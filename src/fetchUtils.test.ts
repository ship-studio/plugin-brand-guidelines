// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import {
  fetchHtml,
  fetchCss,
  extractStylesheetUrls,
  detectBotProtection,
} from './fetchUtils';

/** Helper to create a mock shell with configurable exec behavior. */
function mockShell(response: { stdout: string; stderr: string; exit_code: number }) {
  return {
    exec: vi.fn().mockResolvedValue(response),
  };
}

describe('fetchHtml', () => {
  it('calls shell.exec with curl and discrete array arguments (SECR-01)', async () => {
    const shell = mockShell({ stdout: '<html></html>', stderr: 'HTTP/1.1 200', exit_code: 0 });
    await fetchHtml(shell, 'https://example.com');

    expect(shell.exec).toHaveBeenCalledWith(
      'curl',
      expect.arrayContaining([
        '-s',
        '-L',
        '--max-time', '30',
        '--max-redirs', '5',
        '--max-filesize', '5000000',
        '-D', '/dev/stderr',
        'https://example.com',
      ]),
      { timeout: 35000 },
    );

    // URL must be a separate array element, never interpolated
    const args = shell.exec.mock.calls[0][1] as string[];
    expect(args[args.length - 1]).toBe('https://example.com');
  });

  it('includes a browser user-agent string', async () => {
    const shell = mockShell({ stdout: '', stderr: '', exit_code: 0 });
    await fetchHtml(shell, 'https://example.com');

    const args = shell.exec.mock.calls[0][1] as string[];
    const uaIndex = args.indexOf('-A');
    expect(uaIndex).toBeGreaterThan(-1);
    expect(args[uaIndex + 1]).toContain('Mozilla');
  });

  it('returns html and headers on success', async () => {
    const shell = mockShell({
      stdout: '<html><body>Hello</body></html>',
      stderr: 'HTTP/1.1 200 OK\r\ncontent-type: text/html',
      exit_code: 0,
    });
    const result = await fetchHtml(shell, 'https://example.com');
    expect(result.html).toBe('<html><body>Hello</body></html>');
    expect(result.headers).toContain('200 OK');
  });

  it('throws "Site took too long to respond" for exit code 28', async () => {
    const shell = mockShell({ stdout: '', stderr: 'timeout', exit_code: 28 });
    await expect(fetchHtml(shell, 'https://example.com')).rejects.toThrow(
      'Site took too long to respond',
    );
  });

  it('throws "Response too large" for exit code 63', async () => {
    const shell = mockShell({ stdout: '', stderr: 'max filesize', exit_code: 63 });
    await expect(fetchHtml(shell, 'https://example.com')).rejects.toThrow(
      'Response too large',
    );
  });

  it('throws with stderr message for other non-zero exit codes', async () => {
    const shell = mockShell({ stdout: '', stderr: 'Connection refused', exit_code: 7 });
    await expect(fetchHtml(shell, 'https://example.com')).rejects.toThrow(
      'Connection refused',
    );
  });
});

describe('fetchCss', () => {
  it('calls shell.exec with curl and the CSS URL as a discrete argument', async () => {
    const shell = mockShell({ stdout: 'body { color: red; }', stderr: '', exit_code: 0 });
    const result = await fetchCss(shell, 'https://example.com/style.css');

    expect(result).toBe('body { color: red; }');
    expect(shell.exec).toHaveBeenCalledWith(
      'curl',
      expect.arrayContaining(['https://example.com/style.css']),
      expect.objectContaining({ timeout: 35000 }),
    );
  });

  it('throws on timeout (exit code 28)', async () => {
    const shell = mockShell({ stdout: '', stderr: '', exit_code: 28 });
    await expect(fetchCss(shell, 'https://example.com/style.css')).rejects.toThrow(
      'Site took too long to respond',
    );
  });

  it('throws on response too large (exit code 63)', async () => {
    const shell = mockShell({ stdout: '', stderr: '', exit_code: 63 });
    await expect(fetchCss(shell, 'https://example.com/style.css')).rejects.toThrow(
      'Response too large',
    );
  });
});

