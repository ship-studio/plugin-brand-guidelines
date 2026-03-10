import { useState, useEffect, useRef } from 'react';
import { useTheme } from './context';
import type { ExtractionState } from './useUrlFetch';

interface ExtractionViewProps {
  state: ExtractionState;
  onCancel: () => void;
}

const ANALYZE_HINTS = [
  'Reading design tokens...',
  'Identifying brand colors...',
  'Classifying fonts...',
  'Analyzing voice & tone...',
  'Generating usage guidance...',
  'Almost there...',
];

export function ExtractionView({ state, onCancel }: ExtractionViewProps) {
  const theme = useTheme();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const analyzeStep = state.steps.find((s) => s.id === 'analyze');
  const isAnalyzing = analyzeStep?.status === 'active';

  // Elapsed timer while analyzing
  useEffect(() => {
    if (isAnalyzing) {
      setElapsed(0);
      setHintIndex(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    clearInterval(timerRef.current);
  }, [isAnalyzing]);

  // Cycle through hints every 8 seconds
  useEffect(() => {
    if (isAnalyzing && elapsed > 0 && elapsed % 8 === 0) {
      setHintIndex((prev) => Math.min(prev + 1, ANALYZE_HINTS.length - 1));
    }
  }, [isAnalyzing, elapsed]);

  const doneCount = state.steps.filter((s) => s.status === 'done').length;
  const total = state.steps.length;
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="bg-plugin-extraction-view">
      {/* Progress bar */}
      <div className="bg-plugin-extraction-progress-track" style={{ backgroundColor: theme.bgTertiary }}>
        <div
          className="bg-plugin-extraction-progress-fill"
          style={{
            width: `${progressPct}%`,
            backgroundColor: theme.action,
          }}
        />
      </div>

      {/* Domain label */}
      <div className="bg-plugin-extraction-domain" style={{ color: theme.textMuted }}>
        Extracting from {state.domain}
      </div>

      {/* Steps */}
      <div className="bg-plugin-extraction-steps">
        {state.steps.map((step) => (
          <div key={step.id} className="bg-plugin-step">
            <span className="bg-plugin-step-icon">
              {step.status === 'done' && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="7" fill={theme.success} opacity="0.15" />
                  <path d="M4 7.2L6 9.2L10 5" stroke={theme.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {step.status === 'active' && (
                <span className="bg-plugin-spinner" style={{ borderColor: `${theme.action}33`, borderTopColor: theme.action }} />
              )}
              {step.status === 'error' && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="7" fill={theme.error} opacity="0.15" />
                  <path d="M5 5L9 9M9 5L5 9" stroke={theme.error} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {step.status === 'pending' && (
                <span
                  className="bg-plugin-step-dot"
                  style={{ backgroundColor: theme.textMuted, opacity: 0.3 }}
                />
              )}
            </span>

            <div className="bg-plugin-step-content">
              <div
                className="bg-plugin-step-label"
                style={{
                  color:
                    step.status === 'error'
                      ? theme.error
                      : step.status === 'pending'
                        ? theme.textMuted
                        : theme.textPrimary,
                  fontWeight: step.status === 'active' ? 500 : 400,
                }}
              >
                {step.label}
              </div>
              {step.detail && step.status === 'active' && (
                <div className="bg-plugin-step-detail" style={{ color: theme.textMuted }}>
                  {step.detail}
                </div>
              )}
              {step.id === 'analyze' && step.status === 'active' && (
                <div className="bg-plugin-step-detail" style={{ color: theme.textMuted }}>
                  {ANALYZE_HINTS[hintIndex]}
                  {elapsed > 3 && (
                    <span style={{ marginLeft: 6, opacity: 0.5 }}>
                      {elapsed}s
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Error block */}
      {state.error && (
        <div
          className="bg-plugin-error-block"
          style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
        >
          <div className="bg-plugin-error-headline" style={{ color: theme.error }}>
            {state.error.headline}
          </div>

          <button
            className="bg-plugin-error-toggle"
            onClick={() => setDetailsExpanded(!detailsExpanded)}
          >
            {detailsExpanded ? 'Hide details' : 'Show details'}
          </button>

          {detailsExpanded && (
            <div className="bg-plugin-error-detail">
              {state.error.detail}
            </div>
          )}

          <button
            className="bg-plugin-export-btn"
            onClick={onCancel}
            style={{
              backgroundColor: theme.action,
              color: theme.actionText,
              marginTop: '8px',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Cancel button (only when not in error state) */}
      {!state.error && (
        <button
          className="bg-plugin-cancel-btn"
          onClick={onCancel}
          style={{ color: theme.textMuted }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
