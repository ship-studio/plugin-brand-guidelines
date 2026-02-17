import { useCallback } from 'react';
import { useTheme } from './context';
import type { BrandAsset, BrandSettings } from './types';

export function AssetsSection({
  assets,
  updateSettings,
}: {
  assets: BrandAsset[];
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  const theme = useTheme();

  const addAsset = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      assets: [
        ...prev.assets,
        { id: crypto.randomUUID(), label: '', path: '' },
      ],
    }));
  }, [updateSettings]);

  const updateAsset = useCallback(
    (id: string, field: keyof Omit<BrandAsset, 'id'>, value: string) => {
      updateSettings((prev) => ({
        ...prev,
        assets: prev.assets.map((a) =>
          a.id === id ? { ...a, [field]: value } : a,
        ),
      }));
    },
    [updateSettings],
  );

  const removeAsset = useCallback(
    (id: string) => {
      updateSettings((prev) => ({
        ...prev,
        assets: prev.assets.filter((a) => a.id !== id),
      }));
    },
    [updateSettings],
  );

  if (assets.length === 0) {
    return (
      <div className="bg-plugin-section">
        <div className="bg-plugin-empty">
          No brand assets yet. Add your first asset to get started.
        </div>
        <button
          className="bg-plugin-add-btn"
          onClick={addAsset}
          style={{ borderColor: theme.border }}
        >
          + Add Asset
        </button>
      </div>
    );
  }

  return (
    <div className="bg-plugin-section">
      {assets.map((asset) => (
        <div key={asset.id} className="bg-plugin-row">
          <input
            className="bg-plugin-input"
            placeholder="Label (e.g. Logo)"
            value={asset.label}
            onChange={(e) => updateAsset(asset.id, 'label', e.target.value)}
            style={{ borderColor: theme.border, flex: '0 0 140px' }}
          />
          <input
            className="bg-plugin-input"
            placeholder="Path (e.g. public/logo.svg)"
            value={asset.path}
            onChange={(e) => updateAsset(asset.id, 'path', e.target.value)}
            style={{ borderColor: theme.border }}
          />
          <button
            className="bg-plugin-delete-btn"
            onClick={() => removeAsset(asset.id)}
            title="Remove asset"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="bg-plugin-add-btn"
        onClick={addAsset}
        style={{ borderColor: theme.border }}
      >
        + Add Asset
      </button>
    </div>
  );
}
