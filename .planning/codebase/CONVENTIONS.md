# Coding Conventions

**Analysis Date:** 2026-03-08

## Naming Patterns

**Files:**
- React components: PascalCase `.tsx` (e.g., `src/BrandModal.tsx`, `src/ColorsSection.tsx`, `src/ExportFooter.tsx`)
- Custom hooks: camelCase with `use` prefix `.ts` (e.g., `src/useBrandSettings.ts`, `src/useFileSync.ts`)
- Pure utility modules: camelCase `.ts` (e.g., `src/markdown.ts`, `src/context.ts`, `src/types.ts`, `src/styles.ts`)
- Entry point: `src/index.tsx`

**Functions:**
- Use camelCase for all functions: `generateBrandMarkdown`, `djb2Hash`, `buildFileContent`
- React components use PascalCase: `BrandModal`, `ColorsSection`, `ToolbarButton`
- Custom hooks use `use` prefix: `usePluginContext`, `useBrandSettings`, `useFileSync`, `useInjectStyles`
- Event handlers: `addColor`, `updateColor`, `removeColor` (verb + noun)
- Callbacks passed as props: `onClose`, `onExport` (on + verb)

**Variables:**
- camelCase throughout: `activeTab`, `syncStatus`, `saveTimer`, `latestSettings`
- Constants: UPPER_SNAKE_CASE for module-level constants: `START_MARKER`, `END_MARKER`, `DEFAULT_SETTINGS`, `TABS`, `STATUS_LABELS`, `BG_STYLE_ID`
- Booleans: descriptive names, sometimes with prefixes: `loaded`, `dirty`, `exporting`, `isFirstExport`, `hasData`

**Types:**
- PascalCase for interfaces and type aliases: `BrandColor`, `BrandFont`, `BrandSettings`, `PluginContextValue`
- Union type aliases for constrained strings: `type Tab = 'colors' | 'fonts' | 'voice' | 'assets'`
- Export type alias for sync status: `export type SyncStatus = 'none' | 'not-exported' | 'in-sync' | 'needs-update'`

## Code Style

**Formatting:**
- No Prettier or formatter config detected. Manual formatting conventions are used.
- 2-space indentation
- Single quotes for strings
- Trailing commas in multi-line function parameters and arrays
- Semicolons at end of statements

**Linting:**
- No ESLint config detected. One inline `// eslint-disable-next-line` comment in `src/context.ts` suggests ESLint may be used at a higher level (monorepo) or was previously configured.

**TypeScript:**
- `strict: true` in `tsconfig.json`
- Use `type` imports: `import type { BrandSettings } from './types'`
- Avoid `any` except for window globals access (cast `window as any` in `src/context.ts`)
- Use `Omit<>` for field constraints: `keyof Omit<BrandColor, 'id'>`

## Import Organization

**Order:**
1. React hooks (`import { useState, useEffect, useCallback, useRef } from 'react'`)
2. Local context/hooks (`import { useTheme } from './context'`)
3. Local components (`import { Modal } from './Modal'`)
4. Local utilities (`import { generateBrandMarkdown, ... } from './markdown'`)
5. Type imports last (`import type { BrandSettings } from './types'`)

**Path Aliases:**
- No path aliases configured. All imports use relative paths with `./` prefix.

## Error Handling

**Patterns:**
- Shell command results checked via `exit_code !== 0` before proceeding (see `src/useFileSync.ts` lines 36-47, 85-97)
- User-facing errors shown via `showToast(message, 'error')` - never silent failures
- Try/catch wraps entire async export operation with generic fallback toast in `src/useFileSync.ts` line 129
- Guard clauses for null project state: `if (!project) { showToast('No project open', 'error'); return; }`
- Loading states tracked with boolean flags (`loaded`, `exporting`) to prevent double-actions
- Context access throws if unavailable: `throw new Error('Plugin context not available.')` in `src/context.ts`

