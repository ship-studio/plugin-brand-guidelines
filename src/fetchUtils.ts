/**
 * Fetch utilities for URL extraction.
 *
 * Pure functions for building curl commands, parsing HTML for stylesheets,
 * and detecting bot protection. All curl commands use discrete array arguments
 * (SECR-01) -- the URL is never interpolated into a command string.
 */

/** Browser user-agent string to avoid bot detection on basic sites. */
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Maximum number of stylesheets to extract from a single page. */
const MAX_STYLESHEETS = 20;

/** Shell interface matching the plugin SDK's shell.exec signature. */
interface Shell {
  exec: (
    command: string,
    args: string[],
    options?: { timeout?: number },
  ) => Promise<{ stdout: string; stderr: string; exit_code: number }>;
}

/**
 * Map a curl exit code to a user-friendly error message.
 * Returns null if exit_code indicates success.
 */
function curlError(exitCode: number, stderr: string): Error | null {
  if (exitCode === 0) return null;
  if (exitCode === 28) return new Error('Site took too long to respond');
  if (exitCode === 63) return new Error('Response too large');
  return new Error(stderr || 'Unknown error');
}

/**
 * Fetch HTML from a URL using curl.
 *
 * Headers are captured via `-D /dev/stderr` so they appear in stderr,
 * while the HTML body appears in stdout.
 */
export async function fetchHtml(
  shell: Shell,
  url: string,
): Promise<{ html: string; headers: string }> {
  const result = await shell.exec(
    'curl',
    [
      '-s',
      '-L',
      '--max-time', '30',
      '--max-redirs', '5',
      '--max-filesize', '5000000',
      '-A', USER_AGENT,
      '-D', '/dev/stderr',
      url,
    ],
    { timeout: 35000 },
  );

  const err = curlError(result.exit_code, result.stderr);
  if (err) throw err;

  return { html: result.stdout, headers: result.stderr };
}

/**
 * Fetch a single CSS file from a URL using curl.
 *
 * Simpler than fetchHtml -- no header capture needed.
 */
export async function fetchCss(shell: Shell, url: string): Promise<string> {
  const result = await shell.exec(
    'curl',
    [
      '-s',
      '-L',
      '--max-time', '30',
      '--max-redirs', '5',
      '--max-filesize', '5000000',
      '-A', USER_AGENT,
      url,
    ],
    { timeout: 35000 },
  );

  const err = curlError(result.exit_code, result.stderr);
  if (err) throw err;

  return result.stdout;
}

/**
 * Extract stylesheet URLs from HTML.
 *
 * Parses the HTML with DOMParser, finds `<link rel="stylesheet">` elements,
 * and resolves their `href` attributes relative to the page URL.
 * Caps at MAX_STYLESHEETS to prevent resource exhaustion.
 */
export function extractStylesheetUrls(html: string, pageUrl: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = doc.querySelectorAll('link[rel="stylesheet"]');
  const urls: string[] = [];

  for (const link of links) {
    if (urls.length >= MAX_STYLESHEETS) break;
    const href = link.getAttribute('href');
    if (!href) continue;
    try {
      const resolved = new URL(href, pageUrl).toString();
      urls.push(resolved);
    } catch {
      // Skip malformed URLs
    }
  }

  return urls;
}

/** Result of bot protection detection. */
export interface BotDetectionResult {
  isBlocked: boolean;
  provider?: string;
  detail?: string;
}

/**
 * Detect bot protection from response HTML and headers.
 *
 * Checks for Cloudflare challenge pages, Akamai bot manager,
 * and generic CAPTCHA indicators.
 */
export function detectBotProtection(html: string, headers: string): BotDetectionResult {
  // Cloudflare challenge header
  if (/cf-mitigated:\s*challenge/i.test(headers)) {
    return { isBlocked: true, provider: 'Cloudflare', detail: 'Cloudflare challenge detected' };
  }

  // Cloudflare challenge page markers in HTML
  if (html.includes('__cf_chl') || html.includes('cf-browser-verification')) {
    return { isBlocked: true, provider: 'Cloudflare', detail: 'Cloudflare browser verification page' };
  }

  // Cloudflare interstitial page titles
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch?.[1]?.toLowerCase() || '';
  if (title.includes('just a moment') || title.includes('attention required')) {
    return { isBlocked: true, provider: 'Cloudflare', detail: 'Cloudflare interstitial page' };
  }

  // Akamai Bot Manager
  if (html.includes('_abck') || html.includes('akam-challenge')) {
    return { isBlocked: true, provider: 'Akamai', detail: 'Akamai bot challenge detected' };
  }

  // Generic CAPTCHA indicators
  if (html.includes('g-recaptcha') || html.includes('h-captcha')) {
    return { isBlocked: true, provider: 'CAPTCHA', detail: 'CAPTCHA challenge page detected' };
  }

  return { isBlocked: false };
}
