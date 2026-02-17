import { useCallback } from 'react';
import { useTheme } from './context';
import type { BrandColor, BrandSettings } from './types';

export function ColorsSection({
  colors,
  updateSettings,
}: {
  colors: BrandColor[];
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  const theme = useTheme();

  const addColor = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        { id: crypto.randomUUID(), name: '', hex: '#6C5CE7' },
      ],
    }));
  }, [updateSettings]);

  const updateColor = useCallback(
    (id: string, field: keyof Omit<BrandColor, 'id'>, value: string) => {
      updateSettings((prev) => ({
        ...prev,
        colors: prev.colors.map((c) =>
          c.id === id ? { ...c, [field]: value } : c,
        ),
      }));
    },
    [updateSettings],
  );

  const removeColor = useCallback(
    (id: string) => {
      updateSettings((prev) => ({
        ...prev,
        colors: prev.colors.filter((c) => c.id !== id),
      }));
    },
    [updateSettings],
  );

  if (colors.length === 0) {
    return (
      <div className="bg-plugin-section">
        <div className="bg-plugin-empty">
          No brand colors yet. Add your first color to get started.
        </div>
        <button
          className="bg-plugin-add-btn"
          onClick={addColor}
          style={{ borderColor: theme.border }}
        >
          + Add Color
        </button>
      </div>
    );
  }

  return (
    <div className="bg-plugin-section">
      {colors.map((color) => (
        <div key={color.id} className="bg-plugin-row">
          <div className="bg-plugin-swatch-wrapper">
            <div
              className="bg-plugin-swatch"
              style={{ background: color.hex }}
            />
            <input
              type="color"
              className="bg-plugin-swatch-input"
              value={color.hex}
              onChange={(e) => updateColor(color.id, 'hex', e.target.value.toUpperCase())}
            />
          </div>
          <input
            className="bg-plugin-input bg-plugin-input--name"
            placeholder="Color name"
            value={color.name}
            onChange={(e) => updateColor(color.id, 'name', e.target.value)}
            style={{ borderColor: theme.border }}
          />
          <input
            className="bg-plugin-input bg-plugin-input--hex"
            placeholder="#000000"
            value={color.hex}
            onChange={(e) => {
              let v = e.target.value.toUpperCase();
              if (!v.startsWith('#')) v = '#' + v;
              if (v.length <= 7) updateColor(color.id, 'hex', v);
            }}
            style={{ borderColor: theme.border }}
          />
          <button
            className="bg-plugin-delete-btn"
            onClick={() => removeColor(color.id)}
            title="Remove color"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="bg-plugin-add-btn"
        onClick={addColor}
        style={{ borderColor: theme.border }}
      >
        + Add Color
      </button>
    </div>
  );
}
