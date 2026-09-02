import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../Toast';

function Trigger() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Saved', description: 'All good' })}>
      Fire
    </button>
  );
}

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a toast when requested through the hook', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Fire' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('auto-dismisses after the given duration', () => {
    vi.useFakeTimers();
    function T() {
      const { toast } = useToast();
      return <button onClick={() => toast({ title: 'Bye', duration: 1000 })}>Fire</button>;
    }
    render(
      <ToastProvider>
        <T />
      </ToastProvider>,
    );
    // fireEvent avoids the userEvent + fake-timers deadlock.
    fireEvent.click(screen.getByRole('button', { name: 'Fire' }));
    expect(screen.getByText('Bye')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByText('Bye')).toBeNull();
  });

  it('can be dismissed manually', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Fire' }));
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('throws when useToast is used outside a provider', () => {
    function Bare() {
      useToast();
      return null;
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bare />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
