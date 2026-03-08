# Phase 1: URL Fetching and Security - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can enter any URL and the plugin reliably fetches its HTML and all linked CSS content with clear feedback on errors. Includes SSRF prevention, bot detection, and real-time URL validation. Token extraction (AI analysis) and review UI are separate phases.

</domain>

<decisions>
## Implementation Decisions

### URL input placement
- Empty state (no brand data): full modal-body takeover — centered CTA with headline, URL input, and extract button. Tabs are hidden
- "Or set up manually" link dismisses the CTA and reveals the normal tabbed interface (same modal, view switch)
- With existing data: small icon button in the modal header (next to title, before close button)
- Clicking the header button expands an inline URL input bar below the header, above the tabs. Includes a dismiss (✕) button
- The inline input doesn't navigate away — user stays in the current tabbed view

### Loading & progress UX
- Step-based status text (not spinner, not progress bar)
- Two steps for Phase 1: "Fetching page" and "Loading stylesheets (2/5)..." with count
- Steps check off (✓) as completed; active step shows a loading indicator
- Loading view replaces the entire modal body — tabs hidden/disabled during extraction
- Shows the domain being extracted from: "Extracting from example.com"
- Cancel button visible during extraction — cancelling aborts and returns to previous view
- After successful extraction, jump straight to review flow (Phase 3's concern) — no intermediate "done" screen
- Phase 2 will later add a third step: "Analyzing design tokens"

### Error experience
- Errors appear inline at the failed step — step turns red (✘), previous steps stay checked (✓)
- Friendly headline + expandable "Show details" for technical info (e.g., "HTTP 403 — Cloudflare challenge detected")
- "Try Again" button returns to URL input with the failed URL pre-filled (not auto-retry — most errors aren't transient)
- URL validation errors (invalid format, private IPs, non-http schemes) show as real-time inline hints below the input
- Extract button stays disabled until URL passes validation
- No fetch is attempted for invalid URLs — validation blocks submission

### Claude's Discretion
- Exact animation/transition between views (CTA → tabs, tabs → loading)
- Specific wording for error messages and step labels
- Whether the loading step indicator is a spinner, pulsing dot, or other treatment
- Debounce timing for real-time URL validation

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Modal` component (`src/Modal.tsx`): renders overlay, header, body, and optional footer — URL views will render inside this
- `useShell()` hook (`src/context.ts`): provides `shell.exec(command, args[], options)` — already takes args as an array (SECR-01 pattern established)
- `useToast()` hook: available for supplementary notifications if needed
- Theme system (`src/context.ts`): `useTheme()` provides all color tokens for consistent styling
- CSS class namespace `bg-plugin-*` (`src/styles.ts`): all styles use this prefix — new styles should follow the same pattern

### Established Patterns
- Shell commands use `shell.exec(command, argsArray)` with discrete arguments — never string interpolation (matches SECR-01)
- File I/O via `node -e` with base64 encoding to avoid shell escaping issues (`useFileSync.ts`)
- Debounced persistence pattern in `useBrandSettings.ts` (500ms debounce) — could inform URL validation debounce
- View state managed via React `useState` — no routing or external state management

### Integration Points
- `BrandModal.tsx` is the main entry point — URL input views, loading states, and error states will be orchestrated here
- The `loaded` check in BrandModal already gates on settings being ready — URL flow needs to check `hasBrandData()` to decide empty-state vs tabs
- `hasBrandData()` from `markdown.ts` already exists to check if settings have content
- New hook (e.g., `useUrlFetch.ts`) will manage fetch state, validation, and shell.exec calls

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

*Phase: 01-url-fetching-and-security*
*Context gathered: 2026-03-08*
