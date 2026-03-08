---
phase: 01-url-fetching-and-security
plan: 01
subsystem: security
tags: [url-validation, ssrf, curl, bot-detection, vitest, tdd]

requires: []
provides:
  - "validateUrl() - URL validation with SSRF prevention"
  - "fetchHtml() / fetchCss() - curl command building with discrete args"
  - "extractStylesheetUrls() - HTML stylesheet extraction with relative URL resolution"
  - "detectBotProtection() - Cloudflare, Akamai, CAPTCHA detection"
  - "vitest test infrastructure configured"
affects: [01-02, 01-03]

tech-stack:
  added: [vitest, jsdom]
  patterns: [tdd, pure-function-modules, discrete-shell-args]

key-files:
  created:
    - src/urlValidation.ts
    - src/urlValidation.test.ts
    - src/fetchUtils.ts
    - src/fetchUtils.test.ts
    - vitest.config.ts
  modified:
    - package.json

key-decisions:
  - "Check numeric/hex IP on raw input before URL constructor normalizes them"
  - "Exclude square brackets from shell metachar regex to allow IPv6 URL notation"

patterns-established:
  - "TDD with vitest: write failing tests first, then implement"
  - "Pure function modules: no side effects, easy to test"
  - "Shell metachar check before URL parsing for defense in depth"

requirements-completed: [FETCH-01, FETCH-02, FETCH-03, FETCH-04, SECR-01, SECR-02]

duration: 4min
completed: 2026-03-08
---

# Phase 1 Plan 01: URL Validation and Fetch Utilities Summary

**URL validation with SSRF prevention (private IPs, hex/decimal bypass, shell metacharacters) plus curl command building, stylesheet extraction, and bot detection -- 47 passing tests via TDD**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-08T10:45:26Z
- **Completed:** 2026-03-08T10:49:03Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- URL validation rejects all private IP forms (RFC 1918, loopback, link-local, hex, decimal), non-http schemes, and shell metacharacters
- curl commands built with discrete array arguments (SECR-01) with timeout, redirect limits, and file size caps
- Stylesheet URL extraction via DOMParser with relative URL resolution, capped at 20
- Bot detection identifies Cloudflare (header + HTML markers + title), Akamai (_abck), and CAPTCHA (g-recaptcha)
- vitest test infrastructure set up with jsdom environment for DOM tests

## Task Commits

Each task was committed atomically:

1. **Task 1: URL Validation with SSRF Prevention** - `eaf4e7d` (feat)
2. **Task 2: Fetch Utilities** - `485c6fd` (feat)

## Files Created/Modified
- `src/urlValidation.ts` - validateUrl() with scheme, SSRF, and shell metachar checks (101 lines)
- `src/urlValidation.test.ts` - 25 tests covering all validation behaviors (175 lines)
- `src/fetchUtils.ts` - fetchHtml, fetchCss, extractStylesheetUrls, detectBotProtection (163 lines)
- `src/fetchUtils.test.ts` - 22 tests covering curl args, error handling, HTML parsing, bot detection (197 lines)
- `vitest.config.ts` - Vitest configuration
- `package.json` - Added vitest and jsdom dev dependencies

## Decisions Made
- Check numeric/hex IP patterns on the raw input string before URL constructor parsing, because the URL constructor normalizes decimal IPs (e.g., 2130706433) and hex IPs (e.g., 0x7f000001) to dotted-quad notation, which would make specific error messages impossible
- Exclude square brackets from the shell metacharacter regex because they are valid IPv6 address notation in URLs (e.g., `https://[::1]`); IPv6 loopback is handled by the SSRF blocked hostnames check instead

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed numeric/hex IP detection order**
- **Found during:** Task 1 (URL Validation)
- **Issue:** URL constructor normalizes `http://2130706433` to `http://127.0.0.1`, so the numeric/hex checks after parsing never triggered
- **Fix:** Added `extractRawHost()` helper to check numeric/hex patterns on raw input before URL constructor parsing
- **Files modified:** src/urlValidation.ts
- **Verification:** All 25 tests pass with correct error messages
- **Committed in:** eaf4e7d

**2. [Rule 1 - Bug] Fixed shell metachar false positive on IPv6 URLs**
- **Found during:** Task 1 (URL Validation)
- **Issue:** `[::1]` contains square brackets which matched SHELL_META_RE, returning "URL contains invalid characters" instead of "Local addresses are not allowed"
- **Fix:** Removed square brackets from SHELL_META_RE since they are valid IPv6 notation; IPv6 addresses are caught by SSRF checks
- **Files modified:** src/urlValidation.ts
- **Verification:** `https://[::1]` correctly returns "Local addresses are not allowed"
- **Committed in:** eaf4e7d

**3. [Rule 1 - Bug] Fixed malformed URL test case**
- **Found during:** Task 2 (Fetch Utilities)
- **Issue:** Test used `://invalid` as a malformed URL, but URL constructor resolves it as a relative path
- **Fix:** Changed test to use `http://%` which actually throws in URL constructor
- **Files modified:** src/fetchUtils.test.ts
- **Verification:** Test correctly verifies malformed URLs are skipped
- **Committed in:** 485c6fd

---

**Total deviations:** 3 auto-fixed (3 bugs)
**Impact on plan:** All auto-fixes necessary for correctness. No scope creep.

## Issues Encountered
None beyond the auto-fixed items above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- urlValidation.ts and fetchUtils.ts are ready for the useUrlFetch hook (Plan 02) to orchestrate
- vitest is configured and all 47 tests pass
- No blockers for Plan 02

---
*Phase: 01-url-fetching-and-security*
*Completed: 2026-03-08*
