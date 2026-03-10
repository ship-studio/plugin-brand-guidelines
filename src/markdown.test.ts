import { describe, it, expect } from 'vitest';
import {
  generateBrandMarkdown,
  hasBrandData,
  djb2Hash,
  buildFileContent,
} from './markdown';
import type { BrandSettings } from './types';

/** Helper: create a minimal valid BrandSettings for test use. */
function makeSettings(overrides: Partial<BrandSettings> = {}): BrandSettings {
  return {
    colors: [{ id: '1', name: 'Primary', hex: '#6C5CE7' }],
    fonts: [{ id: '1', role: 'Heading', value: 'Inter' }],
    voiceNotes: '',
    assets: [],
    radii: [{ id: '1', label: 'Button', value: '4px' }],
    spacing: [{ id: '1', label: 'Base', value: '16px' }],
    targetFile: 'CLAUDE.md',
    lastExportedHash: '',
    ...overrides,
  };
}

describe('generateBrandMarkdown — Usage Guide', () => {
  it('produces a Usage Guide section with per-category subsections when usageSummaries exist', () => {
    const settings = makeSettings({
      usageSummaries: {
        colors: 'Use Primary #6C5CE7 for CTAs.',
        fonts: 'Use Inter for headings.',
        radii: 'Use Button radius for interactive elements.',
        spacing: 'Use Base spacing for content areas.',
      },
    });

    const md = generateBrandMarkdown(settings);

    expect(md).toContain('### Usage Guide');
    expect(md).toContain('#### Colors');
    expect(md).toContain('#### Fonts');
    expect(md).toContain('#### Border Radii');
    expect(md).toContain('#### Spacing');
    expect(md).toContain('Use Primary #6C5CE7 for CTAs.');
    expect(md).toContain('Use Inter for headings.');
  });

  it('produces NO Usage Guide section when usageSummaries is undefined', () => {
    const settings = makeSettings({ usageSummaries: undefined });
    const md = generateBrandMarkdown(settings);

    expect(md).not.toContain('### Usage Guide');
    expect(md).not.toContain('#### Colors');
  });

  it('produces NO Usage Guide section when all usageSummaries are empty strings', () => {
    const settings = makeSettings({
      usageSummaries: { colors: '', fonts: '', radii: '', spacing: '' },
    });
    const md = generateBrandMarkdown(settings);

    expect(md).not.toContain('### Usage Guide');
  });

  it('produces Usage Guide with only non-empty subsections (partial summaries)', () => {
    const settings = makeSettings({
      usageSummaries: {
        colors: 'Use Primary for CTAs.',
        fonts: '',
        radii: '',
        spacing: '',
      },
    });
    const md = generateBrandMarkdown(settings);

    expect(md).toContain('### Usage Guide');
    expect(md).toContain('#### Colors');
    expect(md).not.toContain('#### Fonts');
    expect(md).not.toContain('#### Border Radii');
    expect(md).not.toContain('#### Spacing');
  });

  it('skips subsection when summary exists but corresponding tokens are empty', () => {
    const settings = makeSettings({
      colors: [], // no valid colors
      usageSummaries: {
        colors: 'Use Primary for CTAs.',
        fonts: 'Use Inter for headings.',
        radii: '',
        spacing: '',
      },
    });
    const md = generateBrandMarkdown(settings);

    expect(md).toContain('### Usage Guide');
    // Colors subsection should be skipped — no valid color tokens
    expect(md).not.toContain('#### Colors');
    // Fonts subsection should be present — valid font tokens exist
    expect(md).toContain('#### Fonts');
  });

  it('places Usage Guide section after all existing Brand Guidelines subsections', () => {
    const settings = makeSettings({
      voiceNotes: 'Professional tone.',
      assets: [{ id: '1', label: 'Logo', path: 'logo.svg' }],
      usageSummaries: {
        colors: 'Use Primary for CTAs.',
        fonts: 'Use Inter for headings.',
        radii: 'Use Button for interactive.',
        spacing: 'Use Base for content.',
      },
    });
    const md = generateBrandMarkdown(settings);

    const usageIdx = md.indexOf('### Usage Guide');
    const colorsIdx = md.indexOf('### Colors');
    const fontsIdx = md.indexOf('### Fonts');
    const voiceIdx = md.indexOf('### Voice & Tone');
    const assetsIdx = md.indexOf('### Assets');
    const radiiIdx = md.indexOf('### Border Radii');
    const spacingIdx = md.indexOf('### Spacing');

    expect(usageIdx).toBeGreaterThan(colorsIdx);
    expect(usageIdx).toBeGreaterThan(fontsIdx);
    expect(usageIdx).toBeGreaterThan(voiceIdx);
    expect(usageIdx).toBeGreaterThan(assetsIdx);
    expect(usageIdx).toBeGreaterThan(radiiIdx);
    expect(usageIdx).toBeGreaterThan(spacingIdx);
  });
});

