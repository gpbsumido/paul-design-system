import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { SmoothScrollSlider } from '../SmoothScrollSlider';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const slides = [
  { image: 'a.jpg', title: 'Alpha', href: '#a' },
  { image: 'b.jpg', title: 'Beta', href: '#b' },
];

describe('SmoothScrollSlider', () => {
  it('renders a labelled group with the slides as links', () => {
    render(<SmoothScrollSlider slides={slides} />);
    expect(
      screen.getByRole('group', { name: /scrollable slider/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('href', '#a');
    expect(screen.getByRole('link', { name: 'Beta' })).toBeInTheDocument();
  });

  it('handles wheel and drag input without throwing', () => {
    const { container } = render(<SmoothScrollSlider slides={slides} loop={false} />);
    const group = screen.getByRole('group');
    fireEvent.wheel(group, { deltaY: 120 });
    fireEvent.pointerDown(group, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(group, { clientX: 40, pointerId: 1 });
    fireEvent.pointerUp(group, { pointerId: 1 });
    expect(container.querySelector('.smooth-scroll-slider__rail')).toBeInTheDocument();
  });
});
