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
