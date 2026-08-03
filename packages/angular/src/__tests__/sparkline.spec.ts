import { describe, it, expect } from 'vitest';
import { PaulSparklineComponent } from '../sparkline';
import { renderComponent, host } from './render';

/** Mirrors the multi-series half of packages/react/src/__tests__/Sparkline.test.tsx. */
describe('PaulSparkline with multiple series', () => {
  const series = [
    [0, 5],
    [0, 10],
  ];

  const lines = (el: HTMLElement) => [...el.querySelectorAll('.paul-chart__line')];

  it('draws one line per series', () => {
    const el = host(renderComponent(PaulSparklineComponent, { series, label: 'Two teams' }));
    expect(lines(el)).toHaveLength(2);
  });

  it('gives each series its own palette slot', () => {
    const el = host(renderComponent(PaulSparklineComponent, { series, label: 'Two teams' }));
    expect(lines(el).map((p) => p.getAttribute('stroke'))).toEqual([
      'var(--paul-chart-1)',
      'var(--paul-chart-2)',
    ]);
  });

  it('scales every series against one shared domain', () => {
    const el = host(renderComponent(PaulSparklineComponent, { series, label: 'Two teams' }));
    const tops = lines(el).map((p) => {
      const d = p.getAttribute('d') ?? '';
      return Math.min(...[...d.matchAll(/,(-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[1])));
    });
    expect(tops[1]).toBeLessThan(tops[0]);
  });

  it('takes precedence over data', () => {
    const el = host(
      renderComponent(PaulSparklineComponent, { data: [1, 2, 3], series, label: 'Two teams' }),
    );
    expect(lines(el)).toHaveLength(2);
  });

  it('ignores empty series and falls back to the empty state', () => {
    const el = host(
      renderComponent(PaulSparklineComponent, { series: [[], []], label: 'Nothing' }),
    );
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });

  it('does not fill under multiple series, even with variant=area', () => {
    const el = host(
      renderComponent(PaulSparklineComponent, { series, variant: 'area', label: 'Two teams' }),
    );
    expect(el.querySelector('.paul-chart__area')).toBeNull();
  });

  it('still renders a single series from data', () => {
    const el = host(
      renderComponent(PaulSparklineComponent, { data: [1, 5, 3], label: 'One team' }),
    );
    expect(lines(el)).toHaveLength(1);
    expect(lines(el)[0].getAttribute('stroke')).toBeNull();
  });
});
