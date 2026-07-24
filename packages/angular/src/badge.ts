import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClasses()' },
  template: `<ng-content />`,
})
export class PaulBadgeComponent {
  readonly variant = input<'success' | 'warning' | 'error' | 'info'>();
  readonly dot = input(false);
  /** Renders the badge as a spiky starburst seal (for "new"/"beta" flags). */
  readonly starburst = input(false);

  readonly hostClasses = computed(() => {
    const classes = ['badge'];
    const v = this.variant();
    if (v) classes.push(`badge--${v}`);
    if (this.dot()) classes.push('badge--dot');
    if (this.starburst()) classes.push('badge--starburst');
    return classes.join(' ');
  });
}
