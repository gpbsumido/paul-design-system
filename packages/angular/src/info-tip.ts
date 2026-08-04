import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { PaulTooltipComponent } from './tooltip';

/**
 * A small "i" glyph that reveals an explanation on hover or focus — the common
 * "explain this label" case. Angular twin of the React `InfoTip`, built on
 * `PaulTooltip` the same way React's is built on `Tooltip`.
 *
 * React's version accepts rich nodes; this one takes a string, because
 * `PaulTooltip` does. Widening the tooltip to project content is its own
 * change, not something to smuggle into this component.
 */
@Component({
  selector: 'paul-info-tip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaulTooltipComponent],
  host: { style: 'display: inline-block' },
  template: `
    <paul-tooltip [text]="content()" [side]="side()">
      <span class="info-tip" role="img" [attr.aria-label]="label()" tabindex="0">i</span>
    </paul-tooltip>
  `,
})
export class PaulInfoTipComponent {
  /** The explanation shown in the popover. */
  readonly content = input.required<string>();
  readonly side = input<'top' | 'bottom' | 'left' | 'right'>('top');
  /** Accessible name for the trigger. */
  readonly label = input('More information');
}
