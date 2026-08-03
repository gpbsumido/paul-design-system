import type { Meta, StoryObj } from '@storybook/react';
import { DonutChart } from '@paul-portfolio/react';

const meta = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  argTypes: {
    legend: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    data: [
      { label: 'Online', value: 18, color: '#22c55e' },
      { label: 'Degraded', value: 5, color: '#f59e0b' },
      { label: 'Offline', value: 2, color: '#ef4444' },
    ],
    label: 'Fleet health',
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoLegend: Story = {
  args: { legend: false },
};

export const TokenPalette: Story = {
  args: {
    data: [
      { label: 'IAP', value: 42 },
      { label: 'Ads', value: 28 },
      { label: 'Battle Pass', value: 19 },
      { label: 'Cosmetics', value: 11 },
    ],
    label: 'Revenue mix',
  },
};

export const Empty: Story = {
  args: { data: [], label: 'No stores reporting' },
};
