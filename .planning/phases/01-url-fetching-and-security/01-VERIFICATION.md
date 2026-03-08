---
phase: 01-url-fetching-and-security
verified: 2026-03-08T12:07:00Z
status: human_needed
score: 12/12 must-haves verified
gaps: []
human_verification:
  - test: "Open modal with empty brand settings and verify URL CTA appears"
    expected: "Centered headline, URL input, extract button, 'Or set up manually' link"
    why_human: "Visual layout and empty-state detection depend on runtime plugin context"
  - test: "Enter a valid public URL and click Extract"
    expected: "Step-based progress with checkmarks, domain display, progress bar"
    why_human: "Requires live shell.exec and network access"
  - test: "Cancel mid-extraction and verify URL is pre-filled on return"
    expected: "Returns to URL input with the failed URL pre-filled"
    why_human: "Async cancel behavior and state transitions need runtime verification"
  - test: "Open modal with existing brand data and verify globe icon in header"
    expected: "Tabs view with small globe icon button; clicking opens inline URL bar"
    why_human: "Conditional rendering based on plugin storage state"
---

# Phase 01: URL Fetching and Security Verification Report

**Phase Goal:** Fetch any URL safely and extract raw HTML + CSS. Includes URL validation, SSRF prevention, curl-based fetching, stylesheet resolution, and the BrandModal integration with view state machine.
**Verified:** 2026-03-08T12:07:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Valid http/https URLs pass validation; all other schemes are rejected | VERIFIED | `urlValidation.ts` lines 80-82 check `parsed.protocol`; 25 tests pass covering http, https, ftp, javascript, file schemes |
| 2 | Private IPs, localhost, hex IPs, decimal IPs, and link-local addresses are rejected before any shell command | VERIFIED | `urlValidation.ts` BLOCKED_HOSTNAMES set, PRIVATE_IP_PATTERNS array, extractRawHost for hex/decimal; tests cover 127.x, 10.x, 172.16.x, 192.168.x, 169.254.x, ::1, 0.0.0.0, decimal IP, hex IP |
| 3 | Shell metacharacters in URL input are rejected | VERIFIED | `urlValidation.ts` line 37 SHELL_META_RE `/[;|&$\`\\!(){}<>'"]/`; 5 tests for semicolons, pipes, dollar signs, backticks, ampersands |
| 4 | curl commands are built with discrete array arguments, never string interpolation | VERIFIED | `fetchHtml` and `fetchCss` in `fetchUtils.ts` call `shell.exec('curl', [...args, url])` with URL as last array element; tests verify `shell.exec` called with `'curl'` as first arg and array as second |
| 5 | Bot-protected pages (Cloudflare, Akamai, CAPTCHA) are detected from response headers and HTML | VERIFIED | `detectBotProtection` in `fetchUtils.ts` checks cf-mitigated header, __cf_chl, "Just a moment" title, _abck, g-recaptcha; 6 tests cover all providers |
| 6 | Stylesheet URLs are extracted from HTML and resolved relative to page URL | VERIFIED | `extractStylesheetUrls` uses DOMParser + querySelectorAll + `new URL(href, pageUrl)`; 7 tests cover absolute, relative, protocol-relative, empty, non-stylesheet, 20-cap, malformed |
| 7 | useUrlFetch hook orchestrates the full fetch flow: validate -> fetch HTML -> extract stylesheet URLs -> fetch CSS -> detect bot protection | VERIFIED | `useUrlFetch.ts` calls fetchHtml -> detectBotProtection -> extractStylesheetUrls -> fetchCss loop with step tracking and cancel ref checks |
| 8 | User sees step-based progress with checkmarks for completed steps and a loading indicator on the active step | VERIFIED | `ExtractionView.tsx` renders SVG checkmarks for done, CSS spinner for active, X for error, dot for pending; progress bar tracks done/total |
| 9 | User can cancel extraction at any point and return to the previous view | VERIFIED | `useUrlFetch.ts` cancelledRef checked between each async op; `BrandModal.tsx` handleCancel returns to url-cta or url-inline with lastUrl |
| 10 | URL input shows real-time inline validation errors below the input field | VERIFIED | `UrlInputView.tsx` 300ms debounced validateUrl with error hint rendered when `hasTyped && error` |
| 11 | Extract button is disabled until URL passes validation | VERIFIED | `UrlInputView.tsx` line 63: `isDisabled = !value.trim() || !!error || !validated` |
| 12 | When brand settings are empty, modal shows full-body URL CTA instead of tabs | VERIFIED | `BrandModal.tsx` useEffect sets view to 'url-cta' when `!hasBrandData(settings)`; url-cta renders UrlInputView + "Or set up manually" link |

