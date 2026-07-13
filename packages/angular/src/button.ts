import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'isDisabled() || null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-busy]': 'loading() || null',
    '(click)': 'handleClick($event)',
  },
  template: `
    @if (href()) {
      <a [href]="href()" [class]="hostClasses()">
        <ng-content />
      </a>
    } @else {
      <ng-content />
    }
  `,
})
export class PaulButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg'>();
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly href = input<string>();

  readonly clicked = output<MouseEvent>();

  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly hostClasses = computed(() => {
    const classes = ['btn'];
    const v = this.variant();
    const s = this.size();
    if (v) classes.push(`btn--${v}`);
    if (s && s !== 'md') classes.push(`btn--${s}`);
    return classes.join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (!this.isDisabled()) {
      this.clicked.emit(event);
    }
  }
}
