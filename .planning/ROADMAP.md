# Roadmap: Brand Guidelines Plugin

## Milestones

- v1.0 Start from URL -- Phases 1-4 (shipped 2026-03-08)
- v1.1 Usage Guide -- Phases 5-7 (in progress)

## Phases

<details>
<summary>v1.0 Start from URL (Phases 1-4) -- SHIPPED 2026-03-08</summary>

- [x] Phase 1: URL Fetching and Security (3/3 plans) -- completed 2026-03-08
- [x] Phase 2: Token Extraction and AI Analysis (2/2 plans) -- completed 2026-03-08
- [x] Phase 3: Review UI and Entry Points (2/2 plans) -- completed 2026-03-08
- [x] Phase 4: Border Radius and Spacing (2/2 plans) -- completed 2026-03-08

</details>

### v1.1 Usage Guide

- [ ] **Phase 5: Usage Summary Generation** - AI produces per-category usage guidance during token extraction
- [ ] **Phase 6: Review UI for Usage Summaries** - Users can view and edit usage summaries per tab before accepting
- [ ] **Phase 7: Export with Usage Guide** - Exported markdown includes a Usage Guide section with only accepted tokens

## Phase Details

### Phase 5: Usage Summary Generation
**Goal**: AI produces actionable usage guidance alongside extracted tokens
**Depends on**: Phase 4 (existing extraction pipeline)
**Requirements**: AI-01, AI-02
**Success Criteria** (what must be TRUE):
  1. After extraction completes, each token category (colors, fonts, radii, spacing, voice) has a usage summary paragraph in the analysis result
  2. Usage summaries reference specific token names and values (e.g., "Use Primary #5C4EFA for CTAs and interactive elements")
  3. Usage summaries are stored in the AnalysisResult data structure and survive the extraction-to-review handoff
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — Extend AnalysisResult, buildPrompt, and parseAnalysisResponse with usageSummaries (TDD)
- [ ] 05-02-PLAN.md — Wire usageSummaries through prepareTokens and add ExtractionView hint

### Phase 6: Review UI for Usage Summaries
**Goal**: Users can read, edit, and curate usage guidance before accepting tokens
**Depends on**: Phase 5
**Requirements**: RV-01, RV-02
**Success Criteria** (what must be TRUE):
  1. Each review tab (Colors, Fonts, Radii, Spacing, Voice) displays an editable usage summary at the top
  2. When a user deselects a token, the usage summary updates to remove references to that token
  3. Users can freely edit the usage summary text before accepting
**Plans**: 2 plans

Plans:
- [ ] 06-01-PLAN.md — Display editable usage summaries in review tabs and wire through onApply
- [ ] 06-02-PLAN.md — TDD filterUsageSummary and integrate token-aware filtering into ReviewView

### Phase 7: Export with Usage Guide
**Goal**: Exported brand guidelines include a Usage Guide section that explains how to apply each token category
**Depends on**: Phase 6
**Requirements**: EX-01, EX-02
**Success Criteria** (what must be TRUE):
  1. Exported markdown contains a "Usage Guide" section with per-category subsections
  2. The Usage Guide only references tokens the user accepted (rejected tokens do not appear)
  3. If no usage summaries exist (manual-only workflow without extraction), export still works without a Usage Guide section
**Plans**: 1 plan

Plans:
- [ ] 07-01-PLAN.md — TDD generateBrandMarkdown Usage Guide section and integration tests

## Progress

**Execution Order:** 5 -> 6 -> 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. URL Fetching and Security | v1.0 | 3/3 | Complete | 2026-03-08 |
| 2. Token Extraction and AI Analysis | v1.0 | 2/2 | Complete | 2026-03-08 |
| 3. Review UI and Entry Points | v1.0 | 2/2 | Complete | 2026-03-08 |
| 4. Border Radius and Spacing | v1.0 | 2/2 | Complete | 2026-03-08 |
| 5. Usage Summary Generation | v1.1 | 1/2 | In progress | - |
| 6. Review UI for Usage Summaries | v1.1 | 0/2 | Not started | - |
| 7. Export with Usage Guide | v1.1 | 0/1 | Not started | - |
