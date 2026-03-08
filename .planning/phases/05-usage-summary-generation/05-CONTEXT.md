# Phase 5: Usage Summary Generation - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

AI produces per-category usage guidance during token extraction. Usage summaries are generated alongside tokens in the same AI call and stored in the AnalysisResult data structure. Review UI display (Phase 6) and export formatting (Phase 7) are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Summary scope & depth
- 2-3 sentence prose paragraphs per category — concise and actionable
- Reference tokens by name AND value (e.g., "Use Primary #5C4EFA for CTAs and interactive elements") — satisfies requirement AI-02
- Prose format, not bullet points — reads well in both review UI and exported markdown
- Prompt instructs AI to reference the token names it assigned in the same response

### Category coverage
- Generate summaries for 4 categories: colors, fonts, radii, spacing
- Skip voice — voice notes already ARE the usage guidance (free-text tone bullets with do's/don'ts)
- Requirement AI-01 says 5 categories including voice; since voice notes serve this purpose already, the summary field can be empty/null for voice

### AI prompt strategy
- Single AI call — extend existing `buildPrompt()` and JSON schema to include `usageSummaries` fields
- No separate follow-up call — avoids doubling extraction time
- Add "Generating usage guidance..." to ANALYZE_HINTS in ExtractionView for user feedback

### Claude's Discretion
- Whether to include light cross-category references in summaries (e.g., "pairs well with Inter Bold") — judge per-summary if it adds value
- Whether to generate a summary when a category has < 2 tokens — judge based on whether it's useful
- Summary style for radii/spacing — may use component mapping ("Use Card 8px for containers") or general guidance, whichever fits best
- Fallback strategy when AI response includes tokens but omits summaries — graceful degradation preferred (empty string, proceed without)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches within the decisions above.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `buildPrompt()` in `analyzeTokens.ts`: Extend with summary generation instructions and JSON schema fields
- `parseAnalysisResponse()`: Already has 3-tier JSON fallback — summaries benefit from same resilience
- `ANALYZE_HINTS` array in `ExtractionView.tsx`: Add usage guidance hint string
- Defensive `|| []` pattern in `reviewMerge.ts`: Apply same pattern for missing summary fields

### Established Patterns
- `AnalysisResult` interface is the data contract between extraction and review — extend with summary fields
- Prompt ends with explicit JSON schema — add `usageSummaries` or per-category summary fields
- All AI interaction through `claude -p` with `--max-turns 1 --output-format text`

### Integration Points
- `AnalysisResult` in `analyzeTokens.ts` — add usage summary fields (consumed by ReviewView in Phase 6 and markdown export in Phase 7)
- `buildPrompt()` — extend prompt instructions and JSON schema
- `ExtractionView.tsx` — add hint to ANALYZE_HINTS array
- `reviewMerge.ts` `prepareTokens()` — ensure summaries survive the extraction-to-review handoff

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-usage-summary-generation*
*Context gathered: 2026-03-08*
