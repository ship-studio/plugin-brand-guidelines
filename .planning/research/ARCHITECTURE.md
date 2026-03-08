# Architecture Research

**Domain:** Design token extraction from URLs within a Ship Studio plugin
**Researched:** 2026-03-08
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     UI Layer (React)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ URLInput     │  │ Extraction   │  │ Existing Tab         │  │
│  │ Component    │  │ Preview      │  │ Sections             │  │
│  │ (entry point)│  │ (review)     │  │ (Colors/Fonts/etc.)  │  │
│  └──────┬───────┘  └──────▲───────┘  └──────────▲───────────┘  │
│         │                 │                      │              │
├─────────┼─────────────────┼──────────────────────┼──────────────┤
│         │          Orchestration Layer            │              │
│         ▼                 │                       │              │
│  ┌──────────────────────────────────────────┐     │              │
│  │         useUrlExtraction() hook          │     │              │
│  │  (coordinates fetch → parse → AI → map)  │─────┘              │
│  └──────┬──────────┬──────────┬─────────────┘                   │
│         │          │          │                                  │
├─────────┼──────────┼──────────┼──────────────────────────────────┤
│         │    Pure Logic Layer │                                  │
│         ▼          ▼          ▼                                  │
│  ┌───────────┐ ┌────────┐ ┌──────────────┐                     │
│  │ fetchPage │ │ parse  │ │ mapTokensTo  │                     │
│  │ .ts       │ │ CSS.ts │ │ Settings.ts  │                     │
│  └───────────┘ └────────┘ └──────────────┘                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                   Shell I/O Layer                               │
│  ┌──────────────────┐  ┌────────────────────────────────┐      │
│  │ shell.exec(curl)  │  │ shell.exec(claude -p "...")    │      │
│  │ (fetch HTML/CSS)  │  │ (AI analysis of raw tokens)    │      │
│  └──────────────────┘  └────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Recommended Architecture: Four-Stage Pipeline

The extraction process is a linear pipeline with four stages. Each stage is a pure function (or hook) with clear inputs and outputs, matching the existing plugin's pattern of pure logic in standalone modules and shell I/O isolated in hooks.

### Stage 1: Fetch Page Content

**Module:** `src/extraction/fetchPage.ts`
**Input:** URL string
**Output:** `{ html: string; cssTexts: string[] }`
**Shell calls:** `curl` for HTML, then parse `<link>` and `<style>` tags, `curl` again for external stylesheets

This stage uses `shell.exec('curl', ...)` to fetch the raw HTML of the target URL, then extracts CSS from two sources:
1. Inline `<style>` tags -- parsed directly from the HTML string
2. External `<link rel="stylesheet">` tags -- resolved to absolute URLs, then fetched individually via `curl`

**Why curl, not a headless browser:** The plugin has zero runtime dependencies and can only use `shell.exec()`. `curl` is universally available on macOS/Linux (the target platforms for Claude Code). This means we get static CSS only -- no JavaScript-rendered styles. For the vast majority of marketing/branding pages, the brand colors and fonts are in static CSS. This is an acceptable trade-off given the constraint.

**Why not Puppeteer/Playwright/dembrandt:** These require `npm install` of large browser binaries at runtime. The plugin cannot install dependencies. The user's machine has `curl` and `node` already (Claude Code requires Node.js).

### Stage 2: Parse Raw Tokens

**Module:** `src/extraction/parseCSS.ts`
**Input:** `{ html: string; cssTexts: string[] }`
**Output:** `RawTokens` -- deduplicated lists of colors, font families, font sizes, border-radii, spacing values

This is pure string/regex parsing. No shell calls. The module:
1. Extracts all color values from CSS (hex, rgb, rgba, hsl, named colors)
2. Extracts font-family declarations
3. Extracts border-radius values
4. Extracts spacing values (margin, padding, gap)
5. Deduplicates and counts frequency of each value
6. Extracts `<meta>` description, `<title>`, and visible heading/paragraph text from HTML for voice analysis

**Critical design choice:** This stage extracts raw values only. It does NOT try to assign semantic meaning (e.g., "this is the primary color"). That is the AI's job in Stage 3. Keeping parsing dumb and AI analysis smart avoids the fragile middle ground of heuristic-based guessing.

