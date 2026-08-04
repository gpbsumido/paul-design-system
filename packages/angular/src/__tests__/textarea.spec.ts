import { describe, it, expect } from 'vitest';
import { PaulTextareaComponent } from '../textarea';
import { renderComponent, host } from './render';

/** Mirrors packages/react/src/__tests__/Textarea.test.tsx. */
describe('PaulTextarea', () => {
  const field = (el: HTMLElement) => el.querySelector('textarea') as HTMLTextAreaElement;

  it('associates the label with the field', () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio' }));
    const label = el.querySelector('label') as HTMLLabelElement;
    expect(label.textContent).toContain('Bio');
    expect(label.htmlFor).toBe(field(el).id);
    expect(field(el).className).toContain('textarea');
  });

  it('marks the field invalid and links the error text', () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio', error: 'Too short' }));
    expect(field(el).getAttribute('aria-invalid')).toBe('true');
    expect(field(el).className).toContain('textarea--error');
    const helper = el.querySelector('.input__helper--error') as HTMLElement;
    expect(helper.textContent).toContain('Too short');
    expect(field(el).getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('shows helper text when there is no error', () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio', helper: 'Max 200 chars' }));
    const helper = el.querySelector('.input__helper') as HTMLElement;
    expect(helper.textContent).toContain('Max 200 chars');
    expect(helper.className).not.toContain('input__helper--error');
  });

  it('hides the label visually but keeps it in the accessibility tree', () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio', hideLabel: true }));
    const label = el.querySelector('label') as HTMLLabelElement;
    expect(label.className).toBe('sr-only');
    expect(label.htmlFor).toBe(field(el).id);
  });

  it('marks a required field with an aria-hidden asterisk', () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio', required: true }));
    const star = el.querySelector('label span') as HTMLElement;
    expect(star.getAttribute('aria-hidden')).toBe('true');
    expect(field(el).required).toBe(true);
  });

  it('shows and updates a live character count', () => {
    const fixture = renderComponent(PaulTextareaComponent, {
      label: 'Bio',
      maxLength: 100,
      showCount: true,
    });
    const el = host(fixture);
    const count = el.querySelector('.textarea__count') as HTMLElement;
    expect(count.getAttribute('aria-live')).toBe('polite');
    expect(count.textContent?.replace(/\s+/g, ' ').trim()).toBe('0 / 100');

    field(el).value = 'hello';
    field(el).dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(count.textContent?.replace(/\s+/g, ' ').trim()).toBe('5 / 100');
  });

  it('links both the helper and the count through aria-describedby', () => {
    const el = host(
      renderComponent(PaulTextareaComponent, {
        label: 'Bio',
        helper: 'Keep it short',
        maxLength: 100,
        showCount: true,
      }),
    );
    const describedBy = field(el).getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(describedBy).toHaveLength(2);
    expect(describedBy).toContain((el.querySelector('.input__helper') as HTMLElement).id);
    expect(describedBy).toContain((el.querySelector('.textarea__count') as HTMLElement).id);
  });

  it('does not show a count without showCount', () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio', maxLength: 100 }));
    expect(el.querySelector('.textarea__count')).toBeNull();
  });

  it('emits the new value on input', () => {
    const fixture = renderComponent(PaulTextareaComponent, { label: 'Bio' });
    const seen: string[] = [];
    fixture.componentInstance.valueChanged.subscribe((v: string) => seen.push(v));
    const el = host(fixture);
    field(el).value = 'typed';
    field(el).dispatchEvent(new Event('input'));
    expect(seen).toEqual(['typed']);
  });

  it('renders no label, helper or count when given nothing', () => {
    const el = host(renderComponent(PaulTextareaComponent));
    expect(el.querySelector('label')).toBeNull();
    expect(el.querySelector('.input__helper')).toBeNull();
    expect(el.querySelector('.textarea__count')).toBeNull();
    expect(field(el).getAttribute('aria-describedby')).toBeNull();
  });
});
