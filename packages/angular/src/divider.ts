import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * A thin rule that separates content. Horizontal by default; pass
 * orientation="vertical" for use inside a flex row. Angular twin of the React
 * `Divider`; exposes role="separator".
 */
@Component({
  selector: 'paul-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    '[class]': 'hostClasses()',
    '[attr.aria-orientation]': 'orientation()',
  },
  template: ``,
})
export class PaulDividerComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly hostClasses = computed(() =>
    this.orientation() === 'vertical' ? 'divider divider--vertical' : 'divider',
  );
}
