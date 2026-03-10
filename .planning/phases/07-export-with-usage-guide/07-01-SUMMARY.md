---
phase: 07-export-with-usage-guide
plan: 01
subsystem: export
tags: [markdown, usage-guide, tdd, vitest]

# Dependency graph
requires:
  - phase: 05-usage-summary-generation
    provides: UsageSummaries type and AI-generated summaries on BrandSettings
  - phase: 06-review-ui-for-usage-summaries
    provides: Filtered usage summaries displayed in ReviewView
provides:
  - generateBrandMarkdown extended with Usage Guide section
  - Test coverage for Usage Guide markdown generation
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Category-gated Usage Guide subsections (requires both summary text and valid tokens)"

key-files:
  created:
    - src/markdown.test.ts
  modified:
    - src/markdown.ts

key-decisions:
  - "Usage Guide subsections require both non-empty summary text AND valid tokens in that category"

patterns-established:
  - "Usage Guide subsection gating: check summary.trim() AND token array validation before rendering"

requirements-completed: [EX-01, EX-02]

# Metrics
duration: 2min
completed: 2026-03-10
---

# Phase 7 Plan 1: Export with Usage Guide Summary

**generateBrandMarkdown extended with Usage Guide section gated by both summary content and valid tokens per category**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-10T11:07:46Z
- **Completed:** 2026-03-10T11:09:28Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Extended generateBrandMarkdown to render ### Usage Guide with per-category #### subsections
- Subsections only appear when both summary text is non-empty AND valid tokens exist for that category
- 8 tests covering unit and integration scenarios, all passing
- Full test suite (137 tests) passes with no regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: TDD generateBrandMarkdown Usage Guide section**
   - `baacd37` (test: RED - 6 failing tests for Usage Guide)
   - `e35d911` (feat: GREEN - implement Usage Guide section)
2. **Task 2: Verify end-to-end export includes Usage Guide** - `1b8d255` (test)

## Files Created/Modified
- `src/markdown.test.ts` - 8 tests for Usage Guide generation (unit + integration)
- `src/markdown.ts` - Added Usage Guide section generation with category gating

## Decisions Made
- Usage Guide subsections gated by both non-empty summary text AND valid tokens in the corresponding category, preventing orphaned guidance for absent token types

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Export pipeline complete with Usage Guide support
- All v1.1 milestone requirements addressed

## Self-Check: PASSED

- All source files exist (src/markdown.ts, src/markdown.test.ts)
- All commits verified (baacd37, e35d911, 1b8d255)
- 137/137 tests pass, build succeeds

---
*Phase: 07-export-with-usage-guide*
*Completed: 2026-03-10*
