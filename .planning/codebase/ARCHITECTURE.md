# Architecture

**Analysis Date:** 2026-03-08

## Pattern Overview

**Overall:** Ship Studio Plugin (React component library consumed by a host application)

**Key Characteristics:**
- Single-bundle ES module plugin loaded by the Ship Studio host app at runtime
- React is externalized -- the host provides React via `window.__SHIPSTUDIO_REACT__`; the plugin never bundles its own React
- All host capabilities (shell, storage, toast, theme) are accessed through a shared plugin context on `window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__`
- The plugin registers into named "slots" (currently `toolbar`) which the host renders at designated locations
- File I/O is performed indirectly via the host's `shell.exec()` API, not through direct filesystem access

## Layers

**Plugin Entry / Registration:**
- Purpose: Declare plugin identity, slot bindings, and lifecycle hooks
- Location: `src/index.tsx`
- Contains: Exported `name`, `slots` map, `onActivate()`, `onDeactivate()`
- Depends on: `src/ToolbarButton.tsx`
- Used by: Ship Studio host plugin loader

**Host Context Bridge:**
- Purpose: Access host-provided capabilities (shell, storage, actions, theme, project info)
- Location: `src/context.ts`
- Contains: `usePluginContext()` and convenience hooks: `useShell()`, `useToast()`, `usePluginStorage()`, `useProject()`, `useAppActions()`, `useTheme()`
- Depends on: `window.__SHIPSTUDIO_REACT__`, `window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__`
- Used by: All components and hooks throughout the plugin

**UI Components:**
- Purpose: Render the modal UI with tabbed brand data editors
- Location: `src/BrandModal.tsx`, `src/Modal.tsx`, `src/ToolbarButton.tsx`, `src/ExportFooter.tsx`, `src/ColorsSection.tsx`, `src/FontsSection.tsx`, `src/VoiceSection.tsx`, `src/AssetsSection.tsx`
- Contains: React functional components with inline prop types
- Depends on: Context hooks, custom hooks (`useBrandSettings`, `useFileSync`), styles
- Used by: Each other (ToolbarButton -> BrandModal -> Modal + sections + ExportFooter)

**State Management Hooks:**
- Purpose: Load/save brand settings from host storage with debounced persistence
- Location: `src/useBrandSettings.ts`
- Contains: `useBrandSettings()` hook managing settings state, debounced auto-save (500ms), and hash tracking
- Depends on: `usePluginStorage()` from context, `BrandSettings` type
- Used by: `src/BrandModal.tsx`

**File Sync Hook:**
- Purpose: Read target file, compare hashes, write updated content
- Location: `src/useFileSync.ts`
- Contains: `useFileSync()` hook with `checkSync()` and `exportToFile()` functions, `SyncStatus` type
- Depends on: `useShell()`, `useProject()`, `useToast()` from context; all functions from `src/markdown.ts`
- Used by: `src/BrandModal.tsx`

**Markdown Generation (Pure Logic):**
- Purpose: Generate markdown, compute hashes, parse/replace marker sections
- Location: `src/markdown.ts`
- Contains: Pure functions with no side effects -- `generateBrandMarkdown()`, `buildFileContent()`, `djb2Hash()`, `extractBetweenMarkers()`, `hasMarkers()`, `replaceMarkerSection()`, `wrapWithMarkers()`, `hasBrandData()`
- Depends on: `BrandSettings` type only
- Used by: `src/useFileSync.ts`, `src/ExportFooter.tsx`

**Styling:**
- Purpose: All CSS for the plugin, injected at runtime as a `<style>` tag
- Location: `src/styles.ts`
- Contains: `BRAND_GUIDELINES_CSS` string constant and `BG_STYLE_ID` identifier
- Depends on: Nothing
- Used by: `src/ToolbarButton.tsx` (injects styles on mount via `useInjectStyles()`)

**Type Definitions:**
- Purpose: TypeScript interfaces for all domain models and the plugin context contract
- Location: `src/types.ts`
- Contains: `BrandColor`, `BrandFont`, `BrandAsset`, `BrandSettings`, `PluginContextValue`
- Depends on: Nothing
- Used by: All other modules

## Data Flow

**User Edits Brand Data:**

1. User opens modal via `ToolbarButton` -> `BrandModal` renders with current settings from `useBrandSettings()`
2. Section components (`ColorsSection`, `FontsSection`, `VoiceSection`, `AssetsSection`) call `updateSettings()` on every change
3. `updateSettings()` in `useBrandSettings` applies the updater function, sets state, and schedules a debounced save (500ms)
4. After debounce, settings are persisted via `storage.write({ brandSettings: ... })` to the host's plugin storage

