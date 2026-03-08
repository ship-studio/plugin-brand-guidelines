# Stack Research

**Domain:** Design token extraction from URLs within a Ship Studio plugin
**Researched:** 2026-03-08
**Confidence:** MEDIUM-HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Dembrandt (via `npx`) | 0.6.1 | Extract design tokens from any URL | Purpose-built for exactly this task. Uses Playwright under the hood, extracts colors (semantic + palette + CSS vars), typography, spacing, borders, shadows with confidence scores. Outputs structured JSON via `--json-only`. Handles bot detection, JS-heavy sites, dark mode. One command, zero config. |
| Claude Code CLI (`claude -p`) | (host-provided) | AI analysis of raw tokens into branded, semantic output | Already available in the user's environment (the plugin runs inside Claude Code). Non-interactive mode (`-p`) accepts piped input, returns structured text. No API keys needed. Use it to name colors intelligently, assign font roles, infer voice/tone from page copy, and deduplicate/rank extracted tokens. |
| Node.js (via `shell.exec()`) | (host-provided) | Orchestration scripts for extraction pipeline | Already available. Run inline scripts via `node -e` to glue together Dembrandt output and Claude analysis. The plugin already uses this pattern for file writes. |

### Why Dembrandt Over Rolling Our Own

The alternative is writing a custom Puppeteer/Playwright script that calls `getComputedStyle()` on DOM elements. This is viable but substantially worse:

1. **Dembrandt already solves the hard problems**: bot detection bypass, confidence scoring, CSS variable extraction from `:root`, deduplication of similar colors, font source detection, spacing scale identification.
2. **Maintenance burden**: A custom extraction script needs ongoing fixes for edge cases (SPAs, lazy-loaded content, shadow DOM, iframes). Dembrandt handles these.
3. **Output quality**: Dembrandt groups tokens by semantic role and assigns confidence scores. A raw `getComputedStyle` dump gives you hundreds of values with no organization.
4. **Size**: Dembrandt is 156 kB on npm. It pulls Playwright as a dependency, but since we run it via `npx`, the browser download happens on first use and is cached system-wide.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `jq` (system) | (system-provided) | Parse/filter Dembrandt JSON output in shell | When you need to extract specific token categories from Dembrandt output before passing to Claude. Available on macOS by default or via Homebrew. |

**Note on zero-dependency constraint:** None of these become bundled dependencies of the plugin. Everything runs as shell commands through `shell.exec()`. The plugin's `dist/index.js` bundle remains dependency-free.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `npx dembrandt [url] --json-only` | Test extraction locally | Pipe to `jq` for exploring output structure: `npx dembrandt stripe.com --json-only \| jq '.colors'` |
| `echo "..." \| claude -p --output-format json` | Test AI analysis prompts | Iterate on the prompt that transforms raw tokens into branded settings |

## Architecture: The Extraction Pipeline

Everything runs through `shell.exec()`. The pipeline has three stages:

```
Stage 1: Extract          Stage 2: Analyze           Stage 3: Map
npx dembrandt URL  -->   claude -p "prompt"   -->   Node.js transform
     --json-only         (piped JSON input)          to BrandSettings
```

**Stage 1 - Extract tokens:** `shell.exec('npx', ['dembrandt', url, '--json-only'])` returns raw JSON with colors, fonts, spacing, borders, shadows.

**Stage 2 - AI analysis:** Pipe the JSON into `claude -p` with a carefully crafted prompt that instructs Claude to:
- Select the top 5-8 most important colors and give them semantic names (Primary, Secondary, Accent, etc.)
- Identify heading vs body fonts and assign roles
- Infer voice/tone from any extracted text content
- Return a structured JSON response matching the `BrandSettings` schema

**Stage 3 - Map to BrandSettings:** A small `node -e` script (or inline JS parsing in the plugin) transforms Claude's response into the exact `BrandSettings` shape the plugin expects.

### Why This Architecture

- **No new runtime dependencies** in the plugin bundle
- **No API keys** needed (Claude Code is already authenticated)
- **Each stage is independently testable** via shell commands
- **AI handles the "wow factor"**: Raw token extraction gives you data; Claude gives you intelligence (naming, role assignment, deduplication, voice inference)
- **Graceful degradation**: If Dembrandt fails (bot detection, network error), fall back to a simpler `curl + node` approach for basic CSS extraction

## Installation

