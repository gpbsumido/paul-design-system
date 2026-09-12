import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CaseActivity: Story = {
  args: {
    label: 'Case activity',
    items: [
      { id: '1', title: 'Session started', time: '10:02', status: 'default' },
      {
        id: '2',
        title: 'Device flagged',
        time: '10:03',
        status: 'warning',
        description: 'Fingerprint matches 3 unrelated accounts',
      },
      {
        id: '3',
        title: 'Step-up challenge sent',
        time: '10:04',
        status: 'info',
        description: 'One-time passcode to +1 ••• 4417',
      },
      { id: '4', title: 'Payment declined', time: '10:05', status: 'error' },
      { id: '5', title: 'Case auto-resolved', time: '10:07', status: 'success' },
    ],
  },
};

export const Empty: Story = {
  args: { label: 'Case activity', items: [] },
};
