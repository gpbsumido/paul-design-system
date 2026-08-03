import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from '@paul-portfolio/react';

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'area'] },
    label: { control: 'text' },
  },
  args: {
    data: [4, 8, 5, 10, 7, 12, 9, 15, 11, 18],
    label: 'Weekly signups',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};

export const Area: Story = {
  args: { variant: 'area' },
};

export const MultipleSeries: Story = {
  args: {
    series: [
      [4, 8, 5, 10, 7, 12, 9, 15, 11, 18],
      [12, 11, 13, 12, 14, 13, 15, 14, 16, 15],
      [2, 3, 3, 5, 4, 6, 5, 7, 6, 8],
    ],
    label: 'Signups by plan: free, pro, team',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Every line is scaled against one domain spanning all of them. Independently scaled sparklines look comparable and are not — that is the whole reason `series` exists rather than three separate charts. `area` is single-series only; stacked fills at this size are mud.',
      },
    },
  },
};

export const Empty: Story = {
  args: { data: [], label: 'No data yet' },
};