```typescript
interface RawTokens {
  colors: Array<{ value: string; frequency: number; contexts: string[] }>;
  fonts: Array<{ family: string; frequency: number; usedFor: string[] }>;
  radii: Array<{ value: string; frequency: number }>;
  spacing: Array<{ value: string; frequency: number }>;
  textContent: string; // extracted page copy for voice analysis
  metaDescription: string;
  pageTitle: string;
}
```

The `contexts` array for colors captures where the color was found (e.g., `background-color`, `color`, `border-color`) which gives the AI useful signal for semantic classification.

### Stage 3: AI Analysis

**Module:** `src/extraction/analyzeTokens.ts`
**Input:** `RawTokens`
**Output:** `AnalyzedTokens` -- semantically named, role-assigned tokens

This stage sends the raw tokens to Claude via `shell.exec('claude', ['-p', prompt])` for intelligent analysis. The AI:
1. Identifies which colors are primary, secondary, accent, background, text, etc.
2. Assigns human-readable names to colors (not "Blue #1" but "Ocean Blue" or "Primary Blue")
3. Determines which fonts serve heading vs body roles
4. Infers voice/tone from page copy
5. Selects the most relevant border-radius and spacing values

```typescript
interface AnalyzedTokens {
  colors: Array<{ name: string; hex: string; role: string }>;
  fonts: Array<{ role: string; family: string }>;
  voiceNotes: string;
  radii: Array<{ label: string; value: string }>;
  spacing: Array<{ label: string; value: string }>;
}
```

**Prompt strategy:** Build a structured prompt with the raw token data as JSON, instruct Claude to return JSON. Use `--output-format text` and parse the JSON from the response. The prompt should be written to a temp file and piped via stdin to avoid shell argument length limits.

**Why Claude CLI, not an API call:** The user is already running inside Claude Code, which means they have an authenticated Claude environment. `claude -p` piggybacks on that authentication with zero configuration. This is the project's core constraint -- no API keys.

### Stage 4: Map to BrandSettings

**Module:** `src/extraction/mapToSettings.ts`
**Input:** `AnalyzedTokens`
**Output:** `Partial<BrandSettings>` -- ready to merge into existing settings

This is a pure mapping function that converts AI-analyzed tokens into the existing `BrandSettings` shape:
- `AnalyzedTokens.colors` -> `BrandColor[]` (generate UUIDs for `id` fields)
- `AnalyzedTokens.fonts` -> `BrandFont[]`
- `AnalyzedTokens.voiceNotes` -> `string`

Radii and spacing are new token types not in the current `BrandSettings` schema. These require a schema extension (see below).

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `fetchPage.ts` | Retrieve HTML + CSS text from a URL | Pure async functions using `shell.exec('curl', ...)` |
| `parseCSS.ts` | Extract raw token values from CSS/HTML strings | Pure synchronous functions, regex-based parsing |
| `analyzeTokens.ts` | Semantic classification via Claude AI | Async function using `shell.exec('claude', ['-p', ...])` |
| `mapToSettings.ts` | Convert analyzed tokens to BrandSettings shape | Pure synchronous mapping function |
| `useUrlExtraction.ts` | Orchestrate the pipeline, manage loading/error state | React hook coordinating stages 1-4 |
| `URLInputSection.tsx` | URL input field + extract button UI | React component |
| `ExtractionPreview.tsx` | Review extracted tokens before applying | React component |

## Recommended Project Structure

