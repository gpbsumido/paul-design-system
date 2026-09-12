import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '@paul-portfolio/react';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTrend: Story = {
  args: {
    label: 'Approval rate',
    value: '98.2%',
    delta: { value: '+1.4pt', direction: 'up' },
    trend: [95, 96, 95, 97, 98, 97, 98],
    trendLabel: 'Approval rate over the last 7 days',
    footnote: 'Last 24h',
  },
};

export const Negative: Story = {
  args: {
    label: 'Chargeback rate',
    value: '0.92%',
    delta: { value: '+0.18pt', direction: 'up', intent: 'negative' },
    footnote: 'Rolling 30d',
  },
};

export const Dashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 720 }}>
      <StatCard
        label="Approval rate"
        value="98.2%"
        delta={{ value: '+1.4pt', direction: 'up' }}
        trend={[95, 96, 95, 97, 98, 97, 98]}
        trendLabel="Approval rate trend"
      />
      <StatCard
        label="Alerts in queue"
        value={128}
        delta={{ value: '-12', direction: 'down' }}
        trend={[210, 190, 175, 160, 150, 140, 128]}
        trendLabel="Queue depth trend"
      />
      <StatCard
        label="Chargebacks"
        value="0.92%"
        delta={{ value: '+0.18pt', direction: 'up', intent: 'negative' }}
        footnote="Rolling 30d"
      />
    </div>
  ),
};
