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

/**
 * `colors` exists for the case where each bar is a different ENTITY — one bar
 * per team, per channel, per region — so the slots carry identity.
 *
 * It is not for shading a single series green-to-red by size. That double-encodes
 * the value as hue, spends the one free channel on information the bar length
 * already carries, and reads as a status signal that isn't there. One series gets
 * one colour, which is what every other story here shows.
 */
export const PerEntityColors: Story = {
  args: {
    data: [3800, 2600, 1900, 1200, 700],
    labels: ['NA', 'EU', 'APAC', 'LATAM', 'MEA'],
    label: 'Users by region',
    colors: [
      'var(--paul-chart-1)',
      'var(--paul-chart-2)',
      'var(--paul-chart-3)',
      'var(--paul-chart-4)',
      'var(--paul-chart-5)',
    ],
  },
};
