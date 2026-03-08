# Phase 2: Token Extraction and AI Analysis - Research

**Researched:** 2026-03-08
**Domain:** CSS parsing, color normalization, Claude CLI integration
**Confidence:** HIGH

## Summary

Phase 2 transforms raw fetched content (HTML + CSS from Phase 1's `FetchResult`) into semantic design tokens through two stages: (1) regex-based extraction and normalization of colors and fonts from CSS, and (2) a single `claude -p` CLI call that assigns semantic names, classifies font roles, and generates voice/tone notes.

The codebase already has all the infrastructure needed: `shell.exec()` for CLI calls, DOMParser for HTML parsing, the `ExtractionStep` pattern for progress tracking, and the `BrandColor`/`BrandFont` types for output. The primary implementation work is writing pure extraction functions (regex + normalization), composing a Claude prompt, and parsing the JSON response.

**Primary recommendation:** Build extraction as pure functions in a new `tokenExtraction.ts` file, the Claude prompt + invocation in `analyzeTokens.ts`, and wire them into the existing `useUrlFetch` hook by adding a third extraction step.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Regex extraction for color values (hex, rgb, rgba, hsl, hsla, named colors) -- no CSS parser dependency
- Parse external CSS files (from `FetchResult.css[]`) and embedded `<style>` blocks from HTML -- no inline `style=""` attributes
- Extract CSS custom property names (e.g., `--color-primary`) and pass them alongside their values as hints for Claude's semantic naming
- Normalize all color formats to hex, then remove exact duplicates before sending to Claude
- Font-family declarations extracted via regex from the same CSS sources
- Single `claude -p` call through `shell.exec()` for all analysis (colors + fonts + voice) in one prompt
- Claude receives: deduplicated color list with any CSS variable name hints, font-family list, and visible page text
- Response format: strict JSON schema matching `{ colors: [{name, hex}], fonts: [{role, value}], voiceNotes: string }`
- Parse with `JSON.parse` -- if it fails, retry once with a stricter prompt, then show error at the "Analyzing design tokens" step
- All AI shell calls use explicit timeouts (60s+ per AINT-03)
- Extracted colors map to `BrandColor` type: `{ id: crypto.randomUUID(), name: <AI-generated>, hex: <value> }`
- AI-generated color names -- Claude names colors creatively based on the site's design (not from a fixed set)
- Target 5-12 colors per COLR-02
- Extracted fonts map to `BrandFont` type: `{ id: crypto.randomUUID(), role: <AI-classified>, value: <font-family> }`
- No extraction metadata on tokens -- they're plain entries identical to manually created ones
- Extract visible text from HTML using DOMParser -- strip script/style/nav elements, grab innerText
- Send all visible text equally weighted (no prioritization of hero/headline content)
- Truncate visible text to ~10KB
- Voice notes generated as structured bullet points (tone, vocabulary, personality traits, do's/don'ts)
- Output is a single string stored in `voiceNotes` field

### Claude's Discretion
- CSS truncation strategy for the prompt (smart truncation vs selective extraction, within the ~100KB limit per AINT-02)
- Font role classification granularity (Heading/Body/Mono vs more detailed roles)
- Exact prompt wording and few-shot examples
- How to handle edge cases (sites with very few colors, single-font sites, minimal text content)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COLR-01 | Plugin extracts raw color values from fetched CSS (hex, rgb, hsl, named colors) | Regex patterns for all CSS color formats documented below; extraction from `FetchResult.css[]` + embedded `<style>` blocks |
| COLR-02 | Plugin deduplicates and normalizes colors to 5-12 meaningful values | Hex normalization functions + dedup logic; Claude prompt instructs "select 5-12 most meaningful" |
| COLR-03 | AI assigns semantic names to extracted colors (Primary, Accent, Background, etc.) | Claude `-p` call with color list + CSS variable name hints for context |
| FONT-01 | Plugin extracts font-family declarations from fetched CSS | Regex for `font-family` and shorthand `font:` declarations |
| FONT-02 | AI classifies extracted fonts into heading/body roles | Claude prompt includes font list, asks for role classification |
| VOIC-01 | Plugin extracts visible text content from page HTML | DOMParser strips script/style/nav, grabs innerText, truncates to ~10KB |
| VOIC-02 | AI analyzes page copy and generates voice/tone notes | Claude prompt includes visible text, asks for structured voice analysis |
| AINT-01 | All AI analysis runs via Claude Code CLI (`claude -p`) through shell.exec() -- no API keys required | `shell.exec('claude', ['-p', prompt, '--output-format', 'text', '--max-turns', '1'])` pattern |
| AINT-02 | CSS input to Claude is truncated to ~100KB to prevent buffer overflow | Truncation applied before prompt composition; total prompt kept under limit |
| AINT-03 | All shell.exec() calls have explicit timeouts (60s+ for AI analysis) | `{ timeout: 120000 }` on the Claude shell.exec call |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| DOMParser | browser built-in | Parse HTML for text extraction and `<style>` blocks | Already used in `fetchUtils.ts` for stylesheet extraction |
| Claude CLI | latest | AI analysis via `claude -p` | Installed with Claude Code; no API key needed (AINT-01) |
| crypto.randomUUID() | browser built-in | Generate token IDs | Convention from existing codebase |

### Supporting
No additional dependencies needed. All extraction uses regex and built-in APIs.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Regex color extraction | `css-color-extractor` npm package | Adds dependency for what is ~30 lines of regex; locked decision says no CSS parser |
| Manual hex conversion | `color-convert` npm package | Adds dependency; conversion functions are ~40 lines of pure math |
| DOMParser text extraction | `cheerio` or similar | Adds dependency; DOMParser is already proven in codebase |

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  tokenExtraction.ts     # Pure functions: extractColors, extractFonts, extractVisibleText, normalizeToHex
  analyzeTokens.ts       # Claude CLI invocation: buildPrompt, invokeClaudeAnalysis, parseResponse
  useUrlFetch.ts         # Extended: add "Analyzing design tokens" step, call analyzeTokens after fetch
  types.ts               # Unchanged: BrandColor, BrandFont already sufficient
```

### Pattern 1: Pure Extraction Functions
**What:** All CSS parsing and normalization lives in `tokenExtraction.ts` as pure functions with no side effects.
**When to use:** Always -- these are testable, deterministic operations.
**Example:**
```typescript
// tokenExtraction.ts

interface RawColor {
  value: string;      // Original CSS value
  hex: string;        // Normalized hex
  varName?: string;   // CSS custom property name if available
}

/** Extract all color values from CSS text. */
export function extractColors(cssTexts: string[]): RawColor[] {
  const colors: RawColor[] = [];
  const combined = cssTexts.join('\n');

  // Extract CSS custom properties with color values
  const varRegex = /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/g;
  let match;
  while ((match = varRegex.exec(combined))) {
    const hex = normalizeToHex(match[2]);
    if (hex) colors.push({ value: match[2], hex, varName: match[1] });
  }

  // Extract standalone color values (hex, rgb, hsl)
  // ...regex patterns...

  return deduplicateByHex(colors);
}
```

### Pattern 2: Claude CLI Invocation via shell.exec
**What:** Single `claude -p` call with structured prompt, JSON response parsing, and retry logic.
**When to use:** For all AI analysis (colors + fonts + voice in one call).
**Example:**
```typescript
// analyzeTokens.ts

interface AnalysisResult {
  colors: Array<{ name: string; hex: string }>;
  fonts: Array<{ role: string; value: string }>;
  voiceNotes: string;
}

export async function analyzeTokens(
  shell: Shell,
  colors: RawColor[],
  fonts: string[],
  visibleText: string,
): Promise<AnalysisResult> {
  const prompt = buildPrompt(colors, fonts, visibleText);

  const result = await shell.exec(
    'claude',
    ['-p', prompt, '--max-turns', '1'],
    { timeout: 120000 },
  );

  if (result.exit_code !== 0) {
    throw new Error(`AI analysis failed: ${result.stderr}`);
  }

  return parseAnalysisResponse(result.stdout);
}
```

### Pattern 3: Step Extension in useUrlFetch
**What:** Add a third extraction step "Analyzing design tokens" to the existing step machine.
**When to use:** After fetch + CSS loading completes successfully.
**Example:**
```typescript
// In makeSteps():
function makeSteps(): ExtractionStep[] {
  return [
    { id: 'fetch', label: 'Fetching page...', status: 'pending' },
    { id: 'css', label: 'Loading stylesheets...', status: 'pending' },
    { id: 'analyze', label: 'Analyzing design tokens...', status: 'pending' },
  ];
}
```

### Anti-Patterns to Avoid
- **String interpolation in shell commands:** Never build command strings. Always use the args array. This is SECR-01.
- **Unbounded prompt size:** Always truncate CSS and visible text before passing to Claude. macOS arg limit is ~256KB but Claude's context window is the real constraint.
- **Multiple Claude calls:** One call is faster and cheaper than splitting into colors/fonts/voice calls. The prompt handles all three.
- **Blocking UI without progress:** The analysis step can take 30-60s. The ExtractionStep pattern with the spinner already handles this.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS named color to hex mapping | Custom lookup table from scratch | A const map of the 148 CSS named colors | Well-defined, static list; copy from MDN reference |
| RGB/HSL to hex conversion | Approximate math | Standard conversion formulas (well-documented) | Floating point edge cases in HSL especially |
| HTML text extraction | Custom tag stripping regex | DOMParser + querySelectorAll to remove script/style/nav, then textContent | Regex can't parse HTML; DOMParser already in codebase |
| JSON extraction from Claude response | Naive string parsing | `JSON.parse` with regex to find JSON block in response | Claude may include markdown fences around JSON |

**Key insight:** The extraction regex patterns and color conversion math are well-trodden territory. Use established patterns from MDN and community gists rather than inventing new ones.

## Common Pitfalls

### Pitfall 1: Claude Returns Non-JSON or Wrapped JSON
**What goes wrong:** Claude wraps JSON in markdown fences (```json ... ```) or adds explanatory text before/after.
**Why it happens:** Default Claude behavior is to explain, not just output raw JSON.
**How to avoid:** (1) Prompt explicitly says "Output ONLY the JSON, no markdown fences, no explanation." (2) Before `JSON.parse`, strip markdown fences and leading/trailing non-JSON text with a regex like `/```json?\s*([\s\S]*?)\s*```/` or find the first `{` and last `}`.
**Warning signs:** `JSON.parse` throws SyntaxError on first attempt.

### Pitfall 2: CSS Color Regex Misses Modern Syntax
**What goes wrong:** Modern CSS allows `rgb(255 0 0)` (space-separated, no commas) and `rgb(255 0 0 / 0.5)` for alpha.
**Why it happens:** Older regex patterns only match comma-separated syntax.
**How to avoid:** Use a regex that handles both comma and space separators: `rgba?\(\s*\d+[\s,]+\d+[\s,]+\d+(?:\s*[/,]\s*[\d.]+%?)?\s*\)`.
**Warning signs:** Missing colors from sites using modern CSS syntax.

### Pitfall 3: HSL to Hex Conversion Edge Cases
**What goes wrong:** HSL values like `hsl(0, 0%, 100%)` or `hsl(360, 100%, 50%)` produce incorrect hex.
**Why it happens:** Hue wraps at 360, saturation/lightness are percentages that need dividing by 100.
**How to avoid:** Normalize hue to 0-360 range (mod 360), ensure s/l are 0-1 before conversion.
**Warning signs:** Pure white/black/gray colors converting to wrong hex values.

### Pitfall 4: Font-Family Parsing Complexity
**What goes wrong:** `font-family: "Helvetica Neue", Helvetica, Arial, sans-serif` needs to extract the primary font, not the entire stack.
**Why it happens:** CSS font stacks include fallbacks.
**How to avoid:** Extract the full font-family declaration but let Claude pick the meaningful ones. Also handle the shorthand `font:` property which includes font-family after size/line-height.
**Warning signs:** Generic fallbacks (Arial, sans-serif, serif) appearing as extracted fonts.

### Pitfall 5: shell.exec Arg Size Limits
**What goes wrong:** Passing a 100KB+ prompt as a single arg to `shell.exec` may hit OS argument length limits.
**Why it happens:** macOS ARG_MAX is ~1MB total for all args, but individual arg limits vary.
**How to avoid:** Truncate CSS input to ~100KB per AINT-02. Total prompt (colors list + fonts list + visible text + instructions) should stay under ~150KB. If concerned, use the same base64 + `node -e` + pipe pattern from `useFileSync.ts` to write prompt to a temp file, then `cat prompt.txt | claude -p "..."`.
**Warning signs:** `shell.exec` returns with exit code indicating argument too long (E2BIG).

### Pitfall 6: Empty or Minimal Extraction Results
**What goes wrong:** Some sites have very few colors (or none in CSS -- all in images), a single font, or minimal text.
**Why it happens:** Single-page apps, image-heavy sites, sites using CSS-in-JS (not in external stylesheets).
**How to avoid:** Handle gracefully: if fewer than 2 colors found, still send to Claude but note it. The prompt should instruct Claude to work with whatever is available, even if minimal. Show a warning in UI if extraction yielded very few tokens.
**Warning signs:** Empty arrays in the analysis result.

## Code Examples

Verified patterns from established sources:

### CSS Color Extraction Regex
```typescript
// Matches hex (#fff, #ffffff, #ffffffff), rgb/rgba, hsl/hsla
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
const RGB_RE = /rgba?\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?(?:\s*[/,]\s*[\d.]+%?)?\s*\)/gi;
const HSL_RE = /hsla?\(\s*[\d.]+(?:deg|rad|grad|turn)?\s*[,\s]\s*[\d.]+%\s*[,\s]\s*[\d.]+%(?:\s*[/,]\s*[\d.]+%?)?\s*\)/gi;

