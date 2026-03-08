# Roadmap: Brand Guidelines — Start from URL

## Overview

This roadmap delivers the "Start from URL" feature for the Brand Guidelines plugin. The work follows the data pipeline: first we build reliable URL fetching with security baked in, then the CSS parsing and AI analysis that turns raw data into semantic tokens, then the review UI that lets users approve and merge tokens, and finally the schema extensions for border radii and spacing (new data types not yet in the plugin).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: URL Fetching and Security** - Reliable URL input, HTML/CSS fetching via curl, SSRF prevention, and bot detection
- [ ] **Phase 2: Token Extraction and AI Analysis** - CSS parsing, Claude CLI integration, semantic color naming, font role classification, and voice/tone inference
- [x] **Phase 3: Review UI and Entry Points** - Extraction preview with selective token acceptance, settings merge, and discoverable entry points (completed 2026-03-08)
- [x] **Phase 4: Border Radius and Spacing** - Schema extension for radii and spacing tokens with extraction and AI analysis (completed 2026-03-08)

## Phase Details

### Phase 1: URL Fetching and Security
**Goal**: Users can enter any URL and the plugin reliably fetches its HTML and CSS content with clear feedback on errors
**Depends on**: Nothing (first phase)
**Requirements**: FETCH-01, FETCH-02, FETCH-03, FETCH-04, FETCH-05, SECR-01, SECR-02
**Success Criteria** (what must be TRUE):
  1. User can type a URL into an input field and see real-time validation feedback (scheme, format)
  2. Plugin fetches HTML and linked CSS from a valid URL and returns the raw content for downstream processing
  3. User sees a clear error message when a site is bot-protected or unreachable
  4. Attempting to fetch a private IP, localhost, or non-http URL is rejected before any shell command runs
  5. User sees loading/progress indication while fetching is in progress
**Plans:** 3 plans

Plans:
- [ ] 01-01-PLAN.md — TDD: URL validation, SSRF prevention, fetch utilities, and bot detection (pure functions)
- [ ] 01-02-PLAN.md — useUrlFetch hook, UrlInputView, and ExtractionView components
- [ ] 01-03-PLAN.md — BrandModal view state machine integration, Modal header actions, CSS styles

### Phase 2: Token Extraction and AI Analysis
**Goal**: Raw fetched content is parsed into semantic design tokens (named colors, classified fonts, voice notes) via CSS parsing and Claude CLI analysis
**Depends on**: Phase 1
**Requirements**: COLR-01, COLR-02, COLR-03, FONT-01, FONT-02, VOIC-01, VOIC-02, AINT-01, AINT-02, AINT-03
**Success Criteria** (what must be TRUE):
  1. Plugin extracts color values from CSS and deduplicates them to 5-12 meaningful colors with AI-assigned semantic names (Primary, Accent, etc.)
  2. Plugin extracts font-family declarations and AI classifies them into heading/body roles
  3. Plugin extracts visible page text and AI generates voice/tone notes describing the brand's communication style
  4. All AI analysis runs via `claude -p` through shell.exec() with no API key configuration required from the user
  5. CSS input to Claude is truncated to prevent buffer overflow, and all shell calls have explicit timeouts
**Plans:** 2 plans

Plans:
- [ ] 02-01-PLAN.md — TDD: Pure extraction functions for CSS colors, fonts, and visible text
- [ ] 02-02-PLAN.md — Claude CLI integration for AI analysis and pipeline wiring into useUrlFetch

### Phase 3: Review UI and Entry Points
**Goal**: Users can preview all extracted tokens, selectively accept or reject them, and merge accepted tokens into their existing brand settings
**Depends on**: Phase 2
**Requirements**: REVW-01, REVW-02, REVW-03, REVW-04, ENTR-01, ENTR-02
**Success Criteria** (what must be TRUE):
  1. User sees a preview of all extracted tokens (colors, fonts, voice) organized by category before anything is saved
  2. User can individually accept or reject each extracted token and only accepted tokens are applied
  3. Accepted tokens merge with existing brand settings (no data is overwritten or lost)
  4. User can re-extract from a different URL to refine results without losing previously accepted tokens
  5. "Start from URL" is visible as a prominent CTA when brand settings are empty and always accessible via a button in the modal toolbar
**Plans:** 2/2 plans complete

Plans:
- [ ] 03-01-PLAN.md — Pure merge logic with TDD tests, ReviewView component with tabbed layout, CSS styles
- [ ] 03-02-PLAN.md — BrandModal view state wiring, confirmation dialogs, entry point verification

### Phase 4: Border Radius and Spacing
**Goal**: The plugin extracts and surfaces border radius and spacing scale tokens as new first-class brand properties
**Depends on**: Phase 2
**Requirements**: RADI-01, RADI-02, SPAC-01, SPAC-02
**Success Criteria** (what must be TRUE):
  1. Plugin extracts border-radius values from CSS and AI identifies meaningful radius tokens (small, medium, large)
  2. Plugin extracts spacing values (padding, margin, gap) from CSS and AI identifies a spacing scale
  3. Extracted radii and spacing tokens appear in the review preview and are included in the markdown export
**Plans:** 2/2 plans complete

Plans:
- [ ] 04-01-PLAN.md — Data layer: types, CSS extraction, AI prompt extension, merge, markdown export, pipeline wiring
- [ ] 04-02-PLAN.md — UI layer: RadiiSection, SpacingSection components, BrandModal and ReviewView tab extension

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. URL Fetching and Security | 3/3 | Complete | 2026-03-08 |
| 2. Token Extraction and AI Analysis | 2/2 | Complete | 2026-03-08 |
| 3. Review UI and Entry Points | 2/2 | Complete   | 2026-03-08 |
| 4. Border Radius and Spacing | 2/2 | Complete   | 2026-03-08 |
