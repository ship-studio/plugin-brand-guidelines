# Phase 4: Border Radius and Spacing - Research

**Researched:** 2026-03-08
**Domain:** CSS token extraction, AI analysis pipeline extension, React UI components
**Confidence:** HIGH

## Summary

Phase 4 extends the existing extraction-analysis-review-merge pipeline with two new token types: border radii and spacing values. Every pattern needed already exists in the codebase from Phases 2-3. The work is purely additive: new regex extractors in `tokenExtraction.ts`, extended AI prompt and result type in `analyzeTokens.ts`, new types and settings fields in `types.ts`, new section components and review tabs, extended merge logic, and extended markdown export.

There is no new technology to introduce. The existing architecture handles this cleanly -- the same file-by-file extension pattern used for colors and fonts applies identically to radii and spacing. The highest-risk area is CSS regex extraction (border-radius shorthand parsing has edge cases) and AI prompt engineering (ensuring Claude returns the new fields reliably alongside existing ones).

**Primary recommendation:** Follow the exact same patterns as colors/fonts across all files, extending rather than refactoring.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
No locked user decisions -- all implementation decisions deferred to Claude's discretion.

### Claude's Discretion
User deferred all implementation decisions. The following guidelines are derived from established codebase patterns:

- **Schema design**: Follow BrandColor/BrandFont pattern -- new types `BrandRadius { id, label, value }` and `BrandSpacing { id, label, value }` where label is AI-assigned (e.g., "Small", "Card", "Button") and value is the CSS value string (e.g., "4px", "1rem"). Add `radii: BrandRadius[]` and `spacing: BrandSpacing[]` to BrandSettings.
- **Modal tabs**: Add two new tabs "Radii" and "Spacing" to the main BrandModal tab bar, following the existing section component pattern (ColorsSection, FontsSection).
- **Token categorization**: AI assigns descriptive semantic names following Phase 2's creative naming convention. For radii: purpose-based names (e.g., "Button", "Card", "Pill", "Circle"). For spacing: scale-based names (e.g., "Tight", "Base", "Relaxed", "Spacious") or purpose-based (e.g., "Section Gap", "Card Padding").
- **CSS extraction**: Regex extraction from same CSS sources (external + embedded styles). Border-radius: extract `border-radius` shorthand and longhand values. Spacing: extract `padding`, `margin`, `gap` values. Deduplicate by normalized value before sending to AI.
- **AI analysis**: Extend the existing single Claude CLI prompt to include radii and spacing in the same call. Extend `AnalysisResult` type with `radii: [{label, value}]` and `spacing: [{label, value}]`.
- **Review UI**: Add "Radii" and "Spacing" tabs to ReviewView following the existing tabbed pattern with checkboxes and select all/deselect all.
- **Merge logic**: Append-based merge (same as colors/fonts), no duplicate detection. Extend `prepareTokens` and `mergeTokens` in `reviewMerge.ts`.
- **Markdown export**: Follow existing patterns -- `### Border Radii` with `- **Label**: \`value\`` and `### Spacing` with `- **Label**: \`value\``.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RADI-01 | Plugin extracts border-radius values from fetched CSS | Regex patterns for `border-radius` shorthand and longhands; dedup by normalized value string |
| RADI-02 | AI identifies meaningful radius tokens (small, medium, large) from raw values | Extended `buildPrompt()` with radii section; extended `AnalysisResult` with `radii` field |
| SPAC-01 | Plugin extracts spacing values (padding, margin, gap) from fetched CSS | Regex patterns for `padding`, `margin`, `gap` properties; dedup by normalized value string |
| SPAC-02 | AI identifies a spacing scale from raw values | Extended `buildPrompt()` with spacing section; extended `AnalysisResult` with `spacing` field |
</phase_requirements>

## Standard Stack

