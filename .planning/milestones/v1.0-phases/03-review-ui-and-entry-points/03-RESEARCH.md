# Phase 3: Review UI and Entry Points - Research

**Researched:** 2026-03-08
**Domain:** React UI components, state management, merge logic
**Confidence:** HIGH

## Summary

Phase 3 is a pure UI and state management task within an established codebase. All patterns are already set: inline CSS classes with `bg-plugin-` prefix, `updateSettings()` updater pattern, tab-based layout, and the externalized React via `window.__SHIPSTUDIO_REACT__`. The extraction pipeline (Phase 2) outputs `AnalysisResult` with `colors: [{name, hex}]`, `fonts: [{role, value}]`, and `voiceNotes: string`. The review screen consumes this, lets users check/uncheck and edit tokens, then merges accepted tokens into `BrandSettings` via `updateSettings()`.

No external libraries are needed. This is entirely in-tree React component work using existing hooks (`useTheme`, `useToast`, `useBrandSettings`), existing CSS class patterns, and existing type definitions. The main complexity is managing the review state (selection map, inline edits) and wiring the new `'review'` modal view into `BrandModal.tsx`.

**Primary recommendation:** Build a `ReviewView` component with local `useState` for selection/edits, reuse existing row layouts from `ColorsSection`/`FontsSection`/`VoiceSection`, and add the `'review'` ModalView state to `BrandModal.tsx` to intercept `fetchState.status === 'done'`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Tabbed layout matching existing Colors/Fonts/Voice tabs -- one tab per category
- Shows only extracted tokens (not existing brand data) -- review is isolated from current settings
- Colors displayed as row list (swatch + name + hex) matching ColorsSection pattern
- Batch "Apply Selected" button at the bottom -- user reviews all tokens, then applies in one action
- New `ModalView` state: `'review'` -- inserted between `'extracting'` and `'tabs'`
- Checkboxes per token -- standard selection pattern
- All tokens selected (checked) by default -- user deselects what they don't want
- Select All / Deselect All toggle per section (Colors, Fonts, Voice)
- Inline editing allowed in review -- user can rename colors, change hex values, edit font roles before applying
- Voice notes shown as editable text area with checkbox
- Colors: accepted tokens append to end of existing color list, no duplicate detection
- Fonts: accepted fonts append to end of existing font list, no duplicate detection
- Voice notes: if existing voice notes are empty, replace with extracted; if not empty, append extracted below existing
- After applying: toast notification (e.g. "5 colors, 2 fonts applied") via `useToast()`, then switch to tabs view
- "Try another URL" button visible in review screen header -- returns to URL input
- New extraction discards and replaces previous review state entirely
- After applying and returning to tabs, user can re-extract anytime via the header globe button
- If user navigates away from review without applying, show a confirmation dialog warning they'll lose extracted tokens (AI extraction takes 60s+)

### Claude's Discretion
- Exact visual styling of checkboxes and select all/none toggles
- Review screen header design and "Try another URL" button placement
- Confirmation dialog implementation (native confirm vs custom modal)
- How voice notes section handles the select all/none toggle (single item vs multi-line text)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| REVW-01 | Plugin shows a preview of all extracted tokens (colors, fonts, voice) before saving | ReviewView component consuming `AnalysisResult` from `useUrlFetch().result.analysis`, tabbed layout with Colors/Fonts/Voice tabs |
| REVW-02 | User can selectively accept or reject individual extracted tokens | Checkbox per token with `useState<Record<string, boolean>>` selection map, Select All/Deselect All toggle per section |
| REVW-03 | Plugin merges accepted tokens with existing brand settings (not replace) | `updateSettings()` updater appends accepted colors/fonts, voice notes appended or replaced based on existing content |
| REVW-04 | User can re-extract from a different URL to refine results | "Try another URL" button returns to URL input view, new extraction replaces review state entirely |
| ENTR-01 | "Start from URL" appears as a prominent CTA when brand settings are empty | Already implemented in Phase 1 -- `url-cta` view in BrandModal.tsx (lines 89-111). Verify still works. |
| ENTR-02 | "Start from URL" is always accessible via a button in the modal header/toolbar | Already implemented in Phase 1 -- globe button in BrandModal.tsx (lines 125-137). Verify still works. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.0.0 | UI rendering | Externalized via `window.__SHIPSTUDIO_REACT__`, peer dependency |
| TypeScript | ^5.6.0 | Type safety | Already configured |
| Vite | ^6.0.0 | Build tool | Already configured |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | ^4.0.18 | Testing | Unit tests for merge logic |

