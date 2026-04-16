import { jsx, jsxs, Fragment } from "data:text/javascript,const _R=window.__SHIPSTUDIO_REACT__;function _jsx(t,p,k){if(k!==undefined)p=Object.assign({},p,{key:k});const c=p.children;if(c===undefined)return _R.createElement(t,p);const r=Object.assign({},p);delete r.children;if(Array.isArray(c))return _R.createElement(t,r,...c);return _R.createElement(t,r,c)}export const jsx=_jsx;export const jsxs=_jsx;export const Fragment=_R.Fragment;";
import { useEffect, useCallback, useState, useRef, useMemo } from "data:text/javascript,export default window.__SHIPSTUDIO_REACT__;export const useState=window.__SHIPSTUDIO_REACT__.useState;export const useEffect=window.__SHIPSTUDIO_REACT__.useEffect;export const useCallback=window.__SHIPSTUDIO_REACT__.useCallback;export const useMemo=window.__SHIPSTUDIO_REACT__.useMemo;export const useRef=window.__SHIPSTUDIO_REACT__.useRef;export const useContext=window.__SHIPSTUDIO_REACT__.useContext;export const createElement=window.__SHIPSTUDIO_REACT__.createElement;export const Fragment=window.__SHIPSTUDIO_REACT__.Fragment;";
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

/* URL CTA empty state */
.bg-plugin-url-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  text-align: center;
  gap: 8px;
}

.bg-plugin-url-cta-headline {
  font-size: 15px;
  font-weight: 600;
}

.bg-plugin-url-cta-subtext {
  font-size: 12px;
  opacity: 0.6;
  max-width: 300px;
}

.bg-plugin-url-cta-manual {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  text-decoration: underline;
  opacity: 0.5;
  color: inherit;
  margin-top: 4px;
}

.bg-plugin-url-cta-manual:hover {
  opacity: 0.8;
}

/* Inline URL bar (below header, above tabs) */
.bg-plugin-url-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

/* Header action button (globe icon) */
.bg-plugin-header-action {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px 6px;
  opacity: 0.4;
  line-height: 1;
  border-radius: 4px;
}

.bg-plugin-header-action:hover {
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.06);
}

/* Extraction progress */
.bg-plugin-extraction-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px 20px;
  gap: 0;
}

.bg-plugin-extraction-progress-track {
  width: 100%;
  height: 3px;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 20px;
}

.bg-plugin-extraction-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.bg-plugin-extraction-domain {
  font-size: 12px;
  margin-bottom: 20px;
  text-align: center;
}

.bg-plugin-extraction-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 280px;
}

.bg-plugin-step {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bg-plugin-step-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-plugin-step-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.bg-plugin-step-content {
  flex: 1;
  min-width: 0;
}

.bg-plugin-step-label {
  font-size: 13px;
  line-height: 1.3;
}

.bg-plugin-step-detail {
  font-size: 11px;
  margin-top: 1px;
}

/* Spinner for active step */
@keyframes bgSpin {
  to { transform: rotate(360deg); }
}

@keyframes bgPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.bg-plugin-spinner {
  display: block;
  width: 14px;
  height: 14px;
  border: 2px solid;
  border-radius: 50%;
  animation: bgSpin 0.8s linear infinite;
}

.bg-plugin-step-detail {
  animation: bgPulse 2s ease-in-out infinite;
}

/* Error block */
.bg-plugin-error-block {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid;
}

.bg-plugin-error-headline {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.bg-plugin-error-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  color: inherit;
  opacity: 0.5;
  padding: 0;
  text-decoration: underline;
}

.bg-plugin-error-detail {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
  white-space: pre-wrap;
}

/* URL input specific */
.bg-plugin-url-input-wrapper {
  width: 100%;
  max-width: 360px;
  margin-top: 4px;
}

.bg-plugin-url-hint {
  font-size: 11px;
  margin-top: 4px;
  min-height: 16px;
}

.bg-plugin-extract-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  transition: filter 0.12s, opacity 0.12s;
  margin-top: 4px;
}

.bg-plugin-extract-btn:hover:not(:disabled) {
  filter: brightness(0.9);
}

.bg-plugin-extract-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bg-plugin-cancel-btn {
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  font-family: inherit;
  color: inherit;
  opacity: 0.5;
  padding: 6px 12px;
  margin-top: 16px;
}

.bg-plugin-cancel-btn:hover {
  opacity: 0.8;
}

/* Review view */
.bg-plugin-review-checkbox {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  min-height: 16px !important;
  border: 1.5px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 4px !important;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  background: rgba(255, 255, 255, 0.06) !important;
  transition: background 0.12s, border-color 0.12s;
  margin: 0 !important;
  padding: 0 !important;
}

