import { useCallback } from 'react';
import { useTheme } from './context';
import type { BrandRadius, BrandSettings } from './types';

export function RadiiSection({
  radii,
  updateSettings,
}: {
  radii: BrandRadius[];
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  const theme = useTheme();

  const addRadius = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      radii: [
        ...prev.radii,
        { id: crypto.randomUUID(), label: '', value: '' },
      ],
    }));
  }, [updateSettings]);

  const updateRadius = useCallback(
    (id: string, field: keyof Omit<BrandRadius, 'id'>, value: string) => {
      updateSettings((prev) => ({
        ...prev,
        radii: prev.radii.map((r) =>
          r.id === id ? { ...r, [field]: value } : r,
        ),
      }));
    },
    [updateSettings],
  );

  const removeRadius = useCallback(
    (id: string) => {
      updateSettings((prev) => ({
        ...prev,
        radii: prev.radii.filter((r) => r.id !== id),
      }));
    },
    [updateSettings],
  );

  if (radii.length === 0) {
    return (
      <div className="bg-plugin-section">
        <div className="bg-plugin-empty">
          No border radii yet. Add your first radius to get started.
        </div>
        <button
          className="bg-plugin-add-btn"
          onClick={addRadius}
          style={{ borderColor: theme.border }}
        >
          + Add Radius
        </button>
      </div>
    );
  }

  return (
    <div className="bg-plugin-section">
      {radii.map((radius) => (
        <div key={radius.id} className="bg-plugin-row">
          <input
            className="bg-plugin-input bg-plugin-input--name"
            placeholder="Label e.g. Card"
            value={radius.label}
            onChange={(e) => updateRadius(radius.id, 'label', e.target.value)}
            style={{ borderColor: theme.border }}
          />
          <input
            className="bg-plugin-input bg-plugin-input--hex"
            placeholder="Value e.g. 8px"
            value={radius.value}
            onChange={(e) => updateRadius(radius.id, 'value', e.target.value)}
            style={{ borderColor: theme.border }}
          />
          <button
            className="bg-plugin-delete-btn"
            onClick={() => removeRadius(radius.id)}
            title="Remove radius"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="bg-plugin-add-btn"
        onClick={addRadius}
        style={{ borderColor: theme.border }}
      >
        + Add Radius
      </button>
    </div>
  );
}
