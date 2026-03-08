# Brand Guidelines Plugin — Start from URL

## What This Is

A new feature for the Ship Studio Brand Guidelines plugin that lets users paste any website URL and automatically extract design tokens (colors, fonts, border radii, spacing) and voice/tone — pre-filling the brand guidelines modal for review. It leverages the Claude Code environment already running on the user's machine for AI-powered analysis, requiring no API keys.

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

### Active

<!-- Current scope. Building toward these. -->

- [ ] User can enter a URL and trigger design token extraction
- [ ] Extracted colors are identified, named, and pre-filled into the Colors tab
- [ ] Extracted fonts are identified with heading/body roles and pre-filled into the Fonts tab
- [ ] Extracted border radii are captured and surfaced
- [ ] Extracted spacing values are captured and surfaced
- [ ] Voice/tone is inferred from page copy and pre-filled into the Voice tab
- [ ] AI analysis runs via Claude Code shell (no API keys required)
- [ ] Pre-filled tokens are shown for review before saving
- [ ] "Start from URL" appears as empty-state CTA when no brand data exists
- [ ] "Start from URL" is always accessible via a button in the modal

### Out of Scope

- Mobile/responsive token extraction — focus on desktop viewport first
- Multi-page crawling — single URL only
- Real-time preview of the source page — just extract tokens
- Direct Figma/design tool integration — URLs only
- Custom API key configuration — leverage Claude Code environment only

## Context

- The plugin runs inside Ship Studio, which runs inside Claude Code
- Shell access is available via `shell.exec()` through the host plugin context
- Claude Code's AI capabilities can be accessed through the shell environment
- The plugin has zero runtime dependencies — React is externalized from the host
- File I/O happens via the host shell, not direct filesystem access
- This is a production plugin — changes must not ship until explicitly confirmed
- The existing plugin architecture is clean: pure markdown generation, marker-based sync, debounced persistence

## Constraints

- **No API keys**: Users must not be required to enter any API keys — piggyback on the Claude Code environment already installed
- **Production safety**: No changes go live until explicitly confirmed by the maintainer
- **Host SDK only**: All capabilities must come through the Ship Studio plugin context (shell, storage, toast, theme, actions)
- **Zero runtime deps**: The plugin bundles no runtime dependencies — React is externalized
- **Accuracy bar**: Token extraction must be impressively accurate — not a "good enough" scrape, but an intelligent analysis

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use AI (Claude via shell) for token extraction | Pure CSS scraping can't reliably identify semantic roles (primary vs accent) or name colors intelligently — AI analysis delivers the wow-factor accuracy required | — Pending |
| Pre-fill and review (not auto-replace) | Users need to verify and tweak extracted tokens before they become their brand settings | — Pending |
| Both empty-state CTA and always-visible button | Maximum discoverability — new users see it immediately, returning users can re-import anytime | — Pending |
| Extract voice/tone from page copy | Adds significant value since the plugin already has a Voice tab — might as well populate it | — Pending |

---
*Last updated: 2026-03-08 after initialization*
