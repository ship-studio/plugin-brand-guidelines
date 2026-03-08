// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { analyzeTokens, buildPrompt, parseAnalysisResponse } from './analyzeTokens';
import type { RawColor } from './tokenExtraction';

function mockShell(response: { stdout: string; stderr: string; exit_code: number }) {
  return { exec: vi.fn().mockResolvedValue(response) };
}

const sampleColors: RawColor[] = [
  { value: '#6c5ce7', hex: '#6c5ce7', varName: '--color-primary' },
  { value: '#00b894', hex: '#00b894' },
];

const sampleFonts = ['Inter', 'Fira Code'];

const sampleText = 'Welcome to Acme Corp. We build amazing products.';

const validResult = {
  colors: [
    { name: 'Royal Purple', hex: '#6c5ce7' },
    { name: 'Mint Green', hex: '#00b894' },
  ],
  fonts: [
    { role: 'Heading', value: 'Inter' },
    { role: 'Mono', value: 'Fira Code' },
  ],
  voiceNotes: '- Tone: Professional but approachable',
};

describe('buildPrompt', () => {
  it('includes color hex values and CSS variable names', () => {
    const prompt = buildPrompt(sampleColors, sampleFonts, sampleText);
    expect(prompt).toContain('#6c5ce7');
    expect(prompt).toContain('--color-primary');
  });

  it('includes font names', () => {
    const prompt = buildPrompt(sampleColors, sampleFonts, sampleText);
    expect(prompt).toContain('Inter');
    expect(prompt).toContain('Fira Code');
  });

  it('includes visible text', () => {
    const prompt = buildPrompt(sampleColors, sampleFonts, sampleText);
    expect(prompt).toContain('Acme Corp');
  });

  it('truncates input when total exceeds ~100KB', () => {
    const longText = 'x'.repeat(200_000);
    const prompt = buildPrompt(sampleColors, sampleFonts, longText);
    expect(prompt.length).toBeLessThan(110_000);
  });

  it('produces valid prompt with empty color/font arrays', () => {
    const prompt = buildPrompt([], [], 'Some text');
    expect(prompt).toBeTruthy();
    expect(prompt).toContain('Some text');
  });
});

describe('parseAnalysisResponse', () => {
  it('parses clean JSON response', () => {
    const result = parseAnalysisResponse(JSON.stringify(validResult));
    expect(result.colors).toHaveLength(2);
    expect(result.colors[0].name).toBe('Royal Purple');
    expect(result.voiceNotes).toContain('Professional');
  });

  it('parses JSON wrapped in markdown fences', () => {
    const wrapped = '```json\n' + JSON.stringify(validResult) + '\n```';
    const result = parseAnalysisResponse(wrapped);
    expect(result.colors).toHaveLength(2);
  });

  it('parses JSON with leading text', () => {
    const withText = 'Here is the analysis:\n' + JSON.stringify(validResult);
    const result = parseAnalysisResponse(withText);
    expect(result.colors).toHaveLength(2);
  });

  it('throws on unparseable response', () => {
    expect(() => parseAnalysisResponse('not json at all')).toThrow('Failed to parse AI response');
  });
});

describe('analyzeTokens', () => {
  it('calls shell.exec with claude, correct args, and timeout', async () => {
    const shell = mockShell({
      stdout: JSON.stringify(validResult),
      stderr: '',
      exit_code: 0,
    });

    await analyzeTokens(shell, sampleColors, sampleFonts, sampleText);

    expect(shell.exec).toHaveBeenCalledWith(
      'claude',
      expect.arrayContaining(['-p', '--max-turns', '1', '--output-format', 'text']),
      { timeout: 120000 },
    );
  });

  it('returns parsed AnalysisResult on success', async () => {
    const shell = mockShell({
      stdout: JSON.stringify(validResult),
      stderr: '',
      exit_code: 0,
    });

    const result = await analyzeTokens(shell, sampleColors, sampleFonts, sampleText);
    expect(result.colors).toHaveLength(2);
    expect(result.fonts).toHaveLength(2);
    expect(result.voiceNotes).toBeTruthy();
  });

  it('throws on non-zero exit code', async () => {
    const shell = mockShell({
      stdout: '',
      stderr: 'Claude CLI error',
      exit_code: 1,
    });

    await expect(analyzeTokens(shell, sampleColors, sampleFonts, sampleText))
      .rejects.toThrow('Claude CLI error');
  });

  it('retries once on invalid JSON, calls shell.exec twice', async () => {
    const shell = {
      exec: vi.fn()
        .mockResolvedValueOnce({ stdout: 'not json', stderr: '', exit_code: 0 })
        .mockResolvedValueOnce({ stdout: JSON.stringify(validResult), stderr: '', exit_code: 0 }),
    };

    const result = await analyzeTokens(shell, sampleColors, sampleFonts, sampleText);
    expect(shell.exec).toHaveBeenCalledTimes(2);
    expect(result.colors).toHaveLength(2);
  });

  it('throws descriptive error after second parse failure', async () => {
    const shell = {
      exec: vi.fn()
        .mockResolvedValueOnce({ stdout: 'bad json 1', stderr: '', exit_code: 0 })
        .mockResolvedValueOnce({ stdout: 'bad json 2', stderr: '', exit_code: 0 }),
    };

    await expect(analyzeTokens(shell, sampleColors, sampleFonts, sampleText))
      .rejects.toThrow('AI analysis failed: could not parse response');
  });
});
