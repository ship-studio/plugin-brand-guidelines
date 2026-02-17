import { useCallback } from 'react';
import { useTheme } from './context';
import type { BrandFont, BrandSettings } from './types';

export function FontsSection({
  fonts,
  updateSettings,
}: {
  fonts: BrandFont[];
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  const theme = useTheme();

  const addFont = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      fonts: [
        ...prev.fonts,
        { id: crypto.randomUUID(), role: '', value: '' },
      ],
    }));
  }, [updateSettings]);

  const updateFont = useCallback(
    (id: string, field: keyof Omit<BrandFont, 'id'>, value: string) => {
      updateSettings((prev) => ({
        ...prev,
        fonts: prev.fonts.map((f) =>
          f.id === id ? { ...f, [field]: value } : f,
        ),
      }));
    },
    [updateSettings],
  );

  const removeFont = useCallback(
    (id: string) => {
      updateSettings((prev) => ({
        ...prev,
        fonts: prev.fonts.filter((f) => f.id !== id),
      }));
    },
    [updateSettings],
  );

  if (fonts.length === 0) {
    return (
      <div className="bg-plugin-section">
        <div className="bg-plugin-empty">
          No brand fonts yet. Add your first font to get started.
        </div>
        <button
          className="bg-plugin-add-btn"
          onClick={addFont}
          style={{ borderColor: theme.border }}
        >
          + Add Font
        </button>
      </div>
    );
  }

  return (
    <div className="bg-plugin-section">
      {fonts.map((font) => (
        <div key={font.id} className="bg-plugin-row">
          <input
            className="bg-plugin-input"
            placeholder="Role (e.g. Heading)"
            value={font.role}
            onChange={(e) => updateFont(font.id, 'role', e.target.value)}
            style={{ borderColor: theme.border, flex: '0 0 120px' }}
          />
          <input
            className="bg-plugin-input"
            placeholder="Font (e.g. Inter)"
            value={font.value}
            onChange={(e) => updateFont(font.id, 'value', e.target.value)}
            style={{ borderColor: theme.border }}
          />
          <button
            className="bg-plugin-delete-btn"
            onClick={() => removeFont(font.id)}
            title="Remove font"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="bg-plugin-add-btn"
        onClick={addFont}
        style={{ borderColor: theme.border }}
      >
        + Add Font
      </button>
    </div>
  );
}
