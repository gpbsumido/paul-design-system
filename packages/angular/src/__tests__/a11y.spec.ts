import { Component, signal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderComponent, host } from './render';
import { PaulTextareaComponent } from '../textarea';
import { PaulSelectComponent } from '../select';
import { PaulFilterBarComponent } from '../filter-bar';
import { PaulInfoTipComponent } from '../info-tip';
import { PaulTickerComponent } from '../ticker';
import { PaulTiltCardComponent } from '../tilt-card';
import { PaulGradientBackgroundComponent } from '../gradient-background';
import { PaulSpotlightComponent } from '../spotlight';
import { PaulSparklineComponent } from '../sparkline';
import { PaulBarChartComponent } from '../bar-chart';
import { PaulDonutChartComponent } from '../donut-chart';
import { PaulFunnelChartComponent } from '../funnel-chart';
import { PaulRadarChartComponent } from '../radar-chart';
import { PaulScatterPlotComponent } from '../scatter-plot';
import { PaulHeatmapChartComponent } from '../heatmap-chart';
import { PaulParetoChartComponent } from '../pareto-chart';
import { PaulGaugeChartComponent } from '../gauge-chart';
import { PaulWordCloudComponent } from '../word-cloud';
import { PaulStackedLineChartComponent } from '../stacked-line-chart';

expect.extend(matchers);

/**
 * The Angular twins are held to the same axe bar as the React originals in
 * packages/react/src/__tests__/a11y.test.tsx. Each host renders the component
 * the way a caller would, since projected content is part of what axe judges.
 */

@Component({
  selector: 'paul-a11y-select',
  standalone: true,
  imports: [PaulSelectComponent],
  template: `
    <paul-select label="Team" [helper]="helper()">
      <option value="a">A</option>
      <option value="b">B</option>
    </paul-select>
  `,
})
class SelectHost {
  readonly helper = signal<string | undefined>(undefined);
}

@Component({
  selector: 'paul-a11y-filter-bar',
  standalone: true,
  imports: [PaulFilterBarComponent, PaulSelectComponent],
  template: `
    <paul-filter-bar label="Team and player filters">
      <paul-select label="Team"><option value="a">A</option></paul-select>
      <paul-select label="Season"><option value="2026">2026</option></paul-select>
    </paul-filter-bar>
  `,
})
class FilterBarHost {}

@Component({
  selector: 'paul-a11y-ticker',
  standalone: true,
  imports: [PaulTickerComponent],
  template: `
    <paul-ticker label="News ticker" [mode]="mode()">
      <ng-template><a href="#story">Headline</a></ng-template>
    </paul-ticker>
  `,
})
class TickerHost {
  readonly mode = signal<'scroll' | 'marquee'>('scroll');
}

@Component({
  selector: 'paul-a11y-tilt-card',
  standalone: true,
  imports: [PaulTiltCardComponent],
  template: `<paul-tilt-card><h2>Title</h2><p>Body copy</p></paul-tilt-card>`,
})
class TiltCardHost {}

@Component({
  selector: 'paul-a11y-gradient',
  standalone: true,
  imports: [PaulGradientBackgroundComponent],
  template: `<paul-gradient-background><p>Over the gradient</p></paul-gradient-background>`,
})
class GradientHost {}

@Component({
  selector: 'paul-a11y-spotlight',
  standalone: true,
  imports: [PaulSpotlightComponent],
  template: `<paul-spotlight><p>Lit content</p></paul-spotlight>`,
})
class SpotlightHost {}

/** Runs axe over a rendered fixture's DOM. */
async function auditFixture(el: HTMLElement) {
  return axe(el);
}

