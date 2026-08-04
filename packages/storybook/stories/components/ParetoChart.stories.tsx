import type { Meta, StoryObj } from '@storybook/react';
import { ParetoChart } from '@paul-portfolio/react';

const meta = {
  title: 'Charts/ParetoChart',
  component: ParetoChart,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    threshold: { control: { type: 'range', min: 50, max: 95, step: 5 } },
    width: { control: { type: 'range', min: 120, max: 400, step: 10 } },
    height: { control: { type: 'range', min: 80, max: 320, step: 10 } },
  },
  args: {
    data: [
      { label: 'Timeout', value: 412 },
      { label: 'Auth', value: 268 },
      { label: '5xx', value: 154 },
      { label: 'Parse', value: 88 },
      { label: 'Quota', value: 47 },
      { label: 'Other', value: 21 },
    ],
    label: 'Support tickets by failure cause',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "There is ONE y-axis here, on purpose. The textbook Pareto puts raw counts on the left and cumulative percent on the right, but two y-scales on one plot invent a correlation their alignment doesn't support — where the line appears to cross the bars is a function of how the two scales were lined up, and that choice is arbitrary. So the bars are percent-of-total and the line is cumulative percent, both on 0–100, and the crossing point actually means something. Input order is ignored: bars are sorted descending, and the labels are sorted with them.",
      },
    },
  },
} satisfies Meta<typeof ParetoChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The dashed reference line sits at 80% cumulative and the marked point is the first category that reaches it — the "fix these and you have fixed most of it" read.',
      },
    },
  },
};

export const CustomThreshold: Story = {
  args: {
    threshold: 60,
    label: 'Support tickets by failure cause, 60% threshold',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The threshold is a judgement about how much of the problem you intend to take on this quarter, not a law. Move it and the marked crossing moves with it; both the line and the reference share the single percent scale, so the reading stays valid.',
      },
    },
  },
};

export const Empty: Story = {
  args: { data: [], label: 'No tickets in range' },
};
