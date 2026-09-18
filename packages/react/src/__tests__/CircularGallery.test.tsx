import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { CircularGallery } from '../CircularGallery';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CircularGallery', () => {
  it('renders a labelled group with the cards as links', () => {
    render(
      <CircularGallery
        items={[
          { image: 'a.jpg', title: 'Alpha', href: '#a' },
          { image: 'b.jpg', title: 'Beta', href: '#b' },
        ]}
      />,
    );
    expect(
      screen.getByRole('group', { name: /rotating gallery/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('href', '#a');
  });

  it('spins on drag without throwing', () => {
    const { container } = render(
      <CircularGallery items={[{ image: 'a.jpg' }, { image: 'b.jpg' }]} />,
    );
    const group = screen.getByRole('group');
    fireEvent.pointerDown(group, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(group, { clientX: 60, pointerId: 1 });
    fireEvent.pointerUp(group, { pointerId: 1 });
    expect(container.querySelector('.circular-gallery__ring')).toBeInTheDocument();
  });
});
