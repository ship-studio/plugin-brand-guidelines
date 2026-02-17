import { useState, useEffect } from 'react';
import { BG_STYLE_ID, BRAND_GUIDELINES_CSS } from './styles';
import { BrandModal } from './BrandModal';

function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById(BG_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BG_STYLE_ID;
    style.textContent = BRAND_GUIDELINES_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(BG_STYLE_ID)?.remove();
    };
  }, []);
}

export function ToolbarButton() {
  const [modalOpen, setModalOpen] = useState(false);

  useInjectStyles();

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        title="Brand Guidelines"
        className="toolbar-icon-btn"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
          <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
          <path d="M14.5 17.5 4.5 15" />
        </svg>
      </button>
      {modalOpen && <BrandModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
