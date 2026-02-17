import { jsx, jsxs, Fragment } from "data:text/javascript,const _R=window.__SHIPSTUDIO_REACT__;function _jsx(t,p,k){if(k!==undefined)p=Object.assign({},p,{key:k});const c=p.children;if(c===undefined)return _R.createElement(t,p);const r=Object.assign({},p);delete r.children;if(Array.isArray(c))return _R.createElement(t,r,...c);return _R.createElement(t,r,c)}export const jsx=_jsx;export const jsxs=_jsx;export const Fragment=_R.Fragment;";
import { useEffect, useCallback, useState, useRef } from "data:text/javascript,export default window.__SHIPSTUDIO_REACT__;export const useState=window.__SHIPSTUDIO_REACT__.useState;export const useEffect=window.__SHIPSTUDIO_REACT__.useEffect;export const useCallback=window.__SHIPSTUDIO_REACT__.useCallback;export const useMemo=window.__SHIPSTUDIO_REACT__.useMemo;export const useRef=window.__SHIPSTUDIO_REACT__.useRef;export const useContext=window.__SHIPSTUDIO_REACT__.useContext;export const createElement=window.__SHIPSTUDIO_REACT__.createElement;export const Fragment=window.__SHIPSTUDIO_REACT__.Fragment;";
const BG_STYLE_ID = "bg-plugin-styles";
const BRAND_GUIDELINES_CSS = `
@keyframes bgFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

/* Modal overlay */
.bg-plugin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: bgFadeIn 0.15s ease-out;
}

.bg-plugin-modal {
  width: 520px;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: bgFadeIn 0.2s ease-out;
}

.bg-plugin-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  font-size: 13px;
  font-weight: 600;
}

.bg-plugin-close-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  opacity: 0.4;
  line-height: 1;
  border-radius: 4px;
}

.bg-plugin-close-btn:hover {
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.06);
}

.bg-plugin-modal-body {
  padding: 0 16px 16px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.5;
  flex: 1;
  min-height: 0;
}

/* Tabs */
.bg-plugin-tabs {
  display: flex;
  gap: 0;
  padding: 0 16px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.bg-plugin-tab {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: none !important;
  border: none !important;
  border-bottom: 2px solid transparent !important;
  border-radius: 0 !important;
  margin-bottom: -1px;
  color: inherit;
  opacity: 0.4;
  transition: opacity 0.15s, border-color 0.15s, color 0.15s;
  font-family: inherit;
  letter-spacing: 0.01em;
  box-shadow: none !important;
  outline: none;
}

.bg-plugin-tab:hover {
  opacity: 0.7;
}

.bg-plugin-tab--active {
  opacity: 1;
  border-bottom-color: var(--accent, #6C5CE7) !important;
  color: var(--accent, #6C5CE7);
}

/* Section content */
.bg-plugin-section {
  padding-top: 14px;
}

.bg-plugin-empty {
  text-align: center;
  padding: 24px 0;
  font-size: 12px;
  opacity: 0.5;
}

/* Item rows */
.bg-plugin-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.bg-plugin-input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid;
  font-size: 12px;
  font-family: inherit;
  background: transparent;
  color: inherit;
  outline: none;
  min-width: 0;
}

.bg-plugin-input:focus {
  border-color: var(--accent, #6C5CE7);
}

.bg-plugin-input--hex {
  width: 90px;
  flex: none;
  font-family: 'JetBrains Mono', monospace;
}

.bg-plugin-input--name {
  flex: 1;
}

/* Color swatch */
.bg-plugin-swatch-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.bg-plugin-swatch {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.bg-plugin-swatch-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border: none;
  padding: 0;
}

/* Delete button */
.bg-plugin-delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  opacity: 0.3;
  line-height: 1;
  border-radius: 4px;
  color: inherit;
  flex-shrink: 0;
}

.bg-plugin-delete-btn:hover {
  opacity: 0.8;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Add button */
.bg-plugin-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px dashed;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  background: transparent;
  color: inherit;
  opacity: 0.6;
  transition: opacity 0.12s;
  margin-top: 4px;
}

.bg-plugin-add-btn:hover {
  opacity: 1;
}

/* Textarea */
.bg-plugin-textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid;
  font-size: 12px;
  font-family: inherit;
  background: transparent;
  color: inherit;
  outline: none;
  resize: vertical;
  line-height: 1.5;
}

.bg-plugin-textarea:focus {
  border-color: var(--accent, #6C5CE7);
}

/* Export footer */
.bg-plugin-footer {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top-width: 1px;
  border-top-style: solid;
}

.bg-plugin-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.bg-plugin-footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.bg-plugin-select {
  padding: 5px 24px 5px 10px;
  border-radius: 6px;
  border: 1px solid;
  font-size: 12px;
  font-family: inherit;
  background: transparent;
  color: inherit;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.bg-plugin-select option {
  background: var(--bg-primary, #1a1a2e);
  color: inherit;
}

.bg-plugin-sync-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
}

.bg-plugin-sync-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Export button */
.bg-plugin-export-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  transition: filter 0.12s, opacity 0.12s;
  width: 100%;
}

.bg-plugin-export-btn:hover {
  filter: brightness(0.9);
}

.bg-plugin-export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;
const _w = window;
function usePluginContext() {
  const React = _w.__SHIPSTUDIO_REACT__;
  const CtxRef = _w.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  if (CtxRef && (React == null ? void 0 : React.useContext)) {
    const ctx = React.useContext(CtxRef);
    if (ctx) return ctx;
  }
  throw new Error("Plugin context not available.");
}
function useProject() {
  return usePluginContext().project;
}
function useShell() {
  return usePluginContext().shell;
}
function useToast() {
  return usePluginContext().actions.showToast;
}
function usePluginStorage() {
  return usePluginContext().storage;
}
function useTheme() {
  return usePluginContext().theme;
}
function Modal({
  onClose,
  title,
  children,
  footer
}) {
  const theme = useTheme();
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return /* @__PURE__ */ jsx("div", { className: "bg-plugin-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-plugin-modal",
      style: {
        background: theme.bgPrimary,
        color: theme.textPrimary,
        border: `1px solid ${theme.border}`
      },
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-plugin-modal-header",
            style: { borderBottom: `1px solid ${theme.border}` },
            children: [
              /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsxs("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("path", { d: "M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" }),
                  /* @__PURE__ */ jsx("path", { d: "M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" }),
                  /* @__PURE__ */ jsx("path", { d: "M14.5 17.5 4.5 15" })
                ] }),
                title
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "bg-plugin-close-btn",
                  onClick: onClose,
                  style: { color: theme.textMuted },
                  children: "✕"
                }
              )
            ]
          }
        ),
        children,
        footer
      ]
    }
  ) });
}
function ColorsSection({
  colors,
  updateSettings
}) {
  const theme = useTheme();
  const addColor = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        { id: crypto.randomUUID(), name: "", hex: "#6C5CE7" }
      ]
    }));
  }, [updateSettings]);
  const updateColor = useCallback(
    (id, field, value) => {
      updateSettings((prev) => ({
        ...prev,
        colors: prev.colors.map(
          (c) => c.id === id ? { ...c, [field]: value } : c
        )
      }));
    },
    [updateSettings]
  );
  const removeColor = useCallback(
    (id) => {
      updateSettings((prev) => ({
        ...prev,
        colors: prev.colors.filter((c) => c.id !== id)
      }));
    },
    [updateSettings]
  );
  if (colors.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-empty", children: "No brand colors yet. Add your first color to get started." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-add-btn",
          onClick: addColor,
          style: { borderColor: theme.border },
          children: "+ Add Color"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
    colors.map((color) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-plugin-swatch-wrapper", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-plugin-swatch",
            style: { background: color.hex }
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "color",
            className: "bg-plugin-swatch-input",
            value: color.hex,
            onChange: (e) => updateColor(color.id, "hex", e.target.value.toUpperCase())
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input bg-plugin-input--name",
          placeholder: "Color name",
          value: color.name,
          onChange: (e) => updateColor(color.id, "name", e.target.value),
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input bg-plugin-input--hex",
          placeholder: "#000000",
          value: color.hex,
          onChange: (e) => {
            let v = e.target.value.toUpperCase();
            if (!v.startsWith("#")) v = "#" + v;
            if (v.length <= 7) updateColor(color.id, "hex", v);
          },
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-delete-btn",
          onClick: () => removeColor(color.id),
          title: "Remove color",
          children: "✕"
        }
      )
    ] }, color.id)),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-plugin-add-btn",
        onClick: addColor,
        style: { borderColor: theme.border },
        children: "+ Add Color"
      }
    )
  ] });
}
function FontsSection({
  fonts,
  updateSettings
}) {
  const theme = useTheme();
  const addFont = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      fonts: [
        ...prev.fonts,
        { id: crypto.randomUUID(), role: "", value: "" }
      ]
    }));
  }, [updateSettings]);
  const updateFont = useCallback(
    (id, field, value) => {
      updateSettings((prev) => ({
        ...prev,
        fonts: prev.fonts.map(
          (f) => f.id === id ? { ...f, [field]: value } : f
        )
      }));
    },
    [updateSettings]
  );
  const removeFont = useCallback(
    (id) => {
      updateSettings((prev) => ({
        ...prev,
        fonts: prev.fonts.filter((f) => f.id !== id)
      }));
    },
    [updateSettings]
  );
  if (fonts.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-empty", children: "No brand fonts yet. Add your first font to get started." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-add-btn",
          onClick: addFont,
          style: { borderColor: theme.border },
          children: "+ Add Font"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
    fonts.map((font) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input",
          placeholder: "Role (e.g. Heading)",
          value: font.role,
          onChange: (e) => updateFont(font.id, "role", e.target.value),
          style: { borderColor: theme.border, flex: "0 0 120px" }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input",
          placeholder: "Font (e.g. Inter)",
          value: font.value,
          onChange: (e) => updateFont(font.id, "value", e.target.value),
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-delete-btn",
          onClick: () => removeFont(font.id),
          title: "Remove font",
          children: "✕"
        }
      )
    ] }, font.id)),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-plugin-add-btn",
        onClick: addFont,
        style: { borderColor: theme.border },
        children: "+ Add Font"
      }
    )
  ] });
}
function VoiceSection({
  voiceNotes,
  updateSettings
}) {
  const theme = useTheme();
  return /* @__PURE__ */ jsx("div", { className: "bg-plugin-section", children: /* @__PURE__ */ jsx(
    "textarea",
    {
      className: "bg-plugin-textarea",
      placeholder: "Describe your brand's voice and tone...",
      value: voiceNotes,
      onChange: (e) => updateSettings((prev) => ({ ...prev, voiceNotes: e.target.value })),
      style: { borderColor: theme.border }
    }
  ) });
}
function AssetsSection({
  assets,
  updateSettings
}) {
  const theme = useTheme();
  const addAsset = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      assets: [
        ...prev.assets,
        { id: crypto.randomUUID(), label: "", path: "" }
      ]
    }));
  }, [updateSettings]);
  const updateAsset = useCallback(
    (id, field, value) => {
      updateSettings((prev) => ({
        ...prev,
        assets: prev.assets.map(
          (a) => a.id === id ? { ...a, [field]: value } : a
        )
      }));
    },
    [updateSettings]
  );
  const removeAsset = useCallback(
    (id) => {
      updateSettings((prev) => ({
        ...prev,
        assets: prev.assets.filter((a) => a.id !== id)
      }));
    },
    [updateSettings]
  );
  if (assets.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-empty", children: "No brand assets yet. Add your first asset to get started." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-add-btn",
          onClick: addAsset,
          style: { borderColor: theme.border },
          children: "+ Add Asset"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
    assets.map((asset) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input",
          placeholder: "Label (e.g. Logo)",
          value: asset.label,
          onChange: (e) => updateAsset(asset.id, "label", e.target.value),
          style: { borderColor: theme.border, flex: "0 0 140px" }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input",
          placeholder: "Path (e.g. public/logo.svg)",
          value: asset.path,
          onChange: (e) => updateAsset(asset.id, "path", e.target.value),
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-delete-btn",
          onClick: () => removeAsset(asset.id),
          title: "Remove asset",
          children: "✕"
        }
      )
    ] }, asset.id)),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-plugin-add-btn",
        onClick: addAsset,
        style: { borderColor: theme.border },
        children: "+ Add Asset"
      }
    )
  ] });
}
const START_MARKER = "<!-- BRAND-GUIDELINES-START -->";
const END_MARKER = "<!-- BRAND-GUIDELINES-END -->";
function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i) >>> 0;
  }
  return hash.toString(36);
}
function generateBrandMarkdown(settings) {
  const sections = [];
  const validColors = settings.colors.filter((c) => c.name && c.hex);
  if (validColors.length > 0) {
    sections.push(
      "### Colors\n\n" + validColors.map((c) => `- **${c.name}**: \`${c.hex}\``).join("\n")
    );
  }
  const validFonts = settings.fonts.filter((f) => f.role && f.value);
  if (validFonts.length > 0) {
    sections.push(
      "### Fonts\n\n" + validFonts.map((f) => `- **${f.role}**: ${f.value}`).join("\n")
    );
  }
  if (settings.voiceNotes.trim()) {
    sections.push("### Voice & Tone\n\n" + settings.voiceNotes.trim());
  }
  const validAssets = settings.assets.filter((a) => a.label && a.path);
  if (validAssets.length > 0) {
    sections.push(
      "### Assets\n\n" + validAssets.map((a) => `- **${a.label}**: \`${a.path}\``).join("\n")
    );
  }
  if (sections.length === 0) return "";
  return "## Brand Guidelines\n\n" + sections.join("\n\n");
}
function wrapWithMarkers(content) {
  return `${START_MARKER}
${content}
${END_MARKER}`;
}
function hasMarkers(fileContent) {
  return fileContent.includes(START_MARKER) && fileContent.includes(END_MARKER);
}
function extractBetweenMarkers(fileContent) {
  const startIdx = fileContent.indexOf(START_MARKER);
  const endIdx = fileContent.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;
  return fileContent.slice(startIdx + START_MARKER.length + 1, endIdx).trimEnd();
}
function replaceMarkerSection(fileContent, newSection) {
  const startIdx = fileContent.indexOf(START_MARKER);
  const endIdx = fileContent.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    return fileContent.trimEnd() + "\n\n" + newSection + "\n";
  }
  const before = fileContent.slice(0, startIdx);
  const after = fileContent.slice(endIdx + END_MARKER.length);
  return before + newSection + after;
}
function buildFileContent(existingContent, brandMarkdown) {
  const wrappedSection = wrapWithMarkers(brandMarkdown);
  if (existingContent === null) {
    return wrappedSection + "\n";
  }
  if (hasMarkers(existingContent)) {
    return replaceMarkerSection(existingContent, wrappedSection);
  }
  return existingContent.trimEnd() + "\n\n" + wrappedSection + "\n";
}
function hasBrandData(settings) {
  return settings.colors.some((c) => c.name && c.hex) || settings.fonts.some((f) => f.role && f.value) || settings.voiceNotes.trim().length > 0 || settings.assets.some((a) => a.label && a.path);
}
const STATUS_LABELS = {
  "none": "",
  "not-exported": "Not exported",
  "in-sync": "In sync",
  "needs-update": "Needs update"
};
const STATUS_COLORS = {
  "none": "#888",
  "not-exported": "#888",
  "in-sync": "#22c55e",
  "needs-update": "#f59e0b"
};
function ExportFooter({
  settings,
  updateSettings,
  syncStatus,
  exporting,
  onExport
}) {
  const theme = useTheme();
  const project = useProject();
  const hasData = hasBrandData(settings);
  const isFirstExport = syncStatus === "not-exported" || syncStatus === "none";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-plugin-footer",
      style: { borderTopColor: theme.border },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-plugin-footer-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-plugin-footer-left", children: [
            /* @__PURE__ */ jsx("span", { style: { color: theme.textSecondary }, children: "Target:" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "bg-plugin-select",
                value: settings.targetFile,
                onChange: (e) => updateSettings((prev) => ({
                  ...prev,
                  targetFile: e.target.value
                })),
                style: { borderColor: theme.border },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "CLAUDE.md", children: "CLAUDE.md" }),
                  /* @__PURE__ */ jsx("option", { value: "AGENTS.md", children: "AGENTS.md" })
                ]
              }
            )
          ] }),
          syncStatus !== "none" && /* @__PURE__ */ jsxs("div", { className: "bg-plugin-sync-status", style: { color: STATUS_COLORS[syncStatus] }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-plugin-sync-dot",
                style: { background: STATUS_COLORS[syncStatus] }
              }
            ),
            STATUS_LABELS[syncStatus]
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-plugin-export-btn",
            onClick: onExport,
            disabled: !project || !hasData || exporting || syncStatus === "in-sync",
            style: {
              background: theme.action,
              color: theme.actionText
            },
            children: exporting ? "Exporting..." : !project ? "No project open" : !hasData ? "Add brand data first" : isFirstExport ? `Add to ${settings.targetFile}` : `Update in ${settings.targetFile}`
          }
        )
      ]
    }
  );
}
const DEFAULT_SETTINGS = {
  colors: [],
  fonts: [],
  voiceNotes: "",
  assets: [],
  targetFile: "CLAUDE.md",
  lastExportedHash: ""
};
function useBrandSettings() {
  const storage = usePluginStorage();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const saveTimer = useRef(null);
  const latestSettings = useRef(settings);
  latestSettings.current = settings;
  useEffect(() => {
    storage.read().then((data) => {
      if (data.brandSettings && typeof data.brandSettings === "object") {
        setSettings({ ...DEFAULT_SETTINGS, ...data.brandSettings });
      }
      setLoaded(true);
    });
  }, []);
  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      storage.write({ brandSettings: latestSettings.current });
      setDirty(false);
    }, 500);
  }, [storage]);
  const updateSettings = useCallback(
    (updater) => {
      setSettings((prev) => {
        const next = updater(prev);
        latestSettings.current = next;
        setDirty(true);
        return next;
      });
      scheduleSave();
    },
    [scheduleSave]
  );
  const setLastExportedHash = useCallback(
    (hash) => {
      setSettings((prev) => {
        const next = { ...prev, lastExportedHash: hash };
        latestSettings.current = next;
        return next;
      });
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        storage.write({ brandSettings: latestSettings.current });
      }, 100);
    },
    [storage]
  );
  return { settings, updateSettings, setLastExportedHash, loaded, dirty };
}
function useFileSync(settings, setLastExportedHash) {
  const shell = useShell();
  const project = useProject();
  const showToast = useToast();
  const [syncStatus, setSyncStatus] = useState("none");
  const [exporting, setExporting] = useState(false);
  const checkSync = useCallback(async () => {
    if (!project) {
      setSyncStatus("none");
      return;
    }
    if (!hasBrandData(settings)) {
      setSyncStatus("none");
      return;
    }
    const filePath = `${project.path}/${settings.targetFile}`;
    const exists = await shell.exec("test", ["-f", filePath]);
    if (exists.exit_code !== 0) {
      setSyncStatus(settings.lastExportedHash ? "needs-update" : "not-exported");
      return;
    }
    const result = await shell.exec("cat", [filePath]);
    if (result.exit_code !== 0) {
      setSyncStatus("not-exported");
      return;
    }
    const extracted = extractBetweenMarkers(result.stdout);
    if (extracted === null) {
      setSyncStatus(settings.lastExportedHash ? "needs-update" : "not-exported");
      return;
    }
    const currentMarkdown = generateBrandMarkdown(settings);
    const fileHash = djb2Hash(extracted);
    const settingsHash = djb2Hash(currentMarkdown);
    if (fileHash === settingsHash) {
      setSyncStatus("in-sync");
    } else {
      setSyncStatus("needs-update");
    }
  }, [project, settings, shell]);
  const exportToFile = useCallback(async () => {
    if (!project) {
      showToast("No project open", "error");
      return;
    }
    setExporting(true);
    try {
      const brandMarkdown = generateBrandMarkdown(settings);
      if (!brandMarkdown) {
        showToast("No brand data to export", "error");
        setExporting(false);
        return;
      }
      const filePath = `${project.path}/${settings.targetFile}`;
      let existingContent = null;
      const exists = await shell.exec("test", ["-f", filePath]);
      if (exists.exit_code === 0) {
        const writable = await shell.exec("test", ["-w", filePath]);
        if (writable.exit_code !== 0) {
          showToast(`${settings.targetFile} is not writable`, "error");
          setExporting(false);
          return;
        }
        const readResult = await shell.exec("cat", [filePath]);
        if (readResult.exit_code === 0) {
          existingContent = readResult.stdout;
        }
      }
      const newContent = buildFileContent(existingContent, brandMarkdown);
      const encoded = btoa(
        new TextEncoder().encode(newContent).reduce((s, b) => s + String.fromCharCode(b), "")
      );
      const writeResult = await shell.exec("node", [
        "-e",
        `require("fs").writeFileSync(process.argv[1], Buffer.from(process.argv[2], "base64"))`,
        filePath,
        encoded
      ]);
      if (writeResult.exit_code !== 0) {
        showToast(`Failed to write ${settings.targetFile}: ${writeResult.stderr}`, "error");
        setExporting(false);
        return;
      }
      const hash = djb2Hash(brandMarkdown);
      setLastExportedHash(hash);
      setSyncStatus("in-sync");
      showToast(
        `Brand guidelines ${existingContent !== null && extractBetweenMarkers(existingContent) !== null ? "updated" : "added"} in ${settings.targetFile}`,
        "success"
      );
    } catch (err) {
      showToast(`Export failed: ${err}`, "error");
    } finally {
      setExporting(false);
    }
  }, [project, settings, shell, showToast, setLastExportedHash]);
  return { syncStatus, checkSync, exportToFile, exporting };
}
const TABS = [
  { key: "colors", label: "Colors" },
  { key: "fonts", label: "Fonts" },
  { key: "voice", label: "Voice" },
  { key: "assets", label: "Assets" }
];
function BrandModal({ onClose }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("colors");
  const { settings, updateSettings, setLastExportedHash, loaded } = useBrandSettings();
  const { syncStatus, checkSync, exportToFile, exporting } = useFileSync(
    settings,
    setLastExportedHash
  );
  useEffect(() => {
    if (loaded) checkSync();
  }, [loaded, settings.colors, settings.fonts, settings.voiceNotes, settings.assets, settings.targetFile, settings.lastExportedHash]);
  if (!loaded) {
    return /* @__PURE__ */ jsx(Modal, { onClose, title: "Brand Guidelines", children: /* @__PURE__ */ jsx("div", { className: "bg-plugin-modal-body", children: /* @__PURE__ */ jsx("div", { className: "bg-plugin-empty", children: "Loading..." }) }) });
  }
  const footer = /* @__PURE__ */ jsx(
    ExportFooter,
    {
      settings,
      updateSettings,
      syncStatus,
      exporting,
      onExport: exportToFile
    }
  );
  return /* @__PURE__ */ jsxs(Modal, { onClose, title: "Brand Guidelines", footer, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-plugin-tabs",
        style: { borderBottomColor: theme.border },
        children: TABS.map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            className: `bg-plugin-tab${activeTab === tab.key ? " bg-plugin-tab--active" : ""}`,
            onClick: () => setActiveTab(tab.key),
            children: tab.label
          },
          tab.key
        ))
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-plugin-modal-body", children: [
      activeTab === "colors" && /* @__PURE__ */ jsx(
        ColorsSection,
        {
          colors: settings.colors,
          updateSettings
        }
      ),
      activeTab === "fonts" && /* @__PURE__ */ jsx(
        FontsSection,
        {
          fonts: settings.fonts,
          updateSettings
        }
      ),
      activeTab === "voice" && /* @__PURE__ */ jsx(
        VoiceSection,
        {
          voiceNotes: settings.voiceNotes,
          updateSettings
        }
      ),
      activeTab === "assets" && /* @__PURE__ */ jsx(
        AssetsSection,
        {
          assets: settings.assets,
          updateSettings
        }
      )
    ] })
  ] });
}
function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById(BG_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = BG_STYLE_ID;
    style.textContent = BRAND_GUIDELINES_CSS;
    document.head.appendChild(style);
    return () => {
      var _a;
      (_a = document.getElementById(BG_STYLE_ID)) == null ? void 0 : _a.remove();
    };
  }, []);
}
function ToolbarButton() {
  const [modalOpen, setModalOpen] = useState(false);
  useInjectStyles();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setModalOpen(true),
        title: "Brand Guidelines",
        className: "toolbar-icon-btn",
        children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("path", { d: "M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" }),
          /* @__PURE__ */ jsx("path", { d: "M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" }),
          /* @__PURE__ */ jsx("path", { d: "M14.5 17.5 4.5 15" })
        ] })
      }
    ),
    modalOpen && /* @__PURE__ */ jsx(BrandModal, { onClose: () => setModalOpen(false) })
  ] });
}
const name = "Brand Guidelines";
const slots = {
  toolbar: ToolbarButton
};
function onActivate() {
  console.log("[brand-guidelines] Plugin activated");
}
function onDeactivate() {
  console.log("[brand-guidelines] Plugin deactivated");
}
export {
  name,
  onActivate,
  onDeactivate,
  slots
};
