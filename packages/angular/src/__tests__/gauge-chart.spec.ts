import { describe, it, expect } from 'vitest';
import { PaulGaugeChartComponent } from '../gauge-chart';
import { renderComponent, host } from './render';

/** Mirrors packages/react/src/__tests__/GaugeChart.test.tsx. */
describe('PaulGaugeChart', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(renderComponent(PaulGaugeChartComponent, { value: 62, label: 'Disk used', ...inputs }));

  const ariaLabel = (el: HTMLElement) =>
    el.querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';

  it('exposes the figure as an image with the value summary', () => {
    expect(ariaLabel(render_())).toBe('Disk used: 62 of 100 (62%)');
  });

  it('always draws the track, and draws no fill at zero', () => {
    const el = render_({ value: 0 });
    expect(el.querySelector('.paul-chart__gauge-track')).not.toBeNull();
    expect(el.querySelector('.paul-chart__gauge-fill')).toBeNull();
  });

  it('draws a fill once there is something to show', () => {
    expect(render_().querySelector('.paul-chart__gauge-fill')).not.toBeNull();
  });

  it('renders the value and unit as visible text', () => {
    const el = render_({ unit: '%' });
    expect(el.querySelector('.paul-chart__value')?.textContent?.trim()).toBe('62%');
    expect(el.querySelector('.paul-chart__unit')?.textContent).toBe('%');
    // The hero number is real text, not a decoration hidden from assistive tech.
    expect(el.querySelector('.paul-chart__value')?.getAttribute('aria-hidden')).toBeNull();
  });

  it('captions the value with the top of the range', () => {
    const el = render_({ value: 180, label: 'Storage', max: 250, unit: ' GB' });
    expect(el.querySelector('.paul-chart__caption')?.textContent?.trim()).toBe('of 250');
  });

  it('takes the percentage from a custom min and max', () => {
    expect(ariaLabel(render_({ value: 25, label: 'Load', min: 0, max: 50 }))).toContain('(50%)');
  });

  it('clamps a value below the minimum and above the maximum', () => {
    // One fixture, re-driven: the TestBed can only be configured once per test.
    const fixture = renderComponent(PaulGaugeChartComponent, { value: -10, label: 'Load' });
    expect(ariaLabel(host(fixture))).toContain('(0%)');
    fixture.componentRef.setInput('value', 140);
    fixture.detectChanges();
    expect(ariaLabel(host(fixture))).toContain('(100%)');
  });

  it('gives each tone its status colour AND a text label', () => {
    const cases = [
      ['good', 'Good', '--paul-color-success-600'],
      ['warning', 'Warning', '--paul-color-warning-600'],
      ['critical', 'Critical', '--paul-color-error-600'],
    ] as const;
    const fixture = renderComponent(PaulGaugeChartComponent, { value: 62, label: 'Load' });
    for (const [tone, text, token] of cases) {
      fixture.componentRef.setInput('tone', tone);
      fixture.detectChanges();
      const el = host(fixture);
      expect(el.querySelector('.paul-chart__gauge-fill')?.getAttribute('fill')).toContain(token);
      // Colour alone never carries status, so the tone is spelled out too.
      expect(el.querySelector('.paul-chart__tone')?.textContent?.trim()).toBe(text);
    }
  });

  it('renders no tone label for the default tone', () => {
    const el = render_();
    expect(el.querySelector('.paul-chart__tone')).toBeNull();
    expect(el.querySelector('.paul-chart__gauge-fill')?.getAttribute('fill')).toBe(
      'var(--paul-chart-1)',
    );
  });

  it('handles a zero-width range without NaN', () => {
    const el = render_({ value: 5, min: 5, max: 5 });
    const name = ariaLabel(el);
    expect(name).toContain('(0%)');
    expect(name).not.toContain('NaN');
    expect(el.querySelector('.paul-chart__gauge-track')?.getAttribute('d')).not.toContain('NaN');
  });
});

/** Mirrors the caption/range tests in packages/react/src/__tests__/GaugeChart.test.tsx. */
describe('PaulGaugeChart caption and range', () => {
  it('names only the maximum when the range starts at zero', () => {
    const el = host(
      renderComponent(PaulGaugeChartComponent, { label: 'Disk used', value: 62, unit: '%' }),
    );
    expect(el.querySelector('.paul-chart__caption')?.textContent?.trim()).toBe('of 100');
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toContain(
      '62 of 100 (62%)',
    );
  });

  it('names both ends when the range does not start at zero', () => {
    const el = host(
      renderComponent(PaulGaugeChartComponent, {
        label: 'Rack temperature',
        value: 41.5,
        min: 20,
        max: 60,
      }),
    );
    expect(el.querySelector('.paul-chart__caption')?.textContent?.trim()).toBe('of 20 to 60');
    const name = el.querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';
    expect(name).toContain('41.5 of 20 to 60');
    expect(name).toContain('(53.75%)');
  });
});