// CSS custom property with color value
const CSS_VAR_COLOR_RE = /(--[\w-]+)\s*:\s*(#(?:[0-9a-fA-F]{3,4}){1,2}\b|rgba?\([^)]+\)|hsla?\([^)]+\))/g;
```
Source: Adapted from [GitHub Gist - CSS color regex](https://gist.github.com/olmokramer/82ccce673f86db7cda5e)

### Hex Normalization Functions
```typescript
/** Expand 3/4-digit hex to 6-digit. */
function expandHex(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length === 3) return '#' + h[0]+h[0] + h[1]+h[1] + h[2]+h[2];
  if (h.length === 4) return '#' + h[0]+h[0] + h[1]+h[1] + h[2]+h[2]; // drop alpha
  if (h.length === 8) return '#' + h.slice(0, 6); // drop alpha
  return '#' + h;
}

/** Convert rgb(r, g, b) to #rrggbb. */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)));
    return clamped.toString(16).padStart(2, '0');
  }).join('');
}

/** Convert hsl(h, s%, l%) to #rrggbb. */
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;  // normalize hue
  s = Math.max(0, Math.min(1, s / 100));
  l = Math.max(0, Math.min(1, l / 100));

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  );
}
```
Source: [30 seconds of code - Color conversion](https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/), [CSS-Tricks - Converting Color Spaces](https://css-tricks.com/converting-color-spaces-in-javascript/)

### Named CSS Colors Map (partial -- full map has 148 entries)
```typescript
const NAMED_COLORS: Record<string, string> = {
  aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff',
  aquamarine: '#7fffd4', azure: '#f0ffff', beige: '#f5f5dc',
  // ... all 148 named colors ...
  white: '#ffffff', whitesmoke: '#f5f5f5', yellow: '#ffff00',
  yellowgreen: '#9acd32',
};
```
Source: [MDN - named-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/named-color)

### Font-Family Extraction Regex
```typescript
// Match font-family declarations
const FONT_FAMILY_RE = /font-family\s*:\s*([^;}]+)/gi;
// Match font shorthand (font: style variant weight size/line-height family)
const FONT_SHORTHAND_RE = /font\s*:\s*(?:(?:italic|oblique|normal|small-caps|bold|bolder|lighter|\d+)\s+)*[\d.]+(?:px|rem|em|%|pt)\s*(?:\/\s*[\d.]+(?:px|rem|em|%)?\s*)?([^;}]+)/gi;

