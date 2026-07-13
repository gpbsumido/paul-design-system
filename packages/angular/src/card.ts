import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClasses()' },
  template: `<ng-content />`,
})
export class PaulCardComponent {
  readonly variant = input<'elevated' | 'interactive'>();

  readonly hostClasses = computed(() => {
    const classes = ['card'];
    const v = this.variant();
    if (v) classes.push(`card--${v}`);
    return classes.join(' ');
  });
}

@Component({
  selector: 'paul-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card__header' },
  template: `<ng-content />`,
})
export class PaulCardHeaderComponent {}

@Component({
  selector: 'paul-card-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card__body' },
  template: `<ng-content />`,
})
export class PaulCardBodyComponent {}

@Component({
  selector: 'paul-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card__footer' },
  template: `<ng-content />`,
})
export class PaulCardFooterComponent {}
