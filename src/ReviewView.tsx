import { useState, useMemo, useCallback } from 'react';
import { useTheme } from './context';
import { prepareTokens } from './reviewMerge';
import type { AnalysisResult } from './analyzeTokens';
import type { BrandColor, BrandFont, BrandRadius, BrandSpacing } from './types';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ReviewViewProps {
  analysis: AnalysisResult;
  onApply: (colors: BrandColor[], fonts: BrandFont[], voiceNotes: string | null, radii: BrandRadius[], spacing: BrandSpacing[]) => void;
  onTryAnother: () => void;
  onDiscard: () => void;
}

type ReviewTab = 'colors' | 'fonts' | 'voice' | 'radii' | 'spacing';

const TABS: { key: ReviewTab; label: string }[] = [
  { key: 'colors', label: 'Colors' },
  { key: 'fonts', label: 'Fonts' },
  { key: 'voice', label: 'Voice' },
  { key: 'radii', label: 'Radii' },
  { key: 'spacing', label: 'Spacing' },
];

// ── Component ──────────────────────────────────────────────────────────────

export function ReviewView({ analysis, onApply, onTryAnother, onDiscard }: ReviewViewProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<ReviewTab>('colors');

  // Prepare editable tokens from analysis (stable per analysis reference)
  const initial = useMemo(() => prepareTokens(analysis), [analysis]);

  // Editable state
  const [colors, setColors] = useState<BrandColor[]>(initial.colors);
  const [fonts, setFonts] = useState<BrandFont[]>(initial.fonts);
  const [voiceNotes, setVoiceNotes] = useState(initial.voiceNotes);
  const [radii, setRadii] = useState<BrandRadius[]>(initial.radii);
  const [spacing, setSpacing] = useState<BrandSpacing[]>(initial.spacing);

  // Selection maps keyed by token ID (or 'voice' for voice notes)
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initial.colors.forEach((c) => { map[c.id] = true; });
    initial.fonts.forEach((f) => { map[f.id] = true; });
    if (initial.voiceNotes) map['voice'] = true;
    initial.radii.forEach((r) => { map[r.id] = true; });
    initial.spacing.forEach((s) => { map[s.id] = true; });
    return map;
  });

  // Toggle a single item
  const toggle = useCallback((id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Select/deselect all for a section
  const toggleAll = useCallback((ids: string[], selectAll: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };
      ids.forEach((id) => { next[id] = selectAll; });
      return next;
    });
  }, []);

  // Color editing
  const updateColor = useCallback((id: string, field: 'name' | 'hex', value: string) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }, []);

  // Font editing
  const updateFont = useCallback((id: string, field: 'role' | 'value', value: string) => {
    setFonts((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  }, []);

  // Radius editing
  const updateRadius = useCallback((id: string, field: 'label' | 'value', value: string) => {
    setRadii((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  // Spacing editing
  const updateSpacingItem = useCallback((id: string, field: 'label' | 'value', value: string) => {
    setSpacing((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }, []);

  // Counts
  const selectedColorIds = colors.filter((c) => selected[c.id]).map((c) => c.id);
  const selectedFontIds = fonts.filter((f) => selected[f.id]).map((f) => f.id);
  const voiceSelected = !!selected['voice'] && voiceNotes.trim().length > 0;
  const selectedRadiiIds = radii.filter((r) => selected[r.id]).map((r) => r.id);
  const selectedSpacingIds = spacing.filter((s) => selected[s.id]).map((s) => s.id);
  const totalSelected = selectedColorIds.length + selectedFontIds.length + (voiceSelected ? 1 : 0) + selectedRadiiIds.length + selectedSpacingIds.length;

  const allColorsSelected = colors.length > 0 && selectedColorIds.length === colors.length;
  const allFontsSelected = fonts.length > 0 && selectedFontIds.length === fonts.length;
  const allRadiiSelected = radii.length > 0 && selectedRadiiIds.length === radii.length;
  const allSpacingSelected = spacing.length > 0 && selectedSpacingIds.length === spacing.length;

  // Apply handler
  const handleApply = () => {
    const acceptedColors = colors.filter((c) => selected[c.id]);
    const acceptedFonts = fonts.filter((f) => selected[f.id]);
    const acceptedVoice = voiceSelected ? voiceNotes : null;
    const acceptedRadii = radii.filter((r) => selected[r.id]);
    const acceptedSpacing = spacing.filter((s) => selected[s.id]);
    onApply(acceptedColors, acceptedFonts, acceptedVoice, acceptedRadii, acceptedSpacing);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="bg-plugin-review-header" style={{ borderBottomColor: theme.border }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: theme.textSecondary }}>
          Review extracted tokens
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="bg-plugin-review-select-toggle"
            onClick={onTryAnother}
            style={{ color: theme.accent }}
          >
            Try another URL
          </button>
          <button
            className="bg-plugin-review-select-toggle"
            onClick={onDiscard}
            style={{ color: theme.textMuted }}
          >
            Discard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-plugin-tabs" style={{ borderBottomColor: theme.border }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`bg-plugin-tab${activeTab === tab.key ? ' bg-plugin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'colors' && colors.length > 0 && (
              <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 11 }}>
                ({selectedColorIds.length})
              </span>
            )}
            {tab.key === 'fonts' && fonts.length > 0 && (
              <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 11 }}>
                ({selectedFontIds.length})
              </span>
            )}
            {tab.key === 'radii' && radii.length > 0 && (
              <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 11 }}>
                ({selectedRadiiIds.length})
              </span>
            )}
            {tab.key === 'spacing' && spacing.length > 0 && (
              <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 11 }}>
                ({selectedSpacingIds.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-plugin-modal-body">
        {/* Colors tab */}
        {activeTab === 'colors' && (
          <div className="bg-plugin-section">
            {colors.length === 0 ? (
              <div className="bg-plugin-review-empty" style={{ color: theme.textMuted }}>
                No colors extracted
              </div>
            ) : (
              <>
                <div className="bg-plugin-review-section-header">
                  <span style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary }}>
                    {selectedColorIds.length} of {colors.length} selected
                  </span>
                  <button
                    className="bg-plugin-review-select-toggle"
                    onClick={() => toggleAll(colors.map((c) => c.id), !allColorsSelected)}
                    style={{ color: theme.accent }}
                  >
                    {allColorsSelected ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                {colors.map((color) => (
                  <div key={color.id} className="bg-plugin-row">
                    <input
                      type="checkbox"
                      className="bg-plugin-review-checkbox"
                      checked={!!selected[color.id]}
                      onChange={() => toggle(color.id)}
                      style={{ '--checkbox-accent': theme.accent } as React.CSSProperties}
                    />
                    <div className="bg-plugin-swatch-wrapper">
                      <div
                        className="bg-plugin-swatch"
                        style={{ background: color.hex }}
                      />
                    </div>
                    <input
                      className="bg-plugin-input bg-plugin-input--name"
                      value={color.name}
                      onChange={(e) => updateColor(color.id, 'name', e.target.value)}
                      style={{ borderColor: theme.border }}
                      placeholder="Color name"
                    />
                    <input
                      className="bg-plugin-input bg-plugin-input--hex"
                      value={color.hex}
                      onChange={(e) => {
                        let v = e.target.value.toUpperCase();
                        if (!v.startsWith('#')) v = '#' + v;
                        if (v.length <= 7) updateColor(color.id, 'hex', v);
                      }}
                      style={{ borderColor: theme.border }}
                      placeholder="#000000"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Fonts tab */}
        {activeTab === 'fonts' && (
          <div className="bg-plugin-section">
            {fonts.length === 0 ? (
              <div className="bg-plugin-review-empty" style={{ color: theme.textMuted }}>
                No fonts extracted
              </div>
            ) : (
              <>
                <div className="bg-plugin-review-section-header">
                  <span style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary }}>
                    {selectedFontIds.length} of {fonts.length} selected
                  </span>
                  <button
                    className="bg-plugin-review-select-toggle"
                    onClick={() => toggleAll(fonts.map((f) => f.id), !allFontsSelected)}
                    style={{ color: theme.accent }}
                  >
                    {allFontsSelected ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                {fonts.map((font) => (
                  <div key={font.id} className="bg-plugin-row">
                    <input
                      type="checkbox"
                      className="bg-plugin-review-checkbox"
                      checked={!!selected[font.id]}
                      onChange={() => toggle(font.id)}
                      style={{ '--checkbox-accent': theme.accent } as React.CSSProperties}
                    />
                    <input
                      className="bg-plugin-input"
                      value={font.role}
                      onChange={(e) => updateFont(font.id, 'role', e.target.value)}
                      style={{ borderColor: theme.border, flex: '0 0 120px' }}
                      placeholder="Role"
                    />
                    <input
                      className="bg-plugin-input"
                      value={font.value}
                      onChange={(e) => updateFont(font.id, 'value', e.target.value)}
                      style={{ borderColor: theme.border }}
                      placeholder="Font family"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Voice tab */}
        {activeTab === 'voice' && (
          <div className="bg-plugin-section">
            {!initial.voiceNotes ? (
              <div className="bg-plugin-review-empty" style={{ color: theme.textMuted }}>
                No voice notes extracted
              </div>
            ) : (
              <>
                <div className="bg-plugin-review-section-header">
                  <span style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary }}>
                    Voice & Tone
                  </span>
                  <button
                    className="bg-plugin-review-select-toggle"
                    onClick={() => toggle('voice')}
                    style={{ color: theme.accent }}
                  >
                    {selected['voice'] ? 'Deselect' : 'Select'}
                  </button>
                </div>
                <div className="bg-plugin-row" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    className="bg-plugin-review-checkbox"
                    checked={!!selected['voice']}
                    onChange={() => toggle('voice')}
                    style={{
                      '--checkbox-accent': theme.accent,
                      marginTop: 10,
                    } as React.CSSProperties}
                  />
                  <textarea
                    className="bg-plugin-textarea"
                    value={voiceNotes}
                    onChange={(e) => setVoiceNotes(e.target.value)}
                    style={{ borderColor: theme.border, flex: 1 }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Radii tab */}
        {activeTab === 'radii' && (
          <div className="bg-plugin-section">
            {radii.length === 0 ? (
              <div className="bg-plugin-review-empty" style={{ color: theme.textMuted }}>
                No border radii extracted
              </div>
            ) : (
              <>
                <div className="bg-plugin-review-section-header">
                  <span style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary }}>
                    {selectedRadiiIds.length} of {radii.length} selected
                  </span>
                  <button
                    className="bg-plugin-review-select-toggle"
                    onClick={() => toggleAll(radii.map((r) => r.id), !allRadiiSelected)}
                    style={{ color: theme.accent }}
                  >
                    {allRadiiSelected ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                {radii.map((radius) => (
                  <div key={radius.id} className="bg-plugin-row">
                    <input
                      type="checkbox"
                      className="bg-plugin-review-checkbox"
                      checked={!!selected[radius.id]}
                      onChange={() => toggle(radius.id)}
                      style={{ '--checkbox-accent': theme.accent } as React.CSSProperties}
                    />
                    <input
                      className="bg-plugin-input bg-plugin-input--name"
                      value={radius.label}
                      onChange={(e) => updateRadius(radius.id, 'label', e.target.value)}
                      style={{ borderColor: theme.border }}
                      placeholder="Label"
                    />
                    <input
                      className="bg-plugin-input bg-plugin-input--hex"
                      value={radius.value}
                      onChange={(e) => updateRadius(radius.id, 'value', e.target.value)}
                      style={{ borderColor: theme.border }}
                      placeholder="Value"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Spacing tab */}
        {activeTab === 'spacing' && (
          <div className="bg-plugin-section">
            {spacing.length === 0 ? (
              <div className="bg-plugin-review-empty" style={{ color: theme.textMuted }}>
                No spacing values extracted
              </div>
            ) : (
              <>
                <div className="bg-plugin-review-section-header">
                  <span style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary }}>
                    {selectedSpacingIds.length} of {spacing.length} selected
                  </span>
                  <button
                    className="bg-plugin-review-select-toggle"
                    onClick={() => toggleAll(spacing.map((s) => s.id), !allSpacingSelected)}
                    style={{ color: theme.accent }}
                  >
                    {allSpacingSelected ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                {spacing.map((item) => (
                  <div key={item.id} className="bg-plugin-row">
                    <input
                      type="checkbox"
                      className="bg-plugin-review-checkbox"
                      checked={!!selected[item.id]}
                      onChange={() => toggle(item.id)}
                      style={{ '--checkbox-accent': theme.accent } as React.CSSProperties}
                    />
                    <input
                      className="bg-plugin-input bg-plugin-input--name"
                      value={item.label}
                      onChange={(e) => updateSpacingItem(item.id, 'label', e.target.value)}
                      style={{ borderColor: theme.border }}
                      placeholder="Label"
                    />
                    <input
                      className="bg-plugin-input bg-plugin-input--hex"
                      value={item.value}
                      onChange={(e) => updateSpacingItem(item.id, 'value', e.target.value)}
                      style={{ borderColor: theme.border }}
                      placeholder="Value"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer with apply button */}
      <div className="bg-plugin-footer" style={{ borderTopColor: theme.border }}>
        <button
          className="bg-plugin-review-apply-btn"
          disabled={totalSelected === 0}
          onClick={handleApply}
          style={{
            background: theme.action,
            color: theme.actionText,
            opacity: totalSelected === 0 ? 0.5 : 1,
          }}
        >
          Apply {totalSelected} selected
        </button>
      </div>
    </div>
  );
}
