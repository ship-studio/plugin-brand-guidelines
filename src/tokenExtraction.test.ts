// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  normalizeToHex,
  extractColors,
  extractFonts,
  extractVisibleText,
  extractEmbeddedStyles,
  type RawColor,
} from './tokenExtraction';

describe('normalizeToHex', () => {
  it('expands 3-digit hex to 6-digit', () => {
    expect(normalizeToHex('#fff')).toBe('#ffffff');
  });

  it('passes through 6-digit hex lowercase', () => {
    expect(normalizeToHex('#abcdef')).toBe('#abcdef');
  });

  it('converts rgb to hex', () => {
    expect(normalizeToHex('rgb(0, 128, 255)')).toBe('#0080ff');
  });

  it('converts hsl to hex (green)', () => {
    expect(normalizeToHex('hsl(120, 100%, 50%)')).toBe('#00ff00');
  });

  it('converts named color to hex', () => {
    expect(normalizeToHex('red')).toBe('#ff0000');
  });

  it('returns null for unrecognized values', () => {
    expect(normalizeToHex('notacolor')).toBeNull();
  });

  it('lowercases hex values', () => {
    expect(normalizeToHex('#ABCDEF')).toBe('#abcdef');
  });
});

describe('extractColors', () => {
  it('extracts 3-digit hex and normalizes', () => {
    const result = extractColors(['a { color: #f00; }']);
    expect(result).toEqual([{ value: '#f00', hex: '#ff0000', count: 1 }]);
  });

  it('extracts 6-digit hex', () => {
    const result = extractColors(['a { color: #ff0000; }']);
    expect(result).toEqual([{ value: '#ff0000', hex: '#ff0000', count: 1 }]);
  });

  it('strips alpha from 8-digit hex', () => {
    const result = extractColors(['a { color: #ff000080; }']);
    expect(result).toEqual([{ value: '#ff000080', hex: '#ff0000', count: 1 }]);
  });

  it('extracts rgb with comma syntax', () => {
    const result = extractColors(['a { color: rgb(255, 0, 0); }']);
    expect(result).toEqual([{ value: 'rgb(255, 0, 0)', hex: '#ff0000', count: 1 }]);
  });

  it('extracts rgb with space syntax', () => {
    const result = extractColors(['a { color: rgb(255 0 0); }']);
    expect(result).toEqual([{ value: 'rgb(255 0 0)', hex: '#ff0000', count: 1 }]);
  });

  it('extracts rgb with alpha (space syntax)', () => {
    const result = extractColors(['a { color: rgb(255 0 0 / 0.5); }']);
    expect(result).toEqual([{ value: 'rgb(255 0 0 / 0.5)', hex: '#ff0000', count: 1 }]);
  });

  it('extracts hsl and converts to hex', () => {
    const result = extractColors(['a { color: hsl(0, 100%, 50%); }']);
    expect(result).toEqual([{ value: 'hsl(0, 100%, 50%)', hex: '#ff0000', count: 1 }]);
  });

  it('handles hsl hue wrapping at 360', () => {
    const result = extractColors(['a { color: hsl(360, 100%, 50%); }']);
    expect(result[0].hex).toBe('#ff0000');
  });

  it('handles hsl pure white', () => {
    const result = extractColors(['a { color: hsl(0, 0%, 100%); }']);
    expect(result[0].hex).toBe('#ffffff');
  });

  it('handles hsl pure black', () => {
    const result = extractColors(['a { color: hsl(0, 0%, 0%); }']);
    expect(result[0].hex).toBe('#000000');
  });

  it('extracts named colors', () => {
    const result = extractColors(['a { color: cornflowerblue; }']);
    expect(result[0].hex).toBe('#6495ed');
  });

  it('captures CSS custom property names', () => {
    const result = extractColors(['--color-primary: #6C5CE7;']);
    expect(result).toEqual([
      { value: '#6C5CE7', hex: '#6c5ce7', varName: '--color-primary', count: 2 },
    ]);
  });

  it('deduplicates by hex value', () => {
    const result = extractColors(['a{color:#f00} b{color:#ff0000}']);
    expect(result).toHaveLength(1);
  });

  it('returns empty array for empty CSS', () => {
    expect(extractColors([''])).toEqual([]);
    expect(extractColors([])).toEqual([]);
  });
});

describe('extractFonts', () => {
  it('extracts font-family declarations', () => {
    const result = extractFonts(['body { font-family: "Inter", sans-serif; }']);
    expect(result).toEqual(['Inter']);
  });

  it('extracts multiple non-generic fonts', () => {
    const result = extractFonts([
      'h1 { font-family: "Playfair Display", Georgia, serif; }',
    ]);
    expect(result).toEqual(['Playfair Display', 'Georgia']);
  });

  it('extracts from font shorthand', () => {
    const result = extractFonts([
      'p { font: 16px/1.5 "Roboto", Arial, sans-serif; }',
    ]);
    expect(result).toEqual(['Roboto', 'Arial']);
  });

  it('filters out generic-only declarations', () => {
    const result = extractFonts(['a { font-family: monospace; }']);
    expect(result).toEqual([]);
  });

  it('deduplicates across multiple CSS texts', () => {
    const result = extractFonts([
      'body { font-family: "Inter", sans-serif; }',
      'h1 { font-family: "Inter", serif; }',
    ]);
    expect(result).toEqual(['Inter']);
  });
});

describe('extractVisibleText', () => {
  it('extracts text from body', () => {
    expect(extractVisibleText('<body><p>Hello world</p></body>')).toBe(
      'Hello world',
    );
  });

  it('strips script elements', () => {
    expect(
      extractVisibleText(
        '<body><script>var x=1;</script><p>Text</p></body>',
      ),
    ).toBe('Text');
  });

  it('strips style elements', () => {
    expect(
      extractVisibleText(
        '<body><style>.x{}</style><p>Text</p></body>',
      ),
    ).toBe('Text');
  });

  it('strips nav elements', () => {
    expect(
      extractVisibleText(
        '<body><nav>Nav</nav><main>Main</main></body>',
      ),
    ).toBe('Main');
  });

  it('truncates to 10000 characters', () => {
    const longText = 'a'.repeat(15000);
    const result = extractVisibleText(`<body><p>${longText}</p></body>`);
    expect(result.length).toBe(10000);
  });

  it('collapses whitespace', () => {
    expect(
      extractVisibleText('<body><p>  Hello   world  </p></body>'),
    ).toBe('Hello world');
  });
});

describe('extractEmbeddedStyles', () => {
  it('extracts single style block', () => {
    const result = extractEmbeddedStyles(
      '<style>.x { color: red; }</style>',
    );
    expect(result).toEqual(['.x { color: red; }']);
  });

  it('extracts multiple style blocks', () => {
    const result = extractEmbeddedStyles(
      '<style>a{}</style><style>b{}</style>',
    );
    expect(result).toEqual(['a{}', 'b{}']);
  });

  it('returns empty array when no styles', () => {
    const result = extractEmbeddedStyles(
      '<html><body>no styles</body></html>',
    );
    expect(result).toEqual([]);
  });
});
