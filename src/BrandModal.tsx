import { useState, useEffect } from 'react';
import { useTheme, useToast } from './context';
import { Modal } from './Modal';
import { ColorsSection } from './ColorsSection';
import { FontsSection } from './FontsSection';
import { VoiceSection } from './VoiceSection';
import { AssetsSection } from './AssetsSection';
import { RadiiSection } from './RadiiSection';
import { SpacingSection } from './SpacingSection';
import { ExportFooter } from './ExportFooter';
import { UrlInputView } from './UrlInputView';
import { ExtractionView } from './ExtractionView';
import { ReviewView } from './ReviewView';
import { useBrandSettings } from './useBrandSettings';
import { useFileSync } from './useFileSync';
import { useUrlFetch } from './useUrlFetch';
import { mergeTokens } from './reviewMerge';
import { hasBrandData } from './markdown';
import type { UsageSummaries } from './analyzeTokens';
import type { BrandColor, BrandFont, BrandRadius, BrandSpacing } from './types';

const USAGE_SUMMARY_TABS: Record<string, keyof UsageSummaries> = {
  colors: 'colors',
  fonts: 'fonts',
  radii: 'radii',
  spacing: 'spacing',
};

type Tab = 'colors' | 'fonts' | 'voice' | 'assets' | 'radii' | 'spacing';
type ModalView = 'url-cta' | 'tabs' | 'url-inline' | 'extracting' | 'review';

const TABS: { key: Tab; label: string }[] = [
  { key: 'colors', label: 'Colors' },
  { key: 'fonts', label: 'Fonts' },
  { key: 'voice', label: 'Voice' },
  { key: 'assets', label: 'Assets' },
  { key: 'radii', label: 'Radii' },
  { key: 'spacing', label: 'Spacing' },
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

  const showToast = useToast();
  const hasData = loaded && hasBrandData(settings);
  const [view, setView] = useState<ModalView>('tabs');
  const [lastUrl, setLastUrl] = useState('');
  const [confirmAction, setConfirmAction] = useState<'try-another' | 'discard' | null>(null);

  // Set initial view once settings are loaded
  useEffect(() => {
    if (loaded) {
      setView(hasBrandData(settings) ? 'tabs' : 'url-cta');
    }
  }, [loaded]);

  // Check sync on mount and when settings change
  useEffect(() => {
    if (loaded) checkSync();
  }, [loaded, settings.colors, settings.fonts, settings.voiceNotes, settings.assets, settings.radii, settings.spacing, settings.targetFile, settings.lastExportedHash]);

  // Watch fetch state for completion
  useEffect(() => {
    if (fetchState.status === 'done') {
      setView('review');
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

  const handleApply = (colors: BrandColor[], fonts: BrandFont[], voiceNotes: string | null, radii: BrandRadius[], spacing: BrandSpacing[], usageSummaries: UsageSummaries) => {
    updateSettings(prev => mergeTokens(prev, { colors, fonts, voiceNotes, radii, spacing, usageSummaries }));

    const parts: string[] = [];
    if (colors.length) parts.push(`${colors.length} colors`);
    if (fonts.length) parts.push(`${fonts.length} fonts`);
    if (voiceNotes) parts.push('voice notes');
    if (radii.length) parts.push(`${radii.length} radii`);
    if (spacing.length) parts.push(`${spacing.length} spacing`);
    showToast(`Applied ${parts.join(', ')}`, 'success');

    reset();
    setView('tabs');
  };

  const handleTryAnother = () => setConfirmAction('try-another');
  const handleDiscardReview = () => setConfirmAction('discard');

  const confirmDiscard = () => {
    if (confirmAction === 'try-another') {
      reset();
      setView(hasData ? 'url-inline' : 'url-cta');
    } else {
      reset();
      onClose();
    }
    setConfirmAction(null);
  };

  const handleClose = view === 'review' ? handleDiscardReview : onClose;

  if (!loaded) {
    return (
      <Modal onClose={handleClose} title="Brand Guidelines">
        <div className="bg-plugin-modal-body">
          <div className="bg-plugin-empty">Loading...</div>
        </div>
      </Modal>
    );
  }

  // URL CTA view (empty state)
  if (view === 'url-cta') {
    return (
      <Modal onClose={handleClose} title="Brand Guidelines">
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
      <Modal onClose={handleClose} title="Brand Guidelines">
        <div className="bg-plugin-extraction">
          <ExtractionView state={fetchState} onCancel={handleCancel} />
        </div>
      </Modal>
    );
  }

  // Review view (after extraction completes)
  if (view === 'review' && result?.analysis) {
    return (
      <Modal onClose={handleClose} title="Brand Guidelines">
        {confirmAction ? (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: theme.textPrimary, marginBottom: 6 }}>
              Discard extracted tokens?
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>
              AI extraction takes 60+ seconds. You'll need to re-extract.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                className="bg-plugin-add-btn"
                onClick={() => setConfirmAction(null)}
                style={{ borderStyle: 'solid', opacity: 1, padding: '8px 16px' }}
              >
                Keep reviewing
              </button>
              <button
                className="bg-plugin-export-btn"
                onClick={confirmDiscard}
                style={{ background: theme.error, color: '#fff', width: 'auto', padding: '8px 16px' }}
              >
                Discard
              </button>
            </div>
          </div>
        ) : (
          <ReviewView
            analysis={result.analysis}
            onApply={handleApply}
            onTryAnother={handleTryAnother}
            onDiscard={handleDiscardReview}
          />
        )}
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
      onClose={handleClose}
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
        {USAGE_SUMMARY_TABS[activeTab] && settings.usageSummaries?.[USAGE_SUMMARY_TABS[activeTab]] && (
          <div className="bg-plugin-usage-summary" style={{ marginTop: 14 }}>
            <div className="bg-plugin-usage-summary-label" style={{ color: theme.textMuted }}>
              Usage Guide
            </div>
            <textarea
              className="bg-plugin-usage-summary-textarea"
              style={{ borderColor: theme.border, color: theme.textPrimary }}
              value={settings.usageSummaries[USAGE_SUMMARY_TABS[activeTab]]}
              onChange={(e) => {
                const key = USAGE_SUMMARY_TABS[activeTab];
                updateSettings(prev => ({
                  ...prev,
                  usageSummaries: {
                    colors: '',
                    fonts: '',
                    radii: '',
                    spacing: '',
                    ...prev.usageSummaries,
                    [key]: e.target.value,
                  },
                }));
              }}
            />
          </div>
        )}
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
        {activeTab === 'radii' && (
          <RadiiSection
            radii={settings.radii}
            updateSettings={updateSettings}
          />
        )}
        {activeTab === 'spacing' && (
          <SpacingSection
            spacing={settings.spacing}
            updateSettings={updateSettings}
          />
        )}
      </div>
    </Modal>
  );
}
