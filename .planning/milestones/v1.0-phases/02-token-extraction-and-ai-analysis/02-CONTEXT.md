# Phase 2: Token Extraction and AI Analysis - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Raw fetched content (HTML + CSS from Phase 1's `FetchResult`) is parsed into semantic design tokens — named colors, classified fonts, voice/tone notes — via CSS parsing and a single Claude CLI call. The review UI (accept/reject) and new token types (radii, spacing) are separate phases.

</domain>

<decisions>
## Implementation Decisions

### CSS parsing strategy
- Regex extraction for color values (hex, rgb, rgba, hsl, hsla, named colors) — no CSS parser dependency
- Parse external CSS files (from `FetchResult.css[]`) and embedded `<style>` blocks from HTML — no inline `style=""` attributes
- Extract CSS custom property names (e.g., `--color-primary`) and pass them alongside their values as hints for Claude's semantic naming
- Normalize all color formats to hex, then remove exact duplicates before sending to Claude
- Font-family declarations extracted via regex from the same CSS sources

### Claude prompt design
- Single `claude -p` call through `shell.exec()` for all analysis (colors + fonts + voice) in one prompt
- Claude receives: deduplicated color list with any CSS variable name hints, font-family list, and visible page text
- Response format: strict JSON schema matching `{ colors: [{name, hex}], fonts: [{role, value}], voiceNotes: string }`
- Parse with `JSON.parse` — if it fails, retry once with a stricter prompt, then show error at the "Analyzing design tokens" step
- All AI shell calls use explicit timeouts (60s+ per AINT-03)

### Token mapping
- Extracted colors map to `BrandColor` type: `{ id: crypto.randomUUID(), name: <AI-generated>, hex: <value> }`
- AI-generated color names — Claude names colors creatively based on the site's design (not from a fixed set)
- Target 5-12 colors per COLR-02
- Extracted fonts map to `BrandFont` type: `{ id: crypto.randomUUID(), role: <AI-classified>, value: <font-family> }`
- No extraction metadata on tokens — they're plain entries identical to manually created ones

### Voice/tone extraction
- Extract visible text from HTML using DOMParser (already in codebase) — strip script/style/nav elements, grab innerText
- Send all visible text equally weighted (no prioritization of hero/headline content)
- Truncate visible text to ~10KB
- Voice notes generated as structured bullet points (tone, vocabulary, personality traits, do's/don'ts)
- Output is a single string stored in `voiceNotes` field

### Claude's Discretion
- CSS truncation strategy for the prompt (smart truncation vs selective extraction, within the ~100KB limit per AINT-02)
- Font role classification granularity (Heading/Body/Mono vs more detailed roles)
- Exact prompt wording and few-shot examples
- How to handle edge cases (sites with very few colors, single-font sites, minimal text content)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `fetchUtils.ts`: `extractStylesheetUrls()` uses DOMParser — same pattern for text extraction
- `useUrlFetch.ts`: `ExtractionStep` and step-tracking pattern — Phase 2 adds "Analyzing design tokens" as step 3
- `shell.exec()` via `useShell()`: proven pattern for running shell commands with args array
- `BrandColor`, `BrandFont` types in `types.ts`: extraction output maps directly to these
- `crypto.randomUUID()` for ID generation (convention from CONVENTIONS.md)

### Established Patterns
- Shell commands use discrete args arrays, never string interpolation (SECR-01)
- DOMParser for HTML parsing (used in `extractStylesheetUrls`)
- Step-based progress with `ExtractionStep` state machine in `useUrlFetch`
- Pure utility functions in separate `.ts` files (e.g., `fetchUtils.ts`, `markdown.ts`)

### Integration Points
- `useUrlFetch.ts` produces `FetchResult { html, css[], url }` — Phase 2 consumes this
- Phase 1 context decided: Phase 2 adds a third extraction step "Analyzing design tokens"
- `BrandModal.tsx` orchestrates views — extraction flow transitions to analysis after fetch completes
- Phase 3 will consume the extracted tokens for review UI — Phase 2 returns them as `BrandColor[]`, `BrandFont[]`, `string`

</code_context>

<specifics>
## Specific Ideas

No specific references — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-token-extraction-and-ai-analysis*
*Context gathered: 2026-03-08*
