import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.--skeleton-w]': 'width()',
    '[style.--skeleton-h]': 'height()',
  },
  template: ``,
})
export class PaulSkeletonComponent {
  readonly variant = input<'text' | 'circle' | 'rect'>('text');
  readonly width = input<string>();
  readonly height = input<string>();

  readonly hostClasses = computed(() => {
    return `skeleton skeleton--${this.variant()}`;
  });
}
