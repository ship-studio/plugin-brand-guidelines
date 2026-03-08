# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Start from URL

**Shipped:** 2026-03-08
**Phases:** 4 | **Plans:** 9 | **Sessions:** ~4

### What Was Built
- URL input with real-time validation, SSRF prevention, and bot detection
- CSS token extraction pipeline (colors, fonts, text, radii, spacing)
- AI-powered semantic analysis via Claude CLI (color naming, font roles, voice/tone)
- Review UI with selective token acceptance and non-destructive merge
- Border radius and spacing as first-class brand token types
- View state machine integrating full extraction-to-review flow

### What Worked
- TDD-first approach for pure functions — high confidence in extraction/merge logic
- Phase ordering followed the data pipeline (fetch → extract → review → extend) — minimal rework
- Pure function architecture made testing trivial (110 tests, all passing)
- Plan execution was very fast (~2-3 min per plan avg) due to clear phase scoping
- All 27 requirements satisfied with zero gaps at audit time

### What Was Inefficient
- Phase 1 and 2 roadmap checkboxes showed as unchecked despite being complete (minor tracking gap)
- Nyquist validation was partial across all phases — could have been run inline

### Patterns Established
- `bg-plugin-` CSS class prefix convention for all plugin styles
- 3-tier JSON parsing fallback for AI response handling
- View state machine pattern for modal flow control
- Record<string, boolean> selection maps for O(1) toggle UIs
- Defensive `|| []` for backward-compatible type extensions

### Key Lessons
1. AI prompt engineering is less risky than expected — structured JSON prompts with explicit field requirements work well
2. curl-based fetching is sufficient for most brand sites — headless browser can wait
3. Pure function modules (tokenExtraction, reviewMerge, markdown) are the right granularity for this plugin
4. window.confirm() is adequate for MVP confirmation dialogs — no need for custom modal infrastructure

### Cost Observations
- Model mix: balanced profile (opus/sonnet agents)
- Sessions: ~4
- Notable: 23 min total execution across 9 plans — highly efficient

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~4 | 4 | Initial milestone — established TDD + pure function patterns |

### Cumulative Quality

| Milestone | Tests | Build Size | Zero-Dep Additions |
|-----------|-------|------------|-------------------|
| v1.0 | 110 | 101 KB | vitest, jsdom (dev only) |

### Top Lessons (Verified Across Milestones)

1. Pure function architecture enables fast, confident iteration
2. AI analysis via CLI shell is a viable zero-config approach for plugin-level features
