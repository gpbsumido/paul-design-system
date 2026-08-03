import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * An on/off toggle. Controlled via `checked` + `checkedChange`. Exposes
 * role="switch" with aria-checked so assistive tech reads its state. Give it an
 * aria-label since it has no text of its own. Angular twin of the React `Switch`.
 */
@Component({
  selector: 'paul-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="switch"
      [class]="btnClasses()"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="disabled()"
      (click)="toggle()"
    >
      <span class="switch__thumb"></span>
    </button>
  `,
})
export class PaulSwitchComponent {
  readonly checked = input.required<boolean>();
  readonly disabled = input(false);
  readonly ariaLabel = input('', { alias: 'aria-label' });

  readonly checkedChange = output<boolean>();

  readonly btnClasses = computed(() => (this.checked() ? 'switch switch--on' : 'switch'));

  toggle(): void {
    if (!this.disabled()) this.checkedChange.emit(!this.checked());
  }
}
