import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

function Header({ children }: { children: ReactNode }) {
  return <div className="modal__header">{children}</div>;
}

function Body({ children }: { children: ReactNode }) {
  return <div className="modal__body">{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="modal__footer">{children}</div>;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal__backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div id={titleId} className="modal__title">
            {title}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
