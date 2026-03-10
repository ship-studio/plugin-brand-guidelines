/**
 * Filters a usage summary string by removing sentences that reference
 * any of the deselected tokens (by name or value).
 */
export function filterUsageSummary(
  summary: string,
  deselectedTokens: Array<{ name: string; value: string }>,
): string {
  if (!summary || deselectedTokens.length === 0) return summary;

  // Split into sentences at sentence-ending punctuation followed by whitespace
  const sentences = summary.split(/(?<=[.!?])\s+/);

  const filtered = sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return !deselectedTokens.some(
      (token) =>
        lower.includes(token.name.toLowerCase()) ||
        lower.includes(token.value.toLowerCase()),
    );
  });

  return filtered.join(' ').trim();
}
