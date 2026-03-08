---
phase: 02
slug: token-extraction-and-ai-analysis
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-08
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.0.18 |
| **Config file** | `vitest.config.ts` (exists) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | COLR-01 | unit | `npx vitest run src/tokenExtraction.test.ts -t "extractColors"` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | COLR-02 | unit | `npx vitest run src/tokenExtraction.test.ts -t "dedup"` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | FONT-01 | unit | `npx vitest run src/tokenExtraction.test.ts -t "extractFonts"` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | VOIC-01 | unit | `npx vitest run src/tokenExtraction.test.ts -t "extractVisibleText"` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | COLR-03 | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "color names"` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | FONT-02 | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "font roles"` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 2 | VOIC-02 | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "voiceNotes"` | ❌ W0 | ⬜ pending |
| 02-02-04 | 02 | 2 | AINT-01 | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "claude invocation"` | ❌ W0 | ⬜ pending |
| 02-02-05 | 02 | 2 | AINT-02 | unit | `npx vitest run src/analyzeTokens.test.ts -t "truncat"` | ❌ W0 | ⬜ pending |
| 02-02-06 | 02 | 2 | AINT-03 | unit (mock shell) | `npx vitest run src/analyzeTokens.test.ts -t "timeout"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/tokenExtraction.test.ts` — stubs for COLR-01, COLR-02, FONT-01, VOIC-01
- [ ] `src/analyzeTokens.test.ts` — stubs for COLR-03, FONT-02, VOIC-02, AINT-01, AINT-02, AINT-03

*Both files should follow existing test conventions: `// @vitest-environment jsdom` directive, `mockShell()` helper pattern from `fetchUtils.test.ts`.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| AI-generated color names are creative and contextual | COLR-03 | Depends on Claude CLI response quality | Run extraction against a known brand site, verify names are contextually appropriate |
| Voice notes are structured bullet points | VOIC-02 | Output quality is subjective | Run extraction, verify voice notes format matches structured bullet point style |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