### Core
No new libraries needed. This phase uses only existing project dependencies.

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | externalized (host) | UI components | Already in use |
| TypeScript | project config | Type safety | Already in use |
| Vite | project config | Build | Already in use |

### Supporting
No new supporting libraries needed.

### Alternatives Considered
None -- pure extension of existing patterns.

## Architecture Patterns

### Recommended File Changes
```
src/
  types.ts              # Add BrandRadius, BrandSpacing interfaces; extend BrandSettings
  tokenExtraction.ts    # Add extractRadii(), extractSpacing() functions
  analyzeTokens.ts      # Extend buildPrompt(), AnalysisResult, parseAnalysisResponse()
  reviewMerge.ts        # Extend prepareTokens(), mergeTokens()
  markdown.ts           # Extend generateBrandMarkdown(), hasBrandData()
  useBrandSettings.ts   # Add defaults for radii: [], spacing: []
  useUrlFetch.ts        # Call extractRadii/extractSpacing, pass to analyzeTokens
  BrandModal.tsx        # Add 'radii' and 'spacing' to Tab type and TABS array
  ReviewView.tsx        # Add 'radii' and 'spacing' tabs with checkbox rows
  RadiiSection.tsx      # NEW: manual editing section (follows ColorsSection pattern)
  SpacingSection.tsx    # NEW: manual editing section (follows ColorsSection pattern)
```

### Pattern 1: Token Type Definition
**What:** Each brand token type follows the `{ id: string, ...fields }` shape
**When to use:** When adding BrandRadius and BrandSpacing to `types.ts`
**Example:**
```typescript
// Source: existing types.ts pattern (BrandColor, BrandFont, BrandAsset)
export interface BrandRadius {
  id: string;
  label: string;  // AI-assigned semantic name ("Button", "Card", "Pill")
  value: string;  // CSS value string ("4px", "0.5rem", "50%")
}

export interface BrandSpacing {
  id: string;
  label: string;  // AI-assigned semantic name ("Tight", "Base", "Spacious")
  value: string;  // CSS value string ("8px", "1rem", "24px")
}
```

### Pattern 2: Regex Extraction + Dedup
**What:** Scan combined CSS text with regex, normalize values, deduplicate
**When to use:** For `extractRadii()` and `extractSpacing()`
**Example:**
```typescript
// Source: existing extractColors()/extractFonts() pattern in tokenExtraction.ts
export function extractRadii(cssTexts: string[]): string[] {
  const values = new Set<string>();
  const combined = cssTexts.join('\n');
  // border-radius shorthand and longhands
  const re = /border(?:-top-left|-top-right|-bottom-left|-bottom-right)?-radius\s*:\s*([^;}\n]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(combined))) {
    const val = match[1].trim();
    if (val && val !== '0' && val !== '0px') values.add(val);
  }
  return Array.from(values);
}
```

### Pattern 3: Section Component
**What:** Row-based editing component with add/update/remove callbacks
**When to use:** For RadiiSection.tsx and SpacingSection.tsx
**Example:**
```typescript
// Source: ColorsSection.tsx / FontsSection.tsx pattern
export function RadiiSection({
  radii,
  updateSettings,
}: {
  radii: BrandRadius[];
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  // addRadius, updateRadius, removeRadius callbacks
  // Empty state with add button
  // Row per item: label input + value input + delete button
}
```

### Pattern 4: ReviewView Tab Extension
**What:** Add tabs to the TABS array and corresponding content panels
**When to use:** Extending ReviewView.tsx with radii and spacing tabs
**Example:**
```typescript
// Source: existing ReviewView.tsx TABS pattern
type ReviewTab = 'colors' | 'fonts' | 'voice' | 'radii' | 'spacing';

const TABS: { key: ReviewTab; label: string }[] = [
  { key: 'colors', label: 'Colors' },
  { key: 'fonts', label: 'Fonts' },
  { key: 'voice', label: 'Voice' },
  { key: 'radii', label: 'Radii' },
  { key: 'spacing', label: 'Spacing' },
];
```

