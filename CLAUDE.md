# Brand Guidelines Plugin

A Ship Studio plugin that lets users define brand identity (colors, fonts, voice, assets) and sync it into CLAUDE.md or AGENTS.md as a managed section.

## Architecture

- **Entry**: `src/index.tsx` — exports `name`, `slots`, `onActivate`, `onDeactivate`
- **Context**: `src/context.ts` — `usePluginContext()` + convenience hooks (`useShell`, `useToast`, etc.)
- **Types**: `src/types.ts` — `BrandColor`, `BrandFont`, `BrandAsset`, `BrandSettings`, `PluginContextValue`
- **Styles**: `src/styles.ts` — all CSS classes prefixed with `bg-plugin-`

## Plugin SDK Pattern

React is externalized via `vite.config.ts` — the host app provides React through `window.__SHIPSTUDIO_REACT__`. Plugin context is accessed via `window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__`.

## File Sync Strategy

The plugin writes to CLAUDE.md/AGENTS.md using HTML comment markers:

```
<!-- BRAND-GUIDELINES-START -->
...content...
<!-- BRAND-GUIDELINES-END -->
```

Three write cases:
1. File doesn't exist → create with brand section only
2. File exists, no markers → append section at end
3. File exists, markers found → replace between markers (inclusive)

Content is passed to `node -e` as base64 to avoid shell escaping issues.

## Key Files

| File | Purpose |
|------|---------|
| `src/BrandModal.tsx` | Main modal with tab bar (Colors/Fonts/Voice/Assets) |
| `src/useBrandSettings.ts` | Load/save settings via plugin storage with 500ms debounce |
| `src/useFileSync.ts` | Read/write target file, check sync status |
| `src/markdown.ts` | Pure functions: generate markdown, hash (djb2), parse markers |
| `src/ExportFooter.tsx` | Target file selector + sync status + export button |

## Storage Schema

```json
{
  "brandSettings": {
    "colors": [{ "id": "...", "name": "Primary", "hex": "#6C5CE7" }],
    "fonts": [{ "id": "...", "role": "Heading", "value": "Inter" }],
    "voiceNotes": "Professional but approachable.",
    "assets": [{ "id": "...", "label": "Logo", "path": "public/logo.svg" }],
    "targetFile": "CLAUDE.md",
    "lastExportedHash": "abc123"
  }
}
```

## Build

```bash
npm install
npm run build   # → dist/index.js
npm run dev     # watch mode
```
