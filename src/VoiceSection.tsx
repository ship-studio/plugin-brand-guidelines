import { useTheme } from './context';
import type { BrandSettings } from './types';

export function VoiceSection({
  voiceNotes,
  updateSettings,
}: {
  voiceNotes: string;
  updateSettings: (updater: (prev: BrandSettings) => BrandSettings) => void;
}) {
  const theme = useTheme();

  return (
    <div className="bg-plugin-section">
      <textarea
        className="bg-plugin-textarea"
        placeholder="Describe your brand's voice and tone..."
        value={voiceNotes}
        onChange={(e) =>
          updateSettings((prev) => ({ ...prev, voiceNotes: e.target.value }))
        }
        style={{ borderColor: theme.border }}
      />
    </div>
  );
}
