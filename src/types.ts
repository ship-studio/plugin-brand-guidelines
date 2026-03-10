export interface BrandColor {
  id: string;
  name: string;
  hex: string;
}

export interface BrandFont {
  id: string;
  role: string;
  value: string;
}

export interface BrandAsset {
  id: string;
  label: string;
  path: string;
}

export interface BrandRadius {
  id: string;
  label: string;  // AI-assigned: "Button", "Card", "Pill", "Circle"
  value: string;  // CSS value: "4px", "0.5rem", "50%"
}

export interface BrandSpacing {
  id: string;
  label: string;  // AI-assigned: "Tight", "Base", "Relaxed", "Spacious"
  value: string;  // CSS value: "8px", "1rem", "24px"
}

export interface BrandSettings {
  colors: BrandColor[];
  fonts: BrandFont[];
  voiceNotes: string;
  assets: BrandAsset[];
  radii: BrandRadius[];
  spacing: BrandSpacing[];
  usageSummaries?: import('./analyzeTokens').UsageSummaries;
  targetFile: 'CLAUDE.md' | 'AGENTS.md';
  lastExportedHash: string;
}

export interface PluginContextValue {
  pluginId: string;
  project: {
    name: string;
    path: string;
    currentBranch: string;
    hasUncommittedChanges: boolean;
  } | null;
  actions: {
    showToast: (message: string, type?: 'success' | 'error') => void;
    refreshGitStatus: () => void;
    refreshBranches: () => void;
    focusTerminal: () => void;
    openUrl: (url: string) => void;
  };
  shell: {
    exec: (command: string, args: string[], options?: { timeout?: number }) => Promise<{
      stdout: string;
      stderr: string;
      exit_code: number;
    }>;
  };
  storage: {
    read: () => Promise<Record<string, unknown>>;
    write: (data: Record<string, unknown>) => Promise<void>;
  };
  invoke: {
    call: <T = unknown>(command: string, args?: Record<string, unknown>) => Promise<T>;
  };
  theme: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    accent: string;
    accentHover: string;
    action: string;
    actionHover: string;
    actionText: string;
    error: string;
    success: string;
  };
}
