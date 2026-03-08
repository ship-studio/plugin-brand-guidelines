# Feature Landscape

**Domain:** Design token extraction from website URLs (for a Brand Guidelines plugin)
**Researched:** 2026-03-08

## Table Stakes

Features users expect from a "Start from URL" extraction flow. Missing any of these and the feature feels broken or pointless.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| URL input field with validation | Users need to paste a URL and hit go -- this is the entire entry point | Low | Validate URL format before attempting fetch. Show clear error for invalid URLs or unreachable sites. |
| Color palette extraction | Colors are the most visually obvious brand element. Every competitor does this. | Medium | Must extract from computed styles, CSS variables, and inline styles. Raw hex/rgb values from the DOM. |
| Semantic color naming (Primary, Accent, Background, etc.) | Raw hex values without names are useless -- users need to know *what role* each color plays | High | This is where AI analysis shines. Pure CSS scraping cannot reliably determine semantic roles. Analyze usage frequency, element context (buttons vs backgrounds vs text), and CSS variable names. |
| Color deduplication and grouping | Sites use dozens of color values; showing all 47 shades of grey is noise | Medium | Group near-identical colors (within a deltaE threshold). Present the 5-12 most significant colors, not every value found in the stylesheet. |
| Font family extraction with role classification | Users need to know which font is for headings vs body text | Medium | Inspect computed styles on h1-h6 vs p/span elements. Most sites use 2-3 font families at most. Map to Heading/Body/Mono roles. |
| Loading state with progress indication | Extraction takes several seconds (page render + AI analysis). Users need to know something is happening. | Low | Show a progress indicator or status messages ("Fetching page...", "Analyzing styles...", "Generating brand profile..."). |
| Review before applying | Users must be able to see extracted tokens and approve/edit before they overwrite existing brand settings | Medium | This is explicitly called out in PROJECT.md as a requirement. Show extracted results in a review UI, not auto-applied. |
| Error handling for failed extractions | Sites can be unreachable, bot-protected, or have unusual structures | Low | Graceful failure with actionable messages: "Site blocked the request", "Could not load page", "No design tokens found". |
| Voice/tone extraction from page copy | The plugin already has a Voice tab. Extracting voice from visible text is a natural extension and adds significant perceived value. | Medium | AI analyzes visible text content for tone descriptors (professional, playful, technical, casual). Produces 1-3 sentences summarizing the brand voice. |

## Differentiators

Features that set this apart from basic color picker extensions. These create the "wow" factor.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| AI-powered semantic analysis (via Claude Code shell) | Most tools do pure CSS scraping. Using AI to understand *intent* behind design choices produces dramatically better results -- "Primary Blue" instead of "#2563EB found 47 times". | High | This is the core differentiator. The AI can look at the full context: which colors appear on CTAs, which are backgrounds, which are text. No API keys needed since Claude Code is already running. |
| Border radius extraction | Captures the brand's "roundness" personality (sharp corners vs pill buttons vs fully rounded). Few tools extract this. | Low | Pull border-radius values from buttons, cards, inputs. Group into a small set (e.g., "Small: 4px", "Medium: 8px", "Large: 16px"). |
| Spacing scale extraction | Captures the rhythm/density of the design. Useful for reproducing the brand's feel. | Medium | Analyze padding/margin/gap values across the page. Identify the spacing scale (4px, 8px, 16px, 24px, 32px). More useful as a pattern than individual values. |
| Confidence scoring per token | Tells users which extracted values are high-confidence (seen consistently) vs uncertain (edge cases). Builds trust. | Medium | Rate each token: HIGH (consistent usage, clear semantic role), MEDIUM (likely correct but less certain), LOW (inferred, may need manual review). Display visually in the review UI. |
| Re-extraction from different URL | Let users extract from multiple URLs to refine their brand profile (e.g., extract from homepage, then from a product page). | Low | The "Start from URL" button should remain accessible even after initial extraction. New extraction shows review UI again, doesn't silently overwrite. |
| Selective token acceptance | In the review UI, let users cherry-pick which extracted tokens to keep vs discard before applying | Medium | Checkboxes or toggle switches per token in the review view. "Accept All" and "Accept None" shortcuts. This turns extraction from all-or-nothing into a curated flow. |
| Dark mode detection | Some sites have dark mode. Extracting tokens from the wrong theme produces inverted results. | Low | Default to light mode extraction (most common). Dembrandt offers a `--dark-mode` flag. Could offer a toggle, but light-mode-first is fine for v1. |

## Anti-Features

