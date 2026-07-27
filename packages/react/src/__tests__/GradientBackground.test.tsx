import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { GradientBackground } from '../GradientBackground';

afterEach(cleanup);

describe('GradientBackground', () => {
  it('renders its children over the gradient surface', () => {
    render(
      <GradientBackground>
        <span>On the gradient</span>
      </GradientBackground>,
    );
    const child = screen.getByText('On the gradient');
    expect(child.closest('.gradient-bg')).toBeInTheDocument();
  });

  it('builds the gradient image from colors and angle', () => {
    const { container } = render(
      <GradientBackground colors={['#111', '#222', '#333']} angle={45}>
        x
      </GradientBackground>,
    );
    const root = container.querySelector('.gradient-bg') as HTMLElement;
    expect(root.style.getPropertyValue('--paul-gradient-image')).toBe(
      'linear-gradient(45deg, #111, #222, #333)',
    );
  });

  it('animates by default and can be turned off', () => {
    const { container, rerender } = render(<GradientBackground>x</GradientBackground>);
    expect(
      container.querySelector('.gradient-bg')?.getAttribute('data-animate'),
    ).toBe('true');

    rerender(<GradientBackground animate={false}>x</GradientBackground>);
    expect(
      container.querySelector('.gradient-bg')?.getAttribute('data-animate'),
    ).toBeNull();
  });

  it('maps the speed prop to an animation duration', () => {
    const { container } = render(<GradientBackground speed="fast">x</GradientBackground>);
    const root = container.querySelector('.gradient-bg') as HTMLElement;
    expect(root.style.getPropertyValue('--paul-gradient-duration')).toBe('6s');
  });
});
