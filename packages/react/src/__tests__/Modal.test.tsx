import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
