import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * A labelled region holding a wrapping row of filter controls (typically
 * `PaulSelect`s). Angular twin of the React `FilterBar`: a real `<section>`
 * landmark, so the controls sit inside a named region.
 *
 * The label is required — an unnamed region is skipped by assistive tech.
 */
@Component({
  selector: 'paul-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <section class="filter-bar" [attr.aria-label]="label()">
      <div class="filter-bar__row">
        <ng-content />
      </div>
    </section>
  `,
})
export class PaulFilterBarComponent {
  readonly label = input.required<string>();
}
