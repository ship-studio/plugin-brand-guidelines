# External Integrations

**Analysis Date:** 2026-03-08

## APIs & External Services

This plugin has no direct external API integrations. It operates entirely within the Ship Studio host app environment.

## Host App Integration (Ship Studio)

The plugin integrates with Ship Studio through the Plugin Context API, accessed via `window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__` in `src/context.ts`.

**Shell Execution (`useShell` from `src/context.ts`):**
- Executes local shell commands via `shell.exec(command, args, options)`
- Used in `src/useFileSync.ts` for:
  - File existence checks: `test -f <path>`
  - File write permission checks: `test -w <path>`
  - File reading: `cat <path>`
  - File writing: `node -e` with base64-encoded content and `fs.writeFileSync`

**Plugin Storage (`usePluginStorage` from `src/context.ts`):**
- Key-value storage provided by the host app
- `storage.read()` returns `Record<string, unknown>`
- `storage.write(data)` persists data
- Used in `src/useBrandSettings.ts` to persist `brandSettings` object
- Auto-saves with 500ms debounce; hash updates save with 100ms debounce

**Toast Notifications (`useToast` from `src/context.ts`):**
- `showToast(message, type)` where type is `'success' | 'error'`
- Used in `src/useFileSync.ts` for export success/failure feedback

**Project Info (`useProject` from `src/context.ts`):**
- Provides `project.path`, `project.name`, `project.currentBranch`, `project.hasUncommittedChanges`
- Used in `src/useFileSync.ts` to resolve target file paths

**Theme (`useTheme` from `src/context.ts`):**
- Provides color tokens: `bgPrimary`, `bgSecondary`, `bgTertiary`, `textPrimary`, `textSecondary`, `textMuted`, `border`, `accent`, `accentHover`, `action`, `actionHover`, `actionText`, `error`, `success`
- Used in `src/styles.ts` for dynamic styling

**App Actions (`useAppActions` from `src/context.ts`):**
- `refreshGitStatus()`, `refreshBranches()`, `focusTerminal()`, `openUrl(url)`
- Available but not currently used by plugin code

**Invoke (`invoke.call` from `src/types.ts`):**
- Generic RPC: `invoke.call<T>(command, args)` for calling host app commands
- Available but not currently used by plugin code

## Data Storage

**Databases:**
- None - all data stored via Ship Studio's plugin storage API

**File Storage:**
- Local filesystem only
- Writes to `CLAUDE.md` or `AGENTS.md` in the project root
- Uses HTML comment markers for section management (`<!-- BRAND-GUIDELINES-START -->` / `<!-- BRAND-GUIDELINES-END -->`)

**Caching:**
- In-memory React state only
- Persisted settings loaded from plugin storage on mount (`src/useBrandSettings.ts`)

## Authentication & Identity

**Auth Provider:**
- Not applicable - plugin inherits host app's auth context

## Monitoring & Observability

**Error Tracking:**
- None - errors surfaced via toast notifications and `console.log`

**Logs:**
- `console.log` for plugin lifecycle events in `src/index.tsx`

## CI/CD & Deployment

**Hosting:**
- Distributed as a plugin via Ship Studio plugin registry
- `dist/index.js` is committed to the repo for direct loading

**CI Pipeline:**
- None detected (no `.github/workflows/`, no CI config files)

## Environment Configuration

**Required env vars:**
- None - plugin has no environment variable dependencies

**Secrets location:**
- Not applicable

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-03-08*
