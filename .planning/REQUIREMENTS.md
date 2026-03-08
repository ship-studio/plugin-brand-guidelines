# Requirements: Brand Guidelines — Start from URL

**Defined:** 2026-03-08
**Core Value:** Extracting design tokens from any URL with accuracy that amazes users

## v1 Requirements

### URL Input & Fetching

- [ ] **FETCH-01**: User can enter a URL into an input field with real-time validation (http/https only)
- [ ] **FETCH-02**: Plugin fetches page HTML and all linked CSS via curl through shell.exec()
- [ ] **FETCH-03**: Plugin detects bot-protected pages (Cloudflare/Akamai challenges) and shows a clear error message
- [ ] **FETCH-04**: Plugin validates URLs to prevent SSRF (rejects private IPs, localhost, non-http schemes)
- [ ] **FETCH-05**: Plugin shows loading state with progress indication during multi-step extraction

### Color Extraction

- [ ] **COLR-01**: Plugin extracts raw color values from fetched CSS (hex, rgb, hsl, named colors)
- [ ] **COLR-02**: Plugin deduplicates and normalizes colors to 5-12 meaningful values
- [ ] **COLR-03**: AI assigns semantic names to extracted colors (Primary, Accent, Background, etc.)

### Font Extraction

- [ ] **FONT-01**: Plugin extracts font-family declarations from fetched CSS
- [ ] **FONT-02**: AI classifies extracted fonts into heading/body roles

### Voice & Tone

- [ ] **VOIC-01**: Plugin extracts visible text content from page HTML
- [ ] **VOIC-02**: AI analyzes page copy and generates voice/tone notes

### Border Radius Extraction

- [ ] **RADI-01**: Plugin extracts border-radius values from fetched CSS
- [ ] **RADI-02**: AI identifies meaningful radius tokens (small, medium, large) from raw values

### Spacing Extraction

- [ ] **SPAC-01**: Plugin extracts spacing values (padding, margin, gap) from fetched CSS
- [ ] **SPAC-02**: AI identifies a spacing scale from raw values

### Review UI

- [ ] **REVW-01**: Plugin shows a preview of all extracted tokens (colors, fonts, voice, radii, spacing) before saving
- [ ] **REVW-02**: User can selectively accept or reject individual extracted tokens
- [ ] **REVW-03**: Plugin merges accepted tokens with existing brand settings (not replace)
- [ ] **REVW-04**: User can re-extract from a different URL to refine results

### Entry Points

- [ ] **ENTR-01**: "Start from URL" appears as a prominent CTA when brand settings are empty (empty state)
- [ ] **ENTR-02**: "Start from URL" is always accessible via a button in the modal header/toolbar

### AI Integration

- [ ] **AINT-01**: All AI analysis runs via Claude Code CLI (`claude -p`) through shell.exec() — no API keys required
- [ ] **AINT-02**: CSS input to Claude is truncated to ~100KB to prevent buffer overflow
- [ ] **AINT-03**: All shell.exec() calls have explicit timeouts (60s+ for AI analysis)

### Security

- [ ] **SECR-01**: URLs are never interpolated into shell command strings — always passed as discrete arguments
- [ ] **SECR-02**: URL input is sanitized to reject shell metacharacters

## v2 Requirements

### Enhanced Extraction

- **EEXT-01**: Dark mode detection and separate token set extraction
- **EEXT-02**: Confidence scoring displayed per extracted token
- **EEXT-03**: Headless browser extraction via Dembrandt for JS-heavy sites

### Advanced UI

- **AUIX-01**: Side-by-side comparison of extracted tokens vs existing settings
- **AUIX-02**: History of previously extracted URLs with cached results

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-page crawling | Massive complexity increase for marginal value — single URL is sufficient |
| Direct Figma/design tool integration | Different feature entirely — URLs only for v1 |
| Custom API key configuration | Leverages Claude Code environment — no user-facing API config |
| Mobile viewport extraction | Focus on desktop viewport first — most brand pages are desktop-optimized |
| Real-time preview of source page | Just extract tokens — not building a browser |
| Auto-save extracted tokens | Non-deterministic AI output requires user review — never auto-save |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FETCH-01 | — | Pending |
| FETCH-02 | — | Pending |
| FETCH-03 | — | Pending |
| FETCH-04 | — | Pending |
| FETCH-05 | — | Pending |
| COLR-01 | — | Pending |
| COLR-02 | — | Pending |
| COLR-03 | — | Pending |
| FONT-01 | — | Pending |
| FONT-02 | — | Pending |
| VOIC-01 | — | Pending |
| VOIC-02 | — | Pending |
| RADI-01 | — | Pending |
| RADI-02 | — | Pending |
| SPAC-01 | — | Pending |
| SPAC-02 | — | Pending |
| REVW-01 | — | Pending |
| REVW-02 | — | Pending |
| REVW-03 | — | Pending |
| REVW-04 | — | Pending |
| ENTR-01 | — | Pending |
| ENTR-02 | — | Pending |
| AINT-01 | — | Pending |
| AINT-02 | — | Pending |
| AINT-03 | — | Pending |
| SECR-01 | — | Pending |
| SECR-02 | — | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 0
- Unmapped: 27 ⚠️

---
*Requirements defined: 2026-03-08*
*Last updated: 2026-03-08 after initial definition*
