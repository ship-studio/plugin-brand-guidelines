# Project Research Summary

**Project:** Brand Guidelines Plugin — URL Extraction Feature
**Domain:** Design token extraction from website URLs
**Researched:** 2026-03-08
**Confidence:** MEDIUM-HIGH

## Executive Summary

This project adds a "Start from URL" feature to an existing Ship Studio Brand Guidelines plugin. The feature extracts design tokens (colors, fonts, voice/tone) from any website URL and populates the plugin's brand settings. The established approach in this space is a three-stage pipeline: fetch page content, parse raw CSS tokens mechanically, then use AI to assign semantic meaning (naming colors "Primary Blue" instead of "#2563EB", classifying fonts by role, inferring brand voice). The AI step is what separates this from commodity CSS scraper tools and produces the "wow factor."

The recommended architecture uses `curl` for fetching (zero dependencies, universally available), regex-based parsing for raw token extraction, and `claude -p` (Claude Code CLI in headless mode) for AI analysis. There is a meaningful tension in the research: STACK.md recommends Dembrandt (a purpose-built extraction CLI using Playwright), while ARCHITECTURE.md recommends raw `curl` + regex to honor the plugin's zero-dependency constraint. The architecture recommendation is correct for v1 -- `curl` covers the majority of brand/marketing sites where tokens live in static CSS, and avoids requiring users to install a 100MB+ browser binary. Dembrandt remains a strong option for a future "enhanced extraction" mode if curl-based extraction proves insufficient for JS-heavy sites.

The primary risks are: (1) shell command injection via user-supplied URLs -- must be addressed from day one with strict validation, (2) Claude CLI buffer overflow on large CSS corpora -- requires truncation to ~100KB and explicit timeouts, and (3) non-deterministic AI output -- mitigated by always requiring user review before applying extracted tokens. The existing plugin's review-before-save pattern aligns perfectly with this constraint.

## Key Findings

### Recommended Stack

The extraction pipeline requires zero new bundled dependencies. Everything runs through the plugin's existing `shell.exec()` interface using tools already present on the user's machine.

**Core technologies:**
- **curl** (system-provided): Fetch HTML and CSS from target URLs -- universally available, follows redirects, handles HTTPS
- **Node.js regex parsing** (host-provided): Extract raw color, font, and spacing values from CSS text -- pure functions, no dependencies
- **Claude Code CLI** (`claude -p`): AI-powered semantic analysis of raw tokens -- already authenticated in the user's environment, zero configuration needed
- **Dembrandt** (deferred): Purpose-built design token extraction tool -- strong fallback option if curl-based extraction proves insufficient, but adds Playwright dependency

### Expected Features

**Must have (table stakes):**
- URL input with validation and clear error states
- Color extraction with AI-powered semantic naming (Primary, Accent, Background)
- Font extraction with heading/body role classification
- Voice/tone inference from page copy
- Review UI with selective token acceptance before applying
- Loading states with multi-step progress indication
- Graceful error handling (bot protection, timeouts, unreachable sites)

**Should have (differentiators):**
- AI-powered semantic analysis (the core differentiator over pure CSS scrapers)
- Confidence scoring per extracted token
- Re-extraction from different URLs to refine brand profile
- Selective token acceptance (cherry-pick which tokens to keep)

**Defer (v2+):**
- Border radius extraction (low complexity, easy to add but no UI tab exists yet)
- Spacing scale extraction (needs new data model and UI tab)
- Dark mode detection (edge case, light mode covers 90%+ of use cases)
- Multi-page crawling (massive complexity increase for marginal value)

### Architecture Approach

The system is a four-stage linear pipeline contained in a new `src/extraction/` directory. Each stage is a pure function with clear inputs/outputs, matching the existing plugin's pattern of isolating shell I/O from logic. The pipeline integrates with existing code at a single point: `updateSettings()`, meaning auto-save, sync status, and export all work automatically with zero changes.

**Major components:**
1. **fetchPage.ts** -- Retrieves HTML + linked CSS via curl, detects bot protection
2. **parseCSS.ts** -- Regex-based extraction of raw colors, fonts, spacing from CSS text; extracts page copy for voice analysis
3. **analyzeTokens.ts** -- Sends deduplicated raw tokens to Claude CLI for semantic naming and role assignment
4. **mapToSettings.ts** -- Pure mapping from AI-analyzed tokens to the existing BrandSettings schema
5. **useUrlExtraction.ts** -- React hook orchestrating all four stages with progressive loading state
6. **ExtractionPreview.tsx** -- Review UI showing extracted tokens for approval before applying

### Critical Pitfalls

1. **Shell command injection via URLs** -- Never interpolate URLs into shell command strings. Always pass as discrete array arguments to `shell.exec()`. Validate URL scheme (http/https only), reject private IPs (SSRF), reject shell metacharacters.
2. **Claude CLI buffer overflow on large sites** -- Truncate CSS input to 100KB before sending to AI. Set explicit 60s+ timeouts. Structure prompts for concise JSON output. Handle empty stdout gracefully.
3. **Bot-protected sites returning garbage HTML** -- Check fetched HTML for Cloudflare/Akamai challenge signatures before proceeding with analysis. Set browser-like User-Agent on curl requests. Surface clear error messages.
4. **Color deduplication failure** -- Normalize all colors to hex6 format, filter browser defaults, cap output at 8-12 colors. Let AI handle semantic naming using CSS variable names and element context as signals.
5. **Non-deterministic AI output** -- Always require user review before saving. Frame as "AI suggestions" not "extracted facts." Consider caching results per URL within a session.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Fetch Pipeline and URL Input

