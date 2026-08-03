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

export const Empty: Story = {
  args: { data: [], label: 'No data yet' },
};
