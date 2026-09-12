import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderToStaticMarkup } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Toaster, toast } from '../Toaster';

expect.extend(matchers);

// The store is a module-level singleton, so clear anything a test raised.
afterEach(() => {
  document.querySelectorAll('.toast__dismiss').forEach((btn) => {
    act(() => fireEvent.click(btn));
  });
});

describe('Toaster', () => {
  it('renders a toast raised through the imperative api', () => {
    render(<Toaster />);
    act(() => {
      toast.error('Something failed');
    });
    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  it('announces an error toast assertively', () => {
    render(<Toaster />);
    act(() => {
      toast.error('Boom');
    });
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('dismisses a toast when its close button is clicked', () => {
    render(<Toaster />);
    act(() => {
      toast.success('Saved', 'Your changes are in.');
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('shows a toast queued before it mounted', () => {
    act(() => {
      toast.info('Queued first');
    });
    render(<Toaster />);
    expect(screen.getByText('Queued first')).toBeInTheDocument();
  });

  it('hydrates without the getServerSnapshot-cache warning', () => {
    // React calls getServerSnapshot twice during hydration and warns when the
    // results aren't referentially equal. A fresh `[]` per call trips that in
    // every Next.js app that mounts <Toaster /> in a server-rendered layout.
    const seen: string[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      seen.push(args.map(String).join(' '));
    });
    const host = document.createElement('div');
    document.body.appendChild(host);
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      act(() => {
        root = hydrateRoot(host, <Toaster />);
      });
      expect(
        seen.filter((m) => m.includes('getServerSnapshot should be cached')),
      ).toEqual([]);
    } finally {
      spy.mockRestore();
      act(() => root?.unmount());
      host.remove();
    }
  });

  it('renders nothing on the server (no document)', () => {
    const original = globalThis.document;
    // @ts-expect-error emulate the server
    delete globalThis.document;
    try {
      expect(renderToStaticMarkup(<Toaster />)).toBe('');
    } finally {
      globalThis.document = original;
    }
  });

  it('has no a11y violations with a toast up', async () => {
    render(<Toaster />);
    act(() => {
      toast.error('A problem', 'Details here.');
    });
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
