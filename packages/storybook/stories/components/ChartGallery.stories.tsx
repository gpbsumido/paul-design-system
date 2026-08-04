import type { Meta, StoryObj } from '@storybook/react';
import {
  Sparkline,
  BarChart,
  DonutChart,
  FunnelChart,
  RadarChart,
  ScatterPlot,
  HeatmapChart,
  ParetoChart,
  GaugeChart,
  WordCloud,
  StackedLineChart,
} from '@paul-portfolio/react';

/**
 * Every chart form in one place. This is the story to look at after a palette
 * or geometry change: one Chromatic snapshot that catches a regression across
 * the whole set, where the per-chart stories localise it.
 */
function Cell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: '1px solid var(--paul-color-border)',
        borderRadius: 'var(--paul-radius-lg)',
        padding: 'var(--paul-spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--paul-spacing-3)',
        background: 'var(--paul-color-surface)',
        minWidth: 0,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 'var(--paul-font-size-sm)',
          fontWeight: 'var(--paul-font-weight-semibold)',
          color: 'var(--paul-color-foreground)',
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Gallery() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
        gap: 'var(--paul-spacing-4)',
        padding: 'var(--paul-spacing-4)',
      }}
    >
      <Cell title="Sparkline · area">
        <Sparkline data={[4, 8, 5, 10, 7, 12, 9, 15, 11, 18]} variant="area" label="Sessions, last 10 weeks" />
      </Cell>

      <Cell title="Sparkline · two series">
        <Sparkline
          series={[
            [4, 8, 5, 10, 7, 12],
            [2, 3, 6, 5, 9, 8],
          ]}
          label="Organic and paid sessions"
        />
      </Cell>

      <Cell title="BarChart · retention">
        <BarChart
          data={[90, 65, 47, 34, 25]}
          labels={['D1', 'D3', 'D7', 'D14', 'D30']}
          label="Retention by day"
        />
      </Cell>

      <Cell title="DonutChart · fleet health">
        <DonutChart
          data={[
            { label: 'Online', value: 18 },
            { label: 'Degraded', value: 5 },
            { label: 'Offline', value: 2 },
          ]}
          label="Fleet health"
        />
      </Cell>

      <Cell title="FunnelChart · signup">
        <FunnelChart
          data={[
            { label: 'Visit', value: 1000 },
            { label: 'Signup', value: 620 },
            { label: 'Activate', value: 465 },
            { label: 'Pay', value: 223 },
          ]}
          label="Signup funnel"
        />
      </Cell>

      <Cell title="RadarChart · team profile">
        <RadarChart
          axes={['Speed', 'Power', 'Range', 'Control', 'Stamina']}
          data={[
            { label: 'Alpha', values: [9, 6, 8, 5, 7] },
            { label: 'Beta', values: [5, 9, 4, 8, 6] },
          ]}
          label="Team profile"
        />
      </Cell>

      <Cell title="ScatterPlot · load vs latency">
        <ScatterPlot
          series={[
            {
              label: 'p95',
              points: [
                { x: 1, y: 120 },
                { x: 2, y: 138 },
                { x: 3, y: 160 },
                { x: 4, y: 210 },
                { x: 5, y: 320 },
              ],
            },
            {
              label: 'p50',
              points: [
                { x: 1, y: 60 },
                { x: 2, y: 64 },
                { x: 3, y: 71 },
                { x: 4, y: 80 },
                { x: 5, y: 96 },
              ],
            },
          ]}
          label="Latency against concurrent load"
        />
      </Cell>

      <Cell title="HeatmapChart · cohorts">
        <HeatmapChart
          rows={[
            { label: 'Jan', values: [100, 62, 41, 33] },
            { label: 'Feb', values: [100, 58, 39, 30] },
            { label: 'Mar', values: [100, 66, 45, 0] },
          ]}
          colLabels={['W0', 'W1', 'W2', 'W3']}
          label="Cohort retention"
        />
      </Cell>

      <Cell title="ParetoChart · defects">
        <ParetoChart
          data={[
            { label: 'Scratch', value: 50 },
            { label: 'Dent', value: 30 },
            { label: 'Chip', value: 12 },
            { label: 'Crack', value: 5 },
            { label: 'Other', value: 3 },
          ]}
          label="Defects by type"
        />
      </Cell>

      <Cell title="GaugeChart · disk">
        <GaugeChart label="Disk used" value={62} unit="%" />
      </Cell>

      <Cell title="WordCloud · topics">
        <WordCloud
          terms={[
            { text: 'typescript', weight: 40 },
            { text: 'angular', weight: 28 },
            { text: 'react', weight: 26 },
            { text: 'svg', weight: 14 },
            { text: 'tokens', weight: 11 },
            { text: 'a11y', weight: 9 },
          ]}
          label="Topics by frequency"
        />
      </Cell>

      <Cell title="StackedLineChart · traffic">
        <StackedLineChart
          variant="stacked"
          series={[
            { label: 'Organic', values: [10, 14, 18, 22, 26, 30] },
            { label: 'Paid', values: [5, 7, 9, 10, 12, 15] },
            { label: 'Referral', values: [2, 3, 3, 5, 6, 8] },
          ]}
          label="Traffic by channel"
        />
      </Cell>
    </div>
  );
}

const meta = {
  title: 'Charts/Gallery',
  component: Gallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every chart form on one page, drawn from the same geometry core and the same token palette. Switch the theme toolbar to dark to check the dark palette steps — they are separately chosen values, not a flip of the light ones.',
      },
    },
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllCharts: Story = {};
