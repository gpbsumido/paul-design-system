import { Component, input, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';

/**
 * Multi-line text field. Mirrors the React `Textarea`: the same label/error/
 * helper API as `PaulInput`, plus an optional visually-hidden label, a required
 * marker, and a live character counter when paired with `maxLength`.
 *
 * The count follows whatever the field currently holds — the `value` input
 * seeds it, typing updates it — so a caller can leave `value` unset and still
 * get an accurate counter.
 */
@Component({
  selector: 'paul-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <div class="input__wrapper">
      @if (label()) {
        <label [class]="labelClasses()" [attr.for]="textareaId">
          {{ label() }}@if (required()) {<span aria-hidden="true"> *</span>}
        </label>
      }
      <textarea
        [id]="textareaId"
        [class]="textareaClasses()"
        [disabled]="disabled()"
        [required]="required()"
        [attr.rows]="rows()"
        [attr.maxlength]="maxLength()"
        [attr.placeholder]="placeholder() || null"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="describedBy()"
        [value]="value()"
        (input)="onInput($event)"
      ></textarea>
      @if (withCount()) {
        <span [id]="countId" class="textarea__count" aria-live="polite">
          {{ count() }} / {{ maxLength() }}
        </span>
      }
      @if (helperText()) {
        <span [id]="helperId" [class]="helperClasses()">{{ helperText() }}</span>
      }
    </div>
  `,
})
export class PaulTextareaComponent {
  readonly label = input<string>();
  readonly error = input<string>();
  readonly helper = input<string>();
  readonly placeholder = input<string>();
  readonly rows = input<number>();
  readonly maxLength = input<number>();
  /** Visually hide the label while keeping it available to screen readers. */
  readonly hideLabel = input(false);
  /** Show a live "used / max" character count. Needs maxLength to be set. */
  readonly showCount = input(false);
  readonly required = input(false);
  readonly disabled = input(false);
  readonly value = input('');
  readonly ariaLabel = input('', { alias: 'aria-label' });

  readonly valueChanged = output<string>();

  private static nextId = 0;
  readonly textareaId = `paul-textarea-${PaulTextareaComponent.nextId++}`;
  readonly helperId = `${this.textareaId}-helper`;
  readonly countId = `${this.textareaId}-count`;

  /** What the user has typed since the last `value` binding, if anything. */
  private readonly typed = signal<string | null>(null);

  readonly helperText = computed(() => this.error() || this.helper());
  readonly withCount = computed(() => this.showCount() && this.maxLength() != null);
  readonly count = computed(() => (this.typed() ?? this.value()).length);

  readonly labelClasses = computed(() => (this.hideLabel() ? 'sr-only' : 'input__label'));

  readonly textareaClasses = computed(() =>
    this.error() ? 'textarea textarea--error' : 'textarea',
  );

  readonly helperClasses = computed(() =>
    this.error() ? 'input__helper input__helper--error' : 'input__helper',
  );

  readonly describedBy = computed(() => {
    const ids = [this.helperText() ? this.helperId : null, this.withCount() ? this.countId : null];
    return ids.filter(Boolean).join(' ') || null;
  });

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.typed.set(value);
    this.valueChanged.emit(value);
  }
}
