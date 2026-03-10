/**
 * AI-powered token analysis via Claude CLI.
 *
 * Transforms raw extracted colors, fonts, and visible text into
 * semantically named, role-classified design tokens by invoking
 * `claude -p` through shell.exec.
 */

import type { RawColor } from './tokenExtraction';

// ── Types ──────────────────────────────────────────────────────────────────

export interface UsageSummaries {
  colors: string;
  fonts: string;
  radii: string;
  spacing: string;
}

export interface AnalysisResult {
  colors: Array<{ name: string; hex: string }>;
  fonts: Array<{ role: string; value: string }>;
  voiceNotes: string;
  radii: Array<{ label: string; value: string }>;
  spacing: Array<{ label: string; value: string }>;
  usageSummaries: UsageSummaries;
}

interface Shell {
  exec: (
    command: string,
    args: string[],
    options?: { timeout?: number },
  ) => Promise<{ stdout: string; stderr: string; exit_code: number }>;
}

// ── Constants ─────────────────────────────────────────────────────────────

/** Maximum prompt size in characters (~100KB). */
const MAX_PROMPT_SIZE = 100_000;

// ── Prompt Building ───────────────────────────────────────────────────────

/**
 * Build the analysis prompt from extracted tokens.
 * Truncates CSS-derived content if total would exceed ~100KB.
 */
export function buildPrompt(
  colors: RawColor[],
  fonts: string[],
  visibleText: string,
  radii: string[] = [],
  spacing: string[] = [],
): string {
  const colorList = colors.length > 0
    ? colors.map(c => {
        const parts = [c.hex];
        if (c.varName) parts.push(`var: ${c.varName}`);
        if (c.count > 1) parts.push(`used ${c.count}x`);
        return parts.join(' — ');
      }).join('\n')
    : '(none found)';

  const fontList = fonts.length > 0
    ? fonts.join(', ')
    : '(none found)';

  const radiiList = radii.length > 0 ? radii.join(', ') : '(none found)';
  const spacingList = spacing.length > 0 ? spacing.join(', ') : '(none found)';

  const instructions = `You are a brand design analyst. Analyze the following extracted design tokens from a website and produce a structured brand analysis.

## Extracted Colors
${colorList}

## Extracted Fonts
${fontList}

## Page Text
${visibleText}

## Extracted Border Radii
${radiiList}

## Extracted Spacing Values
${spacingList}

## Instructions

1. Select 8-15 of the most meaningful colors from the list above. Colors are sorted by usage frequency — strongly prefer colors used more often (higher "used Nx" counts) as these are the brand's core palette. Assign each a creative semantic name that reflects the brand identity (e.g. "Midnight Navy", "Coral Accent", "Soft Fog"). IMPORTANT: You MUST include background and surface colors (whites, near-whites, light grays for light themes; dark colors for dark themes) — these define the brand's visual foundation. Also include text colors. The goal is to capture the complete theme so someone can reproduce the site's look and feel. Name them with their role, e.g. "Page Background", "Card Surface", "Primary Text", "Muted Text".

2. Classify each font into a role: Heading, Body, Mono, Display, or Accent.

3. Generate voice/tone notes as structured bullet points covering:
   - Tone (e.g. professional, playful, authoritative)
   - Vocabulary style (e.g. technical, conversational, formal)
   - Personality traits
   - Do's and Don'ts for writing in this brand voice

4. Select 3-6 meaningful border-radius values and assign descriptive labels (e.g. 'Button', 'Card', 'Pill', 'Circle').

5. Select 4-8 spacing values that form a coherent scale and assign descriptive labels (e.g. 'Tight', 'Base', 'Relaxed', 'Spacious').

6. Generate a usage summary for each token category (colors, fonts, radii, spacing). Each summary should be 2-3 sentences of prose (not bullet points) explaining how to apply those tokens. Reference specific token names and values — for example, 'Use Primary #5C4EFA for CTAs and interactive elements.' The colors summary MUST start by stating the theme direction (light or dark) and which colors to use for page backgrounds, card surfaces, and text — this is critical for reproducing the brand's look. Do NOT generate a summary for voiceNotes — the voice notes already serve as usage guidance.

Output ONLY valid JSON matching this exact schema, with no markdown fences and no explanation:
{
  "colors": [{"name": "string", "hex": "#xxxxxx"}],
  "fonts": [{"role": "string", "value": "string"}],
  "voiceNotes": "string with bullet points using - prefix",
  "radii": [{"label": "string", "value": "string"}],
  "spacing": [{"label": "string", "value": "string"}],
  "usageSummaries": {"colors": "string", "fonts": "string", "radii": "string", "spacing": "string"}
}`;

  // Truncate if needed
  if (instructions.length > MAX_PROMPT_SIZE) {
    const overhead = instructions.length - visibleText.length;
    const maxTextLen = MAX_PROMPT_SIZE - overhead - 100;
    const truncatedText = visibleText.slice(0, Math.max(0, maxTextLen));
    return instructions.replace(visibleText, truncatedText + '\n[truncated]');
  }

  return instructions;
}

// ── Response Parsing ──────────────────────────────────────────────────────

/**
 * Parse Claude's response into an AnalysisResult.
 * Handles clean JSON, markdown-fenced JSON, and JSON with leading text.
 */
export function parseAnalysisResponse(stdout: string): AnalysisResult {
  const trimmed = stdout.trim();

  let parsed: Record<string, unknown> | undefined;

  // 1. Try direct parse
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    // continue
  }

  // 2. Try stripping markdown fences
  if (!parsed) {
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      try {
        parsed = JSON.parse(fenceMatch[1]);
      } catch {
        // continue
      }
    }
  }

  // 3. Try finding first { and last }
  if (!parsed) {
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        parsed = JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
      } catch {
        // fall through
      }
    }
  }

  if (!parsed) {
    throw new Error('Failed to parse AI response');
  }

  // Normalize usageSummaries: default missing fields to empty strings
  const empty: UsageSummaries = { colors: '', fonts: '', radii: '', spacing: '' };
  parsed.usageSummaries = { ...empty, ...((parsed.usageSummaries as Partial<UsageSummaries>) || {}) };

  return parsed as unknown as AnalysisResult;
}

// ── Main Analysis Function ────────────────────────────────────────────────

/**
 * Analyze extracted tokens using Claude CLI.
 * Retries once with a stricter prompt on parse failure.
 */
export async function analyzeTokens(
  shell: Shell,
  colors: RawColor[],
  fonts: string[],
  visibleText: string,
  radii: string[] = [],
  spacing: string[] = [],
): Promise<AnalysisResult> {
  const prompt = buildPrompt(colors, fonts, visibleText, radii, spacing);

  const result = await shell.exec(
    'claude',
    ['-p', prompt, '--max-turns', '1', '--output-format', 'text'],
    { timeout: 120000 },
  );

  if (result.exit_code !== 0) {
    throw new Error(result.stderr || 'Claude CLI exited with error');
  }

  // First attempt to parse
  try {
    return parseAnalysisResponse(result.stdout);
  } catch {
    // Retry with stricter prompt
    const strictPrompt = prompt + '\n\nYou MUST output ONLY valid JSON. No other text.';
    const retry = await shell.exec(
      'claude',
      ['-p', strictPrompt, '--max-turns', '1', '--output-format', 'text'],
      { timeout: 120000 },
    );

    if (retry.exit_code !== 0) {
      throw new Error(retry.stderr || 'Claude CLI exited with error');
    }

    try {
      return parseAnalysisResponse(retry.stdout);
    } catch {
      throw new Error('AI analysis failed: could not parse response');
    }
  }
}