describe('extractStylesheetUrls', () => {
  it('extracts absolute stylesheet URLs', () => {
    const html = '<html><head><link rel="stylesheet" href="https://cdn.example.com/style.css"></head></html>';
    const result = extractStylesheetUrls(html, 'https://example.com');
    expect(result).toEqual(['https://cdn.example.com/style.css']);
  });

  it('resolves relative stylesheet URLs against page URL', () => {
    const html = '<html><head><link rel="stylesheet" href="/css/main.css"></head></html>';
    const result = extractStylesheetUrls(html, 'https://example.com/about/');
    expect(result).toEqual(['https://example.com/css/main.css']);
  });

  it('resolves protocol-relative stylesheet URLs', () => {
    const html = '<html><head><link rel="stylesheet" href="//cdn.example.com/style.css"></head></html>';
    const result = extractStylesheetUrls(html, 'https://example.com');
    expect(result).toEqual(['https://cdn.example.com/style.css']);
  });

  it('returns empty array when no link tags exist', () => {
    const html = '<html><head><title>Test</title></head></html>';
    const result = extractStylesheetUrls(html, 'https://example.com');
    expect(result).toEqual([]);
  });

  it('skips link tags without rel="stylesheet"', () => {
    const html = '<html><head><link rel="icon" href="/favicon.ico"></head></html>';
    const result = extractStylesheetUrls(html, 'https://example.com');
    expect(result).toEqual([]);
  });

  it('caps at 20 stylesheets maximum', () => {
    const links = Array.from({ length: 25 }, (_, i) =>
      `<link rel="stylesheet" href="/css/style${i}.css">`,
    ).join('');
    const html = `<html><head>${links}</head></html>`;
    const result = extractStylesheetUrls(html, 'https://example.com');
    expect(result).toHaveLength(20);
  });

  it('skips malformed URLs without throwing', () => {
    const html = '<html><head><link rel="stylesheet" href="http://%"><link rel="stylesheet" href="/valid.css"></head></html>';
    const result = extractStylesheetUrls(html, 'https://example.com');
    expect(result).toEqual(['https://example.com/valid.css']);
  });
});

describe('detectBotProtection', () => {
  it('detects Cloudflare via cf-mitigated header', () => {
    const result = detectBotProtection('', 'cf-mitigated: challenge\r\n');
    expect(result.isBlocked).toBe(true);
    expect(result.provider).toBe('Cloudflare');
  });

  it('detects Cloudflare via __cf_chl in HTML', () => {
    const result = detectBotProtection('<script>window.__cf_chl_opt={}</script>', '');
    expect(result.isBlocked).toBe(true);
    expect(result.provider).toBe('Cloudflare');
  });

  it('detects Cloudflare via "Just a moment" title', () => {
    const html = '<html><head><title>Just a moment...</title></head></html>';
    const result = detectBotProtection(html, '');
    expect(result.isBlocked).toBe(true);
    expect(result.provider).toBe('Cloudflare');
  });

  it('detects Akamai via _abck marker', () => {
    const result = detectBotProtection('<script>var _abck="abc";</script>', '');
    expect(result.isBlocked).toBe(true);
    expect(result.provider).toBe('Akamai');
  });

  it('detects CAPTCHA via g-recaptcha', () => {
    const result = detectBotProtection('<div class="g-recaptcha"></div>', '');
    expect(result.isBlocked).toBe(true);
    expect(result.provider).toBe('CAPTCHA');
  });

  it('returns not blocked for normal pages', () => {
    const html = '<html><head><title>My Brand</title></head><body>Welcome</body></html>';
    const result = detectBotProtection(html, 'content-type: text/html\r\n');
    expect(result.isBlocked).toBe(false);
    expect(result.provider).toBeUndefined();
  });
});
