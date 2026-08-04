import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * A labelled `<select>` that shares the input styling and paints its own
 * chevron. Angular twin of the React `Select`.
 *
 * Options are projected, so callers pass native `<option>` elements and keep
 * full control of their values:
 *
 * ```html
 * <paul-select label="Team">
 *   <option value="a">A</option>
 * </paul-select>
 * ```
 *
 * Without a visible `label`, pass `aria-label` so the control still has an
 * accessible name.
 */
@Component({
  selector: 'paul-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <div [class]="wrapperClasses()">
      @if (label()) {
        <label class="select__label" [attr.for]="selectId">{{ label() }}</label>
      }
      <select
        [id]="selectId"
        [class]="selectClasses()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="helperText() ? helperId : null"
        (change)="onChange($event)"
      >
        <ng-content />
      </select>
      @if (helperText()) {
        <span [id]="helperId" [class]="helperClasses()">{{ helperText() }}</span>
      }
    </div>
  `,
})
export class PaulSelectComponent {
  readonly label = input<string>();
  readonly error = input<string>();
  readonly helper = input<string>();
  readonly size = input<'sm' | 'md'>('md');
  /**
   * `vertical` (default) stacks the label above the control. `horizontal` puts
   * it inline to the left, for compact filter rows — see `PaulFilterBar`.
   */
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly disabled = input(false);
  readonly ariaLabel = input('', { alias: 'aria-label' });

  readonly valueChanged = output<string>();

  private static nextId = 0;
  readonly selectId = `paul-select-${PaulSelectComponent.nextId++}`;
  readonly helperId = `${this.selectId}-helper`;

  readonly helperText = computed(() => this.error() || this.helper());

  readonly wrapperClasses = computed(() =>
    this.orientation() === 'horizontal'
      ? 'select__wrapper select__wrapper--horizontal'
      : 'select__wrapper',
  );

  readonly selectClasses = computed(() => {
    const classes = ['select'];
    const size = this.size();
    if (size && size !== 'md') classes.push(`select--${size}`);
    if (this.error()) classes.push('select--error');
    return classes.join(' ');
  });

  readonly helperClasses = computed(() =>
    this.error() ? 'select__helper select__helper--error' : 'select__helper',
  );

  onChange(event: Event): void {
    this.valueChanged.emit((event.target as HTMLSelectElement).value);
  }
}