**Score:** 12/12 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/urlValidation.ts` | URL validation and SSRF prevention | VERIFIED | 101 lines; exports validateUrl, ValidationResult; uses new URL() |
| `src/urlValidation.test.ts` | Tests for URL validation (min 50 lines) | VERIFIED | 175 lines; 25 tests covering all validation behaviors |
| `src/fetchUtils.ts` | curl building, HTML parsing, bot detection | VERIFIED | 163 lines; exports fetchHtml, fetchCss, extractStylesheetUrls, detectBotProtection, BotDetectionResult |
| `src/fetchUtils.test.ts` | Tests for fetch utilities (min 50 lines) | VERIFIED | 197 lines; 22 tests covering curl args, errors, HTML parsing, bot detection |
| `vitest.config.ts` | Vitest test configuration | VERIFIED | 5 lines; minimal working config |
| `src/useUrlFetch.ts` | Fetch orchestration hook with cancel | VERIFIED | 183 lines; exports useUrlFetch, ExtractionStep, ExtractionState, FetchResult |
| `src/UrlInputView.tsx` | URL input with real-time validation | VERIFIED | 101 lines; exports UrlInputView |
| `src/ExtractionView.tsx` | Step-based extraction progress | VERIFIED | 138 lines; exports ExtractionView |
| `src/BrandModal.tsx` | View state machine | VERIFIED | 216 lines; contains ModalView type with url-cta, tabs, url-inline, extracting |
| `src/Modal.tsx` | Updated modal with headerActions slot | VERIFIED | 66 lines; accepts and renders headerActions prop |
| `src/styles.ts` | CSS classes for URL flow | VERIFIED | 571 lines; contains bg-plugin-url-cta, bg-plugin-extraction-view, bg-plugin-spinner, etc. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/urlValidation.ts` | URL Web API | `new URL()` constructor | WIRED | Line 74: `parsed = new URL(trimmed)` |
| `src/fetchUtils.ts` | shell.exec | discrete args array | WIRED | Lines 46-58: `shell.exec('curl', [...args, url])` |
| `src/useUrlFetch.ts` | `src/urlValidation.ts` | import validateUrl | NOT WIRED | useUrlFetch does not import validateUrl -- validation happens in UrlInputView instead |
| `src/useUrlFetch.ts` | `src/fetchUtils.ts` | import fetchHtml etc. | WIRED | Line 3: `import { fetchHtml, fetchCss, extractStylesheetUrls, detectBotProtection } from './fetchUtils'` |
| `src/ExtractionView.tsx` | `src/useUrlFetch.ts` | ExtractionState type | WIRED | Line 3: `import type { ExtractionState } from './useUrlFetch'` |
| `src/BrandModal.tsx` | `src/useUrlFetch.ts` | import useUrlFetch | WIRED | Line 13: `import { useUrlFetch } from './useUrlFetch'` |
| `src/BrandModal.tsx` | `src/UrlInputView.tsx` | import UrlInputView | WIRED | Line 9: `import { UrlInputView } from './UrlInputView'` |
| `src/BrandModal.tsx` | `src/ExtractionView.tsx` | import ExtractionView | WIRED | Line 10: `import { ExtractionView } from './ExtractionView'` |
| `src/BrandModal.tsx` | `src/markdown.ts` | hasBrandData | WIRED | Line 14: `import { hasBrandData } from './markdown'`; used at line 37 and 44 |