### Alternatives Considered
None -- this phase uses only existing in-tree dependencies.

**Installation:**
No new packages required.

## Architecture Patterns

### Recommended Project Structure
```
src/
  ReviewView.tsx        # New: main review component with tabbed layout
  BrandModal.tsx        # Modified: add 'review' to ModalView, intercept fetchState.status === 'done'
  styles.ts             # Modified: add CSS for review checkboxes, select all toggles, apply button
  types.ts              # No changes needed (AnalysisResult already defined in analyzeTokens.ts)
```

### Pattern 1: Review State as Local useState
**What:** The review screen manages its own local state for checkbox selections and inline edits, separate from `BrandSettings`. Only on "Apply Selected" does it merge into `BrandSettings` via `updateSettings()`.
**When to use:** Always -- review state is ephemeral and should not persist to storage.
**Example:**
```typescript
// Selection state: map of token ID -> checked boolean
const [selected, setSelected] = useState<Record<string, boolean>>({});

// Editable copies of extracted tokens (with generated IDs)
const [editedColors, setEditedColors] = useState<BrandColor[]>([]);
const [editedFonts, setEditedFonts] = useState<BrandFont[]>([]);
const [editedVoice, setEditedVoice] = useState<string>('');

// Initialize on mount from AnalysisResult
useEffect(() => {
  const colors = analysis.colors.map(c => ({
    id: crypto.randomUUID(),
    name: c.name,
    hex: c.hex,
  }));
  const fonts = analysis.fonts.map(f => ({
    id: crypto.randomUUID(),
    role: f.role,
    value: f.value,
  }));
  setEditedColors(colors);
  setEditedFonts(fonts);
  setEditedVoice(analysis.voiceNotes);

  // All selected by default
  const sel: Record<string, boolean> = {};
  colors.forEach(c => sel[c.id] = true);
  fonts.forEach(f => sel[f.id] = true);
  sel['voice'] = true;
  setSelected(sel);
}, [analysis]);
```

### Pattern 2: Merge via updateSettings Updater
**What:** The `updateSettings()` function takes an updater `(prev: BrandSettings) => BrandSettings`. Merge logic appends accepted tokens to existing arrays.
**When to use:** When "Apply Selected" is clicked.
**Example:**
```typescript
const handleApply = () => {
  const acceptedColors = editedColors.filter(c => selected[c.id]);
  const acceptedFonts = editedFonts.filter(f => selected[f.id]);
  const acceptVoice = selected['voice'];

  updateSettings(prev => ({
    ...prev,
    colors: [...prev.colors, ...acceptedColors],
    fonts: [...prev.fonts, ...acceptedFonts],
    voiceNotes: acceptVoice
      ? prev.voiceNotes
        ? prev.voiceNotes + '\n\n' + editedVoice
        : editedVoice
      : prev.voiceNotes,
  }));

  // Toast
  const parts: string[] = [];
  if (acceptedColors.length) parts.push(`${acceptedColors.length} colors`);
  if (acceptedFonts.length) parts.push(`${acceptedFonts.length} fonts`);
  if (acceptVoice) parts.push('voice notes');
  showToast(`Applied ${parts.join(', ')}`, 'success');

  onApplied(); // transitions to 'tabs' view
};
```

### Pattern 3: ModalView State Extension
**What:** Add `'review'` to the `ModalView` union type. BrandModal intercepts `fetchState.status === 'done'` to transition to `'review'` instead of `'tabs'`.
**When to use:** This is the core routing change.
**Example:**
```typescript
type ModalView = 'url-cta' | 'tabs' | 'url-inline' | 'extracting' | 'review';

// In the fetchState watcher effect:
useEffect(() => {
  if (fetchState.status === 'done') {
    setView('review'); // Changed from 'tabs'
  }
}, [fetchState.status]);
```

