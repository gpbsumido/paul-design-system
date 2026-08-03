import type { Meta, StoryObj } from '@storybook/react';
import { ScatterPlot } from '@paul-portfolio/react';

/** Monthly spend against p95 response time, one mark per service. */
const services = [
  { x: 120, y: 240 },
  { x: 180, y: 190 },
  { x: 240, y: 165 },
  { x: 310, y: 150 },
  { x: 420, y: 120 },
  { x: 560, y: 108 },
  { x: 700, y: 96 },
  { x: 880, y: 92 },
];

const batchJobs = [
  { x: 150, y: 410 },
  { x: 260, y: 360 },
  { x: 390, y: 330 },
  { x: 520, y: 280 },
  { x: 640, y: 265 },
  { x: 810, y: 240 },
];

const meta = {
  title: 'Charts/ScatterPlot',
  component: ScatterPlot,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    radius: { control: { type: 'range', min: 2, max: 10, step: 1 } },
    width: { control: { type: 'range', min: 120, max: 400, step: 10 } },
    height: { control: { type: 'range', min: 80, max: 320, step: 10 } },
  },
  args: {
    series: [{ label: 'API services', points: services }],
    label: 'Monthly spend against p95 latency',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Two measures against each other, one mark per observation. Marks carry a surface-coloured ring so overlapping points still read as two points rather than one blob.',
      },
    },
  },
} satisfies Meta<typeof ScatterPlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneSeries: Story = {};

export const TwoSeries: Story = {
  args: {
    series: [
      { label: 'API services', points: services },
      { label: 'Batch jobs', points: batchJobs },
    ],
    label: 'Monthly spend against p95 latency by workload type',
  },
};

export const ExplicitDomain: Story = {
  args: {
    series: [{ label: 'Batch jobs', points: batchJobs }],
    domain: { xMin: 0, xMax: 1000, yMin: 0, yMax: 450 },
    label: 'Batch jobs on a fixed scale',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Small multiples only work on a shared scale. Left to itself every plot rescales to its own extent, so two charts side by side look alike while describing different ranges. Pass the same `domain` to every plot in a set and the comparison becomes real.',
      },
    },
  },
};

export const Empty: Story = {
  args: { series: [], label: 'No services reporting' },
};
