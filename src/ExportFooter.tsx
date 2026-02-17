import { useTheme, useProject } from './context';
import type { BrandSettings } from './types';
import type { SyncStatus } from './useFileSync';
import { hasBrandData } from './markdown';

const STATUS_LABELS: Record<SyncStatus, string> = {
  'none': '',
  'not-exported': 'Not exported',
  'in-sync': 'In sync',
  'needs-update': 'Needs update',
};

const STATUS_COLORS: Record<SyncStatus, string> = {
  'none': '#888',
  'not-exported': '#888',
  'in-sync': '#22c55e',
  'needs-update': '#f59e0b',
};

export function ExportFooter({
  settings,
  updateSettings,
  syncStatus,
  exporting,
  onExport,
}: {
  settings: BrandSettings;
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
  syncStatus: SyncStatus;
  exporting: boolean;
  onExport: () => void;
}) {
  const theme = useTheme();
  const project = useProject();
  const hasData = hasBrandData(settings);
  const isFirstExport = syncStatus === 'not-exported' || syncStatus === 'none';

  return (
    <div
      className="bg-plugin-footer"
      style={{ borderTopColor: theme.border }}
    >
      <div className="bg-plugin-footer-row">
        <div className="bg-plugin-footer-left">
          <span style={{ color: theme.textSecondary }}>Target:</span>
          <select
            className="bg-plugin-select"
            value={settings.targetFile}
            onChange={(e) =>
              updateSettings((prev) => ({
                ...prev,
                targetFile: e.target.value as 'CLAUDE.md' | 'AGENTS.md',
              }))
            }
            style={{ borderColor: theme.border }}
          >
            <option value="CLAUDE.md">CLAUDE.md</option>
            <option value="AGENTS.md">AGENTS.md</option>
          </select>
        </div>
        {syncStatus !== 'none' && (
          <div className="bg-plugin-sync-status" style={{ color: STATUS_COLORS[syncStatus] }}>
            <div
              className="bg-plugin-sync-dot"
              style={{ background: STATUS_COLORS[syncStatus] }}
            />
            {STATUS_LABELS[syncStatus]}
          </div>
        )}
      </div>
      <button
        className="bg-plugin-export-btn"
        onClick={onExport}
        disabled={!project || !hasData || exporting || syncStatus === 'in-sync'}
        style={{
          background: theme.action,
          color: theme.actionText,
        }}
      >
        {exporting
          ? 'Exporting...'
          : !project
            ? 'No project open'
            : !hasData
              ? 'Add brand data first'
              : isFirstExport
                ? `Add to ${settings.targetFile}`
                : `Update in ${settings.targetFile}`}
      </button>
    </div>
  );
}
