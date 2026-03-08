# Testing Patterns

**Analysis Date:** 2026-03-08

## Test Framework

**Runner:**
- No test framework configured
- No test runner detected (no Jest, Vitest, or other test config)
- No test scripts in `package.json`

**Assertion Library:**
- None configured

**Run Commands:**
```bash
# No test commands available
# package.json only has "build" and "dev" scripts
```

## Test File Organization

**Location:**
- No test files exist in the codebase
- No `__tests__/` directories
- No `*.test.*` or `*.spec.*` files

## Current State

This codebase has zero tests. There is no test infrastructure set up.

## Recommended Test Setup

Given the tech stack (TypeScript, React, Vite), the recommended approach:

**Framework:** Vitest (native Vite integration)

**Install:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Config:** Add `vitest.config.ts` or extend `vite.config.ts`:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

**Scripts to add to `package.json`:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Testable Code

The codebase has clear separation between pure logic and React components, making some areas straightforward to test:

**High-value pure function targets (no mocking needed):**
- `src/markdown.ts` - All 7 exported functions are pure:
  - `djb2Hash(str)` - Deterministic hash
  - `generateBrandMarkdown(settings)` - Settings to markdown conversion
  - `wrapWithMarkers(content)` - Adds HTML comment markers
  - `hasMarkers(fileContent)` - Boolean check
  - `extractBetweenMarkers(fileContent)` - Content extraction
  - `replaceMarkerSection(fileContent, newSection)` - Content replacement
  - `buildFileContent(existingContent, brandMarkdown)` - 3-case file builder
  - `hasBrandData(settings)` - Validation check

**Suggested test file structure:**
```
src/
  markdown.test.ts        # Pure function tests (highest priority)
  useBrandSettings.test.ts # Hook tests (requires mock storage)
  useFileSync.test.ts      # Hook tests (requires mock shell + project)
```

**Example test for `src/markdown.ts`:**
```typescript
import { describe, it, expect } from 'vitest';
import {
  djb2Hash,
  generateBrandMarkdown,
  buildFileContent,
  hasMarkers,
  extractBetweenMarkers,
  hasBrandData,
} from './markdown';

describe('djb2Hash', () => {
  it('returns deterministic hash for same input', () => {
    expect(djb2Hash('hello')).toBe(djb2Hash('hello'));
  });

  it('returns different hashes for different input', () => {
    expect(djb2Hash('hello')).not.toBe(djb2Hash('world'));
  });
});

describe('buildFileContent', () => {
  it('creates new file with just the section when no existing content', () => {
    const result = buildFileContent(null, '## Brand Guidelines\n\ntest');
    expect(result).toContain('<!-- BRAND-GUIDELINES-START -->');
    expect(result).toContain('<!-- BRAND-GUIDELINES-END -->');
  });

  it('appends to existing file without markers', () => {
    const result = buildFileContent('# Existing\n\nContent', '## Brand Guidelines');
    expect(result).toContain('# Existing\n\nContent');
    expect(result).toContain('<!-- BRAND-GUIDELINES-START -->');
  });

  it('replaces section when markers exist', () => {
    const existing = 'before\n<!-- BRAND-GUIDELINES-START -->\nold\n<!-- BRAND-GUIDELINES-END -->\nafter';
    const result = buildFileContent(existing, 'new content');
    expect(result).toContain('new content');
    expect(result).not.toContain('old');
    expect(result).toContain('before');
    expect(result).toContain('after');
  });
});
```

**Mocking requirements for hook tests:**
- `window.__SHIPSTUDIO_REACT__` - Host React instance
- `window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__` - Plugin context ref
- `storage.read()` / `storage.write()` - Async storage mock
- `shell.exec()` - Async shell command mock

## Test Coverage Gaps

**Critical untested areas:**

| Area | File | Risk |
|------|------|------|
| Markdown generation | `src/markdown.ts` | Malformed output breaks CLAUDE.md/AGENTS.md |
| File sync logic | `src/useFileSync.ts` | Could overwrite user content in target files |
| Marker parsing | `src/markdown.ts` | Edge cases with missing/malformed markers |
| Settings persistence | `src/useBrandSettings.ts` | Debounce timing, storage read/write race conditions |
| Base64 encoding | `src/useFileSync.ts` lines 103-107 | Encoding failures corrupt target file |

---

*Testing analysis: 2026-03-08*
