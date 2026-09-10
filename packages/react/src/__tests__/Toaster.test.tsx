import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderToStaticMarkup } from 'react-dom/server';
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