### Pattern 4: Confirmation Dialog on Navigation Away
**What:** When user tries to leave review (close modal, switch view) without applying, show a confirmation warning.
**When to use:** When extracted tokens exist and haven't been applied.
**Example:**
```typescript
// Use native confirm() -- simplest, no custom modal needed
const handleTryAnotherUrl = () => {
  if (window.confirm('Discard extracted tokens? AI extraction takes 60+ seconds.')) {
    reset();
    setView(hasData ? 'url-inline' : 'url-cta');
  }
};
```

### Anti-Patterns to Avoid
- **Storing review state in BrandSettings:** Review is ephemeral. Never persist unconfirmed tokens to storage.
- **Mutating AnalysisResult directly:** Create editable copies with IDs on mount. The original `AnalysisResult` has no IDs.
- **Forgetting to generate IDs:** `BrandColor` and `BrandFont` require `id` fields. Use `crypto.randomUUID()` when converting from `AnalysisResult`.
- **Re-rendering the whole modal on checkbox toggle:** Keep selection state local to `ReviewView`, not lifted to `BrandModal`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UUID generation | Custom ID generator | `crypto.randomUUID()` | Already used throughout codebase |
| Toast notifications | Custom notification system | `useToast()` hook | Already wired to host app |
| Theme colors | Hardcoded colors | `useTheme()` hook | All components use this pattern |

**Key insight:** Everything needed for this phase already exists in the codebase. The work is assembling existing patterns into a new view.

## Common Pitfalls

### Pitfall 1: Forgetting to Reset Review State on Re-extraction
**What goes wrong:** User applies tokens, extracts again, and sees stale review state from previous extraction.
**Why it happens:** Review state (selected, editedColors, etc.) isn't reset when a new extraction starts.
**How to avoid:** Reset all review local state when `AnalysisResult` changes (dependency in useEffect).
**Warning signs:** Duplicate tokens appearing after second extraction.

### Pitfall 2: Escape Key Closing Modal During Review Without Confirmation
**What goes wrong:** User presses Escape, modal closes, extracted tokens are lost without warning.
**Why it happens:** `Modal.tsx` has an Escape key handler that calls `onClose` unconditionally.
**How to avoid:** Pass a wrapped `onClose` to Modal that checks if user is in review state and shows confirmation first.
**Warning signs:** User loses 60+ seconds of AI extraction work with no warning.

### Pitfall 3: Empty Apply (No Tokens Selected)
**What goes wrong:** User deselects everything and clicks Apply, nothing happens, confusing UX.
**Why it happens:** No guard on the Apply button.
**How to avoid:** Disable the "Apply Selected" button when zero tokens are selected. Show count in button text (e.g. "Apply 3 selected").
**Warning signs:** Button clickable but nothing changes.

### Pitfall 4: Voice Notes Double Newlines on Multiple Re-applications
**What goes wrong:** Each apply appends voice notes, creating ever-growing text with double newlines.
**Why it happens:** Append logic doesn't check if extracted voice is already present.
**How to avoid:** This is acceptable per the locked decisions (no duplicate detection). But the confirmation dialog before re-extraction helps prevent accidental re-application.
**Warning signs:** Voice notes growing unboundedly after repeated extractions.

### Pitfall 5: CSS Class Collisions
**What goes wrong:** New review CSS classes conflict with host app styles.
**Why it happens:** Not using the `bg-plugin-` prefix.
**How to avoid:** Every new CSS class MUST use the `bg-plugin-` prefix per established convention.
**Warning signs:** Visual glitches only when plugin is loaded in host app.

## Code Examples

### Checkbox Row Pattern for Colors
```typescript
// Reuses existing .bg-plugin-row layout with prepended checkbox
<div className="bg-plugin-row">
  <input
    type="checkbox"
    className="bg-plugin-review-checkbox"
    checked={selected[color.id] ?? false}
    onChange={() => toggleSelected(color.id)}
  />
  <div className="bg-plugin-swatch-wrapper">
    <div className="bg-plugin-swatch" style={{ background: color.hex }} />
  </div>
  <input
    className="bg-plugin-input bg-plugin-input--name"
    value={color.name}
    onChange={(e) => updateEditedColor(color.id, 'name', e.target.value)}
    style={{ borderColor: theme.border }}
  />
  <input
    className="bg-plugin-input bg-plugin-input--hex"
    value={color.hex}
    onChange={(e) => updateEditedColor(color.id, 'hex', e.target.value.toUpperCase())}
    style={{ borderColor: theme.border }}
  />
</div>
```

