import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Accessible name when there's no title to point at. */
  'aria-label'?: string;
  /** Id of an element that labels the dialog (wins over title). */
  'aria-labelledby'?: string;
  /** Id of an element that describes the dialog. */
  'aria-describedby'?: string;
  className?: string;
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

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog on open and restore it on close, and trap Tab
  // so keyboard focus can't wander behind the modal.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const labelledby = ariaLabelledby ?? (title ? titleId : undefined);

  return createPortal(
    <div className="modal__backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={!labelledby ? ariaLabel : undefined}
        aria-labelledby={labelledby}
        aria-describedby={ariaDescribedby}
        tabIndex={-1}
        className={cx('modal', className)}
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
