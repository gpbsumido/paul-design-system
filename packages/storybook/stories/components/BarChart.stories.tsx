import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '@paul-portfolio/react';

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    label: { control: 'text' },
  },
  args: {
    data: [90, 65, 47, 34, 25],
    labels: ['D1', 'D3', 'D7', 'D14', 'D30'],
    label: 'Retention by day',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, height: 180 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    data: [3800, 2600, 1900, 1200, 700],
    labels: ['NA', 'EU', 'APAC', 'LATAM', 'MEA'],
    label: 'Users by region',
  },
};

export const CustomColors: Story = {
  args: {
    colors: ['#22c55e', '#22c55e', '#f59e0b', '#ef4444', '#ef4444'],
  },
};
