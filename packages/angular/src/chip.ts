import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'handleClick()',
  },
  template: `
    {{ label() }}
    @if (removable()) {
      <button class="chip__remove" aria-label="Remove" (click)="handleRemove($event)">
        &times;
      </button>
    }
  `,
})
export class PaulChipComponent {
  readonly label = input.required<string>();
  readonly size = input<'sm' | 'md'>('md');
  readonly clickable = input(false);
  readonly removable = input(false);

  readonly clicked = output<void>();
  readonly removed = output<void>();

  readonly hostClasses = computed(() => {
    const classes = ['chip'];
    const s = this.size();
    if (s && s !== 'md') classes.push(`chip--${s}`);
    if (this.clickable()) classes.push('chip--clickable');
    if (this.removable()) classes.push('chip--removable');
    return classes.join(' ');
  });

  handleClick(): void {
    if (this.clickable()) this.clicked.emit();
  }

  handleRemove(event: Event): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