```bash
# Nothing to install in the plugin itself.
# Dembrandt is invoked via npx at runtime (auto-installed on first use):
npx dembrandt example.com --json-only

# For local development/testing, optionally install globally:
npm install -g dembrandt

# jq is likely already available on macOS. If not:
brew install jq
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Dembrandt (`npx`) | Custom Puppeteer script | Only if Dembrandt's output format is fundamentally incompatible with our needs, or if we need to extract something Dembrandt doesn't cover (unlikely -- it covers colors, fonts, spacing, borders, shadows) |
| Dembrandt (`npx`) | Custom Playwright script | Same as above. Playwright has slightly more downloads than Puppeteer (13M vs 3M weekly) but Dembrandt already uses Playwright internally, so we get both |
| Dembrandt (`npx`) | Superposition | Superposition is a desktop app, not a CLI tool. Cannot be invoked from `shell.exec()` |
| `claude -p` for AI analysis | OpenAI CLI / custom API call | Would require API keys. Claude Code is already present and authenticated. Zero-config wins. |
| `claude -p` for AI analysis | No AI (pure heuristics) | Possible for color extraction, but cannot reliably name colors semantically, assign font roles, or infer voice/tone. AI is the differentiator. |
| `jq` for JSON parsing | `node -e` with `JSON.parse` | Use `node -e` if jq is not available on the system. Both work; jq is more concise for simple extractions |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Puppeteer/Playwright as a bundled dependency | Adds ~200MB+ of browser binaries to the plugin. Violates zero-dependency constraint. Also unnecessary since Dembrandt wraps Playwright already | Dembrandt via `npx` |
| `fetch()`/`curl` + regex for CSS parsing | Cannot extract computed styles. Misses JS-rendered content, CSS-in-JS, CSS custom properties resolved at runtime. Produces unreliable results | Dembrandt (headless browser rendering) |
| Browser MCP / Playwright MCP | MCP tools are for interactive agent use, not programmatic extraction from a plugin. Adds unnecessary complexity and coupling to MCP infrastructure | Dembrandt CLI via `shell.exec()` |
| Style Dictionary | Token transformation/distribution tool, not extraction. Useful downstream if you want to output tokens in multiple formats, but overkill for our "extract and display" use case | Direct JSON parsing of Dembrandt output |
| `css-tree` / `postcss` for CSS parsing | Static CSS parsing libraries. Cannot handle computed styles, CSS-in-JS, or runtime-resolved custom properties. Only useful if you already have the raw CSS files | Dembrandt (renders the page and extracts computed styles) |
| Zombie.js | Lightweight but does not render CSS. Only handles DOM/JS execution. Useless for style extraction | Dembrandt (full rendering via Playwright) |

## Key Flags and Options for Dembrandt

| Flag | Purpose | When to Use |
|------|---------|-------------|
| `--json-only` | Raw JSON to stdout (no formatting, no file save) | Always. This is what we pipe to Claude. |
| `--browser=firefox` | Use Firefox instead of Chromium | When Chromium is blocked by bot detection |
| `--slow` | Extend timeouts to 24 seconds | For JS-heavy SPAs that take time to render |
| `--dark-mode` | Extract dark mode tokens | Future feature: let users choose light/dark extraction |
| `--mobile` | Use mobile viewport (390x844) | Out of scope per PROJECT.md, but available for future |
| `--no-sandbox` | Disable Chromium sandbox | For Docker/CI environments if needed |

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| dembrandt 0.6.x | Node.js 18+ | Requires Node 18+. Claude Code environments ship with Node 18+ so this is safe. |
| dembrandt 0.6.x | Playwright (bundled) | Playwright is a dependency of dembrandt, not of our plugin. Auto-installed via npx. |
| `claude -p` | Claude Code (any recent version) | The `-p` flag has been stable since early Claude Code releases. Ship Studio requires 0.3.53+. |

## Confidence Assessment

| Recommendation | Confidence | Rationale |
|----------------|------------|-----------|
| Dembrandt for extraction | MEDIUM-HIGH | The tool is relatively new (v0.6.1) and has not reached 1.0. But it is purpose-built, actively maintained (last publish ~1 month ago), and the extraction approach (Playwright + computed styles) is sound. Fallback plan exists (custom script). |
| `claude -p` for AI analysis | HIGH | Well-documented, stable CLI feature. Already available in the user's environment by definition (the plugin runs inside Claude Code). |
| `--json-only` output format | MEDIUM | Verified via docs and GitHub README. The flag exists and outputs JSON to stdout. Exact schema of the JSON output needs validation during implementation. |
| Pipeline architecture (extract -> analyze -> map) | HIGH | Clean separation of concerns. Each stage is independently testable. Matches the plugin's existing pattern of shell-based operations. |
| Zero new bundled dependencies | HIGH | Architecture is explicitly designed around shell commands. Nothing gets added to package.json. |

## Sources

- [Dembrandt GitHub](https://github.com/dembrandt/dembrandt) -- CLI flags, output formats, extraction capabilities
- [Dembrandt Blackpaper](https://www.dembrandt.com/blackpaper) -- Technical architecture and extraction pipeline details
- [Dembrandt npm](https://www.npmjs.com/package/dembrandt) -- Version 0.6.1, 156 kB, Node 18+ requirement
- [Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference) -- `-p` flag documentation, output formats
- [Claude Code Headless Mode](https://code.claude.com/docs/en/headless) -- Programmatic usage of `claude -p`
- [Puppeteer GitHub](https://github.com/puppeteer/puppeteer) -- v24.38.0, getComputedStyle capabilities (considered as alternative)
- [Playwright vs Puppeteer comparison](https://blog.apify.com/playwright-vs-puppeteer/) -- NPM download stats, feature comparison

---
*Stack research for: Design token extraction from URLs*
*Researched: 2026-03-08*