**Sync Status Check:**

1. `BrandModal` runs `checkSync()` on mount and whenever settings change (via `useEffect`)
2. `checkSync()` in `useFileSync` checks: (a) project exists, (b) brand data exists, (c) target file exists on disk via `shell.exec('test', ...)`
3. If file exists, reads content via `shell.exec('cat', ...)`, extracts content between markers, and compares djb2 hashes
4. Sets `syncStatus` to one of: `'none'`, `'not-exported'`, `'in-sync'`, `'needs-update'`

**Export to File:**

1. User clicks export button in `ExportFooter` -> calls `exportToFile()` from `useFileSync`
2. Generates markdown via `generateBrandMarkdown(settings)` in `src/markdown.ts`
3. Reads existing file content (if any) via `shell.exec('cat', ...)`
4. Calls `buildFileContent()` which handles three cases: new file, append to existing, replace between markers
5. Encodes result as base64, writes via `shell.exec('node', ['-e', ...])` using `fs.writeFileSync`
6. Updates `lastExportedHash` and sets sync status to `'in-sync'`

**State Management:**
- Local React state in `useBrandSettings` hook, persisted to host plugin storage
- No global state management library -- state flows top-down from `BrandModal` to section components via props
- The `updateSettings` callback uses a functional updater pattern: `(prev: BrandSettings) => BrandSettings`

## Key Abstractions

**BrandSettings:**
- Purpose: Central data model representing all brand identity configuration
- Definition: `src/types.ts`
- Pattern: Flat object with arrays of typed items (`BrandColor[]`, `BrandFont[]`, `BrandAsset[]`), a string (`voiceNotes`), and metadata (`targetFile`, `lastExportedHash`)

**PluginContextValue:**
- Purpose: Contract between the plugin and the Ship Studio host app
- Definition: `src/types.ts`
- Pattern: Interface with nested capability objects (`shell`, `storage`, `actions`, `invoke`, `theme`, `project`)

**Marker-Based File Sync:**
- Purpose: Non-destructive injection of content into existing files
- Definition: `src/markdown.ts`
- Pattern: HTML comment markers (`<!-- BRAND-GUIDELINES-START -->` / `<!-- BRAND-GUIDELINES-END -->`) delimit the managed section. Content outside markers is preserved.

**SyncStatus:**
- Purpose: Represent the relationship between in-memory settings and on-disk file content
- Definition: `src/useFileSync.ts`
- Pattern: Union type `'none' | 'not-exported' | 'in-sync' | 'needs-update'` driving UI state in `ExportFooter`

## Entry Points

**Plugin Registration:**
- Location: `src/index.tsx`
- Triggers: Ship Studio host loads the plugin bundle (`dist/index.js`)
- Responsibilities: Exports `name` ("Brand Guidelines"), `slots` (toolbar -> `ToolbarButton`), `onActivate()`, `onDeactivate()` lifecycle hooks

**Toolbar Slot:**
- Location: `src/ToolbarButton.tsx`
- Triggers: Host renders the toolbar slot
- Responsibilities: Inject plugin CSS, render toolbar icon button, toggle `BrandModal` visibility

**Build Output:**
- Location: `dist/index.js`
- Triggers: Host plugin loader imports this file
- Responsibilities: Single ES module bundle containing all plugin code (React externalized)

## Error Handling

**Strategy:** Try-catch in async operations with user-facing toast notifications

**Patterns:**
- `useFileSync.exportToFile()` wraps the entire export flow in try-catch, calls `showToast(message, 'error')` on failure
- Shell command results are checked via `exit_code !== 0` before proceeding
- File writability is checked before attempting writes (`test -w`)
- `usePluginContext()` throws if context is unavailable (hard failure for missing host integration)
- No error boundaries -- unhandled React errors propagate to the host

## Cross-Cutting Concerns

**Logging:** `console.log` with `[brand-guidelines]` prefix in lifecycle hooks only (`src/index.tsx`)

**Validation:** Inline filtering in `src/markdown.ts` -- items with empty required fields (e.g., color without name/hex) are silently excluded from export via `.filter()`. No user-facing validation errors.

**Theming:** All visual styling uses the host's theme object (`useTheme()`) for colors, borders, and backgrounds. CSS classes in `src/styles.ts` use `var()` fallbacks. Plugin components apply theme values via inline `style` props.

**Authentication:** Not applicable -- the plugin operates within the authenticated host context.

---

*Architecture analysis: 2026-03-08*
