import type { BrandSettings } from './types';

const START_MARKER = '<!-- BRAND-GUIDELINES-START -->';
const END_MARKER = '<!-- BRAND-GUIDELINES-END -->';

/**
 * djb2 hash — simple, fast, deterministic string hash.
 */
export function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

/**
 * Generate the brand guidelines markdown section (without markers).
 */
export function generateBrandMarkdown(settings: BrandSettings): string {
  const sections: string[] = [];

  // Colors
  const validColors = settings.colors.filter((c) => c.name && c.hex);
  if (validColors.length > 0) {
    sections.push(
      '### Colors\n\n' +
        validColors.map((c) => `- **${c.name}**: \`${c.hex}\``).join('\n'),
    );
  }

  // Fonts
  const validFonts = settings.fonts.filter((f) => f.role && f.value);
  if (validFonts.length > 0) {
    sections.push(
      '### Fonts\n\n' +
        validFonts.map((f) => `- **${f.role}**: ${f.value}`).join('\n'),
    );
  }

  // Voice
  if (settings.voiceNotes.trim()) {
    sections.push('### Voice & Tone\n\n' + settings.voiceNotes.trim());
  }

  // Assets
  const validAssets = settings.assets.filter((a) => a.label && a.path);
  if (validAssets.length > 0) {
    sections.push(
      '### Assets\n\n' +
        validAssets.map((a) => `- **${a.label}**: \`${a.path}\``).join('\n'),
    );
  }

  if (sections.length === 0) return '';

  return '## Brand Guidelines\n\n' + sections.join('\n\n');
}

/**
 * Wrap content with section markers.
 */
export function wrapWithMarkers(content: string): string {
  return `${START_MARKER}\n${content}\n${END_MARKER}`;
}

/**
 * Check if file content has both markers.
 */
export function hasMarkers(fileContent: string): boolean {
  return fileContent.includes(START_MARKER) && fileContent.includes(END_MARKER);
}

/**
 * Extract content between markers (exclusive of markers themselves).
 */
export function extractBetweenMarkers(fileContent: string): string | null {
  const startIdx = fileContent.indexOf(START_MARKER);
  const endIdx = fileContent.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;
  return fileContent.slice(startIdx + START_MARKER.length + 1, endIdx).trimEnd();
}

/**
 * Replace content between markers (inclusive), preserving surrounding content.
 */
export function replaceMarkerSection(
  fileContent: string,
  newSection: string,
): string {
  const startIdx = fileContent.indexOf(START_MARKER);
  const endIdx = fileContent.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    // Fallback: append
    return fileContent.trimEnd() + '\n\n' + newSection + '\n';
  }
  const before = fileContent.slice(0, startIdx);
  const after = fileContent.slice(endIdx + END_MARKER.length);
  return before + newSection + after;
}

/**
 * Build the full file content for the 3 write cases:
 * 1. File doesn't exist → just the section
 * 2. File exists, no markers → append
 * 3. File exists, has markers → replace
 */
export function buildFileContent(
  existingContent: string | null,
  brandMarkdown: string,
): string {
  const wrappedSection = wrapWithMarkers(brandMarkdown);

  // Case 1: no existing file
  if (existingContent === null) {
    return wrappedSection + '\n';
  }

  // Case 3: has markers → replace
  if (hasMarkers(existingContent)) {
    return replaceMarkerSection(existingContent, wrappedSection);
  }

  // Case 2: exists but no markers → append
  return existingContent.trimEnd() + '\n\n' + wrappedSection + '\n';
}

/**
 * Check if there is any brand data worth exporting.
 */
export function hasBrandData(settings: BrandSettings): boolean {
  return (
    settings.colors.some((c) => c.name && c.hex) ||
    settings.fonts.some((f) => f.role && f.value) ||
    settings.voiceNotes.trim().length > 0 ||
    settings.assets.some((a) => a.label && a.path)
  );
}
