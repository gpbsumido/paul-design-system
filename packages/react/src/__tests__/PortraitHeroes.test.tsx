import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as components from '../index';

afterEach(cleanup);
for (const name of ['Hero06', 'Hero13'] as const) {
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
    it('creates separate accessible names for multiple instances', () => {
      const Hero = components[name];
      render(<><Hero heading="First" /><Hero heading="Second" /></>);
      const regions = screen.getAllByRole('region');
      expect(regions[0].getAttribute('aria-labelledby')).not.toBe(regions[1].getAttribute('aria-labelledby'));
    });
  });
}
