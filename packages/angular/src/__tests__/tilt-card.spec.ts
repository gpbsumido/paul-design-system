import { Component, signal } from '@angular/core';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { PaulTiltCardComponent } from '../tilt-card';
import { renderComponent, host } from './render';
import { stubReducedMotion } from './prefers-reduced-motion.spec';

@Component({
  selector: 'paul-tilt-card-host',
  standalone: true,
  imports: [PaulTiltCardComponent],
  template: `<paul-tilt-card [maxTilt]="10" [glare]="glare()">Card body</paul-tilt-card>`,
})
class TiltCardHost {
  readonly glare = signal(true);
}

/** A rect that makes the pointer maths easy to reason about. */
function stubRect() {
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
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Mirrors packages/react/src/__tests__/TiltCard.test.tsx. */
describe('PaulTiltCard', () => {
  const root = (el: HTMLElement) => el.querySelector('.tilt-card') as HTMLElement;
  const inner = (el: HTMLElement) => el.querySelector('.tilt-card__inner') as HTMLElement;

  it('renders its content inside the tilting inner layer', () => {
    stubReducedMotion(false);
    const el = host(renderComponent(TiltCardHost));
    expect(inner(el).textContent).toContain('Card body');
  });

  it('renders a decorative glare by default', () => {
    stubReducedMotion(false);
    const el = host(renderComponent(TiltCardHost));
    const glare = el.querySelector('.tilt-card__glare') as HTMLElement;
    expect(glare.getAttribute('aria-hidden')).toBe('true');
  });

  it('omits the glare when glare is false', () => {
    stubReducedMotion(false);
    const fixture = renderComponent(TiltCardHost);
    fixture.componentInstance.glare.set(false);
    fixture.detectChanges();
    expect(host(fixture).querySelector('.tilt-card__glare')).toBeNull();
  });

  it('tilts toward the pointer and resets on leave', () => {
    stubReducedMotion(false);
    stubRect();
    const el = host(renderComponent(TiltCardHost));

    // Pointer on the far right edge → full positive rotateY.
    root(el).dispatchEvent(
      new PointerEvent('pointermove', { clientX: 200, clientY: 50, bubbles: true }),
    );
    expect(inner(el).style.getPropertyValue('--paul-tilt-y')).toBe('10.00deg');
    expect(inner(el).style.getPropertyValue('--paul-glare-x')).toBe('100.0%');
    expect(inner(el).dataset.active).toBe('true');

    root(el).dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    expect(inner(el).style.getPropertyValue('--paul-tilt-y')).toBe('0deg');
    expect(inner(el).dataset.active).toBeUndefined();
  });

  it('renders flat with no glare and ignores the pointer under reduced motion', () => {
    stubReducedMotion(true);
    stubRect();
    const el = host(renderComponent(TiltCardHost));
    expect(el.querySelector('.tilt-card__glare')).toBeNull();
    root(el).dispatchEvent(
      new PointerEvent('pointermove', { clientX: 200, clientY: 50, bubbles: true }),
    );
    expect(inner(el).style.getPropertyValue('--paul-tilt-y')).toBe('');
  });
});
