import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from './context';
import { validateUrl } from './urlValidation';

interface UrlInputViewProps {
  onExtract: (url: string) => void;
  initialUrl?: string;
}

export function UrlInputView({ onExtract, initialUrl }: UrlInputViewProps) {
  const theme = useTheme();
  const [value, setValue] = useState(initialUrl || '');
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasTyped, setHasTyped] = useState(false);
  const [validated, setValidated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runValidation = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) {
        setError(undefined);
        setValidated(false);
        return;
      }
      const result = validateUrl(trimmed);
      setError(result.valid ? undefined : result.error);
      setValidated(true);
    },
    [],
  );

  // Validate initialUrl on mount if provided
  useEffect(() => {
    if (initialUrl) {
      setHasTyped(true);
      runValidation(initialUrl);
    }
  }, []);

  const handleChange = (input: string) => {
    setValue(input);
    if (!hasTyped) setHasTyped(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runValidation(input);
    }, 300);
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || error || !validated) return;
    onExtract(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isDisabled = !value.trim() || !!error || !validated;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <input
          className="bg-plugin-input"
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          style={{
            borderColor: hasTyped && error ? theme.error : theme.border,
            color: theme.textPrimary,
            width: '100%',
          }}
        />
        {hasTyped && error && (
          <div className="bg-plugin-url-hint" style={{ color: theme.error }}>
            {error}
          </div>
        )}
      </div>
      <button
        className="bg-plugin-extract-btn"
        onClick={handleSubmit}
        disabled={isDisabled}
        style={{
          backgroundColor: theme.action,
          color: theme.actionText,
          width: '100%',
        }}
      >
        Extract Brand
      </button>
    </div>
  );
}