### Anti-Patterns to Avoid
- **Using a CSS parser library:** The project uses regex extraction intentionally (zero-dependency constraint). Do not introduce `postcss`, `css-tree`, or similar.
- **Separate AI calls for radii/spacing:** The existing single `claude -p` call handles all token types. Extend the prompt, do not add separate calls.
- **Refactoring existing code during extension:** Add new fields alongside existing ones. Do not rename or restructure existing types/functions.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS value parsing | Full CSS parser | Regex extraction | Project pattern; zero-dependency constraint |
| UUID generation | Custom ID generator | `crypto.randomUUID()` | Existing pattern throughout codebase |
| State management | Redux/Zustand | `useState` + `updateSettings` callback | Existing pattern |

## Common Pitfalls

### Pitfall 1: Border-radius shorthand complexity
**What goes wrong:** `border-radius: 10px 20px 30px 40px / 5px 10px` has up to 8 values (4 horizontal + 4 vertical with `/` separator). Multi-value shorthands make dedup tricky.
**Why it happens:** CSS border-radius shorthand is more complex than most people expect.
**How to avoid:** Extract the raw declaration value as a single string (e.g., "10px 20px"). Let AI interpret the meaning. Dedup on the exact string value. Do not try to parse individual corner values -- treat the whole declaration as one token.
**Warning signs:** Seeing duplicate entries that are the same radius expressed differently.

### Pitfall 2: Spacing value explosion
**What goes wrong:** Extracting `padding`, `margin`, and `gap` from all CSS produces hundreds of values, most meaningless (e.g., `0`, `auto`, `inherit`).
**Why it happens:** Every element has padding/margin, unlike colors which are more selective.
**How to avoid:** Filter out `0`, `0px`, `auto`, `inherit`, `initial`, `unset`, `revert` before dedup. Consider extracting only unique numeric values. Let AI reduce to a meaningful scale of 5-10 tokens.
**Warning signs:** Sending 200+ spacing values to AI prompt, eating into the 100KB budget.

### Pitfall 3: Shorthand property parsing for spacing
**What goes wrong:** `margin: 10px 20px` has two values; `padding: 10px 20px 30px 40px` has four. Extracting individual values from shorthands vs just capturing the whole declaration.
**Why it happens:** CSS shorthand properties expand to multiple values.
**How to avoid:** Extract individual values from shorthand (split by whitespace, collect unique non-zero values) rather than treating the whole shorthand as one token. This gives cleaner input to AI. Example: `padding: 8px 16px` yields `["8px", "16px"]`.
**Warning signs:** AI returning tokens like "8px 16px" as a single spacing value.

### Pitfall 4: AI prompt JSON schema extension
**What goes wrong:** Adding new fields to the expected JSON output but AI sometimes omits them or returns the old schema.
**Why it happens:** LLM outputs are non-deterministic; the prompt needs to clearly specify new fields.
**How to avoid:** Update the JSON schema example in the prompt to include `radii` and `spacing` arrays. Use the same explicit schema pattern already in `buildPrompt()`. The 3-tier parse fallback handles minor formatting issues.
**Warning signs:** `parseAnalysisResponse` throwing because result lacks `radii`/`spacing` fields.

### Pitfall 5: Forgetting to extend hasBrandData()
**What goes wrong:** Export button stays disabled when only radii/spacing are populated.
**Why it happens:** `hasBrandData()` in `markdown.ts` only checks colors, fonts, voiceNotes, assets.
**How to avoid:** Add `settings.radii.some(r => r.label && r.value)` and `settings.spacing.some(s => s.label && s.value)` checks.
**Warning signs:** Can add radii/spacing manually but export button is grayed out.

