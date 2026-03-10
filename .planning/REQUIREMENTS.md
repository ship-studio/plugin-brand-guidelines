# Requirements: Brand Guidelines Plugin

**Defined:** 2026-03-08
**Core Value:** Extracting design tokens from any URL with accuracy that amazes users

## v1.1 Requirements

Requirements for Usage Guide milestone. Each maps to roadmap phases.

### AI Analysis

- [x] **AI-01**: AI generates a usage summary paragraph per token category (colors, fonts, radii, spacing, voice) during extraction
- [x] **AI-02**: Usage summaries reference specific tokens by name and value (e.g., "Primary #5C4EFA is used for CTAs and links")

### Review UI

- [x] **RV-01**: Each review tab displays an editable usage summary at the top showing the AI's guidance for that category
- [x] **RV-02**: Usage summaries update when user deselects tokens, removing references to rejected tokens

### Export

- [x] **EX-01**: Exported markdown includes a "Usage Guide" section with per-category usage guidance
- [x] **EX-02**: Usage guide only references tokens the user actually accepted (not rejected ones)

## Future Requirements

### Enhancements

- **ENH-01**: Cross-category relationship guidance (e.g., "Primary color pairs with Inter Bold for CTAs")
- **ENH-02**: Usage guide regeneration when tokens change significantly

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual preview of token usage | Complexity — text guidance is sufficient for v1.1 |
| Per-token inline usage notes | Chose per-tab summaries instead for cleaner UX |
| Auto-generated CSS/Tailwind config | Out of scope — plugin outputs markdown guidance |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AI-01 | Phase 5 | Complete |
| AI-02 | Phase 5 | Complete |
| RV-01 | Phase 6 | Complete |
| RV-02 | Phase 6 | Complete |
| EX-01 | Phase 7 | Complete |
| EX-02 | Phase 7 | Complete |

**Coverage:**
- v1.1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0

---
*Requirements defined: 2026-03-08*
*Last updated: 2026-03-10 after plan 05-01 completion*