**Error display convention:**
- Use `showToast(message, 'error')` for user-facing errors
- Use `showToast(message, 'success')` for confirmations
- Include the relevant filename in error messages: `` `${settings.targetFile} is not writable` ``

## Logging

**Framework:** `console.log` only

**Patterns:**
- Lifecycle logging with plugin prefix: `console.log('[brand-guidelines] Plugin activated')` in `src/index.tsx`
- No debug logging in component or hook code

## Comments

**When to Comment:**
- JSDoc-style `/** */` comments on exported pure functions in utility modules (`src/markdown.ts`)
- Block comments explain non-obvious architectural decisions (`src/vite.config.ts` lines 3-8)
- Inline comments for case distinctions: `// Case 1: no existing file`, `// Case 3: has markers`
- No comments in component files (self-documenting JSX)

**JSDoc/TSDoc:**
- Used on all exported functions in `src/markdown.ts` with single-line descriptions
- Not used on React components or hooks

## Function Design

**Size:** Functions are small, single-purpose. Largest function is `exportToFile` at ~40 lines in `src/useFileSync.ts`.

**Parameters:**
- Components receive props as inline object types: `{ onClose }: { onClose: () => void }`
- Updater pattern for state changes: `updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void`
- This updater pattern is the single mechanism all section components use to modify shared state

**Return Values:**
- Hooks return object destructuring: `{ settings, updateSettings, setLastExportedHash, loaded, dirty }`
- Pure functions return typed values: `string`, `boolean`, `string | null`

## Module Design

**Exports:**
- Named exports exclusively. No default exports anywhere in the codebase.
- Components: single named export per file matching the filename (`export function ColorsSection`)
- Types: all exported from `src/types.ts`
- Hook files export the hook function and related types (`export type SyncStatus`, `export function useFileSync`)

**Barrel Files:**
- No barrel files. `src/index.tsx` serves as the plugin entry point only, exporting `name`, `slots`, `onActivate`, `onDeactivate`.

## Component Patterns

**State Management:**
- Updater function pattern: parent (`BrandModal`) owns state via `useBrandSettings()`, passes `updateSettings` callback down
- Each section component receives its slice of data + the shared `updateSettings` callback
- Immutable updates with spread: `{ ...prev, colors: prev.colors.map(...) }`

**Styling:**
- CSS classes prefixed with `bg-plugin-` to avoid host app conflicts
- CSS injected at runtime via `<style>` tag in `src/ToolbarButton.tsx` using `useInjectStyles()`
- All CSS defined as a template literal string in `src/styles.ts`
- Dynamic theme values applied via inline `style` props using `useTheme()` hook
- BEM-like modifiers: `bg-plugin-tab--active`, `bg-plugin-input--hex`, `bg-plugin-input--name`

**ID Generation:**
- Use `crypto.randomUUID()` for new item IDs (colors, fonts, assets)

**Section Component Structure (follow this pattern for new sections):**
```typescript
// src/NewSection.tsx
import { useCallback } from 'react';
import { useTheme } from './context';
import type { BrandSettings } from './types';

export function NewSection({
  items,
  updateSettings,
}: {
  items: ItemType[];
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  const theme = useTheme();

  const addItem = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), /* defaults */ }],
    }));
  }, [updateSettings]);

  // Empty state
  if (items.length === 0) {
    return (
      <div className="bg-plugin-section">
        <div className="bg-plugin-empty">No items yet.</div>
        <button className="bg-plugin-add-btn" onClick={addItem} style={{ borderColor: theme.border }}>
          + Add Item
        </button>
      </div>
    );
  }

  // List with add button at bottom
  return (
    <div className="bg-plugin-section">
      {items.map((item) => (
        <div key={item.id} className="bg-plugin-row">
          {/* inputs and delete button */}
        </div>
      ))}
      <button className="bg-plugin-add-btn" onClick={addItem} style={{ borderColor: theme.border }}>
        + Add Item
      </button>
    </div>
  );
}
```

---

*Convention analysis: 2026-03-08*
