import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { HoverImageReveal } from '../HoverImageReveal';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const items = [
  { label: 'Alpha', image: 'a.jpg', href: '#a' },
  { label: 'Beta', image: 'b.jpg', href: '#b' },
];

describe('HoverImageReveal', () => {
  it('renders rows as links', () => {
    render(<HoverImageReveal items={items} />);
    expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('href', '#a');
    expect(screen.getByRole('link', { name: 'Beta' })).toBeInTheDocument();
  });

  it('reveals the hovered row image', () => {
    const { container } = render(<HoverImageReveal items={items} />);
    fireEvent.pointerEnter(screen.getByRole('link', { name: 'Beta' }));
    const imgs = container.querySelectorAll('.hover-image-reveal__img');
    expect(imgs[1]).toHaveClass('is-active');
    expect(imgs[0]).not.toHaveClass('is-active');
    expect(container.querySelector('.hover-image-reveal__window')).toHaveClass(
      'is-visible',
    );
  });
});
