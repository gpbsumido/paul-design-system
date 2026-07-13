import { Component, input, output, computed, effect, ChangeDetectionStrategy, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'paul-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'handleEscape()',
  },
  template: `
    @if (open()) {
      <div class="modal__backdrop" (click)="handleBackdropClick()">
        <div class="modal__content" #content
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          (click)="$event.stopPropagation()">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class PaulModalComponent {
  readonly open = input(false);
  readonly closed = output<void>();

  private static nextId = 0;
  readonly titleId = `paul-modal-title-${PaulModalComponent.nextId++}`;

  handleBackdropClick(): void {
    this.closed.emit();
  }

  handleEscape(): void {
    if (this.open()) this.closed.emit();
  }
}

@Component({
  selector: 'paul-modal-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'modal__header' },
  template: `<ng-content />`,
})
export class PaulModalHeaderComponent {}

@Component({
  selector: 'paul-modal-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'modal__body' },
  template: `<ng-content />`,
})
export class PaulModalBodyComponent {}

@Component({
  selector: 'paul-modal-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'modal__footer' },
  template: `<ng-content />`,
})
export class PaulModalFooterComponent {}