### Pitfall 6: Missing default arrays in useBrandSettings
**What goes wrong:** Existing stored settings (from before this phase) lack `radii` and `spacing` fields, causing runtime errors.
**Why it happens:** `storage.read()` returns old schema without new fields.
**How to avoid:** `DEFAULT_SETTINGS` already spreads defaults via `{ ...DEFAULT_SETTINGS, ...stored }`. Just add `radii: []` and `spacing: []` to `DEFAULT_SETTINGS`.
**Warning signs:** `Cannot read property 'map' of undefined` when opening modal with pre-existing settings.

## Code Examples

### CSS Border-Radius Extraction
```typescript
// Handles: border-radius, border-top-left-radius, etc.
// Filters: 0, 0px, inherit, initial, unset
const BORDER_RADIUS_RE = /border(?:-top-left|-top-right|-bottom-left|-bottom-right)?-radius\s*:\s*([^;}\n]+)/gi;
const SKIP_VALUES = new Set(['0', '0px', 'inherit', 'initial', 'unset', 'revert', 'none']);

export function extractRadii(cssTexts: string[]): string[] {
  const values = new Set<string>();
  const combined = cssTexts.join('\n');
  let match: RegExpExecArray | null;
  const re = new RegExp(BORDER_RADIUS_RE.source, BORDER_RADIUS_RE.flags);
  while ((match = re.exec(combined))) {
    const val = match[1].trim().toLowerCase();
    if (val && !SKIP_VALUES.has(val)) values.add(val);
  }
  return Array.from(values);
}
```

### CSS Spacing Extraction
```typescript
// Extracts individual values from padding/margin/gap declarations
// "padding: 8px 16px" -> ["8px", "16px"]
const SPACING_PROP_RE = /(?:padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left))?\s*:\s*([^;}\n]+)/gi;
const SPACING_SKIP = new Set(['0', '0px', 'auto', 'inherit', 'initial', 'unset', 'revert', 'none', 'normal']);

export function extractSpacing(cssTexts: string[]): string[] {
  const values = new Set<string>();
  const combined = cssTexts.join('\n');
  let match: RegExpExecArray | null;
  const re = new RegExp(SPACING_PROP_RE.source, SPACING_PROP_RE.flags);
  while ((match = re.exec(combined))) {
    // Split shorthand into individual values
    const parts = match[1].trim().split(/\s+/);
    for (const part of parts) {
      const val = part.toLowerCase();
      if (val && !SPACING_SKIP.has(val) && /^[\d.]+/.test(val)) {
        values.add(val);
      }
    }
  }
  return Array.from(values);
}
```

### Extended AI Prompt Section
```typescript
// Add to buildPrompt() after existing sections
const radiiList = radii.length > 0 ? radii.join(', ') : '(none found)';
const spacingList = spacing.length > 0 ? spacing.join(', ') : '(none found)';

// Additional prompt sections:
`
## Extracted Border Radii
${radiiList}

## Extracted Spacing Values
${spacingList}
`

// Additional instructions (append to existing numbered list):
`
4. Select 3-6 meaningful border-radius values and assign descriptive labels (e.g. "Button", "Card", "Pill", "Circle").

5. Select 4-8 spacing values that form a coherent scale and assign descriptive labels (e.g. "Tight", "Base", "Relaxed", "Spacious").
`

// Extended JSON schema in prompt:
`{
  "colors": [{"name": "string", "hex": "#xxxxxx"}],
  "fonts": [{"role": "string", "value": "string"}],
  "voiceNotes": "string",
  "radii": [{"label": "string", "value": "string"}],
  "spacing": [{"label": "string", "value": "string"}]
}`
```

### Extended AnalysisResult Type
```typescript
export interface AnalysisResult {
  colors: Array<{ name: string; hex: string }>;
  fonts: Array<{ role: string; value: string }>;
  voiceNotes: string;
  radii: Array<{ label: string; value: string }>;
  spacing: Array<{ label: string; value: string }>;
}
```

