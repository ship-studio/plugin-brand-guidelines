---
phase: 3
slug: review-ui-and-entry-points
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-08
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.18 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 0 | REVW-02, REVW-03 | unit | `npx vitest run src/reviewMerge.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | REVW-01 | manual-only | N/A -- UI rendering requires host app | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | REVW-02 | manual-only | N/A -- checkbox interaction in host app | N/A | ⬜ pending |
| 03-01-04 | 01 | 1 | REVW-03 | unit | `npx vitest run src/reviewMerge.test.ts -t "merge"` | ❌ W0 | ⬜ pending |
| 03-01-05 | 01 | 1 | REVW-04 | manual-only | N/A -- requires full extraction pipeline | N/A | ⬜ pending |
| 03-02-01 | 02 | 1 | ENTR-01 | manual-only | N/A -- already implemented, visual check | N/A | ⬜ pending |
| 03-02-02 | 02 | 1 | ENTR-02 | manual-only | N/A -- already implemented, visual check | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/reviewMerge.test.ts` — unit tests for merge logic covering REVW-02 (filter selected) and REVW-03 (merge with existing)

*Extract merge logic into pure functions for testability.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Review shows extracted tokens organized by category | REVW-01 | UI rendering requires host app context | Open modal, extract from URL, verify review screen shows colors/fonts/voice in separate tabs |
| Accept/reject via checkboxes | REVW-02 | Checkbox interaction in host app | Toggle checkboxes, verify selection state updates |
| Re-extract from different URL | REVW-04 | Requires full extraction pipeline | Click "Try another URL", enter new URL, verify new tokens replace old |
| Empty-state CTA visible | ENTR-01 | Already implemented, visual check | Open modal with no brand settings, verify CTA is visible |
| Header globe button accessible | ENTR-02 | Already implemented, visual check | Open modal with brand settings, verify globe button in header |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
