import { describe, it, expect } from 'vitest';
import { PaulInfoTipComponent } from '../info-tip';
import { renderComponent, host } from './render';

/** Mirrors packages/react/src/__tests__/InfoTip.test.tsx. */
describe('PaulInfoTip', () => {
  const trigger = (el: HTMLElement) => el.querySelector('.info-tip') as HTMLElement;

  it('exposes an accessible, focusable trigger', () => {
    const el = host(renderComponent(PaulInfoTipComponent, { content: 'Shown on hover' }));
    expect(trigger(el).getAttribute('role')).toBe('img');
    expect(trigger(el).getAttribute('aria-label')).toBe('More information');
    expect(trigger(el).getAttribute('tabindex')).toBe('0');
    expect(trigger(el).textContent?.trim()).toBe('i');
  });

  it('takes a custom label', () => {
    const el = host(
      renderComponent(PaulInfoTipComponent, { content: 'x', label: 'What is this' }),
    );
    expect(trigger(el).getAttribute('aria-label')).toBe('What is this');
  });

  it('reveals the tooltip content on hover', () => {
    const fixture = renderComponent(PaulInfoTipComponent, { content: 'Shown on hover' });
    const el = host(fixture);
    const tip = el.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tip.className).not.toContain('tooltip--visible');

    (el.querySelector('paul-tooltip') as HTMLElement).dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(tip.className).toContain('tooltip--visible');
    expect(tip.textContent).toContain('Shown on hover');
  });

  it('passes the side through to the tooltip', () => {
    const el = host(
      renderComponent(PaulInfoTipComponent, { content: 'x', side: 'bottom' }),
    );
    expect((el.querySelector('[role="tooltip"]') as HTMLElement).className).toContain(
      'tooltip--bottom',
    );
  });
});
