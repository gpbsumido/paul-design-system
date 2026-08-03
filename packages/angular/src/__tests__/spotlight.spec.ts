import { Component, signal } from '@angular/core';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { PaulSpotlightComponent } from '../spotlight';
import { renderComponent, host } from './render';
import { stubReducedMotion } from './prefers-reduced-motion.spec';

@Component({
  selector: 'paul-spotlight-host',
  standalone: true,
  imports: [PaulSpotlightComponent],
  template: `<paul-spotlight [size]="size()">Lit content</paul-spotlight>`,
})
class SpotlightHost {
  readonly size = signal(350);
}

function stubRect() {
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
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Mirrors packages/react/src/__tests__/Spotlight.test.tsx. */
describe('PaulSpotlight', () => {
  const root = (el: HTMLElement) => el.querySelector('.spotlight') as HTMLElement;

  it('renders its content above a decorative glow', () => {
    stubReducedMotion(false);
    const el = host(renderComponent(SpotlightHost));
    expect((el.querySelector('.spotlight__content') as HTMLElement).textContent).toContain(
      'Lit content',
    );
    expect(el.querySelector('.spotlight__glow')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('tracks the pointer position', () => {
    stubReducedMotion(false);
    stubRect();
    const el = host(renderComponent(SpotlightHost));

    root(el).dispatchEvent(
      new PointerEvent('pointermove', { clientX: 60, clientY: 70, bubbles: true }),
    );
    expect(root(el).style.getPropertyValue('--paul-spotlight-x')).toBe('50px');
    expect(root(el).style.getPropertyValue('--paul-spotlight-y')).toBe('50px');
    expect(root(el).dataset.active).toBe('true');

    root(el).dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    expect(root(el).dataset.active).toBeUndefined();
  });

  it('sets the glow size from the size input', () => {
    stubReducedMotion(false);
    const fixture = renderComponent(SpotlightHost);
    fixture.componentInstance.size.set(500);
    fixture.detectChanges();
    expect(root(host(fixture)).style.getPropertyValue('--paul-spotlight-size')).toBe('500px');
  });

  it('pins the glow centred and stops tracking under reduced motion', () => {
    stubReducedMotion(true);
    stubRect();
    const el = host(renderComponent(SpotlightHost));
    expect(root(el).dataset.active).toBe('true');

    root(el).dispatchEvent(
      new PointerEvent('pointermove', { clientX: 60, clientY: 70, bubbles: true }),
    );
    expect(root(el).style.getPropertyValue('--paul-spotlight-x')).toBe('');
  });
});
