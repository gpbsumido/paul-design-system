import { Component, input, computed, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'paul-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'position: relative; display: inline-block;',
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
  },
  template: `
    <ng-content />
    <div [class]="tooltipClasses()" role="tooltip">
      {{ text() }}
    </div>
  `,
})
export class PaulTooltipComponent {
  readonly text = input.required<string>();
  readonly side = input<'top' | 'bottom' | 'left' | 'right'>('top');

  readonly visible = signal(false);

  readonly tooltipClasses = computed(() => {
    const classes = ['tooltip', `tooltip--${this.side()}`];
    if (this.visible()) classes.push('tooltip--visible');
    return classes.join(' ');
  });

  show(): void { this.visible.set(true); }
  hide(): void { this.visible.set(false); }
}
