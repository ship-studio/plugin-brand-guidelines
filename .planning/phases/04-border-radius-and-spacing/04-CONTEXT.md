# Phase 4: Border Radius and Spacing - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Extend the plugin schema with border radius and spacing tokens as new first-class brand properties. Add CSS extraction (regex), AI analysis via the existing Claude CLI pipeline, review UI integration, merge logic, and markdown export. The extraction pipeline and review UI already exist from Phases 2-3 — this phase extends them with new token types.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
User deferred all implementation decisions. The following guidelines are derived from established codebase patterns:

- **Schema design**: Follow BrandColor/BrandFont pattern — new types `BrandRadius { id, label, value }` and `BrandSpacing { id, label, value }` where label is AI-assigned (e.g., "Small", "Card", "Button") and value is the CSS value string (e.g., "4px", "1rem"). Add `radii: BrandRadius[]` and `spacing: BrandSpacing[]` to BrandSettings.
- **Modal tabs**: Add two new tabs "Radii" and "Spacing" to the main BrandModal tab bar, following the existing section component pattern (ColorsSection, FontsSection).
- **Token categorization**: AI assigns descriptive semantic names following Phase 2's creative naming convention. For radii: purpose-based names (e.g., "Button", "Card", "Pill", "Circle"). For spacing: scale-based names (e.g., "Tight", "Base", "Relaxed", "Spacious") or purpose-based (e.g., "Section Gap", "Card Padding").
- **CSS extraction**: Regex extraction from same CSS sources (external + embedded styles). Border-radius: extract `border-radius` shorthand and longhand values. Spacing: extract `padding`, `margin`, `gap` values. Deduplicate by normalized value before sending to AI.
- **AI analysis**: Extend the existing single Claude CLI prompt to include radii and spacing in the same call. Extend `AnalysisResult` type with `radii: [{label, value}]` and `spacing: [{label, value}]`.
- **Review UI**: Add "Radii" and "Spacing" tabs to ReviewView following the existing tabbed pattern with checkboxes and select all/deselect all.
- **Merge logic**: Append-based merge (same as colors/fonts), no duplicate detection. Extend `prepareTokens` and `mergeTokens` in `reviewMerge.ts`.
- **Markdown export**: Follow existing patterns — `### Border Radii` with `- **Label**: \`value\`` and `### Spacing` with `- **Label**: \`value\``.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tokenExtraction.ts`: `extractColors()` and `extractFonts()` patterns — add `extractRadii()` and `extractSpacing()` following the same regex + dedup approach
- `analyzeTokens.ts`: `buildPrompt()` and `AnalysisResult` type — extend prompt with radii/spacing sections, extend result type
- `reviewMerge.ts`: `prepareTokens()` and `mergeTokens()` — extend to handle new token types
- `markdown.ts`: `generateBrandMarkdown()` — add new sections for radii and spacing
- `ColorsSection.tsx` / `FontsSection.tsx`: Row-based editing pattern — new sections follow same layout
- `ReviewView.tsx`: Tabbed review with checkboxes — add new tabs

### Established Patterns
- Types in `types.ts` with `{ id: string, ...fields }` shape
- Regex extraction in `tokenExtraction.ts` — no CSS parser dependency
- Single `claude -p` call in `analyzeTokens.ts` for all token types
- `bg-plugin-*` CSS class prefix for all styles
- `crypto.randomUUID()` for ID generation
- Append-based merge in `reviewMerge.ts`

### Integration Points
- `BrandSettings` in `types.ts` — add `radii` and `spacing` arrays
- `useBrandSettings.ts` — default empty arrays for new fields
- `BrandModal.tsx` tab bar — add new tabs
- `useUrlFetch.ts` — extraction pipeline calls new extraction functions
- `analyzeTokens.ts` — prompt and result type extension
- `reviewMerge.ts` — prepare and merge for new types
- `markdown.ts` — export sections for new types

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. All decisions deferred to Claude's judgment following established codebase patterns.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-border-radius-and-spacing*
*Context gathered: 2026-03-08*
