import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClasses()' },
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" />
    } @else {
      <span class="avatar--fallback">{{ fallback() }}</span>
    }
  `,
})
export class PaulAvatarComponent {
  readonly src = input<string>();
  readonly alt = input('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly fallback = input('');

  readonly hostClasses = computed(() => {
    return `avatar avatar--${this.size()}`;
  });
}
