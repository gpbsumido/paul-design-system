import type { Meta, StoryObj } from '@storybook/react';
import { RadarChart } from '@paul-portfolio/react';

const axes = ['Latency', 'Coverage', 'A11y', 'Bundle size', 'Docs', 'Adoption'];

const meta = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  argTypes: {
    showLegend: { control: 'boolean' },
    label: { control: 'text' },
    max: { control: { type: 'range', min: 10, max: 200, step: 10 } },
    size: { control: { type: 'range', min: 120, max: 320, step: 10 } },
  },
  args: {
    axes,
    data: [{ label: 'React package', values: [78, 92, 96, 64, 71, 88] }],
    label: 'Package scorecard',
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
          'Several measures on one frame. Every series is scaled against a single ceiling so the polygons are comparable rather than each filling the frame, and only the first three series are drawn — a fourth translucent overlay stops resolving into a distinct shape.',
      },
    },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneSeries: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A single profile gets no legend — the accessible name already says what the polygon is.',
      },
    },
  },
};

export const TwoSeries: Story = {
  args: {
    data: [
      { label: 'React package', values: [78, 92, 96, 64, 71, 88] },
      { label: 'Angular package', values: [72, 85, 94, 58, 63, 47] },
    ],
    label: 'React vs Angular scorecard',
  },
};

export const SharedMax: Story = {
  args: {
    data: [
      { label: 'React package', values: [78, 92, 96, 64, 71, 88] },
      { label: 'Angular package', values: [72, 85, 94, 58, 63, 47] },
    ],
    max: 100,
    label: 'React vs Angular scorecard, scored out of 100',
  },
  parameters: {
    docs: {
      description: {
        story:
          'These are percentages, so the ceiling is 100 — not the largest value in the data. Left to the default the best score would touch the outer ring and read as perfect. Pass `max` whenever the scale has a real, known top.',
      },
    },
  },
};

export const Empty: Story = {
  args: { data: [], label: 'No scorecard yet' },
};
