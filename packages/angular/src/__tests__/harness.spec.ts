import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { renderComponent, host } from './render';

@Component({
  selector: 'paul-harness-probe',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="probe">{{ greeting() }}</p>`,
})
class ProbeComponent {
  readonly greeting = input('hello');
}

/**
 * Proves the TestBed harness itself works — JIT compilation, zoneless change
 * detection, input binding — before any real component depends on it.
 */
describe('render harness', () => {
  it('mounts a standalone component and renders its template', () => {
    const fixture = renderComponent(ProbeComponent);
    expect(host(fixture).querySelector('.probe')?.textContent).toBe('hello');
  });

  it('applies inputs passed to renderComponent', () => {
    const fixture = renderComponent(ProbeComponent, { greeting: 'bonjour' });
    expect(host(fixture).querySelector('.probe')?.textContent).toBe('bonjour');
  });

  it('re-renders after an input change plus detectChanges', () => {
    const fixture = renderComponent(ProbeComponent, { greeting: 'one' });
    fixture.componentRef.setInput('greeting', 'two');
    fixture.detectChanges();
    expect(host(fixture).querySelector('.probe')?.textContent).toBe('two');
  });
});
