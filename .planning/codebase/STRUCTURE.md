# Codebase Structure

**Analysis Date:** 2026-03-08

## Directory Layout

```
plugin-brand-guidelines/
├── src/                    # All source code (flat, no subdirectories)
│   ├── index.tsx           # Plugin entry point and registration
│   ├── types.ts            # All TypeScript interfaces
│   ├── context.ts          # Host context bridge and convenience hooks
│   ├── styles.ts           # All CSS as a JS string constant
│   ├── markdown.ts         # Pure markdown generation and parsing logic
│   ├── BrandModal.tsx      # Main modal with tab navigation
│   ├── Modal.tsx           # Generic modal shell (overlay, header, close)
│   ├── ToolbarButton.tsx   # Toolbar slot component (icon + modal toggle)
│   ├── ExportFooter.tsx    # Target file selector, sync status, export button
│   ├── ColorsSection.tsx   # Colors tab content
│   ├── FontsSection.tsx    # Fonts tab content
│   ├── VoiceSection.tsx    # Voice tab content
│   ├── AssetsSection.tsx   # Assets tab content
│   ├── useBrandSettings.ts # Settings persistence hook
│   └── useFileSync.ts      # File sync and export hook
├── dist/                   # Build output (committed)
│   └── index.js            # Single ES module bundle
├── plugin.json             # Plugin manifest for Ship Studio registry
├── package.json            # NPM package config
├── package-lock.json       # Dependency lockfile
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── CLAUDE.md               # Project instructions for AI assistants
└── .gitignore              # Git ignore rules
```

## Directory Purposes

**`src/`:**
- Purpose: All plugin source code
- Contains: React components (.tsx), hooks (.ts), types (.ts), styles (.ts), pure logic (.ts)
- Key files: `index.tsx` (entry), `types.ts` (interfaces), `context.ts` (host bridge), `markdown.ts` (core logic)
- Note: Completely flat structure -- no subdirectories. All 14 source files live at the same level.

**`dist/`:**
- Purpose: Built plugin bundle ready for host consumption
- Contains: Single `index.js` ES module
- Generated: Yes, by `npm run build` (Vite)
- Committed: Yes -- required for the plugin to load from the registry

## Key File Locations

**Entry Points:**
- `src/index.tsx`: Plugin registration -- exports `name`, `slots`, `onActivate`, `onDeactivate`
- `dist/index.js`: Built bundle loaded by Ship Studio host

**Configuration:**
- `plugin.json`: Plugin manifest (id, name, version, slots, min_app_version, api_version)
- `vite.config.ts`: Build config with React externalization via data URLs
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Dependencies and scripts (`build`, `dev`)

**Core Logic:**
- `src/markdown.ts`: All pure functions for markdown generation, hashing, marker parsing
- `src/useBrandSettings.ts`: Settings state management with debounced persistence
- `src/useFileSync.ts`: File read/write operations and sync status tracking

**UI Components:**
- `src/BrandModal.tsx`: Main modal orchestrator (tabs, settings, sync)
- `src/Modal.tsx`: Reusable modal shell
- `src/ToolbarButton.tsx`: Entry point component rendered in toolbar slot
- `src/ExportFooter.tsx`: Footer with export controls
- `src/ColorsSection.tsx`, `src/FontsSection.tsx`, `src/VoiceSection.tsx`, `src/AssetsSection.tsx`: Tab content components

**Type System:**
- `src/types.ts`: All domain interfaces (`BrandColor`, `BrandFont`, `BrandAsset`, `BrandSettings`, `PluginContextValue`)

**Styling:**
- `src/styles.ts`: Complete CSS as a string constant, injected at runtime

**Host Bridge:**
- `src/context.ts`: `usePluginContext()` and derived hooks (`useShell`, `useToast`, `usePluginStorage`, `useProject`, `useAppActions`, `useTheme`)

## Naming Conventions

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `BrandModal.tsx`, `ColorsSection.tsx`)
- Custom hooks: camelCase with `use` prefix and `.ts` extension (e.g., `useBrandSettings.ts`, `useFileSync.ts`)
- Pure logic modules: camelCase with `.ts` extension (e.g., `markdown.ts`, `context.ts`, `styles.ts`)
- Type definition files: camelCase with `.ts` extension (e.g., `types.ts`)

**Exports:**
- Components: Named exports matching the filename (e.g., `export function BrandModal`)
- Hooks: Named exports matching the filename (e.g., `export function useBrandSettings`)
- Types: Named exports per interface (e.g., `export interface BrandSettings`)
- Constants: Named exports in UPPER_SNAKE_CASE (e.g., `BG_STYLE_ID`, `BRAND_GUIDELINES_CSS`)

**CSS Classes:**
- All prefixed with `bg-plugin-` to avoid collisions with host styles
- BEM-like modifiers use `--` (e.g., `bg-plugin-tab--active`, `bg-plugin-input--hex`)

## Where to Add New Code

**New Tab/Section (e.g., "Logos" tab):**
- Create component: `src/LogosSection.tsx` (follow `ColorsSection.tsx` pattern)
- Add data type: Add `BrandLogo` interface to `src/types.ts`, extend `BrandSettings`
- Wire into modal: Add tab entry to `TABS` array and render conditionally in `src/BrandModal.tsx`
- Update markdown output: Add section generation in `generateBrandMarkdown()` in `src/markdown.ts`
- Update data check: Add condition to `hasBrandData()` in `src/markdown.ts`
- Update defaults: Add default value to `DEFAULT_SETTINGS` in `src/useBrandSettings.ts`

**New UI Component:**
- Place in `src/` as a PascalCase `.tsx` file
- Use `useTheme()` from `src/context.ts` for colors
- Use CSS classes from `src/styles.ts` (add new classes to `BRAND_GUIDELINES_CSS` if needed)
- All classes must be prefixed with `bg-plugin-`

**New Custom Hook:**
- Place in `src/` as `useXxx.ts`
- Access host capabilities via convenience hooks in `src/context.ts`
- Export a named function matching the filename

**New Pure Logic:**
- Place in `src/` as a camelCase `.ts` file
- Keep free of React imports and side effects
- Export named functions

**New CSS Styles:**
- Add to the `BRAND_GUIDELINES_CSS` string in `src/styles.ts`
- Prefix all class names with `bg-plugin-`

## Special Directories

**`dist/`:**
- Purpose: Contains the built plugin bundle
- Generated: Yes, via `npm run build`
- Committed: Yes (required for plugin registry loading)
- Note: Do not edit manually. Run `npm run build` to regenerate.

**`.claude/`:**
- Purpose: Claude Code local settings
- Contains: `settings.local.json`
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: Installed NPM dependencies
- Generated: Yes, via `npm install`
- Committed: No

---

*Structure analysis: 2026-03-08*
