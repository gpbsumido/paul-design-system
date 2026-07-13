import { Component, input, output, computed, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'paul-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="input__wrapper">
      @if (label()) {
        <label class="input__label" [attr.for]="inputId">{{ label() }}</label>
      }
      <input
        [id]="inputId"
        [class]="inputClasses()"
        [disabled]="disabled()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="helperId"
        (input)="onValueChange($event)"
      />
      @if (error()) {
        <span [id]="helperId" class="input__helper input__helper--error">{{ error() }}</span>
      } @else if (helper()) {
        <span [id]="helperId" class="input__helper">{{ helper() }}</span>
      }
    </div>
  `,
})
export class PaulInputComponent {
  readonly label = input<string>();
  readonly error = input<string>();
  readonly helper = input<string>();
  readonly size = input<'sm' | 'md'>('md');
  readonly disabled = input(false);

  readonly valueChanged = output<string>();

  private static nextId = 0;
  readonly inputId = `paul-input-${PaulInputComponent.nextId++}`;
  readonly helperId = `${this.inputId}-helper`;

  readonly inputClasses = computed(() => {
    const classes = ['input'];
    const s = this.size();
    if (s && s !== 'md') classes.push(`input--${s}`);
    if (this.error()) classes.push('input--error');
    return classes.join(' ');
  });

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChanged.emit(target.value);
  }
}
