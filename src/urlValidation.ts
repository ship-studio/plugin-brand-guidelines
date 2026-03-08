/**
 * URL validation with SSRF prevention.
 *
 * Pure functions for validating user-supplied URLs before any shell command
 * is executed. Covers scheme validation (FETCH-01), private IP rejection
 * (FETCH-04), and shell metacharacter rejection (SECR-02).
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** RFC 1918 and other private/reserved IPv4 ranges. */
const PRIVATE_IP_PATTERNS = [
  /^127\./,                          // 127.0.0.0/8 loopback
  /^10\./,                           // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[0-1])\./,    // 172.16.0.0/12
  /^192\.168\./,                     // 192.168.0.0/16
  /^169\.254\./,                     // 169.254.0.0/16 link-local
  /^0\./,                            // 0.0.0.0/8
];

/** Hostnames that resolve to local addresses. */
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '0.0.0.0',
  '[::1]',
  '[::ffff:127.0.0.1]',
]);

/**
 * Shell metacharacters that must never appear in a URL passed to shell.exec.
 * Square brackets are excluded because they are valid IPv6 address notation
 * in URLs (e.g., https://[::1]) -- IPv6 addresses are handled by SSRF checks.
 */
const SHELL_META_RE = /[;|&$`\\!(){}<>'"]/;

/**
 * Extract the host portion from a raw URL string to check for numeric/hex IPs
 * before the URL constructor normalizes them.
 */
function extractRawHost(url: string): string | null {
  const match = url.match(/^https?:\/\/([^/:?#]+)/i);
  return match ? match[1] : null;
}

export function validateUrl(input: string): ValidationResult {
  const trimmed = input.trim();

  // Empty input is silently invalid (no error message for empty field)
  if (!trimmed) return { valid: false };

  // SECR-02: Reject shell metacharacters before any parsing
  if (SHELL_META_RE.test(trimmed)) {
    return { valid: false, error: 'URL contains invalid characters' };
  }

  // Check for numeric/hex IP bypasses on the raw input before URL constructor
  // normalizes them (e.g., 2130706433 -> 127.0.0.1, 0x7f000001 -> 127.0.0.1).
  const rawHost = extractRawHost(trimmed);
  if (rawHost) {
    if (/^\d+$/.test(rawHost)) {
      return { valid: false, error: 'Numeric IP addresses are not allowed' };
    }
    if (/^0x/i.test(rawHost)) {
      return { valid: false, error: 'Hex IP addresses are not allowed' };
    }
  }

  // Parse with the URL constructor
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // FETCH-01: Only http and https schemes
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only http and https URLs are supported' };
  }

  // FETCH-04: SSRF prevention
  const hostname = parsed.hostname.toLowerCase();

  // Block well-known local hostnames
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { valid: false, error: 'Local addresses are not allowed' };
  }

  // Check if hostname is a dotted-quad IPv4 address
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    if (PRIVATE_IP_PATTERNS.some((re) => re.test(hostname))) {
      return { valid: false, error: 'Private network addresses are not allowed' };
    }
  }

  return { valid: true };
}
