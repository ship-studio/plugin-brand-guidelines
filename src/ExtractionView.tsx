import { useState } from 'react';
import { useTheme } from './context';
import type { ExtractionState } from './useUrlFetch';

interface ExtractionViewProps {
  state: ExtractionState;
  onCancel: () => void;
}

export function ExtractionView({ state, onCancel }: ExtractionViewProps) {
  const theme = useTheme();
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="bg-plugin-extraction-domain">
        Extracting from {state.domain}
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {state.steps.map((step) => (
          <div key={step.id} className="bg-plugin-step">
            {/* Status indicator */}
            <span className="bg-plugin-step-icon">
              {step.status === 'done' && (
                <span style={{ color: theme.success }}>&#10003;</span>
              )}
              {step.status === 'active' && (
                <span
                  className="bg-plugin-pulse"
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.accent,
                  }}
                />
              )}
              {step.status === 'error' && (
                <span style={{ color: theme.error }}>&#10007;</span>
              )}
              {step.status === 'pending' && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.textMuted,
                  }}
                />
              )}
            </span>

            {/* Content */}
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
                }}
              >
                {step.label}
              </div>
              {step.detail && step.status === 'active' && (
                <div className="bg-plugin-step-detail">
                  {step.detail}
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
        >
          Cancel
        </button>
      )}
    </div>
  );
}
