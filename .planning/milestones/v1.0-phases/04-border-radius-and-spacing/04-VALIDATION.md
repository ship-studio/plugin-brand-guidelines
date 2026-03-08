---
phase: 4
slug: border-radius-and-spacing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-08
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (project uses manual testing + `npm run build`) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Build must succeed
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | RADI-01 | build | `npm run build` | ✅ | ⬜ pending |
| 04-01-02 | 01 | 1 | SPAC-01 | build | `npm run build` | ✅ | ⬜ pending |
| 04-01-03 | 01 | 1 | RADI-02, SPAC-02 | build | `npm run build` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | RADI-01, SPAC-01 | build | `npm run build` | ✅ | ⬜ pending |
| 04-02-02 | 02 | 2 | RADI-02, SPAC-02 | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework needed — project validated via `npm run build` success and manual testing across all 3 prior phases.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Radii extraction from CSS | RADI-01 | UI plugin — visual verification | Extract from a URL, verify radii tab shows values |
| Spacing extraction from CSS | SPAC-01 | UI plugin — visual verification | Extract from a URL, verify spacing tab shows values |
| AI semantic naming of radii | RADI-02 | AI output non-deterministic | Verify AI assigns meaningful names like Small/Medium/Large |
| AI spacing scale identification | SPAC-02 | AI output non-deterministic | Verify AI identifies a coherent spacing scale |
| Review preview includes radii/spacing | REVW-01 (ext) | UI visual | Verify review tabs show Radii and Spacing sections |
| Markdown export includes radii/spacing | Export | Visual | Export and verify markdown has Border Radii and Spacing sections |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
