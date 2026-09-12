import type { Meta, StoryObj } from '@storybook/react';
import { RiskScore } from '@paul-portfolio/react';

const meta = {
  title: 'Components/RiskScore',
  component: RiskScore,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    level: { control: 'inline-radio', options: [undefined, 'low', 'medium', 'high', 'critical'] },
    variant: { control: 'inline-radio', options: ['detailed', 'compact'] },
  },
} satisfies Meta<typeof RiskScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = {
  args: { value: 87, label: 'Session risk' },
};

export const Compact: Story = {
  args: { value: 23, variant: 'compact', label: 'Session risk' },
};

export const AllBands: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <RiskScore value={18} label="Low example" />
      <RiskScore value={44} label="Medium example" />
      <RiskScore value={71} label="High example" />
      <RiskScore value={96} label="Critical example" />
    </div>
  ),
};

export const CompactRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <RiskScore value={18} variant="compact" label="Low" />
      <RiskScore value={44} variant="compact" label="Medium" />
      <RiskScore value={71} variant="compact" label="High" />
      <RiskScore value={96} variant="compact" label="Critical" />
    </div>
  ),
};
