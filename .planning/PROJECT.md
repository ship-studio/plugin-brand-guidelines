# Brand Guidelines Plugin — Start from URL

## What This Is

A feature for the Ship Studio Brand Guidelines plugin that lets users paste any website URL and automatically extract design tokens (colors, fonts, border radii, spacing) and voice/tone — pre-filling the brand guidelines modal for review. It leverages the Claude Code environment already running on the user's machine for AI-powered analysis, requiring no API keys.

## Core Value

Extracting design tokens from any URL with accuracy that amazes users — reliable enough that the pre-filled brand guidelines feel like they were hand-curated.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Manual brand color management (add, edit, remove with hex picker) — existing
- ✓ Manual font management (role + font family pairs) — existing
- ✓ Voice/tone notes (free-text) — existing
- ✓ Asset path management (label + file path) — existing
- ✓ Export to CLAUDE.md/AGENTS.md with marker-based sync — existing
- ✓ Sync status tracking (not-exported, in-sync, needs-update) — existing
- ✓ Debounced auto-save to host plugin storage — existing
- ✓ Tabbed modal UI (Colors, Fonts, Voice, Assets) — existing
- ✓ Theme-aware styling via host context — existing
- ✓ URL input with real-time validation (http/https, SSRF prevention) — v1.0
- ✓ HTML/CSS fetching via curl through shell.exec() — v1.0
- ✓ Bot detection (Cloudflare/Akamai challenges) with clear error messages — v1.0
- ✓ Loading state with step-based progress indication — v1.0
- ✓ Color extraction from CSS (hex, rgb, hsl, named) with deduplication — v1.0
- ✓ AI-assigned semantic color names (Primary, Accent, Background, etc.) — v1.0
- ✓ Font-family extraction with AI heading/body role classification — v1.0
- ✓ Voice/tone inference from visible page text — v1.0
- ✓ All AI analysis via Claude CLI (`claude -p`) — no API keys required — v1.0
- ✓ CSS truncation (~100KB) to prevent buffer overflow — v1.0
- ✓ Shell.exec() calls with explicit timeouts — v1.0
- ✓ Token review UI with selective accept/reject per token — v1.0
- ✓ Merge accepted tokens with existing settings (non-destructive) — v1.0
- ✓ Re-extract from different URL without losing previous tokens — v1.0
- ✓ "Start from URL" as empty-state CTA and always-visible toolbar button — v1.0
- ✓ Border radius extraction from CSS with AI semantic tokens — v1.0
- ✓ Spacing scale extraction from CSS with AI semantic tokens — v1.0
- ✓ URLs never interpolated into shell strings (discrete arguments) — v1.0
- ✓ URL input sanitized to reject shell metacharacters — v1.0

### Active

<!-- Current scope. Building toward these. -->

## Current Milestone: v1.1 Usage Guide

**Goal:** Add AI-generated usage guidance per token category so exported brand guidelines explain *how* to use tokens, not just list them.

**Target features:**
- AI generates usage summaries per category (colors, fonts, radii, spacing, voice) during extraction
- Per-tab editable usage summaries in the Review UI
- Exported markdown includes a "Usage Guide" section

### Out of Scope

- Mobile/responsive token extraction — focus on desktop viewport first
- Multi-page crawling — single URL only
- Real-time preview of the source page — just extract tokens
- Direct Figma/design tool integration — URLs only
- Custom API key configuration — leverage Claude Code environment only
- Dark mode detection — deferred to v2
- Confidence scoring per token — deferred to v2
- Headless browser extraction (Dembrandt) — deferred to v2 for JS-heavy sites

## Context

Shipped v1.0 with 5,132 LOC TypeScript/TSX. 110 tests passing, 101 KB build.
Tech stack: React (externalized from host), Vite, Vitest, pure function architecture.
The plugin runs inside Ship Studio inside Claude Code — shell access via `shell.exec()`.
AI analysis uses `claude -p` CLI invocation with structured JSON prompts.
curl-based fetching works for most brand sites; Dembrandt deferred to v2 for JS-heavy sites.

## Constraints

- **No API keys**: Users must not be required to enter any API keys — piggyback on the Claude Code environment already installed
- **Production safety**: No changes go live until explicitly confirmed by the maintainer
- **Host SDK only**: All capabilities must come through the Ship Studio plugin context (shell, storage, toast, theme, actions)
- **Zero runtime deps**: The plugin bundles no runtime dependencies — React is externalized
- **Accuracy bar**: Token extraction must be impressively accurate — not a "good enough" scrape, but an intelligent analysis

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use AI (Claude via shell) for token extraction | Pure CSS scraping can't reliably identify semantic roles — AI delivers wow-factor accuracy | ✓ Good — semantic naming quality exceeded expectations |
| Pre-fill and review (not auto-replace) | Users need to verify and tweak extracted tokens before they become brand settings | ✓ Good — merge-based approach preserves existing data |
| Both empty-state CTA and always-visible button | Maximum discoverability — new users see it immediately, returning users can re-import | ✓ Good — dual entry points work well |
| Extract voice/tone from page copy | Adds significant value since the plugin already has a Voice tab | ✓ Good — completes the brand profile |
| curl-based fetching, Dembrandt deferred to v2 | Zero-dependency constraint; curl works for most brand sites | ✓ Good — simplicity won, JS-heavy sites deferred |
| View state machine (url-cta, tabs, url-inline, extracting, review) | Clean separation of modal states | ✓ Good — maintainable state transitions |
| 3-tier JSON parsing fallback for AI responses | AI output format varies — need resilient parsing | ✓ Good — handles real-world Claude output reliably |
| Record<string, boolean> for selection state | O(1) toggle performance for token selection | ✓ Good — simple and performant |
| window.confirm() for discard dialogs | Simplest approach, no custom modal needed | ✓ Good — adequate for MVP |
| Defensive `|| []` in prepareTokens | Backward compat with older AnalysisResult objects missing new fields | ✓ Good — prevents runtime errors |

---
*Last updated: 2026-03-08 after v1.1 milestone started*
