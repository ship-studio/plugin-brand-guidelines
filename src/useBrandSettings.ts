import { useState, useEffect, useCallback, useRef } from 'react';
import { usePluginStorage } from './context';
import type { BrandSettings } from './types';

const DEFAULT_SETTINGS: BrandSettings = {
  colors: [],
  fonts: [],
  voiceNotes: '',
  assets: [],
  targetFile: 'CLAUDE.md',
  lastExportedHash: '',
};

export function useBrandSettings() {
  const storage = usePluginStorage();
  const [settings, setSettings] = useState<BrandSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSettings = useRef(settings);

  latestSettings.current = settings;

  // Load on mount
  useEffect(() => {
    storage.read().then((data) => {
      if (data.brandSettings && typeof data.brandSettings === 'object') {
        setSettings({ ...DEFAULT_SETTINGS, ...(data.brandSettings as Partial<BrandSettings>) });
      }
      setLoaded(true);
    });
  }, []);

  // Debounced auto-save
  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      storage.write({ brandSettings: latestSettings.current as unknown as Record<string, unknown> });
      setDirty(false);
    }, 500);
  }, [storage]);

  const updateSettings = useCallback(
    (updater: (prev: BrandSettings) => BrandSettings) => {
      setSettings((prev) => {
        const next = updater(prev);
        latestSettings.current = next;
        setDirty(true);
        return next;
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  // Update lastExportedHash without triggering dirty
  const setLastExportedHash = useCallback(
    (hash: string) => {
      setSettings((prev) => {
        const next = { ...prev, lastExportedHash: hash };
        latestSettings.current = next;
        return next;
      });
      // Save immediately
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        storage.write({ brandSettings: latestSettings.current as unknown as Record<string, unknown> });
      }, 100);
    },
    [storage],
  );

  return { settings, updateSettings, setLastExportedHash, loaded, dirty };
}
