import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
expect.extend(matchers);
import * as components from '../index';

let reduced = false;
vi.mock('../usePrefersReducedMotion', () => ({ usePrefersReducedMotion: () => reduced }));
afterEach(() => { cleanup(); reduced = false; vi.unstubAllGlobals(); vi.restoreAllMocks(); });
for (const name of ['SpiralPortraitHero', 'PerspectivePortraitHero'] as const) {
  describe(name, () => {
    it('exports a labelled section with configurable copy, heading level and action slots', async () => {
      const Hero = components[name];
      const { container } = render(<Hero heading="People with perspective" headingLevel={2}
        description="Portraits and stories" images={[{ src: 'portrait.jpg' }]}
        navigation={<a href="#about">About</a>} actions={<a href="#work">Explore work</a>} />);
      expect(screen.getByRole('region', { name: 'People with perspective' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('People with perspective');
      expect(screen.getByRole('link', { name: 'Explore work' })).toHaveAttribute('href', '#work');
      expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
    it('keeps copy and actions available when images are empty or fail', () => {
      const Hero = components[name];
      const props = { heading: 'Still here', actions: <button>Continue</button> };
      const { container, rerender } = render(<Hero {...props} images={[]} />);
      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
      rerender(<Hero {...props} images={[{ src: 'missing.jpg' }]} />);
      fireEvent.error(container.querySelector('img')!);
      expect(screen.getByRole('heading', { name: 'Still here' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
      expect(container.querySelector('img')).not.toBeVisible();
    });
    it('moves only decorative imagery with the pointer and resets for reduced motion', () => {
      vi.stubGlobal('PointerEvent', MouseEvent);
      const Hero = components[name];
      const { container, rerender } = render(<Hero heading="Steady copy" />);
      const region = screen.getByRole('region');
      vi.spyOn(region, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 400, height: 400 } as DOMRect);
      fireEvent.pointerMove(region, { clientX: 400, clientY: 400 });
      const gallery = container.querySelector<HTMLElement>('.portrait-hero__gallery')!;
      expect(gallery.style.transform).toBe('translate3d(10px, 10px, 0)');
      fireEvent.pointerLeave(region);
      expect(gallery.style.transform).toBe('');
      reduced = true;
      rerender(<Hero heading="Steady copy" />);
      fireEvent.pointerMove(region, { clientX: 400, clientY: 400 });
      expect(gallery.style.transform).toBe('');
    });
    it('creates separate accessible names for multiple instances', () => {
      const Hero = components[name];
      render(<><Hero heading="First" /><Hero heading="Second" /></>);
      const regions = screen.getAllByRole('region');
      expect(regions[0].getAttribute('aria-labelledby')).not.toBe(regions[1].getAttribute('aria-labelledby'));
    });
  });
}
