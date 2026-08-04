import { Component, signal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { PaulSelectComponent } from '../select';
import { renderComponent, host } from './render';

/**
 * Options are projected, so the assertions run against a host that provides
 * them — the same way a caller uses the component.
 */
@Component({
  selector: 'paul-select-host',
  standalone: true,
  imports: [PaulSelectComponent],
  template: `
    <paul-select [label]="label()" [error]="error()" [helper]="helper()" [size]="size()" [orientation]="orientation()" [disabled]="disabled()">
      <option value="a">A</option>
      <option value="b">B</option>
    </paul-select>
  `,
})
class SelectHost {
  readonly label = signal<string | undefined>('Team');
  readonly error = signal<string | undefined>(undefined);
  readonly helper = signal<string | undefined>(undefined);
  readonly size = signal<'sm' | 'md'>('md');
  readonly orientation = signal<'vertical' | 'horizontal'>('vertical');
  readonly disabled = signal(false);
}

/** Mirrors packages/react/src/__tests__/Select.test.tsx. */
describe('PaulSelect', () => {
  const control = (el: HTMLElement) => el.querySelector('select') as HTMLSelectElement;

  it('renders a labelled control with the projected options', () => {
    const el = host(renderComponent(SelectHost));
    const label = el.querySelector('label') as HTMLLabelElement;
    expect(label.textContent).toContain('Team');
    expect(label.htmlFor).toBe(control(el).id);
    expect([...control(el).options].map((o) => o.textContent?.trim())).toEqual(['A', 'B']);
  });

  it('applies the select class and a vertical wrapper by default', () => {
    const el = host(renderComponent(SelectHost));
    expect(control(el).className).toBe('select');
    expect(el.querySelector('.select__wrapper')?.className).not.toContain('--horizontal');
  });

  it('horizontal orientation applies the wrapper modifier', () => {
    const fixture = renderComponent(SelectHost);
    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();
    expect(host(fixture).querySelector('.select__wrapper')?.className).toContain(
      'select__wrapper--horizontal',
    );
  });

  it('size sm applies the modifier and md does not', () => {
    const fixture = renderComponent(SelectHost);
    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();
    expect(control(host(fixture)).className).toContain('select--sm');

    fixture.componentInstance.size.set('md');
    fixture.detectChanges();
    expect(control(host(fixture)).className).not.toContain('select--md');
  });

  it('error shows the message and sets aria-invalid', () => {
    const fixture = renderComponent(SelectHost);
    fixture.componentInstance.error.set('Required');
    fixture.detectChanges();
    const el = host(fixture);
    expect(control(el).getAttribute('aria-invalid')).toBe('true');
    const helper = el.querySelector('.select__helper--error') as HTMLElement;
    expect(helper.textContent).toContain('Required');
  });

  it('links helper text through aria-describedby', () => {
    const fixture = renderComponent(SelectHost);
    fixture.componentInstance.helper.set('Pick one');
    fixture.detectChanges();
    const el = host(fixture);
    const helper = el.querySelector('.select__helper') as HTMLElement;
    expect(control(el).getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('disables the control', () => {
    const fixture = renderComponent(SelectHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control(host(fixture)).disabled).toBe(true);
  });

  it('emits the selected value on change', () => {
    const fixture = renderComponent(PaulSelectComponent);
    const seen: string[] = [];
    fixture.componentInstance.valueChanged.subscribe((v: string) => seen.push(v));
    const el = host(fixture);
    control(el).dispatchEvent(new Event('change'));
    expect(seen).toHaveLength(1);
  });

  it('takes an aria-label when there is no visible label', () => {
    const el = host(renderComponent(PaulSelectComponent, { 'aria-label': 'Season' }));
    expect(el.querySelector('label')).toBeNull();
    expect(control(el).getAttribute('aria-label')).toBe('Season');
  });
});
