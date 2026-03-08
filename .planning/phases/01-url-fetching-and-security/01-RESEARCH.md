# Phase 1: URL Fetching and Security - Research

**Researched:** 2026-03-08
**Domain:** URL fetching via curl, SSRF prevention, bot detection, real-time URL validation
**Confidence:** HIGH

## Summary

Phase 1 implements a URL input flow within the existing BrandModal that fetches HTML and linked CSS from any public URL using `curl` via `shell.exec()`. The primary technical challenges are: (1) SSRF prevention through hostname-level validation before any shell command runs, (2) reliably extracting linked CSS stylesheet URLs from fetched HTML, (3) detecting bot-protected pages (Cloudflare, Akamai) from curl responses, and (4) orchestrating a multi-step loading UX with cancel support.

The plugin already establishes the pattern of executing shell commands via `shell.exec(command, argsArray)` with discrete arguments (never string interpolation). This pattern directly satisfies SECR-01. URL validation and SSRF prevention must happen entirely in TypeScript before any shell command is invoked. The curl approach is zero-dependency (already available on macOS/Linux) and sufficient for most brand/marketing pages, which tend to be static HTML.

**Primary recommendation:** Build a `useUrlFetch` hook that validates URLs client-side (URL constructor + private IP regex), runs `curl -L -A <browser-ua> -s --max-time 30` for HTML, parses `<link rel="stylesheet">` tags to extract CSS URLs, fetches each stylesheet individually, and detects bot challenges via response headers (`cf-mitigated`) and HTML content markers.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Empty state (no brand data): full modal-body takeover -- centered CTA with headline, URL input, and extract button. Tabs are hidden
- "Or set up manually" link dismisses the CTA and reveals the normal tabbed interface (same modal, view switch)
- With existing data: small icon button in the modal header (next to title, before close button)
- Clicking the header button expands an inline URL input bar below the header, above the tabs. Includes a dismiss button
- The inline input doesn't navigate away -- user stays in the current tabbed view
- Step-based status text (not spinner, not progress bar)
- Two steps for Phase 1: "Fetching page" and "Loading stylesheets (2/5)..." with count
- Steps check off as completed; active step shows a loading indicator
- Loading view replaces the entire modal body -- tabs hidden/disabled during extraction
- Shows the domain being extracted from: "Extracting from example.com"
- Cancel button visible during extraction -- cancelling aborts and returns to previous view
- After successful extraction, jump straight to review flow (Phase 3's concern) -- no intermediate "done" screen
- Errors appear inline at the failed step -- step turns red, previous steps stay checked
- Friendly headline + expandable "Show details" for technical info
- "Try Again" button returns to URL input with the failed URL pre-filled (not auto-retry)
- URL validation errors show as real-time inline hints below the input
- Extract button stays disabled until URL passes validation
- No fetch is attempted for invalid URLs -- validation blocks submission

### Claude's Discretion
- Exact animation/transition between views (CTA to tabs, tabs to loading)
- Specific wording for error messages and step labels
- Whether the loading step indicator is a spinner, pulsing dot, or other treatment
- Debounce timing for real-time URL validation

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FETCH-01 | User can enter a URL into an input field with real-time validation (http/https only) | URL constructor for parsing, regex for scheme check, debounced validation pattern from existing `useBrandSettings.ts` |
| FETCH-02 | Plugin fetches page HTML and all linked CSS via curl through shell.exec() | curl with `-L -A -s --max-time` flags, HTML parsing for `<link rel="stylesheet">`, sequential CSS fetches |
| FETCH-03 | Plugin detects bot-protected pages and shows clear error message | `cf-mitigated` header detection, HTML content markers (`__cf_chl`, challenge page titles), HTTP 403 status |
| FETCH-04 | Plugin validates URLs to prevent SSRF (rejects private IPs, localhost, non-http schemes) | Client-side hostname validation against RFC 1918 ranges, localhost, link-local, IPv6 loopback before shell.exec |
| FETCH-05 | Plugin shows loading state with progress indication during multi-step extraction | React state machine for step tracking, AbortController-like cancel pattern, step-based UI per locked decisions |
| SECR-01 | URLs never interpolated into shell command strings -- always passed as discrete arguments | Already established by `shell.exec(command, argsArray)` pattern in existing codebase |
| SECR-02 | URL input sanitized to reject shell metacharacters | Validate via URL constructor (rejects malformed), plus explicit check for shell metacharacters in the raw input string |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| curl | system | Fetch HTML and CSS from URLs | Zero dependency -- pre-installed on macOS/Linux, the project's chosen approach |
| URL (Web API) | built-in | Parse and validate URLs | Native browser API, handles encoding, scheme extraction, hostname parsing |
| React useState/useCallback | ^19.0.0 | State management for fetch flow | Already externalized from host app, established pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| DOMParser (Web API) | built-in | Parse HTML to extract stylesheet links | After fetching HTML, to find `<link rel="stylesheet">` tags |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| curl | wget | curl is more universally available on macOS, wget often not pre-installed |
| curl | node fetch/http | Would require more complex shell commands; curl is simpler for this use case |
| DOMParser | regex for link tags | DOMParser is more robust, handles edge cases (attributes in any order, self-closing tags) |

**No additional npm packages needed.** All functionality is achievable with system curl + browser built-in APIs + existing shell.exec pattern.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── useUrlFetch.ts       # Hook: URL validation, fetch orchestration, cancel support
├── urlValidation.ts     # Pure functions: URL validation, SSRF checks, sanitization
├── fetchUtils.ts        # Pure functions: curl command building, HTML parsing, bot detection
├── ExtractionView.tsx   # Loading/progress UI with step indicators
├── UrlInputView.tsx     # URL input with real-time validation (used in empty state + header bar)
├── BrandModal.tsx       # Updated: view state machine (tabs | url-input | extracting | error)
└── styles.ts            # Updated: new CSS classes for extraction UI
```

### Pattern 1: View State Machine in BrandModal
**What:** BrandModal manages a top-level view state that determines which content renders in the modal body.
**When to use:** When the modal has multiple mutually exclusive views (tabs, URL input CTA, extraction loading, error).
**Example:**
```typescript
type ModalView = 'tabs' | 'url-cta' | 'url-inline' | 'extracting' | 'error';

// In BrandModal:
const [view, setView] = useState<ModalView>(
  hasBrandData(settings) ? 'tabs' : 'url-cta'
);
```

### Pattern 2: Step-Based Extraction State
**What:** Track extraction progress as a series of named steps with individual status.
**When to use:** For the multi-step extraction flow (fetch HTML, then fetch N stylesheets).
**Example:**
```typescript
interface ExtractionStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
  detail?: string;  // e.g., "Loading stylesheets (2/5)..."
}

