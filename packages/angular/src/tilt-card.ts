import {
  Component,
  input,
  inject,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PaulReducedMotion } from './prefers-reduced-motion';

/**
 * A surface that tilts in 3D toward the pointer, with an optional glare that
 * tracks the cursor. Angular twin of the React `TiltCard`.
 *
 * The effect is decorative and pointer-driven only, so keyboard users are never
 * left without access to the content. Under prefers-reduced-motion it renders
 * as a flat card: no glare, no handlers bound, nothing to switch off.
 */
@Component({
  selector: 'paul-tilt-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @if (reduced()) {
      <div class="tilt-card">
        <div #inner class="tilt-card__inner"><ng-content /></div>
      </div>
    } @else {
      <div class="tilt-card" (pointermove)="onMove($event)" (pointerleave)="onLeave()">
        <div #inner class="tilt-card__inner">
          @if (glare()) {
            <div aria-hidden="true" class="tilt-card__glare"></div>
          }
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class PaulTiltCardComponent {
  /** Maximum rotation, in degrees, at the edges of the card. */
  readonly maxTilt = input(12);
  /** Show the cursor-tracking glare highlight. */
  readonly glare = input(true);

  readonly reduced = inject(PaulReducedMotion).reduced;

  private readonly inner = viewChild<ElementRef<HTMLElement>>('inner');

  onMove(event: PointerEvent): void {
    const root = event.currentTarget as HTMLElement;
    const rect = root.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const px = (event.clientX - rect.left) / rect.width; // 0 (left) … 1 (right)
    const py = (event.clientY - rect.top) / rect.height; // 0 (top) … 1 (bottom)
    const rotateY = (px - 0.5) * 2 * this.maxTilt();
    const rotateX = -(py - 0.5) * 2 * this.maxTilt();

    const inner = this.inner()?.nativeElement;
    if (!inner) return;
    inner.style.setProperty('--paul-tilt-x', `${rotateX.toFixed(2)}deg`);
    inner.style.setProperty('--paul-tilt-y', `${rotateY.toFixed(2)}deg`);
    inner.style.setProperty('--paul-glare-x', `${(px * 100).toFixed(1)}%`);
    inner.style.setProperty('--paul-glare-y', `${(py * 100).toFixed(1)}%`);
    inner.dataset['active'] = 'true';
  }

  onLeave(): void {
    const inner = this.inner()?.nativeElement;
    if (!inner) return;
    inner.style.setProperty('--paul-tilt-x', '0deg');
    inner.style.setProperty('--paul-tilt-y', '0deg');
    delete inner.dataset['active'];
  }
}
