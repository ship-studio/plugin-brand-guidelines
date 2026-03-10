import { describe, it, expect, vi } from 'vitest';
import { prepareTokens, mergeTokens } from './reviewMerge';
import type { AnalysisResult } from './analyzeTokens';
import type { BrandSettings } from './types';

// ── prepareTokens ──────────────────────────────────────────────────────────

describe('prepareTokens', () => {
  it('converts AnalysisResult colors into BrandColor[] with IDs', () => {
    const analysis: AnalysisResult = {
      colors: [{ name: 'Primary', hex: '#6C5CE7' }],
      fonts: [],
      voiceNotes: '',
      radii: [],
      spacing: [],
      usageSummaries: { colors: '', fonts: '', radii: '', spacing: '' },
    };
    const result = prepareTokens(analysis);
    expect(result.colors).toHaveLength(1);
    expect(result.colors[0]).toEqual(
      expect.objectContaining({ name: 'Primary', hex: '#6C5CE7' }),
    );
    expect(result.colors[0].id).toBeTruthy();
  });

  it('converts AnalysisResult fonts into BrandFont[] with IDs', () => {
    const analysis: AnalysisResult = {
      colors: [],
      fonts: [{ role: 'Heading', value: 'Inter' }],
      voiceNotes: '',
      radii: [],
      spacing: [],
      usageSummaries: { colors: '', fonts: '', radii: '', spacing: '' },
    };
    const result = prepareTokens(analysis);
    expect(result.fonts).toHaveLength(1);
    expect(result.fonts[0]).toEqual(
      expect.objectContaining({ role: 'Heading', value: 'Inter' }),
    );
    expect(result.fonts[0].id).toBeTruthy();
  });

  it('passes through voiceNotes as-is', () => {
    const analysis: AnalysisResult = {
      colors: [],
      fonts: [],
      voiceNotes: 'Professional but friendly.',
      radii: [],
      spacing: [],
      usageSummaries: { colors: '', fonts: '', radii: '', spacing: '' },
    };
    const result = prepareTokens(analysis);
    expect(result.voiceNotes).toBe('Professional but friendly.');
  });

  it('handles empty arrays gracefully', () => {
    const analysis: AnalysisResult = {
      colors: [],
      fonts: [],
      voiceNotes: '',
      radii: [],
      spacing: [],
      usageSummaries: { colors: '', fonts: '', radii: '', spacing: '' },
    };
    const result = prepareTokens(analysis);
    expect(result.colors).toEqual([]);
    expect(result.fonts).toEqual([]);
    expect(result.voiceNotes).toBe('');
  });

  it('includes usageSummaries when present in AnalysisResult', () => {
    const analysis: AnalysisResult = {
      colors: [],
      fonts: [],
      voiceNotes: '',
      radii: [],
      spacing: [],
      usageSummaries: {
        colors: 'Use Primary for CTAs.',
        fonts: 'Use Inter for headings.',
        radii: 'Use 8px for cards.',
        spacing: 'Use 16px as base unit.',
      },
    };
    const result = prepareTokens(analysis);
    expect(result.usageSummaries).toEqual({
      colors: 'Use Primary for CTAs.',
      fonts: 'Use Inter for headings.',
      radii: 'Use 8px for cards.',
      spacing: 'Use 16px as base unit.',
    });
  });

  it('defaults to empty strings when usageSummaries missing from AnalysisResult', () => {
    const analysis = {
      colors: [],
      fonts: [],
      voiceNotes: '',
      radii: [],
      spacing: [],
    } as unknown as AnalysisResult;
    const result = prepareTokens(analysis);
    expect(result.usageSummaries).toEqual({
      colors: '',
      fonts: '',
      radii: '',
      spacing: '',
    });
  });

  it('generates unique IDs for each token', () => {
    const analysis: AnalysisResult = {
      colors: [
        { name: 'A', hex: '#111111' },
        { name: 'B', hex: '#222222' },
      ],
      fonts: [
        { role: 'Heading', value: 'Inter' },
        { role: 'Body', value: 'Arial' },
      ],
      voiceNotes: '',
      radii: [],
      spacing: [],
      usageSummaries: { colors: '', fonts: '', radii: '', spacing: '' },
    };
    const result = prepareTokens(analysis);
    const ids =[...result.colors.map((c) => c.id), ...result.fonts.map((f) => f.id)];
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ── mergeTokens ─────────────────────────────────────────────────────────────

describe('mergeTokens', () => {
  const baseSettings: BrandSettings = {
    colors: [{ id: '1', name: 'Existing', hex: '#000000' }],
    fonts: [{ id: '2', role: 'Body', value: 'Arial' }],
    voiceNotes: 'Existing voice.',
    assets: [{ id: '3', label: 'Logo', path: 'logo.svg' }],
    radii: [],
    spacing: [],
    targetFile: 'CLAUDE.md',
    lastExportedHash: 'abc123',
  };

  it('appends accepted colors to end of existing colors', () => {
    const accepted = {
      colors: [{ id: '10', name: 'New', hex: '#FF0000' }],
      fonts: [],
      voiceNotes: null,
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(baseSettings, accepted);
    expect(result.colors).toHaveLength(2);
    expect(result.colors[0].name).toBe('Existing');
    expect(result.colors[1].name).toBe('New');
  });

  it('appends accepted fonts to end of existing fonts', () => {
    const accepted = {
      colors: [],
      fonts: [{ id: '20', role: 'Heading', value: 'Inter' }],
      voiceNotes: null,
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(baseSettings, accepted);
    expect(result.fonts).toHaveLength(2);
    expect(result.fonts[0].role).toBe('Body');
    expect(result.fonts[1].role).toBe('Heading');
  });

  it('replaces voice notes when existing is empty string', () => {
    const emptyVoice: BrandSettings = { ...baseSettings, voiceNotes: '' };
    const accepted = {
      colors: [],
      fonts: [],
      voiceNotes: 'New voice notes.',
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(emptyVoice, accepted);
    expect(result.voiceNotes).toBe('New voice notes.');
  });

  it('appends voice notes with double newline when existing is non-empty', () => {
    const accepted = {
      colors: [],
      fonts: [],
      voiceNotes: 'Additional notes.',
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(baseSettings, accepted);
    expect(result.voiceNotes).toBe('Existing voice.\n\nAdditional notes.');
  });

  it('leaves voice notes unchanged when accepted voiceNotes is null', () => {
    const accepted = {
      colors: [],
      fonts: [],
      voiceNotes: null,
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(baseSettings, accepted);
    expect(result.voiceNotes).toBe('Existing voice.');
  });

  it('preserves assets unchanged', () => {
    const accepted = {
      colors: [{ id: '10', name: 'New', hex: '#FF0000' }],
      fonts: [],
      voiceNotes: null,
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(baseSettings, accepted);
    expect(result.assets).toEqual(baseSettings.assets);
  });

  it('preserves targetFile unchanged', () => {
    const accepted = {
      colors: [],
      fonts: [],
      voiceNotes: null,
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(baseSettings, accepted);
    expect(result.targetFile).toBe('CLAUDE.md');
  });

  it('preserves lastExportedHash unchanged', () => {
    const accepted = {
      colors: [],
      fonts: [],
      voiceNotes: null,
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(baseSettings, accepted);
    expect(result.lastExportedHash).toBe('abc123');
  });

  it('replaces existing usageSummaries when accepted has usageSummaries', () => {
    const withSummaries: BrandSettings = {
      ...baseSettings,
      usageSummaries: {
        colors: 'Old color guidance.',
        fonts: 'Old font guidance.',
        radii: 'Old radii guidance.',
        spacing: 'Old spacing guidance.',
      },
    };
    const accepted = {
      colors: [],
      fonts: [],
      voiceNotes: null,
      radii: [],
      spacing: [],
      usageSummaries: {
        colors: 'New color guidance.',
        fonts: 'New font guidance.',
        radii: 'New radii guidance.',
        spacing: 'New spacing guidance.',
      },
    };
    const result = mergeTokens(withSummaries, accepted);
    expect(result.usageSummaries).toEqual({
      colors: 'New color guidance.',
      fonts: 'New font guidance.',
      radii: 'New radii guidance.',
      spacing: 'New spacing guidance.',
    });
  });

  it('preserves existing usageSummaries when accepted.usageSummaries is undefined', () => {
    const existingSummaries = {
      colors: 'Use Primary for CTAs.',
      fonts: 'Use Inter for headings.',
      radii: 'Use 8px for cards.',
      spacing: 'Use 16px as base unit.',
    };
    const withSummaries: BrandSettings = {
      ...baseSettings,
      usageSummaries: existingSummaries,
    };
    const accepted = {
      colors: [],
      fonts: [],
      voiceNotes: null,
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(withSummaries, accepted);
    expect(result.usageSummaries).toEqual(existingSummaries);
  });

  it('handles merging into empty settings', () => {
    const empty: BrandSettings = {
      colors: [],
      fonts: [],
      voiceNotes: '',
      assets: [],
      radii: [],
      spacing: [],
      targetFile: 'CLAUDE.md',
      lastExportedHash: '',
    };
    const accepted = {
      colors: [{ id: '10', name: 'Primary', hex: '#6C5CE7' }],
      fonts: [{ id: '20', role: 'Heading', value: 'Inter' }],
      voiceNotes: 'Brand voice notes.',
      radii: [],
      spacing: [],
    };
    const result = mergeTokens(empty, accepted);
    expect(result.colors).toHaveLength(1);
    expect(result.fonts).toHaveLength(1);
    expect(result.voiceNotes).toBe('Brand voice notes.');
  });
});