.bg-plugin-review-checkbox:checked {
  background: var(--checkbox-accent, var(--accent, #6C5CE7)) !important;
  border-color: var(--checkbox-accent, var(--accent, #6C5CE7)) !important;
}

.bg-plugin-review-checkbox:checked::after {
  content: '' !important;
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #fff !important;
  border-width: 0 2px 2px 0 !important;
  transform: rotate(45deg);
}

.bg-plugin-review-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.bg-plugin-review-select-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  font-family: inherit;
  padding: 2px 4px;
  border-radius: 3px;
  transition: opacity 0.12s;
}

.bg-plugin-review-select-toggle:hover {
  opacity: 0.8;
}

.bg-plugin-review-apply-btn {
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

.bg-plugin-review-apply-btn:hover:not(:disabled) {
  filter: brightness(0.9);
}

.bg-plugin-review-apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bg-plugin-review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.bg-plugin-usage-summary {
  margin-bottom: 12px;
  padding: 0 2px;
}

.bg-plugin-usage-summary-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  opacity: 0.5;
}

.bg-plugin-usage-summary-textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px 10px;
  border: 1px solid;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}

.bg-plugin-usage-summary-textarea:focus {
  border-color: var(--accent, #6C5CE7);
}

.bg-plugin-review-empty {
  text-align: center;
  padding: 32px 0;
  font-size: 12px;
  opacity: 0.5;
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
  const directCtx = _w.__SHIPSTUDIO_PLUGIN_CONTEXT__;
  if (directCtx) return directCtx;
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
  footer,
  headerActions
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
              /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                headerActions,
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "bg-plugin-close-btn",
                    onClick: onClose,
                    style: { color: theme.textMuted },
                    children: "✕"
                  }
                )
              ] })
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
function RadiiSection({
  radii,
  updateSettings
}) {
  const theme = useTheme();
  const addRadius = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      radii: [
        ...prev.radii,
        { id: crypto.randomUUID(), label: "", value: "" }
      ]
    }));
  }, [updateSettings]);
  const updateRadius = useCallback(
    (id, field, value) => {
      updateSettings((prev) => ({
        ...prev,
        radii: prev.radii.map(
          (r) => r.id === id ? { ...r, [field]: value } : r
        )
      }));
    },
    [updateSettings]
  );
  const removeRadius = useCallback(
    (id) => {
      updateSettings((prev) => ({
        ...prev,
        radii: prev.radii.filter((r) => r.id !== id)
      }));
    },
    [updateSettings]
  );
  if (radii.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-empty", children: "No border radii yet. Add your first radius to get started." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-add-btn",
          onClick: addRadius,
          style: { borderColor: theme.border },
          children: "+ Add Radius"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
    radii.map((radius) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input bg-plugin-input--name",
          placeholder: "Label e.g. Card",
          value: radius.label,
          onChange: (e) => updateRadius(radius.id, "label", e.target.value),
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input bg-plugin-input--hex",
          placeholder: "Value e.g. 8px",
          value: radius.value,
          onChange: (e) => updateRadius(radius.id, "value", e.target.value),
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-delete-btn",
          onClick: () => removeRadius(radius.id),
          title: "Remove radius",
          children: "✕"
        }
      )
    ] }, radius.id)),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-plugin-add-btn",
        onClick: addRadius,
        style: { borderColor: theme.border },
        children: "+ Add Radius"
      }
    )
  ] });
}
function SpacingSection({
  spacing,
  updateSettings
}) {
  const theme = useTheme();
  const addSpacing = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      spacing: [
        ...prev.spacing,
        { id: crypto.randomUUID(), label: "", value: "" }
      ]
    }));
  }, [updateSettings]);
  const updateSpacing = useCallback(
    (id, field, value) => {
      updateSettings((prev) => ({
        ...prev,
        spacing: prev.spacing.map(
          (s) => s.id === id ? { ...s, [field]: value } : s
        )
      }));
    },
    [updateSettings]
  );
  const removeSpacing = useCallback(
    (id) => {
      updateSettings((prev) => ({
        ...prev,
        spacing: prev.spacing.filter((s) => s.id !== id)
      }));
    },
    [updateSettings]
  );
  if (spacing.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-empty", children: "No spacing values yet. Add your first spacing value to get started." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-add-btn",
          onClick: addSpacing,
          style: { borderColor: theme.border },
          children: "+ Add Spacing"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-section", children: [
    spacing.map((item) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input bg-plugin-input--name",
          placeholder: "Label e.g. Base",
          value: item.label,
          onChange: (e) => updateSpacing(item.id, "label", e.target.value),
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input bg-plugin-input--hex",
          placeholder: "Value e.g. 16px",
          value: item.value,
          onChange: (e) => updateSpacing(item.id, "value", e.target.value),
          style: { borderColor: theme.border }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-delete-btn",
          onClick: () => removeSpacing(item.id),
          title: "Remove spacing",
          children: "✕"
        }
      )
    ] }, item.id)),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-plugin-add-btn",
        onClick: addSpacing,
        style: { borderColor: theme.border },
        children: "+ Add Spacing"
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
  var _a;
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
  const validRadii = settings.radii.filter((r) => r.label && r.value);
  if (validRadii.length > 0) {
    sections.push(
      "### Border Radii\n\n" + validRadii.map((r) => `- **${r.label}**: \`${r.value}\``).join("\n")
    );
  }
  const validSpacing = settings.spacing.filter((s) => s.label && s.value);
  if (validSpacing.length > 0) {
    sections.push(
      "### Spacing\n\n" + validSpacing.map((s) => `- **${s.label}**: \`${s.value}\``).join("\n")
    );
  }
  if (settings.usageSummaries) {
    const categoryMap = [
      { key: "colors", display: "Colors", hasTokens: validColors.length > 0 },
      { key: "fonts", display: "Fonts", hasTokens: validFonts.length > 0 },
      { key: "radii", display: "Border Radii", hasTokens: validRadii.length > 0 },
      { key: "spacing", display: "Spacing", hasTokens: validSpacing.length > 0 }
    ];
    const usageSubsections = [];
    for (const cat of categoryMap) {
      const summary = (_a = settings.usageSummaries[cat.key]) == null ? void 0 : _a.trim();
      if (summary && cat.hasTokens) {
        usageSubsections.push(`#### ${cat.display}

${summary}`);
      }
    }
    if (usageSubsections.length > 0) {
      sections.push("### Usage Guide\n\n" + usageSubsections.join("\n\n"));
    }
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
  return settings.colors.some((c) => c.name && c.hex) || settings.fonts.some((f) => f.role && f.value) || settings.voiceNotes.trim().length > 0 || settings.assets.some((a) => a.label && a.path) || settings.radii.some((r) => r.label && r.value) || settings.spacing.some((s) => s.label && s.value);
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
        hasData && (syncStatus === "not-exported" || syncStatus === "needs-update") && project && /* @__PURE__ */ jsx("div", { style: {
          fontSize: 11,
          color: syncStatus === "not-exported" ? theme.textMuted : STATUS_COLORS["needs-update"],
          textAlign: "center",
          lineHeight: 1.4
        }, children: syncStatus === "not-exported" ? `Your brand guidelines haven’t been added to ${settings.targetFile} yet.` : `Your brand guidelines have changed since the last export.` }),
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
const PRIVATE_IP_PATTERNS = [
  /^127\./,
  // 127.0.0.0/8 loopback
  /^10\./,
  // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  // 172.16.0.0/12
  /^192\.168\./,
  // 192.168.0.0/16
  /^169\.254\./,
  // 169.254.0.0/16 link-local
  /^0\./
  // 0.0.0.0/8
];
const BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
  "localhost",
  "0.0.0.0",
  "[::1]",
  "[::ffff:127.0.0.1]"
]);
const SHELL_META_RE = /[;|&$`\\!(){}<>'"]/;
function extractRawHost(url) {
  const match = url.match(/^https?:\/\/([^/:?#]+)/i);
  return match ? match[1] : null;
}
function validateUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return { valid: false };
  if (SHELL_META_RE.test(trimmed)) {
    return { valid: false, error: "URL contains invalid characters" };
  }
  const rawHost = extractRawHost(trimmed);
  if (rawHost) {
    if (/^\d+$/.test(rawHost)) {
      return { valid: false, error: "Numeric IP addresses are not allowed" };
    }
    if (/^0x/i.test(rawHost)) {
      return { valid: false, error: "Hex IP addresses are not allowed" };
    }
  }
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Only http and https URLs are supported" };
  }
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { valid: false, error: "Local addresses are not allowed" };
  }
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    if (PRIVATE_IP_PATTERNS.some((re) => re.test(hostname))) {
      return { valid: false, error: "Private network addresses are not allowed" };
    }
  }
  return { valid: true };
}
function UrlInputView({ onExtract, initialUrl }) {
  const theme = useTheme();
  const [value, setValue] = useState(initialUrl || "");
  const [error, setError] = useState(void 0);
  const [hasTyped, setHasTyped] = useState(false);
  const [validated, setValidated] = useState(false);
  const timerRef = useRef(null);
  const runValidation = useCallback(
    (input) => {
      const trimmed = input.trim();
      if (!trimmed) {
        setError(void 0);
        setValidated(false);
        return;
      }
      const result = validateUrl(trimmed);
      setError(result.valid ? void 0 : result.error);
      setValidated(true);
    },
    []
  );
  useEffect(() => {
    if (initialUrl) {
      setHasTyped(true);
      runValidation(initialUrl);
    }
  }, []);
  const handleChange = (input) => {
    setValue(input);
    if (!hasTyped) setHasTyped(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runValidation(input);
    }, 300);
  };
  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || error || !validated) return;
    onExtract(trimmed);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  const isDisabled = !value.trim() || !!error || !validated;
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "bg-plugin-input",
          type: "text",
          value,
          onChange: (e) => handleChange(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: "https://example.com",
          style: {
            borderColor: hasTyped && error ? theme.error : theme.border,
            color: theme.textPrimary,
            width: "100%"
          }
        }
      ),
      hasTyped && error && /* @__PURE__ */ jsx("div", { className: "bg-plugin-url-hint", style: { color: theme.error }, children: error })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-plugin-extract-btn",
        onClick: handleSubmit,
        disabled: isDisabled,
        style: {
          backgroundColor: theme.action,
          color: theme.actionText,
          width: "100%"
        },
        children: "Extract Brand"
      }
    )
  ] });
}
const ANALYZE_HINTS = [
  "Reading design tokens...",
  "Identifying brand colors...",
  "Classifying fonts...",
  "Analyzing voice & tone...",
  "Generating usage guidance...",
  "Almost there..."
];
function ExtractionView({ state, onCancel }) {
  const theme = useTheme();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const timerRef = useRef();
  const analyzeStep = state.steps.find((s) => s.id === "analyze");
  const isAnalyzing = (analyzeStep == null ? void 0 : analyzeStep.status) === "active";
  useEffect(() => {
    if (isAnalyzing) {
      setElapsed(0);
      setHintIndex(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1e3);
      return () => clearInterval(timerRef.current);
    }
    clearInterval(timerRef.current);
  }, [isAnalyzing]);
  useEffect(() => {
    if (isAnalyzing && elapsed > 0 && elapsed % 8 === 0) {
      setHintIndex((prev) => Math.min(prev + 1, ANALYZE_HINTS.length - 1));
    }
  }, [isAnalyzing, elapsed]);
  const doneCount = state.steps.filter((s) => s.status === "done").length;
  const total = state.steps.length;
  const progressPct = total > 0 ? Math.round(doneCount / total * 100) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "bg-plugin-extraction-view", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-plugin-extraction-progress-track", style: { backgroundColor: theme.bgTertiary }, children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-plugin-extraction-progress-fill",
        style: {
          width: `${progressPct}%`,
          backgroundColor: theme.action
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-plugin-extraction-domain", style: { color: theme.textMuted }, children: [
      "Extracting from ",
      state.domain
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-plugin-extraction-steps", children: state.steps.map((step) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-step", children: [
      /* @__PURE__ */ jsxs("span", { className: "bg-plugin-step-icon", children: [
        step.status === "done" && /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: [
          /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "7", fill: theme.success, opacity: "0.15" }),
          /* @__PURE__ */ jsx("path", { d: "M4 7.2L6 9.2L10 5", stroke: theme.success, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
        ] }),
        step.status === "active" && /* @__PURE__ */ jsx("span", { className: "bg-plugin-spinner", style: { borderColor: `${theme.action}33`, borderTopColor: theme.action } }),
        step.status === "error" && /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: [
          /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "7", fill: theme.error, opacity: "0.15" }),
          /* @__PURE__ */ jsx("path", { d: "M5 5L9 9M9 5L5 9", stroke: theme.error, strokeWidth: "1.5", strokeLinecap: "round" })
        ] }),
        step.status === "pending" && /* @__PURE__ */ jsx(
          "span",
          {
            className: "bg-plugin-step-dot",
            style: { backgroundColor: theme.textMuted, opacity: 0.3 }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-plugin-step-content", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-plugin-step-label",
            style: {
              color: step.status === "error" ? theme.error : step.status === "pending" ? theme.textMuted : theme.textPrimary,
              fontWeight: step.status === "active" ? 500 : 400
            },
            children: step.label
          }
        ),
        step.detail && step.status === "active" && /* @__PURE__ */ jsx("div", { className: "bg-plugin-step-detail", style: { color: theme.textMuted }, children: step.detail }),
        step.id === "analyze" && step.status === "active" && /* @__PURE__ */ jsxs("div", { className: "bg-plugin-step-detail", style: { color: theme.textMuted }, children: [
          ANALYZE_HINTS[hintIndex],
          elapsed > 3 && /* @__PURE__ */ jsxs("span", { style: { marginLeft: 6, opacity: 0.5 }, children: [
            elapsed,
            "s"
          ] })
        ] })
      ] })
    ] }, step.id)) }),
    state.error && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-plugin-error-block",
        style: { backgroundColor: theme.bgTertiary, borderColor: theme.border },
        children: [
          /* @__PURE__ */ jsx("div", { className: "bg-plugin-error-headline", style: { color: theme.error }, children: state.error.headline }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-plugin-error-toggle",
              onClick: () => setDetailsExpanded(!detailsExpanded),
              children: detailsExpanded ? "Hide details" : "Show details"
            }
          ),
          detailsExpanded && /* @__PURE__ */ jsx("div", { className: "bg-plugin-error-detail", children: state.error.detail }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-plugin-export-btn",
              onClick: onCancel,
              style: {
                backgroundColor: theme.action,
                color: theme.actionText,
                marginTop: "8px"
              },
              children: "Try Again"
            }
          )
        ]
      }
    ),
    !state.error && /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-plugin-cancel-btn",
        onClick: onCancel,
        style: { color: theme.textMuted },
        children: "Cancel"
      }
    )
  ] });
}
function prepareTokens(analysis) {
  const colors = analysis.colors.map((c) => ({
    id: crypto.randomUUID(),
    name: c.name,
    hex: c.hex
  }));
  const fonts = analysis.fonts.map((f) => ({
    id: crypto.randomUUID(),
    role: f.role,
    value: f.value
  }));
  const radii = (analysis.radii || []).map((r) => ({
    id: crypto.randomUUID(),
    label: r.label,
    value: r.value
  }));
  const spacing = (analysis.spacing || []).map((s) => ({
    id: crypto.randomUUID(),
    label: s.label,
    value: s.value
  }));
  const defaultSummaries = { colors: "", fonts: "", radii: "", spacing: "" };
  const usageSummaries = { ...defaultSummaries, ...analysis.usageSummaries || {} };
  return { colors, fonts, voiceNotes: analysis.voiceNotes, radii, spacing, usageSummaries };
}
function mergeTokens(existing, accepted) {
  let voiceNotes = existing.voiceNotes;
  if (accepted.voiceNotes !== null) {
    if (existing.voiceNotes === "") {
      voiceNotes = accepted.voiceNotes;
    } else {
      voiceNotes = existing.voiceNotes + "\n\n" + accepted.voiceNotes;
    }
  }
  return {
    ...existing,
    colors: [...existing.colors, ...accepted.colors],
    fonts: [...existing.fonts, ...accepted.fonts],
    voiceNotes,
    radii: [...existing.radii, ...accepted.radii],
    spacing: [...existing.spacing, ...accepted.spacing],
    usageSummaries: accepted.usageSummaries || existing.usageSummaries
  };
}
function filterUsageSummary(summary, deselectedTokens) {
  if (!summary || deselectedTokens.length === 0) return summary;
  const sentences = summary.split(new RegExp("(?<=[.!?])\\s+"));
  const filtered = sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return !deselectedTokens.some(
      (token) => lower.includes(token.name.toLowerCase()) || lower.includes(token.value.toLowerCase())
    );
  });
  return filtered.join(" ").trim();
}
const TABS$1 = [
  { key: "colors", label: "Colors" },
  { key: "fonts", label: "Fonts" },
  { key: "voice", label: "Voice" },
  { key: "radii", label: "Radii" },
  { key: "spacing", label: "Spacing" }
];
function Checkbox({ checked, onChange, accent, style }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "checkbox",
      "aria-checked": checked,
      tabIndex: 0,
      onClick: onChange,
      onKeyDown: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange();
        }
      },
      style: {
        width: 16,
        height: 16,
        minWidth: 16,
        minHeight: 16,
        borderRadius: 4,
        border: checked ? `1.5px solid ${accent}` : "1.5px solid rgba(255, 255, 255, 0.3)",
        background: checked ? accent : "transparent",
        cursor: "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.12s, border-color 0.12s",
        ...style
      },
      children: checked && /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M2 5.2L4.2 7.4L8.2 2.8", stroke: "#fff", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) })
    }
  );
}
function ReviewView({ analysis, onApply, onTryAnother, onDiscard }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("colors");
  const initial = useMemo(() => prepareTokens(analysis), [analysis]);
  const [colors, setColors] = useState(initial.colors);
  const [fonts, setFonts] = useState(initial.fonts);
  const [voiceNotes, setVoiceNotes] = useState(initial.voiceNotes);
  const [radii, setRadii] = useState(initial.radii);
  const [spacing, setSpacing] = useState(initial.spacing);
  const [usageSummaries, setUsageSummaries] = useState(initial.usageSummaries);
  const updateSummary = useCallback((key, value) => {
    setUsageSummaries((prev) => ({ ...prev, [key]: value }));
  }, []);
  const [selected, setSelected] = useState(() => {
    const map = {};
    initial.colors.forEach((c) => {
      map[c.id] = true;
    });
    initial.fonts.forEach((f) => {
      map[f.id] = true;
    });
    if (initial.voiceNotes) map["voice"] = true;
    initial.radii.forEach((r) => {
      map[r.id] = true;
    });
    initial.spacing.forEach((s) => {
      map[s.id] = true;
    });
    return map;
  });
  const toggle = useCallback((id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);
  const toggleAll = useCallback((ids, selectAll) => {
    setSelected((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        next[id] = selectAll;
      });
      return next;
    });
  }, []);
  const updateColor = useCallback((id, field, value) => {
    setColors((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }, []);
  const updateFont = useCallback((id, field, value) => {
    setFonts((prev) => prev.map((f) => f.id === id ? { ...f, [field]: value } : f));
  }, []);
  const updateRadius = useCallback((id, field, value) => {
    setRadii((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }, []);
  const updateSpacingItem = useCallback((id, field, value) => {
    setSpacing((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }, []);
  const displayedSummaries = useMemo(() => {
    const deselectedColors = colors.filter((c) => !selected[c.id]).map((c) => ({ name: c.name, value: c.hex }));
    const deselectedFonts = fonts.filter((f) => !selected[f.id]).map((f) => ({ name: f.role, value: f.value }));
    const deselectedRadii = radii.filter((r) => !selected[r.id]).map((r) => ({ name: r.label, value: r.value }));
    const deselectedSpacing = spacing.filter((s) => !selected[s.id]).map((s) => ({ name: s.label, value: s.value }));
    return {
      colors: filterUsageSummary(usageSummaries.colors, deselectedColors),
      fonts: filterUsageSummary(usageSummaries.fonts, deselectedFonts),
      radii: filterUsageSummary(usageSummaries.radii, deselectedRadii),
      spacing: filterUsageSummary(usageSummaries.spacing, deselectedSpacing)
    };
  }, [usageSummaries, colors, fonts, radii, spacing, selected]);
  const selectedColorIds = colors.filter((c) => selected[c.id]).map((c) => c.id);
  const selectedFontIds = fonts.filter((f) => selected[f.id]).map((f) => f.id);
  const voiceSelected = !!selected["voice"] && voiceNotes.trim().length > 0;
  const selectedRadiiIds = radii.filter((r) => selected[r.id]).map((r) => r.id);
  const selectedSpacingIds = spacing.filter((s) => selected[s.id]).map((s) => s.id);
  const totalSelected = selectedColorIds.length + selectedFontIds.length + (voiceSelected ? 1 : 0) + selectedRadiiIds.length + selectedSpacingIds.length;
  const allColorsSelected = colors.length > 0 && selectedColorIds.length === colors.length;
  const allFontsSelected = fonts.length > 0 && selectedFontIds.length === fonts.length;
  const allRadiiSelected = radii.length > 0 && selectedRadiiIds.length === radii.length;
  const allSpacingSelected = spacing.length > 0 && selectedSpacingIds.length === spacing.length;
  const handleApply = () => {
    const acceptedColors = colors.filter((c) => selected[c.id]);
    const acceptedFonts = fonts.filter((f) => selected[f.id]);
    const acceptedVoice = voiceSelected ? voiceNotes : null;
    const acceptedRadii = radii.filter((r) => selected[r.id]);
    const acceptedSpacing = spacing.filter((s) => selected[s.id]);
    onApply(acceptedColors, acceptedFonts, acceptedVoice, acceptedRadii, acceptedSpacing, displayedSummaries);
  };
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-plugin-review-header", style: { borderBottomColor: theme.border }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: 12, fontWeight: 500, color: theme.textSecondary }, children: "Review extracted tokens" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-plugin-review-select-toggle",
            onClick: onTryAnother,
            style: { color: theme.accent },
            children: "Try another URL"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-plugin-review-select-toggle",
            onClick: onDiscard,
            style: { color: theme.textMuted },
            children: "Discard"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-plugin-tabs", style: { borderBottomColor: theme.border }, children: TABS$1.map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        className: `bg-plugin-tab${activeTab === tab.key ? " bg-plugin-tab--active" : ""}`,
        onClick: () => setActiveTab(tab.key),
        children: [
          tab.label,
          tab.key === "colors" && colors.length > 0 && /* @__PURE__ */ jsxs("span", { style: { marginLeft: 4, opacity: 0.5, fontSize: 11 }, children: [
            "(",
            selectedColorIds.length,
            ")"
          ] }),
          tab.key === "fonts" && fonts.length > 0 && /* @__PURE__ */ jsxs("span", { style: { marginLeft: 4, opacity: 0.5, fontSize: 11 }, children: [
            "(",
            selectedFontIds.length,
            ")"
          ] }),
          tab.key === "radii" && radii.length > 0 && /* @__PURE__ */ jsxs("span", { style: { marginLeft: 4, opacity: 0.5, fontSize: 11 }, children: [
            "(",
            selectedRadiiIds.length,
            ")"
          ] }),
          tab.key === "spacing" && spacing.length > 0 && /* @__PURE__ */ jsxs("span", { style: { marginLeft: 4, opacity: 0.5, fontSize: 11 }, children: [
            "(",
            selectedSpacingIds.length,
            ")"
          ] })
        ]
      },
      tab.key
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-plugin-modal-body", children: [
      activeTab === "colors" && /* @__PURE__ */ jsx("div", { className: "bg-plugin-section", children: colors.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-plugin-review-empty", style: { color: theme.textMuted }, children: "No colors extracted" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        usageSummaries.colors && /* @__PURE__ */ jsxs("div", { className: "bg-plugin-usage-summary", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-plugin-usage-summary-label", style: { color: theme.textMuted }, children: "Usage guidance" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "bg-plugin-usage-summary-textarea",
              value: displayedSummaries.colors,
              onChange: (e) => updateSummary("colors", e.target.value),
              style: { borderColor: theme.border }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-plugin-review-section-header", children: [
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, fontWeight: 500, color: theme.textSecondary }, children: [
            selectedColorIds.length,
            " of ",
            colors.length,
            " selected"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-plugin-review-select-toggle",
              onClick: () => toggleAll(colors.map((c) => c.id), !allColorsSelected),
              style: { color: theme.accent },
              children: allColorsSelected ? "Deselect all" : "Select all"
            }
          )
        ] }),
        colors.map((color) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: !!selected[color.id],
              onChange: () => toggle(color.id),
              accent: "rgba(255,255,255,0.35)"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "bg-plugin-swatch-wrapper", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-plugin-swatch",
              style: { background: color.hex }
            }
          ) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input bg-plugin-input--name",
              value: color.name,
              onChange: (e) => updateColor(color.id, "name", e.target.value),
              style: { borderColor: theme.border },
              placeholder: "Color name"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input bg-plugin-input--hex",
              value: color.hex,
              onChange: (e) => {
                let v = e.target.value.toUpperCase();
                if (!v.startsWith("#")) v = "#" + v;
                if (v.length <= 7) updateColor(color.id, "hex", v);
              },
              style: { borderColor: theme.border },
              placeholder: "#000000"
            }
          )
        ] }, color.id))
      ] }) }),
      activeTab === "fonts" && /* @__PURE__ */ jsx("div", { className: "bg-plugin-section", children: fonts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-plugin-review-empty", style: { color: theme.textMuted }, children: "No fonts extracted" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        usageSummaries.fonts && /* @__PURE__ */ jsxs("div", { className: "bg-plugin-usage-summary", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-plugin-usage-summary-label", style: { color: theme.textMuted }, children: "Usage guidance" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "bg-plugin-usage-summary-textarea",
              value: displayedSummaries.fonts,
              onChange: (e) => updateSummary("fonts", e.target.value),
              style: { borderColor: theme.border }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-plugin-review-section-header", children: [
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, fontWeight: 500, color: theme.textSecondary }, children: [
            selectedFontIds.length,
            " of ",
            fonts.length,
            " selected"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-plugin-review-select-toggle",
              onClick: () => toggleAll(fonts.map((f) => f.id), !allFontsSelected),
              style: { color: theme.accent },
              children: allFontsSelected ? "Deselect all" : "Select all"
            }
          )
        ] }),
        fonts.map((font) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: !!selected[font.id],
              onChange: () => toggle(font.id),
              accent: "rgba(255,255,255,0.35)"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input",
              value: font.role,
              onChange: (e) => updateFont(font.id, "role", e.target.value),
              style: { borderColor: theme.border, flex: "0 0 120px" },
              placeholder: "Role"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input",
              value: font.value,
              onChange: (e) => updateFont(font.id, "value", e.target.value),
              style: { borderColor: theme.border },
              placeholder: "Font family"
            }
          )
        ] }, font.id))
      ] }) }),
      activeTab === "voice" && /* @__PURE__ */ jsx("div", { className: "bg-plugin-section", children: !initial.voiceNotes ? /* @__PURE__ */ jsx("div", { className: "bg-plugin-review-empty", style: { color: theme.textMuted }, children: "No voice notes extracted" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-plugin-review-section-header", children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 500, color: theme.textSecondary }, children: "Voice & Tone" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-plugin-review-select-toggle",
              onClick: () => toggle("voice"),
              style: { color: theme.accent },
              children: selected["voice"] ? "Deselect" : "Select"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", style: { alignItems: "flex-start" }, children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: !!selected["voice"],
              onChange: () => toggle("voice"),
              accent: "rgba(255,255,255,0.35)",
              style: { marginTop: 10 }
            }
          ),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "bg-plugin-textarea",
              value: voiceNotes,
              onChange: (e) => setVoiceNotes(e.target.value),
              style: { borderColor: theme.border, flex: 1 }
            }
          )
        ] })
      ] }) }),
      activeTab === "radii" && /* @__PURE__ */ jsx("div", { className: "bg-plugin-section", children: radii.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-plugin-review-empty", style: { color: theme.textMuted }, children: "No border radii extracted" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        usageSummaries.radii && /* @__PURE__ */ jsxs("div", { className: "bg-plugin-usage-summary", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-plugin-usage-summary-label", style: { color: theme.textMuted }, children: "Usage guidance" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "bg-plugin-usage-summary-textarea",
              value: displayedSummaries.radii,
              onChange: (e) => updateSummary("radii", e.target.value),
              style: { borderColor: theme.border }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-plugin-review-section-header", children: [
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, fontWeight: 500, color: theme.textSecondary }, children: [
            selectedRadiiIds.length,
            " of ",
            radii.length,
            " selected"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-plugin-review-select-toggle",
              onClick: () => toggleAll(radii.map((r) => r.id), !allRadiiSelected),
              style: { color: theme.accent },
              children: allRadiiSelected ? "Deselect all" : "Select all"
            }
          )
        ] }),
        radii.map((radius) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: !!selected[radius.id],
              onChange: () => toggle(radius.id),
              accent: "rgba(255,255,255,0.35)"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input bg-plugin-input--name",
              value: radius.label,
              onChange: (e) => updateRadius(radius.id, "label", e.target.value),
              style: { borderColor: theme.border },
              placeholder: "Label"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input bg-plugin-input--hex",
              value: radius.value,
              onChange: (e) => updateRadius(radius.id, "value", e.target.value),
              style: { borderColor: theme.border },
              placeholder: "Value"
            }
          )
        ] }, radius.id))
      ] }) }),
      activeTab === "spacing" && /* @__PURE__ */ jsx("div", { className: "bg-plugin-section", children: spacing.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-plugin-review-empty", style: { color: theme.textMuted }, children: "No spacing values extracted" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        usageSummaries.spacing && /* @__PURE__ */ jsxs("div", { className: "bg-plugin-usage-summary", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-plugin-usage-summary-label", style: { color: theme.textMuted }, children: "Usage guidance" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "bg-plugin-usage-summary-textarea",
              value: displayedSummaries.spacing,
              onChange: (e) => updateSummary("spacing", e.target.value),
              style: { borderColor: theme.border }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-plugin-review-section-header", children: [
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, fontWeight: 500, color: theme.textSecondary }, children: [
            selectedSpacingIds.length,
            " of ",
            spacing.length,
            " selected"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-plugin-review-select-toggle",
              onClick: () => toggleAll(spacing.map((s) => s.id), !allSpacingSelected),
              style: { color: theme.accent },
              children: allSpacingSelected ? "Deselect all" : "Select all"
            }
          )
        ] }),
        spacing.map((item) => /* @__PURE__ */ jsxs("div", { className: "bg-plugin-row", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: !!selected[item.id],
              onChange: () => toggle(item.id),
              accent: "rgba(255,255,255,0.35)"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input bg-plugin-input--name",
              value: item.label,
              onChange: (e) => updateSpacingItem(item.id, "label", e.target.value),
              style: { borderColor: theme.border },
              placeholder: "Label"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bg-plugin-input bg-plugin-input--hex",
              value: item.value,
              onChange: (e) => updateSpacingItem(item.id, "value", e.target.value),
              style: { borderColor: theme.border },
              placeholder: "Value"
            }
          )
        ] }, item.id))
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-plugin-footer", style: { borderTopColor: theme.border }, children: /* @__PURE__ */ jsxs(
      "button",
      {
        className: "bg-plugin-review-apply-btn",
        disabled: totalSelected === 0,
        onClick: handleApply,
        style: {
          background: theme.action,
          color: theme.actionText,
          opacity: totalSelected === 0 ? 0.5 : 1
        },
        children: [
          "Apply ",
          totalSelected,
          " selected"
        ]
      }
    ) })
  ] });
}
const DEFAULT_SETTINGS = {
  colors: [],
  fonts: [],
  voiceNotes: "",
  assets: [],
  radii: [],
  spacing: [],
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
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const MAX_STYLESHEETS = 20;
function curlError(exitCode, stderr) {
  if (exitCode === 0) return null;
  if (exitCode === 28) return new Error("Site took too long to respond");
  if (exitCode === 63) return new Error("Response too large");
  return new Error(stderr || "Unknown error");
}
async function fetchHtml(shell, url) {
  const result = await shell.exec(
    "curl",
    [
      "-s",
      "-L",
      "--max-time",
      "30",
      "--max-redirs",
      "5",
      "--max-filesize",
      "5000000",
      "-A",
      USER_AGENT,
      "-D",
      "/dev/stderr",
      url
    ],
    { timeout: 35e3 }
  );
  const err = curlError(result.exit_code, result.stderr);
  if (err) throw err;
  return { html: result.stdout, headers: result.stderr };
}
async function fetchCss(shell, url) {
  const result = await shell.exec(
    "curl",
    [
      "-s",
      "-L",
      "--max-time",
      "30",
      "--max-redirs",
      "5",
      "--max-filesize",
      "5000000",
      "-A",
      USER_AGENT,
      url
    ],
    { timeout: 35e3 }
  );
  const err = curlError(result.exit_code, result.stderr);
  if (err) throw err;
  return result.stdout;
}
function extractStylesheetUrls(html, pageUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = doc.querySelectorAll('link[rel="stylesheet"]');
  const urls = [];
  for (const link of links) {
    if (urls.length >= MAX_STYLESHEETS) break;
    const href = link.getAttribute("href");
    if (!href) continue;
    try {
      const resolved = new URL(href, pageUrl).toString();
      urls.push(resolved);
    } catch {
    }
  }
  return urls;
}
function detectBotProtection(html, headers) {
  var _a;
  if (/cf-mitigated:\s*challenge/i.test(headers)) {
    return { isBlocked: true, provider: "Cloudflare", detail: "Cloudflare challenge detected" };
  }
  if (html.includes("__cf_chl") || html.includes("cf-browser-verification")) {
    return { isBlocked: true, provider: "Cloudflare", detail: "Cloudflare browser verification page" };
  }
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = ((_a = titleMatch == null ? void 0 : titleMatch[1]) == null ? void 0 : _a.toLowerCase()) || "";
  if (title.includes("just a moment") || title.includes("attention required")) {
    return { isBlocked: true, provider: "Cloudflare", detail: "Cloudflare interstitial page" };
  }
  if (html.includes("_abck") || html.includes("akam-challenge")) {
    return { isBlocked: true, provider: "Akamai", detail: "Akamai bot challenge detected" };
  }
  if (html.includes("g-recaptcha") || html.includes("h-captcha")) {
    return { isBlocked: true, provider: "CAPTCHA", detail: "CAPTCHA challenge page detected" };
  }
  return { isBlocked: false };
}
const NAMED_COLORS = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
const RGB_RE = /rgba?\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?(?:\s*[/,]\s*[\d.]+%?)?\s*\)/gi;
const HSL_RE = /hsla?\(\s*[\d.]+(?:deg|rad|grad|turn)?\s*[,\s]\s*[\d.]+%\s*[,\s]\s*[\d.]+%(?:\s*[/,]\s*[\d.]+%?)?\s*\)/gi;
const CSS_VAR_COLOR_RE = /(--[\w-]+)\s*:\s*(#(?:[0-9a-fA-F]{3,4}){1,2}\b|rgba?\([^)]+\)|hsla?\([^)]+\))/g;
const FONT_FAMILY_RE = /font-family\s*:\s*([^;}]+)/gi;
const FONT_SHORTHAND_RE = /font\s*:\s*(?:(?:italic|oblique|normal|small-caps|bold|bolder|lighter|\d+)\s+)*[\d.]+(?:px|rem|em|%|pt)\s*(?:\/\s*[\d.]+(?:px|rem|em|%)?\s*)?([^;}]+)/gi;
const GENERIC_FONTS = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "inherit",
  "initial",
  "unset"
];
function expandHex(hex) {
  const h = hex.replace("#", "").toLowerCase();
  if (h.length === 3) return "#" + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length === 4) return "#" + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length === 8) return "#" + h.slice(0, 6);
  return "#" + h;
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)));
    return clamped.toString(16).padStart(2, "0");
  }).join("");
}
function hslToHex(h, s, l) {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(1, s / 100));
  l = Math.max(0, Math.min(1, l / 100));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(h / 60 % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
}
function parseRgbValues(value) {
  const m = value.match(/rgba?\(\s*([\d.]+)%?\s*[,\s]\s*([\d.]+)%?\s*[,\s]\s*([\d.]+)%?/i);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
}
function parseHslValues(value) {
  const m = value.match(/hsla?\(\s*([\d.]+)(?:deg|rad|grad|turn)?\s*[,\s]\s*([\d.]+)%\s*[,\s]\s*([\d.]+)%/i);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
}
function normalizeToHex(value) {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith("#")) {
    const stripped = trimmed.replace("#", "");
    if (/^[0-9a-f]{3,8}$/.test(stripped)) {
      return expandHex(trimmed);
    }
    return null;
  }
  if (trimmed.startsWith("rgb")) {
    const vals = parseRgbValues(trimmed);
    if (vals) return rgbToHex(vals[0], vals[1], vals[2]);
    return null;
  }
  if (trimmed.startsWith("hsl")) {
    const vals = parseHslValues(trimmed);
    if (vals) return hslToHex(vals[0], vals[1], vals[2]);
    return null;
  }
  if (NAMED_COLORS[trimmed]) {
    return NAMED_COLORS[trimmed];
  }
  return null;
}
function extractColors(cssTexts) {
  const colors = [];
  const seenHex = /* @__PURE__ */ new Map();
  const combined = cssTexts.join("\n");
  if (!combined.trim()) return [];
  function addColor(value, hex, varName) {
    const normalizedHex = hex.toLowerCase();
    const existing = seenHex.get(normalizedHex);
    if (existing !== void 0) {
      colors[existing].count++;
      return;
    }
    seenHex.set(normalizedHex, colors.length);
    const entry = { value, hex: normalizedHex, count: 1 };
    if (varName) entry.varName = varName;
    colors.push(entry);
  }
  let match;
  const varRe = new RegExp(CSS_VAR_COLOR_RE.source, CSS_VAR_COLOR_RE.flags);
  while (match = varRe.exec(combined)) {
    const hex = normalizeToHex(match[2]);
    if (hex) addColor(match[2], hex, match[1]);
  }
  const hexRe = new RegExp(HEX_RE.source, HEX_RE.flags);
  while (match = hexRe.exec(combined)) {
    const hex = normalizeToHex(match[0]);
    if (hex) addColor(match[0], hex);
  }
  const rgbRe = new RegExp(RGB_RE.source, RGB_RE.flags);
  while (match = rgbRe.exec(combined)) {
    const hex = normalizeToHex(match[0]);
    if (hex) addColor(match[0], hex);
  }
  const hslRe = new RegExp(HSL_RE.source, HSL_RE.flags);
  while (match = hslRe.exec(combined)) {
    const hex = normalizeToHex(match[0]);
    if (hex) addColor(match[0], hex);
  }
  const propValueRe = /(?:color|background(?:-color)?)\s*:\s*([a-z]+)\s*[;}\s]/gi;
  let propMatch;
  const propRe = new RegExp(propValueRe.source, propValueRe.flags);
  while (propMatch = propRe.exec(combined)) {
    const name2 = propMatch[1].toLowerCase();
    if (NAMED_COLORS[name2]) {
      addColor(propMatch[1], NAMED_COLORS[name2]);
    }
  }
  colors.sort((a, b) => b.count - a.count);
  return colors;
}
function parseFontFamilies(raw) {
  return raw.split(",").map((f) => f.trim().replace(/^["']|["']$/g, "")).filter((f) => f && !GENERIC_FONTS.includes(f.toLowerCase()));
}
function extractFonts(cssTexts) {
  const fonts = /* @__PURE__ */ new Set();
  const combined = cssTexts.join("\n");
  let match;
  const ffRe = new RegExp(FONT_FAMILY_RE.source, FONT_FAMILY_RE.flags);
  while (match = ffRe.exec(combined)) {
    for (const f of parseFontFamilies(match[1])) {
      fonts.add(f);
    }
  }
  const fsRe = new RegExp(FONT_SHORTHAND_RE.source, FONT_SHORTHAND_RE.flags);
  while (match = fsRe.exec(combined)) {
    for (const f of parseFontFamilies(match[1])) {
      fonts.add(f);
    }
  }
  return Array.from(fonts);
}
function extractVisibleText(html) {
  var _a;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const removeTags = ["script", "style", "nav", "footer", "header", "noscript", "svg", "iframe"];
  for (const tag of removeTags) {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  }
  const text = (((_a = doc.body) == null ? void 0 : _a.textContent) || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 1e4);
}
function extractRadii(cssTexts) {
  const values = /* @__PURE__ */ new Set();
  const combined = cssTexts.join("\n");
  const skipValues = /* @__PURE__ */ new Set(["0", "0px", "inherit", "initial", "unset", "revert", "none"]);
  const re = new RegExp(
    /border(?:-top-left|-top-right|-bottom-left|-bottom-right)?-radius\s*:\s*([^;}\n]+)/gi.source,
    "gi"
  );
  let match;
  while (match = re.exec(combined)) {
    const val = match[1].trim().toLowerCase();
    if (!skipValues.has(val)) {
      values.add(val);
    }
  }
  return Array.from(values);
}
function extractSpacing(cssTexts) {
  const values = /* @__PURE__ */ new Set();
  const combined = cssTexts.join("\n");
  const skipValues = /* @__PURE__ */ new Set([
    "0",
    "0px",
    "auto",
    "inherit",
    "initial",
    "unset",
    "revert",
    "none",
    "normal"
  ]);
  const re = new RegExp(
    /(?:padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left))?\s*:\s*([^;}\n]+)/gi.source,
    "gi"
  );
  let match;
  while (match = re.exec(combined)) {
    const parts = match[1].trim().toLowerCase().split(/\s+/);
    for (const part of parts) {
      if (!skipValues.has(part) && /^[\d.]/.test(part)) {
        values.add(part);
      }
    }
  }
  return Array.from(values);
}
function extractEmbeddedStyles(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const styles = [];
  doc.querySelectorAll("style").forEach((el) => {
    var _a;
    const text = (_a = el.textContent) == null ? void 0 : _a.trim();
    if (text) styles.push(text);
  });
  return styles;
}
const MAX_PROMPT_SIZE = 1e5;
function buildPrompt(colors, fonts, visibleText, radii = [], spacing = []) {
  const colorList = colors.length > 0 ? colors.map((c) => {
    const parts = [c.hex];
    if (c.varName) parts.push(`var: ${c.varName}`);
    if (c.count > 1) parts.push(`used ${c.count}x`);
    return parts.join(" — ");
  }).join("\n") : "(none found)";
  const fontList = fonts.length > 0 ? fonts.join(", ") : "(none found)";
  const radiiList = radii.length > 0 ? radii.join(", ") : "(none found)";
  const spacingList = spacing.length > 0 ? spacing.join(", ") : "(none found)";
  const instructions = `You are a brand design analyst. Analyze the following extracted design tokens from a website and produce a structured brand analysis.

## Extracted Colors
${colorList}

## Extracted Fonts
${fontList}

## Page Text
${visibleText}

## Extracted Border Radii
${radiiList}

## Extracted Spacing Values
${spacingList}

## Instructions

1. Select 8-15 of the most meaningful colors from the list above. Colors are sorted by usage frequency — strongly prefer colors used more often (higher "used Nx" counts) as these are the brand's core palette. Assign each a creative semantic name that reflects the brand identity (e.g. "Midnight Navy", "Coral Accent", "Soft Fog"). IMPORTANT: You MUST include background and surface colors (whites, near-whites, light grays for light themes; dark colors for dark themes) — these define the brand's visual foundation. Also include text colors. The goal is to capture the complete theme so someone can reproduce the site's look and feel. Name them with their role, e.g. "Page Background", "Card Surface", "Primary Text", "Muted Text".

2. Classify each font into a role: Heading, Body, Mono, Display, or Accent.

3. Generate voice/tone notes as structured bullet points covering:
   - Tone (e.g. professional, playful, authoritative)
   - Vocabulary style (e.g. technical, conversational, formal)
   - Personality traits
   - Do's and Don'ts for writing in this brand voice

4. Select 3-6 meaningful border-radius values and assign descriptive labels (e.g. 'Button', 'Card', 'Pill', 'Circle').

5. Select 4-8 spacing values that form a coherent scale and assign descriptive labels (e.g. 'Tight', 'Base', 'Relaxed', 'Spacious').

6. Generate a usage summary for each token category (colors, fonts, radii, spacing). Each summary should be 2-3 sentences of prose (not bullet points) explaining how to apply those tokens. Reference specific token names and values — for example, 'Use Primary #5C4EFA for CTAs and interactive elements.' The colors summary MUST start by stating the theme direction (light or dark) and which colors to use for page backgrounds, card surfaces, and text — this is critical for reproducing the brand's look. Do NOT generate a summary for voiceNotes — the voice notes already serve as usage guidance.

Output ONLY valid JSON matching this exact schema, with no markdown fences and no explanation:
{
  "colors": [{"name": "string", "hex": "#xxxxxx"}],
  "fonts": [{"role": "string", "value": "string"}],
  "voiceNotes": "string with bullet points using - prefix",
  "radii": [{"label": "string", "value": "string"}],
  "spacing": [{"label": "string", "value": "string"}],
  "usageSummaries": {"colors": "string", "fonts": "string", "radii": "string", "spacing": "string"}
}`;
  if (instructions.length > MAX_PROMPT_SIZE) {
    const overhead = instructions.length - visibleText.length;
    const maxTextLen = MAX_PROMPT_SIZE - overhead - 100;
    const truncatedText = visibleText.slice(0, Math.max(0, maxTextLen));
    return instructions.replace(visibleText, truncatedText + "\n[truncated]");
  }
  return instructions;
}
function parseAnalysisResponse(stdout) {
  const trimmed = stdout.trim();
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
  }
  if (!parsed) {
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      try {
        parsed = JSON.parse(fenceMatch[1]);
      } catch {
      }
    }
  }
  if (!parsed) {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        parsed = JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
      } catch {
      }
    }
  }
  if (!parsed) {
    throw new Error("Failed to parse AI response");
  }
  const empty = { colors: "", fonts: "", radii: "", spacing: "" };
  parsed.usageSummaries = { ...empty, ...parsed.usageSummaries || {} };
  return parsed;
}
async function analyzeTokens(shell, colors, fonts, visibleText, radii = [], spacing = []) {
  const prompt = buildPrompt(colors, fonts, visibleText, radii, spacing);
  const result = await shell.exec(
    "claude",
    ["-p", prompt, "--max-turns", "1", "--output-format", "text"],
    { timeout: 12e4 }
  );
  if (result.exit_code !== 0) {
    throw new Error(result.stderr || "Claude CLI exited with error");
  }
  try {
    return parseAnalysisResponse(result.stdout);
  } catch {
    const strictPrompt = prompt + "\n\nYou MUST output ONLY valid JSON. No other text.";
    const retry = await shell.exec(
      "claude",
      ["-p", strictPrompt, "--max-turns", "1", "--output-format", "text"],
      { timeout: 12e4 }
    );
    if (retry.exit_code !== 0) {
      throw new Error(retry.stderr || "Claude CLI exited with error");
    }
    try {
      return parseAnalysisResponse(retry.stdout);
    } catch {
      throw new Error("AI analysis failed: could not parse response");
    }
  }
}
const INITIAL_STATE = {
  status: "idle",
  steps: [],
  domain: ""
};
function makeSteps() {
  return [
    { id: "fetch", label: "Fetching page...", status: "pending" },
    { id: "css", label: "Loading stylesheets...", status: "pending" },
    { id: "analyze", label: "Analyzing design tokens...", status: "pending" }
  ];
}
function updateStep(steps, id, update) {
  return steps.map((s) => s.id === id ? { ...s, ...update } : s);
}
function mapError(err) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("took too long")) {
    return { headline: "Connection timed out", detail: message };
  }
  if (message.includes("too large")) {
    return { headline: "Page too large to process", detail: message };
  }
  if (message.includes("AI analysis failed") || message.includes("Failed to parse AI")) {
    return { headline: "Could not analyze design tokens", detail: message };
  }
  return { headline: "Could not fetch page", detail: message };
}
function useUrlFetch() {
  const shell = useShell();
  const [state, setState] = useState(INITIAL_STATE);
  const [result, setResult] = useState(null);
  const cancelledRef = useRef(false);
  const startExtraction = useCallback(
    async (url) => {
      cancelledRef.current = false;
      setResult(null);
      let domain;
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = url;
      }
      const steps = makeSteps();
      setState({ status: "extracting", steps, domain });
      try {
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, "fetch", { status: "active" })
        }));
        const { html, headers } = await fetchHtml(shell, url);
        if (cancelledRef.current) return;
        const botCheck = detectBotProtection(html, headers);
        if (botCheck.isBlocked) {
          setState((prev) => ({
            ...prev,
            status: "error",
            steps: updateStep(prev.steps, "fetch", { status: "error" }),
            error: {
              headline: "Site may be bot-protected",
              detail: botCheck.detail || `Protected by ${botCheck.provider || "unknown provider"}`
            }
          }));
          return;
        }
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, "fetch", { status: "done" })
        }));
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, "css", { status: "active" })
        }));
        const cssUrls = extractStylesheetUrls(html, url);
        const cssContents = [];
        for (let i = 0; i < cssUrls.length; i++) {
          if (cancelledRef.current) return;
          setState((prev) => ({
            ...prev,
            steps: updateStep(prev.steps, "css", {
              detail: `Loading stylesheets (${i + 1}/${cssUrls.length})...`
            })
          }));
          try {
            const css = await fetchCss(shell, cssUrls[i]);
            cssContents.push(css);
          } catch {
          }
        }
        if (cancelledRef.current) return;
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, "css", { status: "done", detail: void 0 })
        }));
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, "analyze", { status: "active" })
        }));
        const allCss = [...cssContents, ...extractEmbeddedStyles(html)];
        const rawColors = extractColors(allCss);
        const fontNames = extractFonts(allCss);
        const rawRadii = extractRadii(allCss);
        const rawSpacing = extractSpacing(allCss);
        const visibleText = extractVisibleText(html);
        const analysis = await analyzeTokens(shell, rawColors, fontNames, visibleText, rawRadii, rawSpacing);
        if (cancelledRef.current) return;
        setState((prev) => ({
          ...prev,
          steps: updateStep(prev.steps, "analyze", { status: "done" })
        }));
        const extractionResult = { html, css: cssContents, url, analysis };
        setResult(extractionResult);
        setState((prev) => ({ ...prev, status: "done" }));
      } catch (err) {
        if (cancelledRef.current) return;
        const error = mapError(err);
        setState((prev) => {
          const activeStep = prev.steps.find((s) => s.status === "active");
          const updatedSteps = activeStep ? updateStep(prev.steps, activeStep.id, { status: "error" }) : prev.steps;
          return { ...prev, status: "error", steps: updatedSteps, error };
        });
      }
    },
    [shell]
  );
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setState(INITIAL_STATE);
    setResult(null);
  }, []);
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setResult(null);
  }, []);
  return { state, startExtraction, cancel, reset, result };
}
const USAGE_SUMMARY_TABS = {
  colors: "colors",
  fonts: "fonts",
  radii: "radii",
  spacing: "spacing"
};
const TABS = [
  { key: "colors", label: "Colors" },
  { key: "fonts", label: "Fonts" },
  { key: "voice", label: "Voice" },
  { key: "assets", label: "Assets" },
  { key: "radii", label: "Radii" },
  { key: "spacing", label: "Spacing" }
];
function BrandModal({ onClose }) {
  var _a;
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("colors");
  const { settings, updateSettings, setLastExportedHash, loaded } = useBrandSettings();
  const { syncStatus, checkSync, exportToFile, exporting } = useFileSync(
    settings,
    setLastExportedHash
  );
  const { state: fetchState, startExtraction, cancel, reset, result } = useUrlFetch();
  const showToast = useToast();
  const hasData = loaded && hasBrandData(settings);
  const [view, setView] = useState("tabs");
  const [lastUrl, setLastUrl] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  useEffect(() => {
    if (loaded) {
      setView(hasBrandData(settings) ? "tabs" : "url-cta");
    }
  }, [loaded]);
  useEffect(() => {
    if (loaded) checkSync();
  }, [loaded, settings.colors, settings.fonts, settings.voiceNotes, settings.assets, settings.radii, settings.spacing, settings.targetFile, settings.lastExportedHash]);
  useEffect(() => {
    if (fetchState.status === "done") {
      setView("review");
    }
  }, [fetchState.status]);
  const handleExtract = (url) => {
    setLastUrl(url);
    setView("extracting");
    startExtraction(url);
  };
  const handleCancel = () => {
    cancel();
    if (lastUrl) {
      setView(hasData ? "url-inline" : "url-cta");
    } else {
      setView(hasData ? "tabs" : "url-cta");
    }
  };
  const handleApply = (colors, fonts, voiceNotes, radii, spacing, usageSummaries) => {
    updateSettings((prev) => mergeTokens(prev, { colors, fonts, voiceNotes, radii, spacing, usageSummaries }));
    const parts = [];
    if (colors.length) parts.push(`${colors.length} colors`);
    if (fonts.length) parts.push(`${fonts.length} fonts`);
    if (voiceNotes) parts.push("voice notes");
    if (radii.length) parts.push(`${radii.length} radii`);
    if (spacing.length) parts.push(`${spacing.length} spacing`);
    showToast(`Applied ${parts.join(", ")}`, "success");
    reset();
    setView("tabs");
  };
  const handleTryAnother = () => setConfirmAction("try-another");
  const handleDiscardReview = () => setConfirmAction("discard");
  const confirmDiscard = () => {
    if (confirmAction === "try-another") {
      reset();
      setView(hasData ? "url-inline" : "url-cta");
    } else {
      reset();
      onClose();
    }
    setConfirmAction(null);
  };
  const handleClose = view === "review" ? handleDiscardReview : onClose;
  if (!loaded) {
    return /* @__PURE__ */ jsx(Modal, { onClose: handleClose, title: "Brand Guidelines", children: /* @__PURE__ */ jsx("div", { className: "bg-plugin-modal-body", children: /* @__PURE__ */ jsx("div", { className: "bg-plugin-empty", children: "Loading..." }) }) });
  }
  if (view === "url-cta") {
    return /* @__PURE__ */ jsx(Modal, { onClose: handleClose, title: "Brand Guidelines", children: /* @__PURE__ */ jsxs("div", { className: "bg-plugin-url-cta", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-url-cta-headline", style: { color: theme.textPrimary }, children: "Start from a URL" }),
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-url-cta-subtext", style: { color: theme.textMuted }, children: "Enter a website URL to extract brand colors, fonts, and voice" }),
      /* @__PURE__ */ jsx("div", { className: "bg-plugin-url-input-wrapper", children: /* @__PURE__ */ jsx(UrlInputView, { onExtract: handleExtract, initialUrl: lastUrl || void 0 }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-plugin-url-cta-manual",
          onClick: () => setView("tabs"),
          children: "Or set up manually"
        }
      )
    ] }) });
  }
  if (view === "extracting") {
    return /* @__PURE__ */ jsx(Modal, { onClose: handleClose, title: "Brand Guidelines", children: /* @__PURE__ */ jsx("div", { className: "bg-plugin-extraction", children: /* @__PURE__ */ jsx(ExtractionView, { state: fetchState, onCancel: handleCancel }) }) });
  }
  if (view === "review" && (result == null ? void 0 : result.analysis)) {
    return /* @__PURE__ */ jsx(Modal, { onClose: handleClose, title: "Brand Guidelines", children: confirmAction ? /* @__PURE__ */ jsxs("div", { style: { padding: 24, textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 13, fontWeight: 500, color: theme.textPrimary, marginBottom: 6 }, children: "Discard extracted tokens?" }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: theme.textMuted, marginBottom: 16 }, children: "AI extraction takes 60+ seconds. You'll need to re-extract." }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "center" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-plugin-add-btn",
            onClick: () => setConfirmAction(null),
            style: { borderStyle: "solid", opacity: 1, padding: "8px 16px" },
            children: "Keep reviewing"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-plugin-export-btn",
            onClick: confirmDiscard,
            style: { background: theme.error, color: "#fff", width: "auto", padding: "8px 16px" },
            children: "Discard"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsx(
      ReviewView,
      {
        analysis: result.analysis,
        onApply: handleApply,
        onTryAnother: handleTryAnother,
        onDiscard: handleDiscardReview
      }
    ) });
  }
  const headerUrlButton = hasData ? /* @__PURE__ */ jsx(
    "button",
    {
      className: "bg-plugin-header-action",
      onClick: () => setView(view === "url-inline" ? "tabs" : "url-inline"),
      title: "Extract from URL",
      children: /* @__PURE__ */ jsxs("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("path", { d: "M2 12h20" }),
        /* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
      ] })
    }
  ) : null;
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
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      onClose: handleClose,
      title: "Brand Guidelines",
      footer,
      headerActions: headerUrlButton,
      children: [
        view === "url-inline" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-plugin-url-bar",
            style: { borderBottomColor: theme.border },
            children: [
              /* @__PURE__ */ jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsx(UrlInputView, { onExtract: handleExtract, initialUrl: lastUrl || void 0 }) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "bg-plugin-header-action",
                  onClick: () => setView("tabs"),
                  title: "Dismiss",
                  children: "✕"
                }
              )
            ]
          }
        ),
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
          USAGE_SUMMARY_TABS[activeTab] && ((_a = settings.usageSummaries) == null ? void 0 : _a[USAGE_SUMMARY_TABS[activeTab]]) && /* @__PURE__ */ jsxs("div", { className: "bg-plugin-usage-summary", style: { marginTop: 14 }, children: [
            /* @__PURE__ */ jsx("div", { className: "bg-plugin-usage-summary-label", style: { color: theme.textMuted }, children: "Usage Guide" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "bg-plugin-usage-summary-textarea",
                style: { borderColor: theme.border, color: theme.textPrimary },
                value: settings.usageSummaries[USAGE_SUMMARY_TABS[activeTab]],
                onChange: (e) => {
                  const key = USAGE_SUMMARY_TABS[activeTab];
                  updateSettings((prev) => ({
                    ...prev,
                    usageSummaries: {
                      colors: "",
                      fonts: "",
                      radii: "",
                      spacing: "",
                      ...prev.usageSummaries,
                      [key]: e.target.value
                    }
                  }));
                }
              }
            )
          ] }),
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
          ),
          activeTab === "radii" && /* @__PURE__ */ jsx(
            RadiiSection,
            {
              radii: settings.radii,
              updateSettings
            }
          ),
          activeTab === "spacing" && /* @__PURE__ */ jsx(
            SpacingSection,
            {
              spacing: settings.spacing,
              updateSettings
            }
          )
        ] })
      ]
    }
  );
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
