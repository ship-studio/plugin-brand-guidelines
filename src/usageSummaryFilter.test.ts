import { describe, it, expect } from 'vitest';
import { filterUsageSummary } from './usageSummaryFilter';

describe('filterUsageSummary', () => {
  it('returns empty string for empty summary', () => {
    expect(filterUsageSummary('', [{ name: 'Primary', value: '#5C4EFA' }])).toBe('');
  });

  it('returns summary unchanged when no deselected tokens', () => {
    const summary = 'Use Primary #5C4EFA for CTAs. Secondary #2D3436 for text.';
    expect(filterUsageSummary(summary, [])).toBe(summary);
  });

  it('removes sentence referencing deselected token name', () => {
    const summary = 'Use Primary for CTAs. Secondary works for text.';
    const result = filterUsageSummary(summary, [{ name: 'Primary', value: '#5C4EFA' }]);
    expect(result).toBe('Secondary works for text.');
  });

  it('removes sentence referencing deselected token value', () => {
    const summary = 'Use #5C4EFA for CTAs. Secondary works for text.';
    const result = filterUsageSummary(summary, [{ name: 'Primary', value: '#5C4EFA' }]);
    expect(result).toBe('Secondary works for text.');
  });

  it('removes only matching sentences from multiple', () => {
    const summary = 'Use Primary for CTAs. Secondary works for text. Accent is for highlights.';
    const result = filterUsageSummary(summary, [{ name: 'Primary', value: '#5C4EFA' }]);
    expect(result).toBe('Secondary works for text. Accent is for highlights.');
  });

  it('returns empty string when all sentences match deselected tokens', () => {
    const summary = 'Use Primary for CTAs. Use #5C4EFA for buttons.';
    const result = filterUsageSummary(summary, [{ name: 'Primary', value: '#5C4EFA' }]);
    expect(result).toBe('');
  });

  it('matches case-insensitively', () => {
    const summary = 'Use primary for CTAs. Secondary works for text.';
    const result = filterUsageSummary(summary, [{ name: 'Primary', value: '#5C4EFA' }]);
    expect(result).toBe('Secondary works for text.');
  });

  it('cleans up extra whitespace after removal', () => {
    const summary = '  Use Primary for CTAs.   Secondary works for text.  ';
    const result = filterUsageSummary(summary, [{ name: 'Primary', value: '#5C4EFA' }]);
    expect(result).toBe('Secondary works for text.');
  });

  it('handles multiple deselected tokens', () => {
    const summary = 'Use Primary for CTAs. Secondary works for text. Accent is for highlights.';
    const result = filterUsageSummary(summary, [
      { name: 'Primary', value: '#5C4EFA' },
      { name: 'Accent', value: '#00B894' },
    ]);
    expect(result).toBe('Secondary works for text.');
  });

  it('handles sentences ending with exclamation marks', () => {
    const summary = 'Primary is bold! Secondary is subtle.';
    const result = filterUsageSummary(summary, [{ name: 'Primary', value: '#5C4EFA' }]);
    expect(result).toBe('Secondary is subtle.');
  });
});
