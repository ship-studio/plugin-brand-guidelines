/**
 * Pure merge functions for the review flow.
 *
 * prepareTokens converts AI AnalysisResult (no IDs) into typed tokens with IDs.
 * mergeTokens appends accepted tokens into existing BrandSettings.
 */

import type { AnalysisResult, UsageSummaries } from './analyzeTokens';
import type { BrandColor, BrandFont, BrandRadius, BrandSpacing, BrandSettings } from './types';

// ── prepareTokens ──────────────────────────────────────────────────────────

/**
 * Convert an AnalysisResult (no IDs) into BrandColor[], BrandFont[], and
 * voiceNotes string, assigning a unique ID to each color and font.
 */
export function prepareTokens(analysis: AnalysisResult): {
  colors: BrandColor[];
  fonts: BrandFont[];
  voiceNotes: string;
  radii: BrandRadius[];
  spacing: BrandSpacing[];
  usageSummaries: UsageSummaries;
} {
  const colors: BrandColor[] = analysis.colors.map((c) => ({
    id: crypto.randomUUID(),
    name: c.name,
    hex: c.hex,
  }));

  const fonts: BrandFont[] = analysis.fonts.map((f) => ({
    id: crypto.randomUUID(),
    role: f.role,
    value: f.value,
  }));

  const radii: BrandRadius[] = (analysis.radii || []).map((r) => ({
    id: crypto.randomUUID(),
    label: r.label,
    value: r.value,
  }));

  const spacing: BrandSpacing[] = (analysis.spacing || []).map((s) => ({
    id: crypto.randomUUID(),
    label: s.label,
    value: s.value,
  }));

  const defaultSummaries: UsageSummaries = { colors: '', fonts: '', radii: '', spacing: '' };
  const usageSummaries: UsageSummaries = { ...defaultSummaries, ...(analysis.usageSummaries || {}) };

  return { colors, fonts, voiceNotes: analysis.voiceNotes, radii, spacing, usageSummaries };
}

// ── mergeTokens ─────────────────────────────────────────────────────────────

/**
 * Merge accepted tokens into existing BrandSettings.
 *
 * - Colors: appended to end of existing array
 * - Fonts: appended to end of existing array
 * - Voice notes: replaced when existing is empty, appended with \n\n when non-empty,
 *   left unchanged when accepted voiceNotes is null
 * - Assets, targetFile, lastExportedHash: preserved unchanged
 */
export function mergeTokens(
  existing: BrandSettings,
  accepted: {
    colors: BrandColor[];
    fonts: BrandFont[];
    voiceNotes: string | null;
    radii: BrandRadius[];
    spacing: BrandSpacing[];
    usageSummaries?: UsageSummaries;
  },
): BrandSettings {
  let voiceNotes = existing.voiceNotes;

  if (accepted.voiceNotes !== null) {
    if (existing.voiceNotes === '') {
      voiceNotes = accepted.voiceNotes;
    } else {
      voiceNotes = existing.voiceNotes + '\n\n' + accepted.voiceNotes;
    }
  }

  return {
    ...existing,
    colors: [...existing.colors, ...accepted.colors],
    fonts: [...existing.fonts, ...accepted.fonts],
    voiceNotes,
    radii: [...existing.radii, ...accepted.radii],
    spacing: [...existing.spacing, ...accepted.spacing],
    usageSummaries: accepted.usageSummaries || existing.usageSummaries,
  };
}
