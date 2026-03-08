# Codebase Concerns

**Analysis Date:** 2026-03-08

## Tech Debt

**No Input Validation on Hex Color Values:**
- Issue: The hex color input in `src/ColorsSection.tsx` (lines 90-93) only checks that the value starts with `#` and is at most 7 characters. It does not validate that the value is a valid hex color (e.g., `#GGGGGG` is accepted). Invalid hex values propagate into the exported markdown and the color swatch `style={{ background: color.hex }}` which silently renders nothing.
- Files: `src/ColorsSection.tsx`
- Impact: Garbage color values exported to CLAUDE.md/AGENTS.md; confusing swatch display.
- Fix approach: Add a regex validation (`/^#[0-9A-F]{6}$/i`) and show a visual error state on invalid input. Only export colors with valid hex values.

**No Input Sanitization for Markdown Injection:**
- Issue: User-provided values (color names, font roles, voice notes, asset labels/paths) are interpolated directly into markdown in `src/markdown.ts` (lines 24-53). Strings containing markdown syntax (e.g., `**`, backticks, `<!-- -->`) will corrupt the output or break the marker-based sync system.
- Files: `src/markdown.ts`
- Impact: Malformed markdown in target file. If a user puts `<!-- BRAND-GUIDELINES-END -->` inside a voice note, the marker extraction in `extractBetweenMarkers` will break, causing partial content replacement or data loss on next export.
- Fix approach: Escape or strip HTML comment syntax (`<!-- -->`) from all user inputs before interpolation. Consider escaping markdown special characters in name/label fields.

**djb2 Hash Collision Risk:**
- Issue: `djb2Hash` in `src/markdown.ts` (lines 9-15) is a 32-bit hash. While collisions are unlikely for typical brand guideline content, using it for sync status means two different contents could produce the same hash, showing "in-sync" when the file is actually stale.
- Files: `src/markdown.ts`, `src/useFileSync.ts`
- Impact: Low probability but silent data inconsistency if it occurs.
- Fix approach: Acceptable for current use case. If sync accuracy becomes critical, switch to a longer hash (e.g., SHA-256 via SubtleCrypto).

**Unsafe Type Cast in Storage Write:**
- Issue: `useBrandSettings.ts` line 38 casts `BrandSettings` through `unknown` to `Record<string, unknown>` to satisfy the storage API. This bypasses type safety and could mask type errors if `BrandSettings` evolves.
- Files: `src/useBrandSettings.ts`
- Impact: Silent type mismatches if the settings shape changes.
- Fix approach: Define the storage write signature to accept `BrandSettings` directly, or use a proper serialization step.

**Monolithic CSS String:**
- Issue: All styles live in a single 329-line template literal in `src/styles.ts`. This is injected into the DOM at runtime via `document.head.appendChild`. No CSS modules, no scoping beyond the `bg-plugin-` prefix convention.
- Files: `src/styles.ts`, `src/ToolbarButton.tsx` (lines 5-16)
- Impact: Harder to maintain as the plugin grows. Risk of style leakage if host app uses similar class names. The `!important` declarations on tab styles (lines 81-91) suggest existing conflicts with host CSS.
- Fix approach: Consider CSS modules via Vite, or at minimum a more robust scoping strategy. The `!important` overrides indicate fragile style isolation.

## Known Bugs

**Style Element Cleanup Race Condition:**
- Symptoms: If multiple `ToolbarButton` instances mount (unlikely but possible), the cleanup function in `useInjectStyles` (`src/ToolbarButton.tsx` lines 12-14) removes the style element on first unmount, leaving other instances unstyled.
- Files: `src/ToolbarButton.tsx`
- Trigger: Mount two toolbar button instances, unmount one.
- Workaround: Currently only one toolbar slot exists, so this does not manifest.

**checkSync Missing from useEffect Dependencies:**
- Symptoms: The `useEffect` in `src/BrandModal.tsx` (line 32-34) calls `checkSync` but does not list it in the dependency array. This is a React exhaustive-deps violation. The effect may use a stale `checkSync` closure.
- Files: `src/BrandModal.tsx`
- Trigger: When `checkSync` identity changes (e.g., `project` or `shell` reference changes) but the listed deps do not change.
- Workaround: In practice, `checkSync` is stable enough that this rarely causes issues, but it violates React rules of hooks.

**storage.read() Error Not Handled:**
- Symptoms: If `storage.read()` rejects in `useBrandSettings.ts` (line 26), the promise rejection is unhandled. The component stays in `loaded: false` state indefinitely, showing "Loading..." forever.
- Files: `src/useBrandSettings.ts`
- Trigger: Storage backend throws an error (corrupt data, permissions).
- Workaround: None. User must close and reopen the modal.

## Security Considerations

**Shell Command Execution via `node -e`:**
- Risk: The file write operation in `src/useFileSync.ts` (lines 109-114) executes `node -e` with a base64-encoded payload. While the base64 encoding prevents direct injection, the `filePath` is constructed from `project.path` + `settings.targetFile`. The `targetFile` is constrained to `'CLAUDE.md' | 'AGENTS.md'` by TypeScript types, but `project.path` comes from the host and is not validated by the plugin.
- Files: `src/useFileSync.ts`
- Current mitigation: TypeScript union type constrains `targetFile`; base64 encoding prevents content injection; the host app controls `project.path`.
- Recommendations: The current approach is reasonable given the plugin trust model (host provides the execution context). No immediate action needed.

