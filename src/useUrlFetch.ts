import { useState, useRef, useCallback } from 'react';
import { useShell } from './context';
import { fetchHtml, fetchCss, extractStylesheetUrls, detectBotProtection } from './fetchUtils';
import { extractColors, extractFonts, extractRadii, extractSpacing, extractVisibleText, extractEmbeddedStyles } from './tokenExtraction';
import { analyzeTokens, type AnalysisResult } from './analyzeTokens';

export interface ExtractionStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
  detail?: string;
}

export interface ExtractionState {
  status: 'idle' | 'extracting' | 'done' | 'error';
  steps: ExtractionStep[];
  domain: string;
  error?: { headline: string; detail: string };
}

export interface FetchResult {
  html: string;
  css: string[]; // Array of CSS content strings
  url: string;
}

export interface ExtractionResult extends FetchResult {
  analysis: AnalysisResult;
}

const INITIAL_STATE: ExtractionState = {
  status: 'idle',
  steps: [],
  domain: '',
};

function makeSteps(): ExtractionStep[] {
  return [
    { id: 'fetch', label: 'Fetching page...', status: 'pending' },
    { id: 'css', label: 'Loading stylesheets...', status: 'pending' },
    { id: 'analyze', label: 'Analyzing design tokens...', status: 'pending' },
  ];
}

function updateStep(
  steps: ExtractionStep[],
  id: string,
  update: Partial<ExtractionStep>,
): ExtractionStep[] {
  return steps.map((s) => (s.id === id ? { ...s, ...update } : s));
}

/**
 * Map known error messages to user-friendly headlines.
 */
function mapError(err: unknown): { headline: string; detail: string } {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes('took too long')) {
    return { headline: 'Connection timed out', detail: message };
  }
  if (message.includes('too large')) {
    return { headline: 'Page too large to process', detail: message };
  }

  if (message.includes('AI analysis failed') || message.includes('Failed to parse AI')) {
    return { headline: 'Could not analyze design tokens', detail: message };
  }

  return { headline: 'Could not fetch page', detail: message };
}

export function useUrlFetch() {
  const shell = useShell();
  const [state, setState] = useState<ExtractionState>(INITIAL_STATE);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const cancelledRef = useRef(false);

  const startExtraction = useCallback(
    async (url: string) => {
      cancelledRef.current = false;
      setResult(null);

      let domain: string;
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = url;
      }

      const steps = makeSteps();
      setState({ status: 'extracting', steps, domain });

      try {
        // Step 1: Fetch page
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, 'fetch', { status: 'active' }),
        }));

        const { html, headers } = await fetchHtml(shell, url);

        if (cancelledRef.current) return;

        // Check for bot protection
        const botCheck = detectBotProtection(html, headers);
        if (botCheck.isBlocked) {
          setState((prev) => ({
            ...prev,
            status: 'error',
            steps: updateStep(prev.steps, 'fetch', { status: 'error' }),
            error: {
              headline: 'Site may be bot-protected',
              detail: botCheck.detail || `Protected by ${botCheck.provider || 'unknown provider'}`,
            },
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, 'fetch', { status: 'done' }),
        }));

        // Step 2: Load stylesheets
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, 'css', { status: 'active' }),
        }));

        const cssUrls = extractStylesheetUrls(html, url);
        const cssContents: string[] = [];

        for (let i = 0; i < cssUrls.length; i++) {
          if (cancelledRef.current) return;

          setState((prev) => ({
            ...prev,
            steps: updateStep(prev.steps, 'css', {
              detail: `Loading stylesheets (${i + 1}/${cssUrls.length})...`,
            }),
          }));

          try {
            const css = await fetchCss(shell, cssUrls[i]);
            cssContents.push(css);
          } catch {
            // Skip failures silently -- some CSS files may 404
          }
        }

        if (cancelledRef.current) return;

        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, 'css', { status: 'done', detail: undefined }),
        }));

        // Step 3: Analyze design tokens with AI
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, 'analyze', { status: 'active' }),
        }));

        const allCss = [...cssContents, ...extractEmbeddedStyles(html)];
        const rawColors = extractColors(allCss);
        const fontNames = extractFonts(allCss);
        const rawRadii = extractRadii(allCss);
        const rawSpacing = extractSpacing(allCss);
        const visibleText = extractVisibleText(html);
        const analysis = await analyzeTokens(shell, rawColors, fontNames, visibleText, rawRadii, rawSpacing);

        if (cancelledRef.current) return;

        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, 'analyze', { status: 'done' }),
        }));

        // Done
        const extractionResult: ExtractionResult = { html, css: cssContents, url, analysis };
        setResult(extractionResult);
        setState((prev) => ({ ...prev, status: 'done' }));
      } catch (err) {
        if (cancelledRef.current) return;

        const error = mapError(err);

        setState((prev) => {
          // Find the active step and mark it as error
          const activeStep = prev.steps.find((s) => s.status === 'active');
          const updatedSteps = activeStep
            ? updateStep(prev.steps, activeStep.id, { status: 'error' })
            : prev.steps;

          return { ...prev, status: 'error', steps: updatedSteps, error };
        });
      }
    },
    [shell],
  );

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setState(INITIAL_STATE);
    setResult(null);
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setResult(null);
  }, []);

  return { state, startExtraction, cancel, reset, result };
}
