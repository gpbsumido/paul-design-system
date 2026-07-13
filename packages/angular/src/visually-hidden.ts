import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-visually-hidden',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'visually-hidden' },
  template: `<ng-content />`,
})
export class PaulVisuallyHiddenComponent {}
