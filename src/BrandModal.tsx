import { useState, useEffect } from 'react';
import { useTheme } from './context';
import { Modal } from './Modal';
import { ColorsSection } from './ColorsSection';
import { FontsSection } from './FontsSection';
import { VoiceSection } from './VoiceSection';
import { AssetsSection } from './AssetsSection';
import { ExportFooter } from './ExportFooter';
import { UrlInputView } from './UrlInputView';
import { ExtractionView } from './ExtractionView';
import { useBrandSettings } from './useBrandSettings';
import { useFileSync } from './useFileSync';
import { useUrlFetch } from './useUrlFetch';
import { hasBrandData } from './markdown';

type Tab = 'colors' | 'fonts' | 'voice' | 'assets';
type ModalView = 'url-cta' | 'tabs' | 'url-inline' | 'extracting';

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
  const { state: fetchState, startExtraction, cancel, reset, result } = useUrlFetch();

  const hasData = loaded && hasBrandData(settings);
  const [view, setView] = useState<ModalView>('tabs');
  const [lastUrl, setLastUrl] = useState('');

  // Set initial view once settings are loaded
  useEffect(() => {
    if (loaded) {
      setView(hasBrandData(settings) ? 'tabs' : 'url-cta');
    }
  }, [loaded]);

  // Check sync on mount and when settings change
  useEffect(() => {
    if (loaded) checkSync();
  }, [loaded, settings.colors, settings.fonts, settings.voiceNotes, settings.assets, settings.targetFile, settings.lastExportedHash]);

  // Watch fetch state for completion
  useEffect(() => {
    if (fetchState.status === 'done') {
      // result.analysis contains AI-analyzed colors/fonts/voiceNotes (Phase 3 will add review flow)
      setView('tabs');
    }
    // error state: stay on extracting view (ExtractionView handles error display)
  }, [fetchState.status]);

  const handleExtract = (url: string) => {
    setLastUrl(url);
    setView('extracting');
    startExtraction(url);
  };

  const handleCancel = () => {
    cancel();
    if (lastUrl) {
      // Return to appropriate URL input view with pre-filled URL
      setView(hasData ? 'url-inline' : 'url-cta');
    } else {
      setView(hasData ? 'tabs' : 'url-cta');
    }
  };

  if (!loaded) {
    return (
      <Modal onClose={onClose} title="Brand Guidelines">
        <div className="bg-plugin-modal-body">
          <div className="bg-plugin-empty">Loading...</div>
        </div>
      </Modal>
    );
  }

  // URL CTA view (empty state)
  if (view === 'url-cta') {
    return (
      <Modal onClose={onClose} title="Brand Guidelines">
        <div className="bg-plugin-url-cta">
          <div className="bg-plugin-url-cta-headline" style={{ color: theme.textPrimary }}>
            Start from a URL
          </div>
          <div className="bg-plugin-url-cta-subtext" style={{ color: theme.textMuted }}>
            Enter a website URL to extract brand colors, fonts, and voice
          </div>
          <div className="bg-plugin-url-input-wrapper">
            <UrlInputView onExtract={handleExtract} initialUrl={lastUrl || undefined} />
          </div>
          <button
            className="bg-plugin-url-cta-manual"
            onClick={() => setView('tabs')}
          >
            Or set up manually
          </button>
        </div>
      </Modal>
    );
  }

  // Extracting view
  if (view === 'extracting') {
    return (
      <Modal onClose={onClose} title="Brand Guidelines">
        <div className="bg-plugin-extraction">
          <ExtractionView state={fetchState} onCancel={handleCancel} />
        </div>
      </Modal>
    );
  }

  // Header action button (globe icon for URL input)
  const headerUrlButton = hasData ? (
    <button
      className="bg-plugin-header-action"
      onClick={() => setView(view === 'url-inline' ? 'tabs' : 'url-inline')}
      title="Extract from URL"
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </button>
  ) : null;

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
    <Modal
      onClose={onClose}
      title="Brand Guidelines"
      footer={footer}
      headerActions={headerUrlButton}
    >
      {/* Inline URL bar (url-inline view) */}
      {view === 'url-inline' && (
        <div
          className="bg-plugin-url-bar"
          style={{ borderBottomColor: theme.border }}
        >
          <div style={{ flex: 1 }}>
            <UrlInputView onExtract={handleExtract} initialUrl={lastUrl || undefined} />
          </div>
          <button
            className="bg-plugin-header-action"
            onClick={() => setView('tabs')}
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
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