Features to explicitly NOT build. These add complexity without proportional value, or conflict with the plugin's constraints.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Multi-page crawling | Massively increases complexity, execution time, and failure modes. Single-page extraction is sufficient for brand identity -- a homepage or key landing page captures the brand. | Extract from one URL at a time. Users can re-run on different URLs if needed. |
| Real-time page preview | Embedding or rendering the source page in the plugin UI is technically difficult (CORS, iframes, security) and adds no value to the extraction workflow. | Show extracted tokens only. Users can open the source URL in a browser tab. |
| Logo/favicon download | Downloading and storing binary assets adds file management complexity. The existing Assets tab handles paths, not file downloads. | If a logo URL is found, populate it as an asset path reference in the Assets tab. Don't download the file. |
| CSS/SCSS/JSON export formats | The plugin exports to CLAUDE.md/AGENTS.md as markdown. Adding CSS/SCSS/JSON export is scope creep for a different use case (developer tooling, not AI context). | Stick to the existing markdown export. The brand data in storage is already structured and could be exported later if needed. |
| Custom extraction rules or selectors | Letting users specify CSS selectors or custom rules to target specific elements creates a power-user feature with a steep learning curve and fragile UX. | AI analysis handles the intelligence. Users review and adjust results, not the extraction process. |
| API key configuration for external services | PROJECT.md explicitly constrains this: no API keys. The Claude Code environment is the AI backend. | All AI analysis runs through `shell.exec()` calling Claude Code. Zero configuration needed. |
| Font file downloading or embedding | Downloading font files (WOFF2, TTF) is a different use case. The plugin captures font family names for brand documentation. | Extract font family names and roles only. Users can source the actual font files separately. |
| Gradient extraction | W3C Design Tokens spec has limited gradient support. Gradients are rarely core brand tokens. Extraction fidelity is poor. | Ignore gradients. Focus on solid colors which are reliable and more useful for brand documentation. |

## Feature Dependencies

```
URL Input + Validation
  --> Page Fetching (shell.exec with curl or headless browser)
    --> Raw Style Extraction (computed styles from DOM)
      --> AI Analysis (Claude Code via shell)
        --> Token Generation (colors, fonts, voice, radii, spacing)
          --> Review UI (display extracted tokens for approval)
            --> Apply to Settings (merge into existing BrandSettings)

Border Radius Extraction --> requires Raw Style Extraction
Spacing Extraction --> requires Raw Style Extraction
Voice/Tone Extraction --> requires page text content (fetched alongside styles)
Confidence Scoring --> requires AI Analysis (AI assigns confidence)
Semantic Color Naming --> requires AI Analysis
Selective Token Acceptance --> requires Review UI
```

## MVP Recommendation

Prioritize for the first milestone:

1. **URL input with validation and clear error states** -- the entry point, must be solid
2. **Color extraction with AI-powered semantic naming** -- highest-impact table stake. Colors named "Primary", "Accent", "Background" instead of raw hex values is the moment users go "wow"
3. **Font extraction with heading/body role classification** -- second most visible token type. Usually only 2-3 families to detect, high accuracy achievable
4. **Voice/tone inference from page copy** -- low marginal cost since AI is already analyzing the page. Fills the Voice tab which would otherwise stay empty
5. **Review UI with selective acceptance** -- users must see and approve tokens before they're applied. Critical for trust
6. **Loading states and error handling** -- polish that prevents confusion

Defer to a follow-up iteration:

- **Border radius extraction**: Adds value but is not expected for v1. Low complexity, easy to add later.
- **Spacing scale extraction**: Medium complexity and the output is harder to present meaningfully in the current UI (no "Spacing" tab exists). Defer until the data model is ready.
- **Confidence scoring**: Nice-to-have but adds UI complexity. For v1, the AI should just do its best and let users review. Scoring can come later when there's data on what users actually adjust.
- **Dark mode detection**: Edge case. Light mode extraction covers 90%+ of use cases.

## Sources

- [Design Token Extractor - Chrome Web Store](https://chromewebstore.google.com/detail/design-token-extractor/iibemocnockckccgcihcmjkciicfoclh)
- [Superposition: Use the design system you already have](https://superposition.design/)
- [CSS Design Tokens Analyzer - Project Wallace](https://www.projectwallace.com/design-tokens)
- [Dembrandt - Automated Design Token Extraction (Blackpaper)](https://www.dembrandt.com/blackpaper)
- [Dembrandt GitHub](https://github.com/dembrandt/dembrandt)
- [Peek Chrome Extension](https://peek.framer.ai/blog/extract-colors-fonts-from-any-website-in-seconds)
- [Brand Extractor](https://genysysengine.tech/Brand-Extractor)
- [Brand Voice Analyzer - Apify](https://apify.com/consummate_mandala/brand-voice-analyzer)
- [Relevance AI - Website to Brand Identity](https://relevanceai.com/templates/website-to-brand-identity-2468b)
- [Semantic Color Systems - DEV Community](https://dev.to/ynab/a-semantic-color-system-the-theory-hk7)
- [Typographic Hierarchy - Toptal](https://www.toptal.com/designers/typography/typographic-hierarchy)
