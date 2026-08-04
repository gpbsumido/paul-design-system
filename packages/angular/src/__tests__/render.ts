import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

/**
 * Mounts a standalone component with the given inputs and runs a first change
 * detection pass. Zoneless, so nothing re-renders until a test asks for it —
 * call `fixture.detectChanges()` after dispatching an event.
 *
 * Owning this in one place keeps the eight spec files from each deciding how a
 * fixture gets built.
 */
export function renderComponent<T>(
  component: Type<T>,
  inputs: Record<string, unknown> = {},
): ComponentFixture<T> {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

/** The rendered host element, for querying with plain DOM APIs. */
export function host<T>(fixture: ComponentFixture<T>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}
