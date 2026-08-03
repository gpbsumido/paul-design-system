import { Component, signal } from '@angular/core';
import {
  PaulButtonComponent,
  PaulTextareaComponent,
  PaulSelectComponent,
  PaulFilterBarComponent,
  PaulInfoTipComponent,
  PaulTickerComponent,
  PaulTiltCardComponent,
  PaulGradientBackgroundComponent,
  PaulSpotlightComponent,
  PaulSparklineComponent,
  PaulDonutChartComponent,
  PaulFunnelChartComponent,
  PaulRadarChartComponent,
  PaulScatterPlotComponent,
  PaulHeatmapChartComponent,
  PaulParetoChartComponent,
  PaulGaugeChartComponent,
  PaulWordCloudComponent,
  PaulStackedLineChartComponent,
  type PaulDonutDatum,
  type PaulFunnelDatum,
  type PaulRadarSeries,
  type PaulLineSeries,
} from '@paul-portfolio/angular';

/**
 * A stand-in consumer, compiled against the BUILT package (dist/, via the path
 * mapping in this folder's tsconfig) with strictTemplates on.
 *
 * This is what caught the packaging bug: built with plain `tsc`, the published
 * output carried no component definitions, so none of these bindings resolved —
 * an Angular app importing the library got silently inert components. Compiling
 * this file is the check that the shipped artifact is actually consumable.
 */
@Component({
  selector: 'consumer-app',
  standalone: true,
  imports: [
    PaulButtonComponent,
    PaulTextareaComponent,
    PaulSelectComponent,
    PaulFilterBarComponent,
    PaulInfoTipComponent,
    PaulTickerComponent,
    PaulTiltCardComponent,
    PaulGradientBackgroundComponent,
    PaulSpotlightComponent,
    PaulSparklineComponent,
    PaulDonutChartComponent,
    PaulFunnelChartComponent,
    PaulRadarChartComponent,
    PaulScatterPlotComponent,
    PaulHeatmapChartComponent,
    PaulParetoChartComponent,
    PaulGaugeChartComponent,
    PaulWordCloudComponent,
    PaulStackedLineChartComponent,
  ],
  template: `
    <paul-button variant="primary" size="lg" [disabled]="busy()" (clicked)="onClick()">
      Save
    </paul-button>

    <paul-textarea
      label="Bio"
      [maxLength]="280"
      [showCount]="true"
      [required]="true"
      (valueChanged)="bio.set($event)"
    />

    <paul-filter-bar label="Filters">
      <paul-select label="Team" size="sm" orientation="horizontal" (valueChanged)="team.set($event)">
        <option value="a">A</option>
      </paul-select>
    </paul-filter-bar>

    <paul-info-tip content="Net rating is points per 100 possessions." side="bottom" />

    <paul-ticker label="News" mode="scroll" edge="bottom" [speed]="60">
      <ng-template><a href="#story">Headline</a></ng-template>
    </paul-ticker>

    <paul-tilt-card [maxTilt]="8" [glare]="true">Tilting content</paul-tilt-card>

    <paul-gradient-background [colors]="palette" [angle]="45" speed="fast">
      <p>Over the gradient</p>
    </paul-gradient-background>

    <paul-spotlight [size]="420">Lit content</paul-spotlight>

    <paul-sparkline [data]="series" variant="area" label="Sessions, last 8 weeks" />

    <paul-donut-chart [data]="mix" label="Revenue mix" [legend]="true" [thickness]="24" />

    <paul-sparkline [series]="cohorts" label="Two cohorts" />

    <paul-funnel-chart [data]="funnel" label="Signup funnel" [showDropOff]="true" />

    <paul-radar-chart [data]="profiles" [axes]="axes" label="Team profile" [max]="10" />

    <paul-scatter-plot [series]="cloud" label="Load vs latency" [radius]="5" />

    <paul-heatmap-chart
      [matrix]="cohortGrid"
      [rowLabels]="['Jan', 'Feb']"
      [colLabels]="['W0', 'W1']"
      label="Cohort retention"
    />

    <paul-pareto-chart [data]="defects" label="Defects" [threshold]="80" />

    <paul-gauge-chart label="Disk used" [value]="62" unit="%" tone="warning" />

    <paul-word-cloud [terms]="topics" label="Topics" [limit]="20" />

    <paul-stacked-line-chart [series]="traffic" label="Traffic" variant="stacked" />
  `,
})
export class ConsumerApp {
  readonly busy = signal(false);
  readonly bio = signal('');
  readonly team = signal('a');

  readonly palette = ['#111', '#222', '#333'];
  readonly series = [4, 8, 5, 10, 7, 12, 9, 15];
  readonly mix: PaulDonutDatum[] = [
    { label: 'IAP', value: 42 },
    { label: 'Ads', value: 28 },
  ];

  readonly cohorts = [
    [1, 5, 3],
    [2, 4, 8],
  ];
  readonly funnel: PaulFunnelDatum[] = [
    { label: 'Visit', value: 1000 },
    { label: 'Signup', value: 620 },
  ];
  readonly axes = ['Speed', 'Power', 'Range'];
  readonly profiles: PaulRadarSeries[] = [
    { label: 'Alpha', values: [10, 6, 8] },
    { label: 'Beta', values: [5, 9, 3] },
  ];
  readonly cloud = [
    {
      label: 'p95',
      points: [
        { x: 1, y: 2 },
        { x: 3, y: 5 },
      ],
    },
  ];
  readonly cohortGrid = [
    [100, 60],
    [100, 55],
  ];
  readonly defects = [
    { label: 'Scratch', value: 50 },
    { label: 'Dent', value: 30 },
  ];
  readonly topics = [
    { text: 'typescript', weight: 40 },
    { text: 'angular', weight: 28 },
  ];
  readonly traffic: PaulLineSeries[] = [
    { label: 'Organic', values: [10, 20, 30] },
    { label: 'Paid', values: [5, 10, 15] },
  ];

  onClick(): void {
    this.busy.set(true);
  }
}