```
src/
├── extraction/              # All URL extraction logic (new)
│   ├── fetchPage.ts         # Stage 1: curl-based HTML/CSS fetching
│   ├── parseCSS.ts          # Stage 2: regex-based token extraction
│   ├── analyzeTokens.ts     # Stage 3: Claude AI semantic analysis
│   ├── mapToSettings.ts     # Stage 4: tokens -> BrandSettings mapping
│   ├── useUrlExtraction.ts  # Orchestration hook
│   └── types.ts             # RawTokens, AnalyzedTokens interfaces
├── URLInputSection.tsx      # URL entry UI (new)
├── ExtractionPreview.tsx    # Token review UI (new)
├── BrandModal.tsx           # Modified: add URL flow entry points
├── ColorsSection.tsx        # Unchanged
├── FontsSection.tsx         # Unchanged
├── VoiceSection.tsx         # Unchanged
├── AssetsSection.tsx        # Unchanged
├── ExportFooter.tsx         # Unchanged
├── useBrandSettings.ts     # Modified: accept pre-fill from extraction
├── useFileSync.ts           # Unchanged
├── markdown.ts              # Modified: include radii/spacing in export
├── types.ts                 # Modified: add radii/spacing to BrandSettings
├── context.ts               # Unchanged
├── styles.ts                # Modified: add extraction UI styles
├── Modal.tsx                # Unchanged
├── ToolbarButton.tsx        # Unchanged
└── index.tsx                # Unchanged
```

### Structure Rationale

- **`extraction/` subdirectory:** Groups all new extraction logic together, keeping it isolated from existing code. Each file in this directory corresponds to one pipeline stage, making the flow easy to follow and test independently.
- **New UI components at `src/` root:** Follows the existing flat component pattern (all components are already at `src/` root level). No need to introduce a `components/` directory for two files.
- **Minimal modifications to existing files:** The extraction pipeline is additive. Existing hooks and components need only small integration points (accepting pre-filled data, extending types).

## Architectural Patterns

### Pattern 1: Shell-Mediated Pipeline

**What:** Each stage of the extraction pipeline is a pure function that receives data and returns data. Shell I/O (curl, claude) is injected via a `shell` parameter, never imported globally.
**When to use:** Always -- this matches the existing plugin pattern where `useFileSync` receives shell via context hooks.
**Trade-offs:** Requires passing shell around, but enables testing with mock shell implementations.

**Example:**
```typescript
// fetchPage.ts
export async function fetchPage(
  url: string,
  shell: { exec: (cmd: string, args: string[]) => Promise<ShellResult> }
): Promise<{ html: string; cssTexts: string[] }> {
  const result = await shell.exec('curl', ['-sL', '--max-time', '15', url]);
  if (result.exit_code !== 0) throw new Error(`Failed to fetch: ${result.stderr}`);
  const html = result.stdout;
  const cssTexts = await fetchLinkedStylesheets(html, url, shell);
  return { html, cssTexts };
}
```

### Pattern 2: Temp File for Large Prompts

**What:** Write the AI prompt + token data to a temp file, pipe it to `claude -p` via stdin, rather than passing as a shell argument.
**When to use:** When the raw token data exceeds ~100KB (common for sites with large CSS).
**Trade-offs:** Requires writing and cleaning up a temp file, but avoids shell argument length limits (`ARG_MAX`).

**Example:**
```typescript
// analyzeTokens.ts
export async function analyzeTokens(
  rawTokens: RawTokens,
  shell: ShellExec
): Promise<AnalyzedTokens> {
  const prompt = buildAnalysisPrompt(rawTokens);
  const encoded = btoa(/* ... */);

  // Write prompt to temp file
  await shell.exec('node', ['-e',
    'require("fs").writeFileSync(process.argv[1], Buffer.from(process.argv[2], "base64"))',
    '/tmp/brand-extract-prompt.txt', encoded
  ]);

  // Pipe to claude
  const result = await shell.exec('bash', ['-c',
    'cat /tmp/brand-extract-prompt.txt | claude -p --output-format text'
  ], { timeout: 60000 });

  // Clean up
  await shell.exec('rm', ['-f', '/tmp/brand-extract-prompt.txt']);

  return parseAIResponse(result.stdout);
}
```

### Pattern 3: Progressive State in Orchestrator Hook

**What:** The orchestration hook exposes granular state so the UI can show progress through the pipeline stages.
**When to use:** Always -- extraction takes 10-30 seconds; users need feedback.
**Trade-offs:** More state management, but dramatically better UX.

**Example:**
```typescript
type ExtractionStage = 'idle' | 'fetching' | 'parsing' | 'analyzing' | 'ready' | 'error';

export function useUrlExtraction() {
  const shell = useShell();
  const [stage, setStage] = useState<ExtractionStage>('idle');
  const [result, setResult] = useState<Partial<BrandSettings> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async (url: string) => {
    setStage('fetching');
    const page = await fetchPage(url, shell);

    setStage('parsing');
    const rawTokens = parseCSS(page);

    setStage('analyzing');
    const analyzed = await analyzeTokens(rawTokens, shell);

    setStage('ready');
    setResult(mapToSettings(analyzed));
  }, [shell]);

  return { stage, result, error, extract };
}
```

