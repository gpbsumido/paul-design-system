import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * A square, icon-only button. Always needs an aria-label because there is no
 * visible text to name it. Renders a real <button> so it is keyboard operable.
 * Angular twin of the React `IconButton`.
 */
@Component({
  selector: 'paul-icon-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="btnClasses()"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
})
export class PaulIconButtonComponent {
  readonly ariaLabel = input.required<string>({ alias: 'aria-label' });
  readonly size = input<'sm' | 'md'>('md');
  readonly disabled = input(false);

  readonly clicked = output<MouseEvent>();

  readonly btnClasses = computed(() => {
    const s = this.size();
    return s && s !== 'md' ? `icon-btn icon-btn--${s}` : 'icon-btn';
  });
}
