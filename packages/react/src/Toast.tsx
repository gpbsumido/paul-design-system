import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Use 0 to keep it until dismissed. */
  duration?: number;
};

type ToastRecord = ToastOptions & { id: number };

type ToastContextValue = {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;

/**
 * Wrap an app in ToastProvider and call `useToast().toast(...)` to raise a
 * notification. Toasts stack in a live region so screen readers announce them —
 * errors assertively, everything else politely — and auto-dismiss unless
 * `duration` is 0.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((list) => [...list, { ...options, id }]);
      const duration = options.duration ?? DEFAULT_DURATION;
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  // Clear any pending timers on unmount.
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="toast-region" role="region" aria-label="Notifications">
            {toasts.map((t) => (
              <div
                key={t.id}
                role={t.variant === 'error' ? 'alert' : 'status'}
                aria-live={t.variant === 'error' ? 'assertive' : 'polite'}
                className={cx('toast', `toast--${t.variant ?? 'default'}`)}
              >
                <div className="toast__body">
                  <p className="toast__title">{t.title}</p>
                  {t.description && <p className="toast__description">{t.description}</p>}
                </div>
                <button
                  type="button"
                  className="toast__dismiss"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(t.id)}
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

/** Access the toast API. Must be called inside a ToastProvider. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
