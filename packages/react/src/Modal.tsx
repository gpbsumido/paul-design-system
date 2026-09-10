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

  // Read the latest onClose from a ref so the keydown listener below never has
  // to be torn down and re-added when onClose changes identity.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // On open: focus into the dialog, trap Tab, lock body scroll, and hide the
  // rest of the page from assistive tech. All of it is undone on close. The
  // effect depends only on `open` — never on onClose — so a parent re-render
  // (e.g. a polling query) can't re-run it and steal focus from an input.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    // Lock body scroll, padding out the scrollbar's width so the page behind
    // doesn't shift as it disappears.
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Hide the background from assistive tech, without clobbering an
    // aria-hidden that was already there.
    const hidden = Array.from(document.body.children).filter(
      (el) =>
        el !== dialog && !el.contains(dialog) && !el.hasAttribute('aria-hidden'),
    );
    for (const el of hidden) el.setAttribute('aria-hidden', 'true');

    // Focus the first focusable element, or the dialog itself if it has none.
    const focusables = dialog
      ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      : [];
    (focusables[0] ?? dialog)?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const tabbable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (tabbable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
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
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      for (const el of hidden) el.removeAttribute('aria-hidden');
      previouslyFocused?.focus?.();
    };
  }, [open]);

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
        className={cx('modal__content', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div id={titleId} className="modal__header">
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
