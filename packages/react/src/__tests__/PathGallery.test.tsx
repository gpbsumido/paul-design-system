import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { PathGallery } from '../PathGallery';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('PathGallery', () => {
  it('renders a labelled group with the items as links', () => {
    const { container } = render(
      <PathGallery
        items={[
          { image: 'a.jpg', title: 'Alpha', href: '#a' },
          { image: 'b.jpg', title: 'Beta', href: '#b' },
        ]}
      />,
    );
    expect(
      screen.getByRole('group', { name: /along a path/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('href', '#a');
    expect(container.querySelectorAll('.path-gallery__item')).toHaveLength(2);
    expect(container.querySelector('.path-gallery__track')).not.toBeNull();
  });

  it('hides the track line when showPath is false', () => {
    const { container } = render(
      <PathGallery items={[{ image: 'a.jpg', title: 'Alpha' }]} showPath={false} />,
    );
    expect(container.querySelector('.path-gallery__track')).toBeNull();
    expect(container.querySelectorAll('.path-gallery__item')).toHaveLength(1);
  });
});
