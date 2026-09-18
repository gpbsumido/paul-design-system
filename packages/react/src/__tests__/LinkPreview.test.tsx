import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { LinkPreview } from '../LinkPreview';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('LinkPreview', () => {
  it('wraps a real link', () => {
    render(
      <LinkPreview href="https://example.com" image="p.jpg">
        Docs
      </LinkPreview>,
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('opens the preview card on hover', () => {
    const { container } = render(
      <LinkPreview href="https://example.com" image="p.jpg">
        Docs
      </LinkPreview>,
    );
    const card = container.querySelector('.link-preview__card');
    expect(card).not.toHaveClass('is-open');
    fireEvent.pointerEnter(container.querySelector('.link-preview') as HTMLElement);
    expect(card).toHaveClass('is-open');
  });
});
