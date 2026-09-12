import type { Meta, StoryObj } from '@storybook/react';
import { AgentDecisionCard, Button } from '@paul-portfolio/react';

const meta = {
  title: 'Components/AgentDecisionCard',
  component: AgentDecisionCard,
  tags: ['autodocs'],
  argTypes: {
    decision: { control: 'inline-radio', options: ['approve', 'decline', 'review'] },
    confidence: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  },
} satisfies Meta<typeof AgentDecisionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decline: Story = {
  args: {
    decision: 'decline',
    title: 'Payment $4,200 to a new payee',
    agentName: 'Risk Agent',
    confidence: 0.92,
    rationale: [
      'Payee added 4 minutes before the transfer',
      'Device seen with 3 unrelated accounts this week',
      'Amount is 6× the account median',
    ],
    actions: (
      <>
        <Button variant="danger">Confirm decline</Button>
        <Button variant="outline">Override</Button>
      </>
    ),
  },
};

export const Approve: Story = {
  args: {
    decision: 'approve',
    title: 'Login from a known device',
    agentName: 'Risk Agent',
    confidence: 0.98,
    rationale: ['Device fingerprint matches 40 prior sessions', 'Impossible-travel check passed'],
    actions: <Button variant="primary">Acknowledge</Button>,
  },
};

export const Review: Story = {
  args: {
    decision: 'review',
    title: 'Velocity spike on card ending 4417',
    agentName: 'AML Agent',
    confidence: 0.61,
    rationale: ['7 authorisations in 3 minutes', 'Two distinct merchant categories'],
    actions: (
      <>
        <Button variant="primary">Open case</Button>
        <Button variant="outline">Dismiss</Button>
      </>
    ),
  },
};