**No Content Size Limits:**
- Risk: Users can enter unlimited text in voice notes or add unlimited colors/fonts/assets. Large content could produce very large writes to CLAUDE.md.
- Files: `src/VoiceSection.tsx`, `src/ColorsSection.tsx`, `src/FontsSection.tsx`, `src/AssetsSection.tsx`
- Current mitigation: None.
- Recommendations: Add reasonable limits (e.g., 5000 chars for voice notes, 50 items for lists) to prevent accidental bloat of target files.

## Performance Bottlenecks

**checkSync Reads Entire File on Every Settings Change:**
- Problem: Every keystroke triggers `updateSettings` -> state change -> `useEffect` in `BrandModal.tsx` fires `checkSync` -> which runs `shell.exec('cat', [filePath])` to read the entire target file. With the 500ms debounce on save, the sync check still fires on every React render caused by settings changes.
- Files: `src/useFileSync.ts`, `src/BrandModal.tsx` (lines 32-34)
- Cause: The `useEffect` depends on `settings.colors`, `settings.fonts`, etc., which change on every keystroke. `checkSync` performs two shell commands (`test -f` and `cat`) each time.
- Improvement path: Debounce the sync check, or only check sync on tab switch / export click rather than on every settings change. The sync status badge is informational and does not need real-time accuracy.

## Fragile Areas

**Marker-Based File Sync:**
- Files: `src/markdown.ts` (lines 77-100), `src/useFileSync.ts`
- Why fragile: The sync system relies on exact HTML comment markers (`<!-- BRAND-GUIDELINES-START -->` and `<!-- BRAND-GUIDELINES-END -->`). If a user manually edits the target file and alters or removes one marker, the plugin falls back to appending a duplicate section. If both markers exist but are reordered (end before start), `extractBetweenMarkers` returns null and content is duplicated.
- Safe modification: Always test with all three write cases (no file, no markers, has markers). Add a test for the edge case where markers are present but malformed.
- Test coverage: No tests exist for any of these functions.

**React Externalization via data: URLs:**
- Files: `vite.config.ts` (lines 11-15)
- Why fragile: The Vite config manually enumerates React exports (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, `useContext`, `createElement`, `Fragment`) in a data URL string. If the plugin starts using additional React APIs (e.g., `useReducer`, `useSyncExternalStore`, `createContext`, `forwardRef`), the build succeeds but the import fails at runtime with an opaque error.
- Safe modification: When adding new React imports, always add the corresponding export to `reactDataUrl` in `vite.config.ts`. Consider generating this list programmatically.
- Test coverage: No tests. Failures only surface at runtime in the host app.

**Custom JSX Runtime in data: URL:**
- Files: `vite.config.ts` (line 13)
- Why fragile: The custom `_jsx` function is a minimal reimplementation. It does not handle all JSX runtime edge cases (e.g., `defaultProps`, `ref` forwarding via the new JSX transform). If React 19 changes the JSX runtime contract, this breaks silently.
- Safe modification: Test any React version upgrade thoroughly in the host app.
- Test coverage: None.

## Scaling Limits

**Storage as Single JSON Blob:**
- Current capacity: The entire brand settings object is written as one blob via `storage.write({ brandSettings: ... })`.
- Limit: For typical brand guidelines (a few colors, fonts, one text block), this is fine. If the plugin were extended to support multiple brand profiles or large asset catalogs, the single-blob approach would become inefficient.
- Scaling path: Not a concern at current scope. If needed, partition storage by key.

## Dependencies at Risk

**No Production Dependencies:**
- The plugin has zero runtime dependencies (React is externalized). This is a strength, not a risk. The only dev dependencies are `@types/react`, `typescript`, and `vite`, all well-maintained.

**Tight Coupling to Host App Globals:**
- Risk: The plugin depends on `window.__SHIPSTUDIO_REACT__`, `window.__SHIPSTUDIO_REACT_DOM__`, and `window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__`. Any change to these global names or their shape breaks the plugin with no compile-time warning.
- Files: `src/context.ts`, `vite.config.ts`
- Impact: Plugin fails to load entirely.
- Migration plan: The host app controls these contracts. Plugin should pin to `api_version` in `plugin.json` and the host should maintain backward compatibility per API version.

## Missing Critical Features

**No Undo/Redo:**
- Problem: Deleting a color, font, or asset is immediate and irreversible. The 500ms debounced save means the deletion persists to storage quickly.
- Blocks: Users who accidentally delete items must re-enter them manually.

**No Import/Restore from Target File:**
- Problem: The plugin can export to CLAUDE.md but cannot read brand data back from the target file. If storage is cleared, all brand settings are lost even if the markdown exists in the file.
- Blocks: Round-trip editing; recovery from storage loss.

## Test Coverage Gaps

**No Tests Exist:**
- What's not tested: The entire codebase has zero test files. No unit tests, integration tests, or E2E tests.
- Files: All files in `src/` -- particularly the pure functions in `src/markdown.ts` which are highly testable (`generateBrandMarkdown`, `buildFileContent`, `extractBetweenMarkers`, `djb2Hash`, `hasBrandData`).
- Risk: Any refactoring or feature addition has no safety net. The marker-based sync logic in `src/markdown.ts` is the most critical area -- bugs here can corrupt user files (CLAUDE.md/AGENTS.md).
- Priority: **High** -- `src/markdown.ts` functions should be the first to get test coverage. These are pure functions with clear inputs/outputs and directly impact file integrity.

---

*Concerns audit: 2026-03-08*
