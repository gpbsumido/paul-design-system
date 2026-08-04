import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * An indeterminate loading spinner. Renders as a live status region so
 * assistive tech announces that something is loading. Angular twin of the
 * React `Spinner`.
 */
@Component({
  selector: 'paul-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    '[attr.aria-label]': 'label()',
    '[class]': 'hostClasses()',
  },
  template: ``,
})
export class PaulSpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  /** Accessible name announced to screen readers. Defaults to "Loading". */
  readonly label = input('Loading');

  readonly hostClasses = computed(() => {
    const s = this.size();
    return s && s !== 'md' ? `spinner spinner--${s}` : 'spinner';
  });
}