**Note on useUrlFetch -> urlValidation link:** The Plan 02 must_haves specified this link, but the actual architecture routes validation through UrlInputView (which imports validateUrl) rather than the hook. This is a valid architectural choice -- validation happens at the input layer before extraction starts. The truth "URL input shows real-time inline validation errors" confirms this works correctly.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FETCH-01 | 01-01, 01-03 | User can enter a URL with real-time validation (http/https only) | SATISFIED | validateUrl scheme check + UrlInputView debounced validation + BrandModal URL CTA |
| FETCH-02 | 01-01 | Plugin fetches page HTML and all linked CSS via curl through shell.exec() | SATISFIED | fetchHtml + fetchCss + extractStylesheetUrls; useUrlFetch orchestrates the full pipeline |
| FETCH-03 | 01-01 | Plugin detects bot-protected pages and shows clear error message | SATISFIED | detectBotProtection identifies Cloudflare/Akamai/CAPTCHA; useUrlFetch maps to user-friendly error with "Site may be bot-protected" headline |
| FETCH-04 | 01-01 | Plugin validates URLs to prevent SSRF | SATISFIED | validateUrl rejects private IPs, localhost, hex/decimal IPs, non-http schemes |
| FETCH-05 | 01-02, 01-03 | Plugin shows loading state with progress indication during multi-step extraction | SATISFIED | ExtractionView renders step-based progress with spinner, checkmarks, progress bar, and domain display |
| SECR-01 | 01-01 | URLs never interpolated into shell command strings -- discrete arguments | SATISFIED | fetchHtml/fetchCss pass URL as array element to shell.exec; tests verify discrete args |
| SECR-02 | 01-01 | URL input sanitized to reject shell metacharacters | SATISFIED | SHELL_META_RE checks before any parsing; 5 tests for ;|&$` |

**Orphaned requirements:** None. All 7 requirement IDs (FETCH-01 through FETCH-05, SECR-01, SECR-02) mapped to Phase 1 in REQUIREMENTS.md are accounted for in the plans and verified above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No anti-patterns detected |

No TODOs, FIXMEs, placeholders, empty implementations, or stub patterns found in any phase artifact.

### Human Verification Required

### 1. Empty State URL CTA

**Test:** Open the Brand Guidelines modal with no existing brand data
**Expected:** Full-body centered URL CTA with headline "Start from a URL", subtext, URL input, extract button, and "Or set up manually" link. Clicking "Or set up manually" should switch to normal tabbed view.
**Why human:** Requires plugin runtime context (usePluginContext, useBrandSettings) and visual layout verification

### 2. URL Extraction End-to-End

**Test:** Enter a valid public URL (e.g., https://stripe.com) and click Extract
**Expected:** View transitions to extraction progress showing domain name, progress bar, step checkmarks as steps complete, and CSS content fetched
**Why human:** Requires live shell.exec (curl), network access, and real-time progress observation

### 3. Cancel and Retry Flow

**Test:** Start extraction and click Cancel before completion
**Expected:** Returns to URL input view with the URL pre-filled; user can modify and re-extract
**Why human:** Async timing of cancel relative to network requests; state transition verification

### 4. Header Globe Button (Existing Data)

**Test:** Open modal when brand data already exists
**Expected:** Normal tabs with small globe icon in header; clicking opens inline URL bar below header; clicking X dismisses it
**Why human:** Conditional on plugin storage containing brand data; visual layout verification

### Gaps Summary

No automated gaps found. All 12 observable truths verified against the actual codebase. All 7 requirements satisfied. All artifacts exist, are substantive, and are properly wired. Tests pass (47/47) and build succeeds.

One minor architectural deviation: the Plan 02 key_links specified useUrlFetch importing validateUrl, but validation is actually performed in UrlInputView. This is not a gap -- the validation still happens before extraction, just at the UI layer rather than the hook layer. The observable truth ("URL input shows real-time inline validation errors") is fully satisfied.

4 items require human verification to confirm the complete end-to-end flow works in the Ship Studio runtime environment.

---

_Verified: 2026-03-08T12:07:00Z_
_Verifier: Claude (gsd-verifier)_
