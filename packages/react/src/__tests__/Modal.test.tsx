import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('not visible when open is false', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('visible when open is true', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <p>Hello Modal</p>
      </Modal>,
    );
    expect(screen.getByText('Hello Modal')).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('aria-labelledby links to title', () => {
    render(
      <Modal open={true} onClose={() => {}} title="My Title">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const titleEl = document.getElementById(labelledBy!);
    expect(titleEl).toHaveTextContent('My Title');
  });

  it('renders the title prop inside the styled header', () => {
    render(
      <Modal open={true} onClose={() => {}} title="My Title">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('My Title').closest('.modal__header')).toBeInTheDocument();
  });

  it('Escape key calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('backdrop click calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    const backdrop = screen.getByRole('dialog').parentElement!;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders Modal.Header, Modal.Body, Modal.Footer', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <Modal.Header>Header</Modal.Header>
        <Modal.Body>Body</Modal.Body>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>,
    );
    expect(screen.getByText('Header').closest('.modal__header')).toBeInTheDocument();
    expect(screen.getByText('Body').closest('.modal__body')).toBeInTheDocument();
    expect(screen.getByText('Footer').closest('.modal__footer')).toBeInTheDocument();
  });

  it('labels itself from aria-label when there is no title', () => {
    render(
      <Modal open onClose={() => {}} aria-label="Settings">
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
  });

  it('passes aria-describedby and merges className', () => {
    render(
      <Modal open onClose={() => {}} aria-label="X" aria-describedby="desc" className="wide">
        <p id="desc">Body</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-describedby', 'desc');
    expect(dialog).toHaveClass('modal__content', 'wide');
  });

  it('moves focus into the dialog and traps Tab', () => {
    render(
      <Modal open onClose={() => {}} aria-label="X">
        <button>only</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    // focus landed inside the dialog
    expect(dialog.contains(document.activeElement)).toBe(true);
    const only = screen.getByRole('button', { name: 'only' });
    only.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    // single focusable wraps back to itself
    expect(document.activeElement).toBe(only);
  });

  it('restores focus to the opener on close', () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open</button>
          {open && (
            <Modal open onClose={() => setOpen(false)} aria-label="X">
              <button onClick={() => setOpen(false)}>close</button>
            </Modal>
          )}
        </>
      );
    }
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'open' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(document.activeElement).toBe(opener);
  });
});
