import { Component, signal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { PaulGradientBackgroundComponent } from '../gradient-background';
import { renderComponent, host } from './render';

@Component({
  selector: 'paul-gradient-host',
  standalone: true,
  imports: [PaulGradientBackgroundComponent],
  template: `
    <paul-gradient-background [colors]="colors()" [angle]="angle()" [speed]="speed()" [animate]="animate()">
      <span>On the gradient</span>
    </paul-gradient-background>
  `,
})
class GradientHost {
  readonly colors = signal<string[] | undefined>(undefined);
  readonly angle = signal(120);
  readonly speed = signal<'slow' | 'normal' | 'fast'>('normal');
  readonly animate = signal(true);
}

/** Mirrors packages/react/src/__tests__/GradientBackground.test.tsx. */
describe('PaulGradientBackground', () => {
  const root = (el: HTMLElement) => el.querySelector('.gradient-bg') as HTMLElement;

  it('renders its content over the gradient surface', () => {
    const el = host(renderComponent(GradientHost));
    expect(root(el).textContent).toContain('On the gradient');
  });

  it('builds the gradient image from colors and angle', () => {
    const fixture = renderComponent(GradientHost);
    fixture.componentInstance.colors.set(['#111', '#222', '#333']);
    fixture.componentInstance.angle.set(45);
    fixture.detectChanges();
    expect(root(host(fixture)).style.getPropertyValue('--paul-gradient-image')).toBe(
      'linear-gradient(45deg, #111, #222, #333)',
    );
  });

  it('leaves the gradient image to CSS when no colors are given', () => {
    const el = host(renderComponent(GradientHost));
    expect(root(el).style.getPropertyValue('--paul-gradient-image')).toBe('');
  });

  it('animates by default and can be turned off', () => {
    const fixture = renderComponent(GradientHost);
    expect(root(host(fixture)).getAttribute('data-animate')).toBe('true');

    fixture.componentInstance.animate.set(false);
    fixture.detectChanges();
    expect(root(host(fixture)).getAttribute('data-animate')).toBeNull();
  });

  it('maps the speed input to an animation duration', () => {
    const fixture = renderComponent(GradientHost);
    fixture.componentInstance.speed.set('fast');
    fixture.detectChanges();
    expect(root(host(fixture)).style.getPropertyValue('--paul-gradient-duration')).toBe('6s');
  });
});
