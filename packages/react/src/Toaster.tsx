import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';
import type { ToastVariant } from './Toast';

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. 0 keeps it until dismissed. */
  duration?: number;
};

type ToastRecord = ToastInput & { id: number };

const DEFAULT_DURATION = 5000;

// A module-level store, so `toast(...)` can be called from anywhere — including
// outside React, which is the whole point: a global fetch/query error handler
// isn't a component and can't call a hook. `<Toaster />` subscribes to it.
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();
let records: ToastRecord[] = [];
let nextId = 0;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismiss(id: number) {
  records = records.filter((r) => r.id !== id);
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  emit();
}

function show(input: ToastInput): number {
  const id = nextId++;
  records = [...records, { ...input, id }];
  emit();
  const duration = input.duration ?? DEFAULT_DURATION;
  if (duration > 0 && typeof setTimeout !== 'undefined') {
    timers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    );
  }
  return id;
}

/**
 * Raise a toast from anywhere — a component, an event handler, or a plain
 * module like a query-client error handler. `<Toaster />` renders whatever is in
 * the queue, so the call site needs no context or hook.
 */
export const toast = Object.assign(
  (input: ToastInput) => show(input),
  {
    success: (title: string, description?: string) =>
      show({ title, description, variant: 'success' }),
    error: (title: string, description?: string) =>
      show({ title, description, variant: 'error' }),
    warning: (title: string, description?: string) =>
      show({ title, description, variant: 'warning' }),
    info: (title: string, description?: string) =>
      show({ title, description, variant: 'default' }),
    dismiss,
  },
);

/**
 * Mount once, near the app root. Renders the toast queue in a fixed live region
 * — errors announced assertively, everything else politely — and portals to the
 * body so it's never clipped. Returns nothing on the server (no document there).
 */
// The server snapshot must be the SAME array every call — React invokes it
// repeatedly during hydration and treats a changing result as an infinite loop.
const NO_TOASTS: ToastRecord[] = [];

export function Toaster() {
  const items = useSyncExternalStore(
    subscribe,
    () => records,
    () => NO_TOASTS,
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="toast-region" role="region" aria-label="Notifications">
      {items.map((t) => (
        <div
          key={t.id}
          role={t.variant === 'error' ? 'alert' : 'status'}
          aria-live={t.variant === 'error' ? 'assertive' : 'polite'}
          className={cx('toast', `toast--${t.variant ?? 'default'}`)}
        >
          <div className="toast__body">
            <p className="toast__title">{t.title}</p>
            {t.description && (
              <p className="toast__description">{t.description}</p>
            )}
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
  );
}
