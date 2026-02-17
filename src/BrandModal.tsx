import { useState, useEffect } from 'react';
import { useTheme } from './context';
import { Modal } from './Modal';
import { ColorsSection } from './ColorsSection';
import { FontsSection } from './FontsSection';
import { VoiceSection } from './VoiceSection';
import { AssetsSection } from './AssetsSection';
import { ExportFooter } from './ExportFooter';
import { useBrandSettings } from './useBrandSettings';
import { useFileSync } from './useFileSync';

type Tab = 'colors' | 'fonts' | 'voice' | 'assets';

const TABS: { key: Tab; label: string }[] = [
  { key: 'colors', label: 'Colors' },
  { key: 'fonts', label: 'Fonts' },
  { key: 'voice', label: 'Voice' },
  { key: 'assets', label: 'Assets' },
];

export function BrandModal({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('colors');
  const { settings, updateSettings, setLastExportedHash, loaded } =
    useBrandSettings();
  const { syncStatus, checkSync, exportToFile, exporting } = useFileSync(
    settings,
    setLastExportedHash,
  );

  // Check sync on mount and when settings change
  useEffect(() => {
    if (loaded) checkSync();
  }, [loaded, settings.colors, settings.fonts, settings.voiceNotes, settings.assets, settings.targetFile, settings.lastExportedHash]);

  if (!loaded) {
    return (
      <Modal onClose={onClose} title="Brand Guidelines">
        <div className="bg-plugin-modal-body">
          <div className="bg-plugin-empty">Loading...</div>
        </div>
      </Modal>
    );
  }

  const footer = (
    <ExportFooter
      settings={settings}
      updateSettings={updateSettings}
      syncStatus={syncStatus}
      exporting={exporting}
      onExport={exportToFile}
    />
  );

  return (
    <Modal onClose={onClose} title="Brand Guidelines" footer={footer}>
      <div
        className="bg-plugin-tabs"
        style={{ borderBottomColor: theme.border }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`bg-plugin-tab${activeTab === tab.key ? ' bg-plugin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-plugin-modal-body">
        {activeTab === 'colors' && (
          <ColorsSection
            colors={settings.colors}
            updateSettings={updateSettings}
          />
        )}
        {activeTab === 'fonts' && (
          <FontsSection
            fonts={settings.fonts}
            updateSettings={updateSettings}
          />
        )}
        {activeTab === 'voice' && (
          <VoiceSection
            voiceNotes={settings.voiceNotes}
            updateSettings={updateSettings}
          />
        )}
        {activeTab === 'assets' && (
          <AssetsSection
            assets={settings.assets}
            updateSettings={updateSettings}
          />
        )}
      </div>
    </Modal>
  );
}