interface ExtractionState {
  steps: ExtractionStep[];
  domain: string;        // extracted from URL for display
  error?: { headline: string; detail: string };
  cancelled: boolean;
}
```

### Pattern 3: Cancellable Fetch via Flag
**What:** Since shell.exec does not support AbortController, use a mutable ref flag to skip processing after cancel.
**When to use:** When user clicks cancel during extraction.
**Example:**
```typescript
const cancelledRef = useRef(false);

const cancel = useCallback(() => {
  cancelledRef.current = true;
  // Return to previous view
}, []);

// In fetch loop:
if (cancelledRef.current) return;
```

### Pattern 4: curl via shell.exec with Discrete Arguments
**What:** Build curl commands using the established `shell.exec(command, argsArray)` pattern.
**When to use:** Every curl invocation (SECR-01 compliance).
**Example:**
```typescript
// Fetch HTML
const result = await shell.exec('curl', [
  '-s',                    // silent (no progress bar)
  '-L',                    // follow redirects
  '--max-time', '30',      // timeout
  '--max-redirs', '5',     // limit redirect chains
  '-A', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  '-D', '-',               // dump headers to stdout (before body)
  url
]);
```

### Anti-Patterns to Avoid
- **String interpolation in shell commands:** Never do `shell.exec('curl', ['-s', \`${url}\`])` -- pass the URL as its own array element (already the pattern, but worth reinforcing)
- **DNS rebinding ignorance:** Validating the hostname before fetch but not considering that DNS could resolve differently at curl time. Acceptable risk for v1 since this runs locally, not on a server
- **Regex-only URL parsing:** Don't use regex to extract scheme/hostname -- use the URL constructor
- **Unbounded CSS fetches:** Always cap the number of stylesheets fetched (e.g., max 20) to prevent resource exhaustion on pages with many CSS files

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL parsing | Custom regex parser | `new URL(input)` | Handles edge cases (ports, auth, encoding, IDN) |
| HTML parsing for links | Regex like `/<link.*href="([^"]+)".*>/` | `DOMParser` + `querySelectorAll('link[rel="stylesheet"]')` | Handles attribute order, whitespace, quotes, self-closing |
| Private IP detection | Simple string matching (`url.includes('localhost')`) | Parsed hostname checked against comprehensive RFC 1918 ranges | String matching is trivially bypassed (e.g., `localhos\x74`, `0x7f000001`) |
| URL resolution | Manual path joining | `new URL(cssHref, pageUrl)` | Handles relative paths, protocol-relative URLs, query strings |

**Key insight:** The URL and DOMParser Web APIs handle 90% of the tricky parsing work. Hand-rolling parsers for URLs or HTML is the fastest path to security bypasses and edge-case bugs.

## Common Pitfalls

### Pitfall 1: Incomplete SSRF Hostname Validation
**What goes wrong:** Checking only for `localhost` and `127.0.0.1` misses many private address forms.
**Why it happens:** Developers forget about `0.0.0.0`, `[::]`, `[::1]`, `0x7f000001` (hex), `2130706433` (decimal), `0177.0.0.1` (octal), `169.254.x.x` (link-local), and IPv6 mapped addresses.
**How to avoid:** Parse hostname with `new URL()`, then check against a comprehensive list: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `0.0.0.0`, `::1`, `::`, `fc00::/7`, and the literal strings `localhost`, `[::1]`. Also reject numeric-only hostnames (could be decimal IP) and hex-prefixed hostnames.
**Warning signs:** URL `http://0x7f000001/` or `http://[::1]/` bypasses validation.

### Pitfall 2: Forgetting to Resolve Relative CSS URLs
**What goes wrong:** A page at `https://example.com/about/` has `<link href="../css/main.css">`. If you don't resolve relative to the page URL, you fetch the wrong path or fail entirely.
**Why it happens:** Many stylesheets use relative paths; protocol-relative URLs (`//cdn.example.com/style.css`) are also common.
**How to avoid:** Always use `new URL(href, pageUrl)` to resolve stylesheet URLs before fetching.
**Warning signs:** CSS fetch returns 404 or HTML (wrong URL resolved).

### Pitfall 3: Bot Detection False Positives/Negatives
**What goes wrong:** Treating any 403 as "bot protected" (false positive) or missing soft blocks where Cloudflare returns 200 with a challenge page (false negative).
**Why it happens:** Bot protection varies widely. Some sites return 403 for other reasons; some return 200 with JS challenge.
**How to avoid:** Check multiple signals: (1) `cf-mitigated: challenge` header, (2) HTML contains `__cf_chl` or challenge-related meta/script tags, (3) page title contains "Just a moment" or "Attention Required", (4) HTTP 403 with Cloudflare `server` header. Report as "may be bot-protected" rather than definitively.
**Warning signs:** Error message says "bot protected" for a site that is simply down.

### Pitfall 4: curl Timeout Not Set
**What goes wrong:** curl hangs indefinitely on unresponsive hosts, blocking the UI forever.
**Why it happens:** curl has no default timeout for the overall operation.
**How to avoid:** Always use `--max-time 30` (or similar) and also pass `{ timeout: 35000 }` to `shell.exec()` as a safety net.
**Warning signs:** Extraction "Loading..." state never resolves.

### Pitfall 5: shell.exec Timeout vs curl Timeout
**What goes wrong:** The shell.exec timeout kills the process, but the hook doesn't know why it died -- it looks like a generic error.
**Why it happens:** shell.exec timeout produces a different error shape than curl timeout (which exits with code 28).
**How to avoid:** Set curl `--max-time` slightly lower than shell.exec timeout. Check for curl exit code 28 specifically to show a "site took too long to respond" message.
**Warning signs:** Generic "extraction failed" error when the real cause is a timeout.

### Pitfall 6: Large HTML Responses
**What goes wrong:** Some pages return megabytes of HTML (SPAs with inline data, long pages). Storing it all in a JavaScript string via stdout can be slow or crash.
**Why it happens:** curl captures entire response body.
**How to avoid:** Use `--max-filesize 5000000` (5MB limit) in curl to reject oversized responses early. Most brand pages are well under this.
**Warning signs:** Extraction hangs or is very slow on specific sites.

## Code Examples

### URL Validation (Pure Function)
```typescript
// src/urlValidation.ts

const PRIVATE_IP_PATTERNS = [
  /^127\./,                          // 127.0.0.0/8 loopback
  /^10\./,                           // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[0-1])\./,    // 172.16.0.0/12
  /^192\.168\./,                     // 192.168.0.0/16
  /^169\.254\./,                     // link-local
  /^0\./,                            // 0.0.0.0/8
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '0.0.0.0',
  '[::1]',
  '[::ffff:127.0.0.1]',
]);

// Shell metacharacters that should never appear in a URL
const SHELL_META_RE = /[;|&$`\\!(){}[\]<>'"]/;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUrl(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) return { valid: false };

  // SECR-02: Reject shell metacharacters
  if (SHELL_META_RE.test(trimmed)) {
    return { valid: false, error: 'URL contains invalid characters' };
  }

  // Parse with URL constructor
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // FETCH-01: http/https only
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only http and https URLs are supported' };
  }

  // FETCH-04: SSRF prevention
  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { valid: false, error: 'Local addresses are not allowed' };
  }

  // Check if hostname looks like an IP address
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const ip = hostname;
    if (PRIVATE_IP_PATTERNS.some(re => re.test(ip))) {
      return { valid: false, error: 'Private network addresses are not allowed' };
    }
  }

  // Reject numeric-only hostnames (could be decimal IP)
  if (/^\d+$/.test(hostname)) {
    return { valid: false, error: 'Numeric IP addresses are not allowed' };
  }

  // Reject hex IPs (0x...)
  if (/^0x/i.test(hostname)) {
    return { valid: false, error: 'Hex IP addresses are not allowed' };
  }

  return { valid: true };
}
```

### Fetching HTML via curl
```typescript
// src/fetchUtils.ts

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function fetchHtml(
  shell: { exec: (cmd: string, args: string[], opts?: { timeout?: number }) => Promise<{ stdout: string; stderr: string; exit_code: number }> },
  url: string,
): Promise<{ html: string; headers: string }> {
  // Use -D /dev/stderr to separate headers from body
  const result = await shell.exec('curl', [
    '-s',
    '-L',
    '--max-time', '30',
    '--max-redirs', '5',
    '--max-filesize', '5000000',
    '-A', USER_AGENT,
    '-D', '/dev/stderr',   // headers go to stderr
    url,
  ], { timeout: 35000 });

  if (result.exit_code !== 0) {
    if (result.exit_code === 28) throw new Error('Site took too long to respond');
    if (result.exit_code === 63) throw new Error('Response too large');
    throw new Error(`Failed to fetch: ${result.stderr || 'Unknown error'}`);
  }

  return { html: result.stdout, headers: result.stderr };
}
```

### Extracting Stylesheet URLs from HTML
```typescript
export function extractStylesheetUrls(html: string, pageUrl: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = doc.querySelectorAll('link[rel="stylesheet"]');
  const urls: string[] = [];

  const MAX_STYLESHEETS = 20;

  for (const link of links) {
    if (urls.length >= MAX_STYLESHEETS) break;
    const href = link.getAttribute('href');
    if (!href) continue;
    try {
      const resolved = new URL(href, pageUrl).toString();
      urls.push(resolved);
    } catch {
      // Skip malformed URLs
    }
  }

  return urls;
}
```

### Bot Detection from Response
```typescript
export interface BotDetectionResult {
  isBlocked: boolean;
  provider?: string;
  detail?: string;
}

