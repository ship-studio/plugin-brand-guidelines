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
      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
        Extracting from {state.domain}
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {state.steps.map((step) => (
          <div key={step.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Status indicator */}
              {step.status === 'done' && (
                <span style={{ color: theme.success, fontSize: '14px', width: '18px', textAlign: 'center' }}>
                  &#10003;
                </span>
              )}
              {step.status === 'active' && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.accent,
                    marginLeft: '5px',
                    marginRight: '5px',
                    animation: 'bgPulse 1.2s ease-in-out infinite',
                  }}
                />
              )}
              {step.status === 'error' && (
                <span style={{ color: theme.error, fontSize: '14px', width: '18px', textAlign: 'center' }}>
                  &#10007;
                </span>
              )}
              {step.status === 'pending' && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.textMuted,
                    marginLeft: '5px',
                    marginRight: '5px',
                  }}
                />
              )}

              {/* Label */}
              <span
                style={{
                  fontSize: '13px',
                  color:
                    step.status === 'error'
                      ? theme.error
                      : step.status === 'active'
                        ? theme.textPrimary
                        : step.status === 'done'
                          ? theme.textPrimary
                          : theme.textMuted,
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Detail text for active step */}
            {step.detail && step.status === 'active' && (
              <span
                style={{
                  fontSize: '11px',
                  color: theme.textMuted,
                  paddingLeft: '26px',
                }}
              >
                {step.detail}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Error block */}
      {state.error && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: theme.bgTertiary,
          }}
        >
          <div style={{ color: theme.error, fontSize: '13px', fontWeight: 500 }}>
            {state.error.headline}
          </div>

          <button
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textMuted,
              fontSize: '11px',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
              textDecoration: 'underline',
            }}
          >
            {detailsExpanded ? 'Hide details' : 'Show details'}
          </button>

          {detailsExpanded && (
            <div
              style={{
                fontSize: '11px',
                color: theme.textMuted,
                lineHeight: '1.5',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {state.error.detail}
            </div>
          )}

          <button
            className="bg-plugin-export-btn"
            onClick={onCancel}
            style={{
              backgroundColor: theme.action,
              color: theme.actionText,
              marginTop: '4px',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Cancel button (only when not in error state -- error has its own Try Again) */}
      {!state.error && (
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textMuted,
            fontSize: '12px',
            cursor: 'pointer',
            padding: '4px 0',
            textAlign: 'center',
          }}
        >
          Cancel
        </button>
      )}

      {/* Pulse animation style */}
      <style>{`
        @keyframes bgPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
