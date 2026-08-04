import { Component, input } from '@angular/core';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { PaulTickerComponent } from '../ticker';
import { renderComponent, host } from './render';
import { stubReducedMotion } from './prefers-reduced-motion.spec';

/**
 * Content is passed as an <ng-template> rather than plain projection, because
 * the loop needs to render the same content twice — see the note on
 * PaulTickerComponent.
 */
@Component({
  selector: 'paul-ticker-host',
  standalone: true,
  imports: [PaulTickerComponent],
  template: `
    <paul-ticker [label]="label()" [mode]="mode()" [edge]="edge()">
      <ng-template>
        <a href="#one">Headline</a>
      </ng-template>
    </paul-ticker>
  `,
})
class TickerHost {
  readonly label = input('News ticker');
  readonly mode = input<'scroll' | 'marquee'>('scroll');
  readonly edge = input<'top' | 'bottom'>('top');
}

afterEach(() => vi.unstubAllGlobals());

/** Mirrors packages/react/src/__tests__/Ticker.test.tsx. */
describe('PaulTicker', () => {
  const root = (el: HTMLElement) => el.querySelector('.ticker') as HTMLElement;
  const groups = (el: HTMLElement) => [...el.querySelectorAll('.ticker__group')];

  it('scroll mode is a labelled section that shows its content', () => {
    stubReducedMotion(false);
    const el = host(renderComponent(TickerHost));
    expect(root(el).tagName).toBe('SECTION');
    expect(root(el).getAttribute('aria-label')).toBe('News ticker');
    expect(root(el).textContent).toContain('Headline');
  });

  it('scroll mode duplicates the content and hides the clone from assistive tech', () => {
    stubReducedMotion(false);
    const el = host(renderComponent(TickerHost));
    expect(groups(el)).toHaveLength(2);
    expect(groups(el)[1].getAttribute('aria-hidden')).toBe('true');
  });

  it('drops the clone out of the tab order', () => {
    // Exercises the fallback rather than the main path: jsdom has no `inert`,
    // so the capability check falls through to the manual tabIndex sweep. In a
    // real browser `inert` does this before render and these values stay 0.
    stubReducedMotion(false);
    const el = host(renderComponent(TickerHost));
    const cloned = groups(el)[1].querySelector('a') as HTMLAnchorElement;
    expect(cloned.tabIndex).toBe(-1);
    const original = groups(el)[0].querySelector('a') as HTMLAnchorElement;
    expect(original.tabIndex).toBe(0);
  });

  it('keeps the clone inert from the first render, not after an effect', () => {
    // The clone duplicates real controls so the loop looks seamless, and it is
    // aria-hidden. Dropping its focusables to tabIndex -1 in a lifecycle hook
    // leaves a window: between render and that hook the duplicate holds
    // tabbable controls inside an aria-hidden container, and axe rates that
    // serious. Its React twin shipped exactly this and the violation fired on
    // a live page. Hiding something from assistive tech while leaving it
    // reachable by keyboard is worse than not hiding it -- the user lands on a
    // control a screen reader insists is not there.
    stubReducedMotion(false);
    const el = host(renderComponent(TickerHost));

    expect(groups(el)[1].hasAttribute('inert')).toBe(true);
    // The visible copy stays fully reachable.
    expect(groups(el)[0].hasAttribute('inert')).toBe(false);
    expect(groups(el)[0].hasAttribute('aria-hidden')).toBe(false);
  });

  it('marquee mode is decorative and aria-hidden', () => {
    stubReducedMotion(false);
    const fixture = renderComponent(TickerHost, { mode: 'marquee' });
    const el = host(fixture);
    expect(root(el).className).toContain('ticker--marquee');
    expect(root(el).getAttribute('aria-hidden')).toBe('true');
    expect(root(el).getAttribute('aria-label')).toBeNull();
    expect(groups(el)).toHaveLength(2);
  });

  it('edge picks the border side', () => {
    stubReducedMotion(false);
    const el = host(renderComponent(TickerHost, { edge: 'bottom' }));
    expect(root(el).className).toContain('ticker--bottom');
  });

  it('reduced motion collapses scroll mode to a single plain copy', () => {
    stubReducedMotion(true);
    const el = host(renderComponent(TickerHost));
    expect(groups(el)).toHaveLength(1);
    expect(el.querySelector('.ticker__track')).toBeNull();
  });

  // The ambient scroll only ever runs against `.ticker__track`, so its absence
  // is the structural proof that reduced motion starts no loop. Asserting on
  // requestAnimationFrame directly would be dishonest — Angular's own zoneless
  // scheduler calls it too, so a spy can't tell whose frame it is.
  it('reduced motion renders no track for the loop to drive', () => {
    stubReducedMotion(true);
    const el = host(renderComponent(TickerHost));
    expect(el.querySelector('.ticker__track')).toBeNull();
    expect(root(el).getAttribute('data-direction')).toBeNull();
  });

  it('pauses on hover and resumes on leave', () => {
    stubReducedMotion(false);
    const fixture = renderComponent(TickerHost);
    const el = host(fixture);
    const track = el.querySelector('.ticker__track') as HTMLElement;

    root(el).dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(track.getAttribute('data-paused')).toBe('true');

    root(el).dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(track.getAttribute('data-paused')).toBeNull();
  });
});
