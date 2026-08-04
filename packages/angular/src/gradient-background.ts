import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

const DURATION: Record<'slow' | 'normal' | 'fast', string> = {
  slow: '18s',
  normal: '12s',
  fast: '6s',
};

/**
 * A decorative surface painted with a flowing multi-stop gradient. Angular twin
 * of the React `GradientBackground`. Content is projected and renders on top,
 * so the surface stays content-agnostic.
 *
 * The ambient flow is pure CSS and gated behind prefers-reduced-motion in
 * `gradient-background.css` — no JS motion to switch off here. Omitting
 * `colors` leaves the token brand palette in place.
 */
@Component({
  selector: 'paul-gradient-background',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <div
      class="gradient-bg"
      [attr.data-animate]="animate() ? 'true' : null"
      [style.--paul-gradient-image]="gradientImage()"
      [style.--paul-gradient-duration]="duration()"
    >
      <ng-content />
    </div>
  `,
})
export class PaulGradientBackgroundComponent {
  /** Gradient stops, in order. Defaults to the token brand palette. */
  readonly colors = input<string[]>();
  readonly angle = input(120);
  readonly speed = input<'slow' | 'normal' | 'fast'>('normal');
  readonly animate = input(true);

  readonly gradientImage = computed(() => {
    const colors = this.colors();
    if (!colors || colors.length === 0) return null;
    return `linear-gradient(${this.angle()}deg, ${colors.join(', ')})`;
  });

  readonly duration = computed(() => DURATION[this.speed()]);
}
