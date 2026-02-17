import { useEffect } from 'react';
import { useTheme } from './context';

export function Modal({
  onClose,
  title,
  children,
  footer,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const theme = useTheme();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="bg-plugin-overlay" onClick={onClose}>
      <div
        className="bg-plugin-modal"
        style={{
          background: theme.bgPrimary,
          color: theme.textPrimary,
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-plugin-modal-header"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
              <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
              <path d="M14.5 17.5 4.5 15" />
            </svg>
            {title}
          </span>
          <button
            className="bg-plugin-close-btn"
            onClick={onClose}
            style={{ color: theme.textMuted }}
          >
            ✕
          </button>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}
