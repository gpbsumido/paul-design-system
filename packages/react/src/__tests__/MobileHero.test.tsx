import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MobileOrbitHero, MobileReelHero, MobileLensHero } from '../MobileHero';

const images = [{ src: '/one.webp', alt: 'Portfolio' }, { src: '/two.webp', alt: 'Design system' }];

  it('scrubs the reel with a labelled keyboard-accessible slider', () => {
    render(<MobileReelHero heading="Reel" images={images} />);
    const slider = screen.getByRole('slider', { name: 'Scrub projects' });
    fireEvent.change(slider, { target: { value: '1' } });
    expect(slider).toHaveAttribute('aria-valuetext', 'Design system, 2 of 2');
    expect(screen.getByRole('status')).toHaveTextContent('Design system');
  });

  it('selects orbit projects by tapping markers and keyboard rotation', () => {
    render(<MobileOrbitHero heading="Orbit" images={images} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select Design system' }));
    expect(screen.getByRole('status')).toHaveTextContent('Design system');
    const dial = screen.getByRole('slider', { name: 'Rotate project dial' });
    fireEvent.keyDown(dial, { key: 'ArrowLeft' });
    expect(screen.getByRole('status')).toHaveTextContent('Portfolio');
    expect(dial).toHaveAttribute('aria-valuenow', '0');
  });

  it('moves the lens to a tapped project and offers a non-dragging next control', () => {
    render(<MobileLensHero heading="Lens" images={images} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inspect Design system' }));
    expect(screen.getByRole('status')).toHaveTextContent('Design system');
    fireEvent.click(screen.getByRole('button', { name: 'Next project' }));
    expect(screen.getByRole('status')).toHaveTextContent('Portfolio');
  });

for (const Hero of [MobileOrbitHero, MobileReelHero, MobileLensHero]) {
  describe(Hero.name, () => {
    it('preserves content for empty, single and shrinking image collections', () => {
      const { rerender } = render(<Hero heading="Explore" images={[]} actions={<a href="#work">Work</a>} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Explore');
      expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      rerender(<Hero heading="Explore" images={images} />);
      const next = screen.queryByRole('button', { name: 'Next project' });
      if (next) fireEvent.click(next);
      else if (Hero === MobileReelHero) fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
      else fireEvent.click(screen.getByRole('button', { name: 'Select Design system' }));
      rerender(<Hero heading="Explore" images={images.slice(0, 1)} />);
      expect(screen.getByRole('status')).toHaveTextContent('Portfolio');
    });
    it('keeps the project action after its image fails', () => {
      const { container } = render(<Hero heading="Explore" images={[{ ...images[0], href: '/work' }]} />);
      for (const img of container.querySelectorAll('img')) fireEvent.error(img);
      expect(screen.getByRole('link', { name: 'Open Portfolio' })).toHaveAttribute('href', '/work');
      expect(screen.getByRole('status')).toHaveTextContent('Portfolio');
    });
    it('has no axe accessibility violations', async () => {
      const { axe } = await import('vitest-axe');
      const { container } = render(<Hero heading="Explore" images={images} />);
      expect((await axe(container)).violations).toEqual([]);
    });
  });
}

function pointer(target: Element, type: string, x: number, y: number) {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 });
  Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true } });
  fireEvent(target, event);
}

it('rotates the orbit by dragging and stops on pointer cancellation', () => {
  render(<MobileOrbitHero heading="Orbit" images={images} />);
  const dial = screen.getByRole('slider');
  dial.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 300, bottom: 300, width: 300, height: 300, toJSON() {} });
  pointer(dial, 'pointerdown', 150, 5);
  pointer(dial, 'pointermove', 150, 295);
  expect(screen.getByRole('status')).toHaveTextContent('Design system');
  pointer(dial, 'pointercancel', 150, 295);
  pointer(dial, 'pointermove', 150, 5);
  expect(screen.getByRole('status')).toHaveTextContent('Design system');
});

it('drags the lens without jumping away from the grabbed handle', () => {
  const { container } = render(<MobileLensHero heading="Lens" images={images} />);
  const stage = container.querySelector('.mobile-hero__contact-sheet')!;
  stage.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 300, bottom: 300, width: 300, height: 300, toJSON() {} });
  const handle = screen.getByRole('button', { name: 'Move magnifying lens' });
  pointer(handle, 'pointerdown', 130, 120);
  pointer(handle, 'pointermove', 140, 120);
  expect(parseFloat((container.querySelector('.mobile-hero__lens') as HTMLElement).style.left)).toBeCloseTo(31.333, 2);
  pointer(handle, 'pointermove', 280, 120);
  expect(screen.getByRole('status')).toHaveTextContent('Design system');
  pointer(handle, 'pointercancel', 280, 120);
  pointer(handle, 'pointermove', 130, 120);
  expect(screen.getByRole('status')).toHaveTextContent('Design system');
});
