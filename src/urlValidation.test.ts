import { describe, it, expect } from 'vitest';
import { validateUrl } from './urlValidation';

describe('validateUrl', () => {
  describe('empty and whitespace input', () => {
    it('returns invalid with no error for empty string', () => {
      const result = validateUrl('');
      expect(result).toEqual({ valid: false });
    });

    it('returns invalid with no error for whitespace-only string', () => {
      const result = validateUrl('   ');
      expect(result).toEqual({ valid: false });
    });

    it('trims leading/trailing whitespace before validation', () => {
      const result = validateUrl('  https://example.com  ');
      expect(result).toEqual({ valid: true });
    });
  });

  describe('scheme validation', () => {
    it('accepts https URLs', () => {
      expect(validateUrl('https://example.com')).toEqual({ valid: true });
    });

    it('accepts http URLs', () => {
      expect(validateUrl('http://example.com')).toEqual({ valid: true });
    });

    it('accepts http URLs with path and query', () => {
      expect(validateUrl('http://example.com/path?q=1')).toEqual({ valid: true });
    });

    it('rejects ftp scheme', () => {
      expect(validateUrl('ftp://example.com')).toEqual({
        valid: false,
        error: 'Only http and https URLs are supported',
      });
    });

    it('rejects javascript scheme', () => {
      const result = validateUrl('javascript:alert(1)');
      expect(result.valid).toBe(false);
    });

    it('rejects file scheme', () => {
      const result = validateUrl('file:///etc/passwd');
      expect(result.valid).toBe(false);
    });
  });

  describe('invalid URL format', () => {
    it('rejects non-URL strings', () => {
      expect(validateUrl('not a url')).toEqual({
        valid: false,
        error: 'Invalid URL format',
      });
    });
  });

  describe('SSRF prevention - localhost and local addresses', () => {
    it('rejects localhost', () => {
      expect(validateUrl('https://localhost')).toEqual({
        valid: false,
        error: 'Local addresses are not allowed',
      });
    });

    it('rejects 0.0.0.0', () => {
      expect(validateUrl('https://0.0.0.0')).toEqual({
        valid: false,
        error: 'Local addresses are not allowed',
      });
    });

    it('rejects IPv6 loopback [::1]', () => {
      expect(validateUrl('https://[::1]')).toEqual({
        valid: false,
        error: 'Local addresses are not allowed',
      });
    });
  });

  describe('SSRF prevention - private IP ranges', () => {
    it('rejects 127.0.0.1 (loopback)', () => {
      expect(validateUrl('https://127.0.0.1')).toEqual({
        valid: false,
        error: 'Private network addresses are not allowed',
      });
    });

    it('rejects 10.0.0.1 (Class A private)', () => {
      expect(validateUrl('https://10.0.0.1')).toEqual({
        valid: false,
        error: 'Private network addresses are not allowed',
      });
    });

    it('rejects 192.168.1.1 (Class C private)', () => {
      expect(validateUrl('https://192.168.1.1')).toEqual({
        valid: false,
        error: 'Private network addresses are not allowed',
      });
    });

    it('rejects 172.16.0.1 (Class B private)', () => {
      expect(validateUrl('https://172.16.0.1')).toEqual({
        valid: false,
        error: 'Private network addresses are not allowed',
      });
    });

    it('rejects 169.254.1.1 (link-local)', () => {
      expect(validateUrl('https://169.254.1.1')).toEqual({
        valid: false,
        error: 'Private network addresses are not allowed',
      });
    });
  });

  describe('SSRF prevention - IP encoding bypasses', () => {
    it('rejects decimal IP (2130706433 = 127.0.0.1)', () => {
      expect(validateUrl('http://2130706433')).toEqual({
        valid: false,
        error: 'Numeric IP addresses are not allowed',
      });
    });

    it('rejects hex IP (0x7f000001 = 127.0.0.1)', () => {
      expect(validateUrl('http://0x7f000001')).toEqual({
        valid: false,
        error: 'Hex IP addresses are not allowed',
      });
    });
  });

  describe('shell metacharacter rejection', () => {
    it('rejects semicolons', () => {
      expect(validateUrl('https://example.com;rm -rf /')).toEqual({
        valid: false,
        error: 'URL contains invalid characters',
      });
    });

    it('rejects pipe characters', () => {
      expect(validateUrl('https://example.com|cat /etc/passwd')).toEqual({
        valid: false,
        error: 'URL contains invalid characters',
      });
    });

    it('rejects dollar-sign command substitution', () => {
      expect(validateUrl('https://example.com$(whoami)')).toEqual({
        valid: false,
        error: 'URL contains invalid characters',
      });
    });

    it('rejects backtick command substitution', () => {
      expect(validateUrl('https://example.com`whoami`')).toEqual({
        valid: false,
        error: 'URL contains invalid characters',
      });
    });

    it('rejects ampersand', () => {
      const result = validateUrl('https://example.com&id');
      expect(result).toEqual({
        valid: false,
        error: 'URL contains invalid characters',
      });
    });
  });
});