describe('Full export pipeline with Usage Guide', () => {
  it('end-to-end: generateBrandMarkdown + hasBrandData + djb2Hash + buildFileContent', () => {
    const settings: BrandSettings = {
      colors: [{ id: '1', name: 'Primary', hex: '#6C5CE7' }],
      fonts: [{ id: '1', role: 'Heading', value: 'Inter' }],
      voiceNotes: 'Professional tone.',
      assets: [{ id: '1', label: 'Logo', path: 'logo.svg' }],
      radii: [{ id: '1', label: 'Button', value: '4px' }],
      spacing: [{ id: '1', label: 'Base', value: '16px' }],
      usageSummaries: {
        colors: 'Use Primary #6C5CE7 for CTAs and interactive elements.',
        fonts: 'Use Inter for all headings to maintain hierarchy.',
        radii: 'Apply Button radius to interactive controls.',
        spacing: 'Use Base spacing for standard content gaps.',
      },
      targetFile: 'CLAUDE.md',
      lastExportedHash: '',
    };

    // generateBrandMarkdown produces full output
    const md = generateBrandMarkdown(settings);
    expect(md).toContain('## Brand Guidelines');
    expect(md).toContain('### Colors');
    expect(md).toContain('### Fonts');
    expect(md).toContain('### Voice & Tone');
    expect(md).toContain('### Assets');
    expect(md).toContain('### Border Radii');
    expect(md).toContain('### Spacing');
    expect(md).toContain('### Usage Guide');
    // Usage Guide subsections
    expect(md).toContain('#### Colors');
    expect(md).toContain('#### Fonts');
    // Usage Guide appears after token sections
    expect(md.indexOf('### Usage Guide')).toBeGreaterThan(md.indexOf('### Spacing'));

    // hasBrandData returns true
    expect(hasBrandData(settings)).toBe(true);

    // djb2Hash returns a non-empty string
    const hash = djb2Hash(md);
    expect(hash).toBeTruthy();
    expect(typeof hash).toBe('string');

    // buildFileContent with null existing content wraps in markers
    const fileContent = buildFileContent(null, md);
    expect(fileContent).toContain('<!-- BRAND-GUIDELINES-START -->');
    expect(fileContent).toContain('<!-- BRAND-GUIDELINES-END -->');
    expect(fileContent).toContain('### Usage Guide');
  });

  it('buildFileContent replaces existing section including Usage Guide', () => {
    const oldMd = '## Brand Guidelines\n\n### Colors\n\n- **Old**: `#000`';
    const oldFile =
      'Some preamble.\n\n<!-- BRAND-GUIDELINES-START -->\n' +
      oldMd +
      '\n<!-- BRAND-GUIDELINES-END -->\n\nSome epilogue.';

    const newSettings: BrandSettings = {
      colors: [{ id: '1', name: 'Primary', hex: '#6C5CE7' }],
      fonts: [{ id: '1', role: 'Heading', value: 'Inter' }],
      voiceNotes: '',
      assets: [],
      radii: [],
      spacing: [],
      usageSummaries: {
        colors: 'Use Primary for CTAs.',
        fonts: 'Use Inter for headings.',
        radii: '',
        spacing: '',
      },
      targetFile: 'CLAUDE.md',
      lastExportedHash: '',
    };
    const newMd = generateBrandMarkdown(newSettings);
    const result = buildFileContent(oldFile, newMd);

    // Old content replaced
    expect(result).not.toContain('**Old**');
    // New content present with usage guide
    expect(result).toContain('### Usage Guide');
    expect(result).toContain('#### Colors');
    // Surrounding content preserved
    expect(result).toContain('Some preamble.');
    expect(result).toContain('Some epilogue.');
  });
});