## Data Flow

### Extraction Flow (New)

```
[User enters URL]
    │
    ▼
[useUrlExtraction.extract(url)]
    │
    ├── Stage 1: fetchPage(url, shell)
    │       │
    │       ├── shell.exec('curl', [url])  →  HTML string
    │       ├── parse <link> tags  →  stylesheet URLs
    │       └── shell.exec('curl', [cssUrl]) x N  →  CSS text[]
    │       │
    │       ▼
    │   { html, cssTexts }
    │
    ├── Stage 2: parseCSS({ html, cssTexts })
    │       │
    │       ├── regex: color values + frequency + context
    │       ├── regex: font-family declarations
    │       ├── regex: border-radius values
    │       ├── regex: spacing (margin/padding/gap)
    │       └── extract text content from HTML
    │       │
    │       ▼
    │   RawTokens
    │
    ├── Stage 3: analyzeTokens(rawTokens, shell)
    │       │
    │       ├── build structured prompt with token data
    │       ├── write prompt to temp file
    │       ├── shell.exec('bash', ['cat ... | claude -p'])
    │       └── parse JSON from Claude response
    │       │
    │       ▼
    │   AnalyzedTokens
    │
    └── Stage 4: mapToSettings(analyzed)
            │
            ├── generate UUIDs for each token
            └── map to BrandColor[], BrandFont[], voiceNotes
            │
            ▼
        Partial<BrandSettings>
            │
            ▼
[ExtractionPreview renders tokens for review]
            │
            ▼ (user clicks "Apply")
[updateSettings(prev => merge(prev, extracted))]
            │
            ▼
[Existing debounced auto-save via useBrandSettings]
```

### Integration with Existing Data Flow

The extraction result merges into the existing flow at a single point: `updateSettings()`. This means:
- Auto-save works automatically (debounced persistence via `useBrandSettings`)
- Sync status updates automatically (via the existing `useEffect` in `BrandModal`)
- Export works as before (no changes to `useFileSync` or `markdown.ts`)