describe('Accessibility', () => {
  it('PaulTextarea with a label has no violations', async () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio' }));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulTextarea with an error and a live count has no violations', async () => {
    const el = host(
      renderComponent(PaulTextareaComponent, {
        label: 'Bio',
        error: 'Too short',
        maxLength: 100,
        showCount: true,
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulTextarea with a hidden label has no violations', async () => {
    const el = host(renderComponent(PaulTextareaComponent, { label: 'Bio', hideLabel: true }));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulSelect has no violations', async () => {
    const el = host(renderComponent(SelectHost));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulSelect with helper text has no violations', async () => {
    const fixture = renderComponent(SelectHost);
    fixture.componentInstance.helper.set('Pick one');
    fixture.detectChanges();
    expect(await auditFixture(host(fixture))).toHaveNoViolations();
  });

  it('PaulFilterBar of selects has no violations', async () => {
    const el = host(renderComponent(FilterBarHost));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulInfoTip has no violations', async () => {
    const el = host(renderComponent(PaulInfoTipComponent, { content: 'What this means' }));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulTicker in scroll mode has no violations', async () => {
    const el = host(renderComponent(TickerHost));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulTicker in marquee mode has no violations', async () => {
    const fixture = renderComponent(TickerHost);
    fixture.componentInstance.mode.set('marquee');
    fixture.detectChanges();
    expect(await auditFixture(host(fixture))).toHaveNoViolations();
  });

  it('PaulTiltCard has no violations', async () => {
    const el = host(renderComponent(TiltCardHost));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulGradientBackground has no violations', async () => {
    const el = host(renderComponent(GradientHost));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulSpotlight has no violations', async () => {
    const el = host(renderComponent(SpotlightHost));
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulSparkline has no violations', async () => {
    const el = host(
      renderComponent(PaulSparklineComponent, {
        data: [4, 8, 5, 10],
        label: 'Sessions, last 4 weeks',
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulBarChart has no violations', async () => {
    const el = host(
      renderComponent(PaulBarChartComponent, {
        data: [90, 65, 47],
        labels: ['D1', 'D3', 'D7'],
        label: 'Retention',
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulDonutChart with a legend has no violations', async () => {
    const el = host(
      renderComponent(PaulDonutChartComponent, {
        data: [
          { label: 'Online', value: 18 },
          { label: 'Offline', value: 2 },
        ],
        label: 'Fleet health',
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulFunnelChart has no violations', async () => {
    const el = host(
      renderComponent(PaulFunnelChartComponent, {
        label: 'Signup funnel',
        data: [
          { label: 'Visit', value: 1000 },
          { label: 'Signup', value: 620 },
        ],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulRadarChart has no violations', async () => {
    const el = host(
      renderComponent(PaulRadarChartComponent, {
        label: 'Team profile',
        axes: ['Speed', 'Power', 'Range'],
        data: [
          { label: 'Alpha', values: [10, 6, 8] },
          { label: 'Beta', values: [5, 9, 3] },
        ],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulScatterPlot has no violations', async () => {
    const el = host(
      renderComponent(PaulScatterPlotComponent, {
        label: 'Load vs latency',
        series: [
          {
            label: 'p95',
            points: [
              { x: 1, y: 2 },
              { x: 3, y: 5 },
            ],
          },
        ],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulHeatmapChart has no violations', async () => {
    const el = host(
      renderComponent(PaulHeatmapChartComponent, {
        label: 'Cohort retention',
        rows: [
          { label: 'Jan', values: [100, 60] },
          { label: 'Feb', values: [100, 55] },
        ],
        colLabels: ['W0', 'W1'],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulParetoChart has no violations', async () => {
    const el = host(
      renderComponent(PaulParetoChartComponent, {
        label: 'Defects',
        data: [
          { label: 'Scratch', value: 50 },
          { label: 'Dent', value: 30 },
        ],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulGaugeChart has no violations', async () => {
    const el = host(
      renderComponent(PaulGaugeChartComponent, { label: 'Disk used', value: 62, unit: '%' }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulGaugeChart with a status tone has no violations', async () => {
    const el = host(
      renderComponent(PaulGaugeChartComponent, {
        label: 'Disk used',
        value: 94,
        unit: '%',
        tone: 'critical',
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulWordCloud has no violations', async () => {
    const el = host(
      renderComponent(PaulWordCloudComponent, {
        label: 'Topics',
        terms: [
          { text: 'typescript', weight: 40 },
          { text: 'angular', weight: 28 },
        ],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulStackedLineChart has no violations', async () => {
    const el = host(
      renderComponent(PaulStackedLineChartComponent, {
        label: 'Traffic',
        series: [
          { label: 'Organic', values: [10, 20, 30] },
          { label: 'Paid', values: [5, 10, 15] },
        ],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });

  it('PaulSparkline with several series has no violations', async () => {
    const el = host(
      renderComponent(PaulSparklineComponent, {
        label: 'Two teams',
        series: [
          [1, 5, 3],
          [2, 4, 8],
        ],
      }),
    );
    expect(await auditFixture(el)).toHaveNoViolations();
  });
});
