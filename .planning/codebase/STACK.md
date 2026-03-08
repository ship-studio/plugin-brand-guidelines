# Technology Stack

**Analysis Date:** 2026-03-08

## Languages

**Primary:**
- TypeScript 5.6+ - All source code in `src/`
- TSX - React components (`src/*.tsx`)

**Secondary:**
- JSON - Configuration (`package.json`, `tsconfig.json`, `plugin.json`)

## Runtime

**Environment:**
- Node.js (used at runtime for file writes via `node -e` in `src/useFileSync.ts`)
- Browser/Electron - Plugin runs inside Ship Studio host app

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19 - UI framework (peer dependency, provided by host app via `window.__SHIPSTUDIO_REACT__`)

**Testing:**
- None configured - no test framework or test files detected

**Build/Dev:**
- Vite 6 - Build tool and dev server (`vite.config.ts`)
- TypeScript 5.6 - Type checking (`tsconfig.json`)

## Key Dependencies

**Critical (devDependencies):**
- `@types/react` ^19.0.0 - TypeScript types for React
- `typescript` ^5.6.0 - TypeScript compiler
- `vite` ^6.0.0 - Build bundler

**Peer Dependencies (provided by host):**
- `react` ^19.0.0 - Externalized; host provides via `window.__SHIPSTUDIO_REACT__`

**Notable:** This plugin has zero runtime dependencies. React and ReactDOM are externalized in `vite.config.ts` and resolved from the host application's window globals at runtime.

## Configuration

**TypeScript (`tsconfig.json`):**
- Target: ES2020
- Module: ESNext with bundler resolution
- JSX: react-jsx
- Strict mode: enabled

**Vite Build (`vite.config.ts`):**
- Output: ES module library format
- Entry: `src/index.tsx`
- Output file: `dist/index.js`
- Minification: disabled (`minify: false`)
- React/ReactDOM externalized via data: URL rewrites to `window.__SHIPSTUDIO_REACT__` and `window.__SHIPSTUDIO_REACT_DOM__`
- JSX runtime externalized to custom `_jsx` shim via data: URL

**Plugin Manifest (`plugin.json`):**
- Plugin ID: `brand-guidelines`
- API version: 1
- Min app version: 0.3.53
- Slots: `["toolbar"]`
- No required commands

## Build Output

**Production:**
- `dist/index.js` - Single ES module bundle (committed to repo for registry loading)

## Platform Requirements

**Development:**
- Node.js (version not pinned - no `.nvmrc` or `.node-version`)
- npm

**Production:**
- Ship Studio desktop app >= 0.3.53
- Plugin loads as ES module inside the host app's plugin runtime

---

*Stack analysis: 2026-03-08*