**Rationale:** This is the foundation. Every subsequent phase depends on being able to reliably fetch and parse page content. Security (injection prevention) must be correct from the start.
**Delivers:** Working URL input component, validated URL fetching via curl, HTML/CSS text extraction, bot protection detection, error handling
**Addresses:** URL input with validation, error handling for failed extractions, loading states
**Avoids:** Command injection (Pitfall 2), bot protection failures (Pitfall 6), raw HTML limitations (Pitfall 1)

### Phase 2: CSS Parsing and AI Analysis Pipeline

**Rationale:** With fetching working, the next step is turning raw CSS into meaningful tokens. This phase contains the highest-complexity work (AI prompt engineering) and the core differentiator.
**Delivers:** Regex-based token parser, Claude CLI integration with prompt engineering, semantic color naming, font role classification, voice/tone inference, output size caps and timeout handling
**Addresses:** Color extraction with semantic naming, font extraction with roles, voice/tone extraction, color deduplication
**Avoids:** Buffer overflow (Pitfall 3), deduplication failure (Pitfall 4)

### Phase 3: Review UI and Settings Integration

**Rationale:** The pipeline produces tokens; now users need to see, approve, and selectively accept them. This phase is where non-determinism becomes a UX concern rather than a technical one.
**Delivers:** Extraction preview component with per-token accept/reject, merge strategy for existing settings, progressive loading states across all pipeline stages, "Apply" flow into existing BrandSettings
**Addresses:** Review before applying, selective token acceptance, re-extraction capability
**Avoids:** Non-deterministic output confusion (Pitfall 5), existing data overwrite

### Phase 4: Schema Extension and Export Updates

**Rationale:** Border radii and spacing are valuable but require schema changes (new `BrandRadius` and `BrandSpacing` types) and markdown export updates. These are additive and low-risk but touch existing code.
**Delivers:** Extended BrandSettings schema, radii/spacing in markdown export, updated DEFAULT_SETTINGS
**Addresses:** Border radius extraction, spacing scale extraction (differentiators deferred from MVP)

### Phase Ordering Rationale

- Phases follow the data flow: fetch -> parse -> present -> extend. Each phase builds on the previous one's output.
- Security-critical work (URL validation, injection prevention) is front-loaded in Phase 1 because it cannot be retrofitted safely.
- The AI pipeline (Phase 2) is isolated from UI work (Phase 3) so prompt engineering can be iterated independently.
- Schema extension (Phase 4) is last because the existing schema handles colors, fonts, and voice -- the three highest-value token types. Radii and spacing are incremental.
- The existing plugin continues to function unchanged throughout all phases since all work is additive.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (AI Analysis):** The Claude CLI prompt engineering is the highest-uncertainty area. The exact prompt that produces reliable, well-structured JSON output needs iteration. Also, the `claude -p` behavior with large stdin needs empirical testing -- documented issues (#7263, #15001) suggest edge cases exist.
- **Phase 1 (Fetching):** The curl-based approach needs validation against a diverse set of real websites to understand how many sites return usable CSS vs. requiring a headless browser.

Phases with standard patterns (skip research-phase):
- **Phase 3 (Review UI):** Standard React component work. The patterns are established in the existing codebase (modal tabs, settings merge, state management).
- **Phase 4 (Schema Extension):** Straightforward type additions and template updates. The backward-compatible merge pattern is already documented in ARCHITECTURE.md.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | curl + claude -p approach is well-grounded but Dembrandt vs. curl tension needs resolution. curl is the right v1 choice given zero-dependency constraint. |
| Features | HIGH | Feature priorities are clear, well-sourced from competitor analysis, and aligned with the existing plugin structure. |
| Architecture | HIGH | Four-stage pipeline is clean, matches existing codebase patterns, and has a clear build order with strict dependency chain. |
| Pitfalls | HIGH | Well-documented from multiple sources including real Claude CLI GitHub issues. Security pitfalls have established OWASP prevention patterns. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Dembrandt JSON output schema:** STACK.md recommends Dembrandt but the exact output format needs empirical validation. If curl-based extraction is adopted for v1 (recommended), this gap is deferred.
- **Claude CLI prompt engineering:** The specific prompt that produces reliable BrandSettings-shaped JSON has not been prototyped. This is the single highest-risk unknown and should be validated early in Phase 2.
- **curl coverage rate:** What percentage of real brand/marketing sites yield usable CSS via static fetch? Research suggests "most" but no quantitative data exists. Test against 10-20 real URLs early.
- **shell.exec() buffer limits:** The host app's shell.exec() may have undocumented buffer limits for stdout. Needs empirical testing with large outputs.

## Sources

### Primary (HIGH confidence)
- [Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference) -- `-p` flag, headless mode
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection) -- shell injection prevention
- [Claude Code Issue #7263](https://github.com/anthropics/claude-code/issues/7263) -- empty output with large stdin
- [Claude Code Issue #15001](https://github.com/anthropics/claude-code/issues/15001) -- stdout buffer limits

### Secondary (MEDIUM confidence)
- [Dembrandt GitHub](https://github.com/dembrandt/dembrandt) -- extraction tool capabilities and output format
- [Dembrandt Blackpaper](https://www.dembrandt.com/blackpaper) -- technical architecture reference
- [Project Wallace CSS Design Tokens](https://www.projectwallace.com/design-tokens) -- CSS analysis approaches
- [Snyk SSRF Prevention](https://snyk.io/blog/preventing-server-side-request-forgery-node-js/) -- URL validation patterns

### Tertiary (LOW confidence)
- [Dembrandt npm](https://www.npmjs.com/package/dembrandt) -- v0.6.1 details, pre-1.0 stability unknown
- [Style-scraper](https://github.com/mrseanryan/style-scraper) -- computed style extraction alternative approach

---
*Research completed: 2026-03-08*
*Ready for roadmap: yes*
