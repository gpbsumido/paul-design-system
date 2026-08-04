import type { Meta, StoryObj } from '@storybook/react';
import { HeatmapChart } from '@paul-portfolio/react';

/** Percent of each signup cohort still active at week N. */
const retention = [
  { label: 'Jan cohort', values: [100, 62, 48, 41, 37] },
  { label: 'Feb cohort', values: [100, 66, 52, 45, 40] },
  { label: 'Mar cohort', values: [100, 71, 58, 50, 44] },
  { label: 'Apr cohort', values: [100, 74, 61, 54, 49] },
];

/** A 7x8 grid — past roughly 8x8 the printed values turn into texture. */
const trafficByHour = [
  { label: 'Mon', values: [4, 6, 12, 28, 44, 51, 38, 19] },
  { label: 'Tue', values: [5, 7, 14, 31, 47, 55, 41, 21] },
  { label: 'Wed', values: [5, 8, 15, 33, 49, 57, 43, 22] },
  { label: 'Thu', values: [6, 8, 16, 34, 50, 58, 44, 23] },
  { label: 'Fri', values: [6, 9, 17, 35, 52, 61, 46, 25] },
  { label: 'Sat', values: [3, 4, 8, 15, 22, 26, 24, 17] },
  { label: 'Sun', values: [2, 3, 6, 12, 18, 21, 20, 14] },
];

const meta = {
  title: 'Charts/HeatmapChart',
  component: HeatmapChart,
  tags: ['autodocs'],
  argTypes: {
    showValues: { control: 'boolean' },
    label: { control: 'text' },
    width: { control: { type: 'range', min: 160, max: 480, step: 20 } },
    height: { control: { type: 'range', min: 100, max: 360, step: 10 } },
  },
  args: {
    rows: retention,
    colLabels: ['W0', 'W1', 'W2', 'W3', 'W4'],
    label: 'Weekly retention by signup cohort',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A grid shaded by magnitude, so the colour comes from the sequential ramp rather than the categorical series palette — intensity is a quantity here, not an identity. The scale legend is not optional: a ramp with no key says one cell is bigger than another but never by how much.',
      },
    },
  },
} satisfies Meta<typeof HeatmapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CohortRetention: Story = {};

export const ValuesHidden: Story = {
  args: {
    rows: trafficByHour,
    colLabels: ['06', '08', '10', '12', '14', '16', '18', '20'],
    label: 'Requests per second by weekday and hour',
    showValues: false,
    width: 320,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Direct labelling is only honest on a small grid. Past roughly 8x8 the text is smaller than the cell can carry and the numbers read as texture, so turn the values off and let the ramp plus the scale legend do the work.',
      },
    },
  },
};

export const Empty: Story = {
  args: { rows: [], colLabels: [], label: 'No cohorts in range' },
};
