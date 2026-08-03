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
 * An interactive background: a soft radial glow that follows the cursor across
 * the surface. Angular twin of the React `Spotlight`.
 *
 * The glow is decorative and clipped to the container; projected content sits
 * in its own layer on top. Under prefers-reduced-motion the glow is pinned to
 * the centre and stops tracking — visible, but with no cursor-driven movement.
 */
@Component({
  selector: 'paul-spotlight',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @if (reduced()) {
      <div
        #root
        class="spotlight"
        data-active="true"
        [style.--paul-spotlight-size]="sizePx()"
        [style.--paul-spotlight-color]="color() || null"
      >
        <div aria-hidden="true" class="spotlight__glow"></div>
        <div class="spotlight__content"><ng-content /></div>
      </div>
    } @else {
      <div
        #root
        class="spotlight"
        [style.--paul-spotlight-size]="sizePx()"
        [style.--paul-spotlight-color]="color() || null"
        (pointermove)="onMove($event)"
        (pointerleave)="onLeave()"
      >
        <div aria-hidden="true" class="spotlight__glow"></div>
        <div class="spotlight__content"><ng-content /></div>
      </div>
    }
  `,
})
export class PaulSpotlightComponent {
  /** Diameter of the glow, in pixels. */
  readonly size = input(350);
  /** Glow colour. Any CSS colour; defaults to a soft brand-blue wash. */
  readonly color = input<string>();

  readonly reduced = inject(PaulReducedMotion).reduced;

  private readonly root = viewChild<ElementRef<HTMLElement>>('root');

  readonly sizePx = () => `${this.size()}px`;

  onMove(event: PointerEvent): void {
    const el = this.root()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--paul-spotlight-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--paul-spotlight-y', `${event.clientY - rect.top}px`);
    el.dataset['active'] = 'true';
  }

  onLeave(): void {
    const el = this.root()?.nativeElement;
    if (el) delete el.dataset['active'];
  }
}