export function detectBotProtection(html: string, headers: string): BotDetectionResult {
  // Check Cloudflare challenge header
  if (/cf-mitigated:\s*challenge/i.test(headers)) {
    return { isBlocked: true, provider: 'Cloudflare', detail: 'Cloudflare challenge detected' };
  }

  // Check for Cloudflare challenge page markers in HTML
  if (html.includes('__cf_chl') || html.includes('cf-browser-verification')) {
    return { isBlocked: true, provider: 'Cloudflare', detail: 'Cloudflare browser verification page' };
  }

  // Check for common challenge page titles
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch?.[1]?.toLowerCase() || '';
  if (title.includes('just a moment') || title.includes('attention required')) {
    return { isBlocked: true, provider: 'Cloudflare', detail: 'Cloudflare interstitial page' };
  }

  // Check for Akamai Bot Manager
  if (html.includes('_abck') || html.includes('akam-challenge')) {
    return { isBlocked: true, provider: 'Akamai', detail: 'Akamai bot challenge detected' };
  }

  // Check for generic CAPTCHA indicators
  if (html.includes('g-recaptcha') || html.includes('h-captcha')) {
    return { isBlocked: true, provider: 'CAPTCHA', detail: 'CAPTCHA challenge page detected' };
  }

  return { isBlocked: false };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SSRF: check only `localhost` and `127.0.0.1` | Comprehensive hostname validation including hex, decimal, IPv6, link-local | Ongoing OWASP updates | Must cover all private ranges, not just obvious ones |
| Cloudflare detection: check HTTP status only | `cf-mitigated` header + HTML content markers | Cloudflare docs (current) | Header is the most reliable signal; HTML markers are fallback |
| curl without user-agent | curl with browser user-agent string | Always been best practice | Many sites return different content (or block) default curl UA |

**Deprecated/outdated:**
- `__cfduid` cookie: Cloudflare deprecated this cookie in 2021. Do not rely on it for detection.

## Open Questions

1. **curl header capture strategy**
   - What we know: `-D /dev/stderr` sends headers to stderr, which shell.exec captures separately. Alternative: `-i` includes headers in stdout (mixed with body).
   - What's unclear: Whether shell.exec reliably separates stdout/stderr, or if the host app merges them. Need to verify at implementation time.
   - Recommendation: Try `-D /dev/stderr` first. If stderr is not reliably captured, fall back to `-i` and split headers from body using the blank line delimiter.

2. **Cancel mechanism**
   - What we know: shell.exec returns a Promise but we don't know if it supports cancellation/abort at the process level.
   - What's unclear: Whether cancelling means we can kill the curl process or just ignore its result.
   - Recommendation: Use a ref flag to ignore results after cancel. The curl `--max-time` ensures the process eventually terminates regardless.

3. **curl availability on Windows**
   - What we know: Ship Studio appears to be an Electron/Tauri desktop app. curl ships with modern Windows 10+.
   - What's unclear: Whether all target platforms have curl available.
   - Recommendation: Since the project already uses shell commands extensively (node, cat, test), curl is a safe assumption. Log a clear error if curl is not found.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest (recommended -- matches Vite build system) |
| Config file | none -- see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FETCH-01 | URL validation accepts http/https, rejects others | unit | `npx vitest run src/urlValidation.test.ts -t "scheme"` | No -- Wave 0 |
| FETCH-02 | fetchHtml builds correct curl args, extractStylesheetUrls parses HTML | unit | `npx vitest run src/fetchUtils.test.ts` | No -- Wave 0 |
| FETCH-03 | detectBotProtection identifies Cloudflare/Akamai challenge pages | unit | `npx vitest run src/fetchUtils.test.ts -t "bot"` | No -- Wave 0 |
| FETCH-04 | SSRF validation rejects private IPs, localhost, hex/decimal IPs | unit | `npx vitest run src/urlValidation.test.ts -t "SSRF"` | No -- Wave 0 |
| FETCH-05 | Extraction state machine transitions correctly | unit | `npx vitest run src/useUrlFetch.test.ts` | No -- Wave 0 |
| SECR-01 | curl args are discrete array elements, never interpolated | unit | `npx vitest run src/fetchUtils.test.ts -t "args"` | No -- Wave 0 |
| SECR-02 | Shell metacharacters in URL are rejected | unit | `npx vitest run src/urlValidation.test.ts -t "metachar"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` -- vitest configuration for the project
- [ ] `src/urlValidation.test.ts` -- covers FETCH-01, FETCH-04, SECR-02
- [ ] `src/fetchUtils.test.ts` -- covers FETCH-02, FETCH-03, SECR-01
- [ ] Framework install: `npm install -D vitest` -- no test framework currently installed

## Sources

### Primary (HIGH confidence)
- [Cloudflare Challenge Detection Docs](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/) - `cf-mitigated` header detection method
- [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) - Private IP address ranges (10/8, 172.16/12, 192.168/16)
- [curl documentation](https://curl.se/docs/httpscripting.html) - curl flags and behavior
- URL Web API, DOMParser -- browser built-in APIs, stable and well-documented

### Secondary (MEDIUM confidence)
- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) - SSRF prevention patterns
- [OWASP SSRF Prevention in Node.js](https://owasp.org/www-community/pages/controls/SSRF_Prevention_in_Nodejs) - Node-specific guidance
- [ZenRows Cloudflare bypass analysis](https://www.zenrows.com/blog/curl-bypass-cloudflare) - Cloudflare challenge HTML markers

### Tertiary (LOW confidence)
- Bot detection for Akamai (`_abck`, `akam-challenge`) -- based on community scraping knowledge, not official docs. Needs validation if Akamai detection accuracy matters.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - curl + URL API + DOMParser are well-understood, zero-dependency tools
- Architecture: HIGH - follows established patterns in the existing codebase (shell.exec, useState, hooks)
- URL validation/SSRF: HIGH - RFC 1918 ranges are well-defined, URL constructor is standard
- Bot detection: MEDIUM - Cloudflare detection is well-documented; Akamai/others are community knowledge
- Pitfalls: HIGH - SSRF bypass vectors and timeout issues are well-documented in security literature

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (stable domain -- curl, URL API, and SSRF patterns don't change frequently)
