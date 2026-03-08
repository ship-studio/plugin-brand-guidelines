import { useCallback } from 'react';
import { useTheme } from './context';
import type { BrandSpacing, BrandSettings } from './types';

export function SpacingSection({
  spacing,
  updateSettings,
}: {
  spacing: BrandSpacing[];
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  const theme = useTheme();

  const addSpacing = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      spacing: [
        ...prev.spacing,
        { id: crypto.randomUUID(), label: '', value: '' },
      ],
    }));
  }, [updateSettings]);

  const updateSpacing = useCallback(
    (id: string, field: keyof Omit<BrandSpacing, 'id'>, value: string) => {
      updateSettings((prev) => ({
        ...prev,
        spacing: prev.spacing.map((s) =>
          s.id === id ? { ...s, [field]: value } : s,
        ),
      }));
    },
    [updateSettings],
  );

  const removeSpacing = useCallback(
    (id: string) => {
      updateSettings((prev) => ({
        ...prev,
        spacing: prev.spacing.filter((s) => s.id !== id),
      }));
    },
    [updateSettings],
  );

  if (spacing.length === 0) {
    return (
      <div className="bg-plugin-section">
        <div className="bg-plugin-empty">
          No spacing values yet. Add your first spacing value to get started.
        </div>
        <button
          className="bg-plugin-add-btn"
          onClick={addSpacing}
          style={{ borderColor: theme.border }}
        >
          + Add Spacing
        </button>
      </div>
    );
  }

  return (
    <div className="bg-plugin-section">
      {spacing.map((item) => (
        <div key={item.id} className="bg-plugin-row">
          <input
            className="bg-plugin-input bg-plugin-input--name"
            placeholder="Label e.g. Base"
            value={item.label}
            onChange={(e) => updateSpacing(item.id, 'label', e.target.value)}
            style={{ borderColor: theme.border }}
          />
          <input
            className="bg-plugin-input bg-plugin-input--hex"
            placeholder="Value e.g. 16px"
            value={item.value}
            onChange={(e) => updateSpacing(item.id, 'value', e.target.value)}
            style={{ borderColor: theme.border }}
          />
          <button
            className="bg-plugin-delete-btn"
            onClick={() => removeSpacing(item.id)}
            title="Remove spacing"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="bg-plugin-add-btn"
        onClick={addSpacing}
        style={{ borderColor: theme.border }}
      >
        + Add Spacing
      </button>
    </div>
  );
}