The only question is merge strategy when settings already have data:
- **Replace:** Simplest. New extraction overwrites existing tokens.
- **Merge:** Append extracted tokens to existing ones, deduplicating by hex/family.
- **Recommended:** Replace, with a confirmation dialog if existing data is present. Users can always undo by not clicking "Apply" in the preview.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| URLInputSection <-> useUrlExtraction | Hook return values (stage, result, extract fn) | Standard React hook pattern |
| useUrlExtraction <-> extraction/* | Direct function calls | All extraction modules are pure functions |
| ExtractionPreview <-> BrandModal | Callback prop: onApply(Partial<BrandSettings>) | BrandModal calls updateSettings |
| extraction/* <-> shell | shell.exec() injected as parameter | Matches existing pattern in useFileSync |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Target website | `curl -sL` via shell.exec | Max timeout 15s per request. Follow redirects (-L). Some sites may block curl user-agent -- use a browser-like UA string. |
| Claude CLI | `claude -p` via shell.exec | Timeout 60s+. Depends on user having Claude Code installed (guaranteed since plugin runs inside it). Large stdin may occasionally return empty -- handle gracefully. |

## Schema Extension

The current `BrandSettings` type needs extension for border-radii and spacing. Recommended addition:

```typescript
export interface BrandRadius {
  id: string;
  label: string;  // e.g., "Small", "Medium", "Large"
  value: string;   // e.g., "4px", "8px", "16px"
}

export interface BrandSpacing {
  id: string;
  label: string;  // e.g., "XS", "SM", "MD", "LG"
  value: string;   // e.g., "4px", "8px", "16px", "32px"
}

export interface BrandSettings {
  colors: BrandColor[];
  fonts: BrandFont[];
  voiceNotes: string;
  assets: BrandAsset[];
  radii: BrandRadius[];       // NEW
  spacing: BrandSpacing[];    // NEW
  targetFile: 'CLAUDE.md' | 'AGENTS.md';
  lastExportedHash: string;
}
```

This is backward-compatible: the `DEFAULT_SETTINGS` in `useBrandSettings.ts` initializes both as `[]`, and the existing `{ ...DEFAULT_SETTINGS, ...stored }` merge pattern handles missing fields gracefully.

The `generateBrandMarkdown()` function in `markdown.ts` needs two new sections added for radii and spacing export.

## Anti-Patterns

### Anti-Pattern 1: Embedding CSS Parsing in the AI Prompt

**What people do:** Send raw CSS text to Claude and ask it to find colors, fonts, etc.
**Why it's wrong:** Wastes AI tokens on mechanical parsing. CSS can be huge (100KB+). Claude is slow and expensive for regex-equivalent work. The prompt may exceed context limits.
**Do this instead:** Parse CSS mechanically in Stage 2 (regex), send only the deduplicated token list to Claude in Stage 3. The AI's job is semantic analysis (naming, role assignment), not parsing.

### Anti-Pattern 2: Using a Headless Browser

**What people do:** Reach for Puppeteer/Playwright to get computed styles.
**Why it's wrong:** The plugin has zero runtime dependencies. Installing Puppeteer means downloading a 100MB+ browser binary. The shell.exec API was not designed for long-running browser processes.
**Do this instead:** Use `curl` for static HTML/CSS. Accept that JavaScript-rendered styles will be missed. For 90%+ of brand/marketing sites, the brand tokens are in static CSS. If a site is entirely JS-rendered, the AI can still infer colors from inline styles in the HTML.

### Anti-Pattern 3: Single Monolithic Shell Command

**What people do:** Try to do everything in one `shell.exec` call -- fetch, parse, analyze, return.
**Why it's wrong:** No progress feedback. If it fails, you don't know where. Timeouts are hard to manage. Debugging is painful.
**Do this instead:** Break into discrete stages with progress reporting between each. Each stage can fail independently with a clear error message.

### Anti-Pattern 4: Putting Extraction Logic in React Components

**What people do:** Put fetch/parse logic directly in component event handlers.
**Why it's wrong:** Untestable, not reusable, mixes UI concerns with I/O.
**Do this instead:** All extraction logic lives in `src/extraction/` as pure functions. The orchestration hook (`useUrlExtraction`) coordinates them. Components only render state.

## Build Order (Dependency Chain)

The stages have strict dependencies that dictate build order:

```
1. extraction/types.ts          (no deps -- define RawTokens, AnalyzedTokens)
2. extraction/parseCSS.ts       (depends on: types.ts)
3. extraction/fetchPage.ts      (depends on: parseCSS.ts for <link> parsing)
4. extraction/analyzeTokens.ts  (depends on: types.ts)
5. extraction/mapToSettings.ts  (depends on: types.ts, src/types.ts)
6. extraction/useUrlExtraction.ts (depends on: all above + context.ts)
7. types.ts modifications       (add BrandRadius, BrandSpacing)
8. URLInputSection.tsx           (depends on: useUrlExtraction)
9. ExtractionPreview.tsx         (depends on: types from extraction/types.ts)
10. BrandModal.tsx modifications  (depends on: URLInputSection, ExtractionPreview)
11. markdown.ts modifications    (add radii/spacing to export)
12. styles.ts modifications      (add extraction UI styles)
```

**Phase implications:**
- Stages 1-5 (pure logic) can be built and tested without any UI changes
- Stage 6 (hook) bridges logic to React
- Stages 7-12 (UI + schema) are the integration phase
- The existing plugin continues to work throughout -- all changes are additive

## Sources

- [Claude Code CLI reference -- headless mode and -p flag](https://code.claude.com/docs/en/cli-reference)
- [Claude Code headless mode documentation](https://code.claude.com/docs/en/headless)
- [Dembrandt -- design token extraction approach (reference for token categories)](https://github.com/dembrandt/dembrandt)
- [Known issue: Claude CLI empty output with large stdin](https://github.com/anthropics/claude-code/issues/7263)

---
*Architecture research for: Design token extraction from URLs (Brand Guidelines plugin)*
*Researched: 2026-03-08*
