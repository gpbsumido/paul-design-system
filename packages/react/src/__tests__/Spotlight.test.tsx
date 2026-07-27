import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { Spotlight } from '../Spotlight';

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

describe('Spotlight', () => {
  it('renders its children in the content layer above a decorative glow', () => {
    stubReducedMotion(false);
    const { container } = render(<Spotlight>Lit content</Spotlight>);
    const content = screen.getByText('Lit content');
    expect(content.closest('.spotlight__content')).toBeInTheDocument();
    const glow = container.querySelector('.spotlight__glow');
    expect(glow?.getAttribute('aria-hidden')).toBe('true');
  });

  it('tracks the pointer position', () => {
    stubReducedMotion(false);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 200,
      height: 100,
      right: 210,
      bottom: 120,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    } as DOMRect);

    const { container } = render(<Spotlight>x</Spotlight>);
    const root = container.querySelector('.spotlight') as HTMLElement;

    fireEvent.pointerMove(root, { clientX: 60, clientY: 70 });
    expect(root.style.getPropertyValue('--paul-spotlight-x')).toBe('50px');
    expect(root.style.getPropertyValue('--paul-spotlight-y')).toBe('50px');
    expect(root.dataset.active).toBe('true');

    fireEvent.pointerLeave(root);
    expect(root.dataset.active).toBeUndefined();
  });

  it('sets the glow size from the size prop', () => {
    stubReducedMotion(false);
    const { container } = render(<Spotlight size={500}>x</Spotlight>);
    const root = container.querySelector('.spotlight') as HTMLElement;
    expect(root.style.getPropertyValue('--paul-spotlight-size')).toBe('500px');
  });

  it('shows a static centered glow under reduced motion and does not track', async () => {
    stubReducedMotion(true);
    const { container } = render(<Spotlight>x</Spotlight>);
    const root = await waitFor(() => {
      const el = container.querySelector('.spotlight') as HTMLElement;
      expect(el.dataset.active).toBe('true');
      return el;
    });
    // No pointer handler is attached, so moving the cursor never sets a position.
    fireEvent.pointerMove(root, { clientX: 60, clientY: 70 });
    expect(root.style.getPropertyValue('--paul-spotlight-x')).toBe('');
  });
});