/** Parse a font-family string into individual font names. */
function parseFontFamilies(raw: string): string[] {
  return raw
    .split(',')
    .map(f => f.trim().replace(/^["']|["']$/g, ''))
    .filter(f => !['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'inherit', 'initial', 'unset'].includes(f.toLowerCase()));
}
```

### Visible Text Extraction
```typescript
/** Extract visible text from HTML, stripping non-content elements. */
export function extractVisibleText(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove non-content elements
  const removeTags = ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'svg', 'iframe'];
  for (const tag of removeTags) {
    doc.querySelectorAll(tag).forEach(el => el.remove());
  }

  const text = (doc.body?.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate to ~10KB
  return text.slice(0, 10_000);
}
```

### Claude CLI Invocation
```typescript
// Source: https://code.claude.com/docs/en/cli-reference
const result = await shell.exec(
  'claude',
  ['-p', prompt, '--max-turns', '1', '--output-format', 'text'],
  { timeout: 120000 },  // 2 minutes (AINT-03: 60s+)
);
```

### Extracting Embedded Style Blocks
```typescript
/** Extract CSS from <style> blocks in HTML. */
export function extractEmbeddedStyles(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const styles: string[] = [];
  doc.querySelectorAll('style').forEach(el => {
    const text = el.textContent?.trim();
    if (text) styles.push(text);
  });
  return styles;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `rgb(255, 0, 0)` comma syntax | `rgb(255 0 0)` space syntax + `rgb(255 0 0 / 0.5)` alpha | CSS Color Level 4 (2022+) | Regex must handle both comma and space separators |
| `hsl()` with commas only | `hsl()` with space separators and optional `deg` unit | CSS Color Level 4 | Hue can have `deg`, `rad`, `grad`, `turn` units |
| `claude -p` text output | `claude -p --output-format json` structured output | 2025 | Returns JSON with metadata; but `text` is simpler for our use case since we parse the response ourselves |

**Deprecated/outdated:**
- None relevant -- all patterns used are current.

## Open Questions

1. **Claude CLI availability detection**
   - What we know: `claude -p` requires Claude Code to be installed. The plugin runs inside Ship Studio which presumes Claude Code.
   - What's unclear: Should we detect if `claude` is not in PATH and show a specific error?
   - Recommendation: Attempt the call; if exit_code is non-zero with "command not found" in stderr, show "Claude Code is required for AI analysis" error.

2. **Optimal `--output-format` flag**
   - What we know: `--output-format json` wraps the response in a JSON envelope with metadata. `--output-format text` returns raw text.
   - What's unclear: Whether `json` format makes parsing easier or harder since our prompt asks Claude to output JSON.
   - Recommendation: Use `--output-format text` to get Claude's raw JSON response directly. The `json` format would nest our JSON inside another JSON envelope, adding complexity. Use `--max-turns 1` to prevent agentic behavior.

3. **Prompt size vs quality tradeoff**
   - What we know: More CSS context = better color naming. But prompts over ~100KB risk issues.
   - What's unclear: Whether sending all CSS vs a curated subset produces meaningfully different results.
   - Recommendation: Send CSS custom properties first (highest signal), then remaining color/font declarations, truncating at ~100KB total prompt size. This prioritizes the highest-value content.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.0.18 |
| Config file | `vitest.config.ts` (exists, minimal config) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COLR-01 | Extract hex/rgb/hsl/named colors from CSS | unit | `npx vitest run src/tokenExtraction.test.ts -t "extractColors"` | No -- Wave 0 |
| COLR-02 | Deduplicate and normalize to 5-12 colors | unit | `npx vitest run src/tokenExtraction.test.ts -t "dedup"` | No -- Wave 0 |
| COLR-03 | AI assigns semantic names | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "color names"` | No -- Wave 0 |
| FONT-01 | Extract font-family declarations | unit | `npx vitest run src/tokenExtraction.test.ts -t "extractFonts"` | No -- Wave 0 |
| FONT-02 | AI classifies font roles | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "font roles"` | No -- Wave 0 |
| VOIC-01 | Extract visible text from HTML | unit | `npx vitest run src/tokenExtraction.test.ts -t "extractVisibleText"` | No -- Wave 0 |
| VOIC-02 | AI generates voice notes | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "voiceNotes"` | No -- Wave 0 |
| AINT-01 | Uses `claude -p` via shell.exec | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "claude invocation"` | No -- Wave 0 |
| AINT-02 | Truncates CSS input to ~100KB | unit | `npx vitest run src/analyzeTokens.test.ts -t "truncat"` | No -- Wave 0 |
| AINT-03 | Shell calls have 60s+ timeouts | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "timeout"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/tokenExtraction.test.ts` -- covers COLR-01, COLR-02, FONT-01, VOIC-01
- [ ] `src/analyzeTokens.test.ts` -- covers COLR-03, FONT-02, VOIC-02, AINT-01, AINT-02, AINT-03

Note: Existing test files (`fetchUtils.test.ts`, `urlValidation.test.ts`) use `// @vitest-environment jsdom` directive and `mockShell()` helper pattern. New tests should follow the same conventions.

## Sources

### Primary (HIGH confidence)
- [Claude CLI Reference](https://code.claude.com/docs/en/cli-reference) -- flags: `-p`, `--output-format`, `--max-turns`, `--json-schema`
- [MDN - CSS named-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/named-color) -- complete list of 148 named colors
- [MDN - CSS color value](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value) -- modern color syntax (Level 4)
- Existing codebase: `fetchUtils.ts`, `useUrlFetch.ts`, `useFileSync.ts`, `types.ts` -- established patterns

### Secondary (MEDIUM confidence)
- [GitHub Gist - CSS color regex](https://gist.github.com/olmokramer/82ccce673f86db7cda5e) -- regex patterns, verified against MDN spec
- [30 Seconds of Code - Color conversion](https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/) -- conversion algorithms
- [CSS-Tricks - Converting Color Spaces](https://css-tricks.com/converting-color-spaces-in-javascript/) -- HSL/RGB conversion math

### Tertiary (LOW confidence)
- None -- all findings verified with primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies; using built-in APIs and established CLI
- Architecture: HIGH -- follows existing codebase patterns exactly (pure functions + hook extension)
- Pitfalls: HIGH -- well-documented CSS parsing edge cases; Claude JSON response handling is standard
- Color conversion math: HIGH -- algorithms are mathematical formulas verified across multiple sources

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (stable domain; CSS spec and Claude CLI are mature)