### Select All / Deselect All Toggle
```typescript
const allColorsSelected = editedColors.every(c => selected[c.id]);
const toggleAllColors = () => {
  const newVal = !allColorsSelected;
  setSelected(prev => {
    const next = { ...prev };
    editedColors.forEach(c => next[c.id] = newVal);
    return next;
  });
};

// Render
<button className="bg-plugin-review-select-toggle" onClick={toggleAllColors}>
  {allColorsSelected ? 'Deselect all' : 'Select all'}
</button>
```

### ReviewView Props Interface
```typescript
interface ReviewViewProps {
  analysis: AnalysisResult;
  onApply: (colors: BrandColor[], fonts: BrandFont[], voiceNotes: string | null) => void;
  onTryAnother: () => void;
  onDiscard: () => void;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Direct state mutation | Updater function pattern | Established in Phase 1 | All settings changes go through `updateSettings()` |
| Inline styles only | CSS classes with `bg-plugin-` prefix | Established in Phase 1 Plan 3 | Formal CSS in `styles.ts` |
| No view state machine | ModalView union type | Phase 1 Plan 3 | Clean view routing in BrandModal |

## Open Questions

1. **Checkbox styling consistency with host app**
   - What we know: The plugin uses inline styles and custom CSS classes. The host app's theme is accessed via `useTheme()`.
   - What's unclear: Whether the host app has checkbox styles that might conflict.
   - Recommendation: Use a custom styled checkbox (opacity-based styling with accent color) to avoid host app CSS conflicts. Keep it simple with `appearance: none` and custom styling.

2. **Modal Escape key behavior during review**
   - What we know: `Modal.tsx` unconditionally calls `onClose` on Escape.
   - What's unclear: Whether modifying this will break other modal uses.
   - Recommendation: Wrap `onClose` in BrandModal when view is `'review'` to add confirmation. This doesn't modify Modal.tsx.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REVW-01 | Review shows extracted tokens organized by category | manual-only | N/A -- UI rendering requires host app context | N/A |
| REVW-02 | Accept/reject individual tokens via checkboxes | unit | `npx vitest run src/reviewMerge.test.ts -t "filters selected"` | No -- Wave 0 |
| REVW-03 | Accepted tokens merge with existing settings | unit | `npx vitest run src/reviewMerge.test.ts -t "merge"` | No -- Wave 0 |
| REVW-04 | Re-extract from different URL | manual-only | N/A -- requires full extraction pipeline | N/A |
| ENTR-01 | Empty-state CTA visible | manual-only | N/A -- already implemented, visual check | N/A |
| ENTR-02 | Header globe button accessible | manual-only | N/A -- already implemented, visual check | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/reviewMerge.test.ts` -- covers REVW-02 and REVW-03 (merge logic as pure functions)

Note: Most REVW requirements are UI/interaction concerns. The testable surface is the merge logic (filtering selected tokens and appending to existing settings). Extract merge logic into a pure function for testability.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/BrandModal.tsx`, `src/useUrlFetch.ts`, `src/useBrandSettings.ts`, `src/analyzeTokens.ts`, `src/types.ts`, `src/styles.ts`, `src/ColorsSection.tsx`, `src/FontsSection.tsx`, `src/VoiceSection.tsx`, `src/Modal.tsx`, `src/context.ts`
- Phase context: `.planning/phases/03-review-ui-and-entry-points/03-CONTEXT.md`
- Requirements: `.planning/REQUIREMENTS.md`

### Secondary (MEDIUM confidence)
None needed -- all patterns established in existing codebase.

### Tertiary (LOW confidence)
None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all in-tree
- Architecture: HIGH -- follows established patterns from Phase 1/2, clear integration points identified in codebase
- Pitfalls: HIGH -- based on direct code analysis of Modal.tsx escape handling, updateSettings patterns, and CSS conventions

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (stable -- internal codebase patterns)
