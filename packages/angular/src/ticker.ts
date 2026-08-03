import {
  Component,
  input,
  inject,
  signal,
  computed,
  contentChild,
  viewChild,
  afterNextRender,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PaulReducedMotion } from './prefers-reduced-motion';

/** How long a touch keeps the strip frozen before the ambient scroll resumes. */
const TOUCH_RESUME_MS = 4000;

/**
 * A horizontal ticker strip with two modes: an accessible, auto-scrolling
 * container (`scroll`) and a decorative CSS marquee (`marquee`). Angular twin
 * of the React `Ticker`. Both loop seamlessly and both honour
 * prefers-reduced-motion.
 *
 * Content comes in as an `<ng-template>` rather than plain projection, because
 * the seamless loop renders the same content twice and projected content can
 * only be placed once:
 *
 * ```html
 * <paul-ticker label="News">
 *   <ng-template><span>Headline</span></ng-template>
 * </paul-ticker>
 * ```
 */
@Component({
  selector: 'paul-ticker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { style: 'display: contents' },
  template: `
    @if (mode() === 'marquee') {
      <div [class]="rootClasses()" aria-hidden="true" [attr.data-direction]="direction()">
        <div class="ticker__track">
          <div class="ticker__group"><ng-container [ngTemplateOutlet]="body()" /></div>
          <div class="ticker__group"><ng-container [ngTemplateOutlet]="body()" /></div>
        </div>
      </div>
    } @else if (reduced()) {
      <!-- Reduced motion: a plain, single-copy scrollable row. No clone, no loop. -->
      <section [class]="rootClasses()" [attr.aria-label]="label()">
        <div class="ticker__group"><ng-container [ngTemplateOutlet]="body()" /></div>
      </section>
    } @else {
      <section
        #scroller
        [class]="rootClasses()"
        [attr.aria-label]="label()"
        [attr.data-direction]="direction()"
        (mouseenter)="paused.set(true)"
        (mouseleave)="paused.set(false)"
        (touchstart)="freezeForTouch()"
      >
        <div class="ticker__track" [attr.data-paused]="paused() || null">
          <div class="ticker__group"><ng-container [ngTemplateOutlet]="body()" /></div>
          <div #clone aria-hidden="true" class="ticker__group">
            <ng-container [ngTemplateOutlet]="body()" />
          </div>
        </div>
      </section>
    }
  `,
})
export class PaulTickerComponent {
  /** Accessible name for the strip. Scroll mode renders a labelled region. */
  readonly label = input.required<string>();
  /**
   * `scroll` (default) is a real scroll container with an ambient auto-scroll —
   * every item stays reachable. `marquee` is a decorative, aria-hidden CSS loop.
   */
  readonly mode = input<'scroll' | 'marquee'>('scroll');
  /** Which edge the strip sits on; picks the border side. */
  readonly edge = input<'top' | 'bottom'>('top');
  /** Which way the ambient motion travels. */
  readonly direction = input<'left' | 'right'>('left');
  /** Ambient auto-scroll speed for scroll mode, in px/sec. */
  readonly speed = input(40);

  readonly reduced = inject(PaulReducedMotion).reduced;
  readonly paused = signal(false);

  private readonly template = contentChild(TemplateRef);
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly clone = viewChild<ElementRef<HTMLElement>>('clone');
  private readonly destroyRef = inject(DestroyRef);
  private resumeTimer: ReturnType<typeof setTimeout> | null = null;

  readonly body = computed(() => this.template() ?? null);

  readonly rootClasses = computed(() => {
    const classes = ['ticker'];
    if (this.mode() === 'marquee') classes.push('ticker--marquee');
    classes.push(this.edge() === 'top' ? 'ticker--top' : 'ticker--bottom');
    return classes.join(' ');
  });

  constructor() {
    afterNextRender(() => {
      this.dropCloneFromTabOrder();
      this.startAmbientScroll();
    });
    this.destroyRef.onDestroy(() => {
      if (this.resumeTimer) clearTimeout(this.resumeTimer);
    });
  }

  /**
   * The clone fills the trailing half of the loop and stays clickable for
   * pointer users, so drop its focusables out of the tab order by hand. Paired
   * with aria-hidden, assistive tech never sees the duplicate.
   */
  private dropCloneFromTabOrder(): void {
    const focusables = this.clone()?.nativeElement.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]',
    );
    focusables?.forEach((el) => {
      el.tabIndex = -1;
    });
  }

  /**
   * Advance scrollLeft each frame and wrap by one copy width for a seamless
   * loop. Pauses on hover/touch; user scrolling is left alone.
   */
  private startAmbientScroll(): void {
    const el = this.scroller()?.nativeElement;
    if (!el) return;

    const dir = this.direction() === 'left' ? 1 : -1;
    // Start the rightward strip one copy in, so it has somewhere to scroll back.
    if (dir < 0) el.scrollLeft = el.scrollWidth / 2;

    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      const half = el.scrollWidth / 2;
      if (!this.paused() && half > 0) {
        let next = el.scrollLeft + (dir * this.speed() * dt) / 1000;
        if (next >= half) next -= half;
        else if (next < 0) next += half;
        el.scrollLeft = next;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    this.destroyRef.onDestroy(() => cancelAnimationFrame(frame));
  }

  freezeForTouch(): void {
    this.paused.set(true);
    if (this.resumeTimer) clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => this.paused.set(false), TOUCH_RESUME_MS);
  }
}