### Extended prepareTokens and mergeTokens
```typescript
// In prepareTokens: add after fonts
const radii: BrandRadius[] = (analysis.radii || []).map((r) => ({
  id: crypto.randomUUID(),
  label: r.label,
  value: r.value,
}));
const spacing: BrandSpacing[] = (analysis.spacing || []).map((s) => ({
  id: crypto.randomUUID(),
  label: s.label,
  value: s.value,
}));
return { colors, fonts, voiceNotes: analysis.voiceNotes, radii, spacing };

// In mergeTokens: add to return object
radii: [...existing.radii, ...accepted.radii],
spacing: [...existing.spacing, ...accepted.spacing],
```

### Extended Markdown Export
```typescript
// In generateBrandMarkdown, after Fonts section:
const validRadii = settings.radii.filter((r) => r.label && r.value);
if (validRadii.length > 0) {
  sections.push(
    '### Border Radii\n\n' +
      validRadii.map((r) => `- **${r.label}**: \`${r.value}\``).join('\n'),
  );
}

const validSpacing = settings.spacing.filter((s) => s.label && s.value);
if (validSpacing.length > 0) {
  sections.push(
    '### Spacing\n\n' +
      validSpacing.map((s) => `- **${s.label}**: \`${s.value}\``).join('\n'),
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| N/A | Regex extraction | Phase 2 | Established pattern for this project |
| N/A | Single Claude CLI call for all tokens | Phase 2 | Extend prompt, don't add calls |

No deprecated or outdated patterns to worry about. This phase purely extends Phase 2-3 patterns.

## Open Questions

1. **Shorthand parsing granularity for border-radius**
   - What we know: `border-radius: 10px 20px` is valid (different horizontal/vertical). Most sites use simple single values.
   - What's unclear: Whether to split multi-value shorthands into individual values or keep as-is
   - Recommendation: Keep as-is (pass the full declaration value). Let AI interpret. Most real-world sites use single values like `border-radius: 8px`.

2. **AI response backward compatibility**
   - What we know: Existing saved analysis results won't have `radii`/`spacing` fields.
   - What's unclear: Whether any code path stores raw AnalysisResult for later use
   - Recommendation: Use `analysis.radii || []` and `analysis.spacing || []` defensive access in `prepareTokens()` to handle missing fields gracefully.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected (no test config or test files in project) |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RADI-01 | extractRadii returns deduplicated border-radius values | unit | N/A | No |
| RADI-02 | AI prompt includes radii section, result parsed correctly | unit | N/A | No |
| SPAC-01 | extractSpacing returns deduplicated spacing values | unit | N/A | No |
| SPAC-02 | AI prompt includes spacing section, result parsed correctly | unit | N/A | No |

### Sampling Rate
No test infrastructure exists. Validation is manual: build succeeds (`npm run build`), visual inspection of UI, end-to-end URL extraction.

### Wave 0 Gaps
No test infrastructure exists in this project. Given the project has completed 3 phases without tests and is a UI plugin (manual testing is the norm), adding a test framework is out of scope for this phase. Validation via `npm run build` success and manual testing.

## Sources

### Primary (HIGH confidence)
- Project source code (src/types.ts, src/tokenExtraction.ts, src/analyzeTokens.ts, src/reviewMerge.ts, src/markdown.ts, src/ReviewView.tsx, src/BrandModal.tsx, src/useBrandSettings.ts, src/useUrlFetch.ts, src/ColorsSection.tsx, src/styles.ts) -- all patterns derived directly from existing code
- CONTEXT.md -- user decisions and implementation guidelines

### Secondary (MEDIUM confidence)
- CSS specification knowledge for border-radius shorthand syntax and spacing properties

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, pure extension of existing code
- Architecture: HIGH - every pattern is directly visible in existing source files
- Pitfalls: HIGH - derived from CSS specification knowledge and concrete codebase analysis

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (stable -- no external dependencies to change)
