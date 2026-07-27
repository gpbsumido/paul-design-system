import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { TiltCard } from '../TiltCard';

/** Stub matchMedia so the reduced-motion hook sees the given preference. */
function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('TiltCard', () => {
  it('renders its children inside the tilting inner layer', () => {
    stubReducedMotion(false);
    render(<TiltCard>Card body</TiltCard>);
    const inner = screen.getByText('Card body');
    expect(inner.closest('.tilt-card__inner')).toBeInTheDocument();
    expect(inner.closest('.tilt-card')).toBeInTheDocument();
  });

  it('renders a decorative glare by default', () => {
    stubReducedMotion(false);
    const { container } = render(<TiltCard>Hi</TiltCard>);
    const glare = container.querySelector('.tilt-card__glare');
    expect(glare).toBeInTheDocument();
    expect(glare?.getAttribute('aria-hidden')).toBe('true');
  });

  it('omits the glare when glare is false', () => {
    stubReducedMotion(false);
    const { container } = render(<TiltCard glare={false}>Hi</TiltCard>);
    expect(container.querySelector('.tilt-card__glare')).not.toBeInTheDocument();
  });

  it('tilts toward the pointer position', () => {
    stubReducedMotion(false);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    const { container } = render(<TiltCard maxTilt={10}>Hi</TiltCard>);
    const root = container.querySelector('.tilt-card') as HTMLElement;
    const inner = container.querySelector('.tilt-card__inner') as HTMLElement;

    // Pointer on the far right → positive rotateY.
    fireEvent.pointerMove(root, { clientX: 200, clientY: 50 });
    expect(inner.style.getPropertyValue('--paul-tilt-y')).toBe('10.00deg');
    expect(inner.dataset.active).toBe('true');

    // Leaving resets the tilt.
    fireEvent.pointerLeave(root);
    expect(inner.style.getPropertyValue('--paul-tilt-y')).toBe('0deg');
    expect(inner.dataset.active).toBeUndefined();
  });

  it('renders flat with no glare under reduced motion', async () => {
    stubReducedMotion(true);
    const { container } = render(<TiltCard>Hi</TiltCard>);
    expect(screen.getByText('Hi')).toBeInTheDocument();
    await waitFor(() =>
      expect(
        container.querySelector('.tilt-card__glare'),
      ).not.toBeInTheDocument(),
    );
  });
});
