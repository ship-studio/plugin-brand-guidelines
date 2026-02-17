export const BG_STYLE_ID = 'bg-plugin-styles';

export const BRAND_GUIDELINES_CSS = `
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
