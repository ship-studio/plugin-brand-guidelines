# Phase 3: Review UI and Entry Points - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can preview all extracted tokens (colors, fonts, voice), selectively accept or reject them via checkboxes, edit values inline, and merge accepted tokens into their existing brand settings with a batch apply action. Entry points (empty-state CTA and header globe button) are already built from Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Review layout
- Tabbed layout matching existing Colors/Fonts/Voice tabs — familiar pattern, one tab per category
- Shows only extracted tokens (not existing brand data) — review is isolated from current settings
- Colors displayed as row list (swatch + name + hex) matching ColorsSection pattern
- Batch "Apply Selected" button at the bottom — user reviews all tokens, then applies in one action
- New `ModalView` state: `'review'` — inserted between `'extracting'` and `'tabs'`

### Accept/reject interaction
- Checkboxes per token — standard selection pattern
- All tokens selected (checked) by default — user deselects what they don't want
- Select All / Deselect All toggle per section (Colors, Fonts, Voice)
- Inline editing allowed in review — user can rename colors, change hex values, edit font roles before applying
- Voice notes shown as editable text area with checkbox

### Merge behavior
- Colors: accepted tokens append to end of existing color list, no duplicate detection
- Fonts: accepted fonts append to end of existing font list, no duplicate detection
- Voice notes: if existing voice notes are empty, replace with extracted; if not empty, append extracted below existing
- After applying: toast notification (e.g. "5 colors, 2 fonts applied") via `useToast()`, then switch to tabs view

### Re-extraction flow
- "Try another URL" button visible in review screen header — returns to URL input
- New extraction discards and replaces previous review state entirely
- After applying and returning to tabs, user can re-extract anytime via the header globe button
- If user navigates away from review without applying, show a confirmation dialog warning they'll lose extracted tokens (AI extraction takes 60s+)

### Claude's Discretion
- Exact visual styling of checkboxes and select all/none toggles
- Review screen header design and "Try another URL" button placement
- Confirmation dialog implementation (native confirm vs custom modal)
- How voice notes section handles the select all/none toggle (single item vs multi-line text)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ColorsSection.tsx`: Row pattern with swatch + name input + hex input — review can reuse this layout with added checkbox
- `FontsSection.tsx`: Row pattern with role + value inputs — same reuse opportunity
- `VoiceSection.tsx`: Textarea for voice notes — review uses same textarea with checkbox
- `useToast()` hook: Available for post-apply confirmation
- `Modal.tsx`: Renders overlay, header, body, footer — review fits inside existing modal structure
- `ExtractionView.tsx`: Shows extraction progress — review view replaces this on completion

### Established Patterns
- `ModalView` type: `'url-cta' | 'tabs' | 'url-inline' | 'extracting'` — add `'review'` state
- `updateSettings()` updater function pattern for merging data into BrandSettings
- `bg-plugin-*` CSS class prefix for all styles
- `crypto.randomUUID()` for generating IDs on new tokens

### Integration Points
- `BrandModal.tsx`: Orchestrates views — needs to intercept `fetchState.status === 'done'` to show review instead of tabs
- `useUrlFetch.result`: Contains `ExtractionResult.analysis` with colors/fonts/voiceNotes — review screen consumes this
- `useBrandSettings.updateSettings()`: Merge function for applying accepted tokens
- `AnalysisResult` type: `{ colors: [{name, hex}], fonts: [{role, value}], voiceNotes: string }` — needs IDs added during merge

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

*Phase: 03-review-ui-and-entry-points*
*Context gathered: 2026-03-08*
