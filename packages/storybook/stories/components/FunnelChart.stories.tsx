import type { Meta, StoryObj } from '@storybook/react';
import { FunnelChart } from '@paul-portfolio/react';

const meta = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
  argTypes: {
    showDropOff: { control: 'boolean' },
    label: { control: 'text' },
    width: { control: { type: 'range', min: 120, max: 400, step: 10 } },
    height: { control: { type: 'range', min: 80, max: 320, step: 10 } },
  },
  args: {
    data: [
      { label: 'Visited pricing', value: 12480 },
      { label: 'Started trial', value: 4120 },
      { label: 'Invited a teammate', value: 1870 },
      { label: 'Added a card', value: 940 },
      { label: 'Converted', value: 610 },
    ],
    label: 'Trial to paid conversion',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Stage-to-stage conversion drawn as narrowing bands. The taper carries the shape; the per-stage drop-off is printed as text, because that number is what a funnel is actually read for.',
      },
    },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DropOffHidden: Story = {
  args: { showDropOff: false },
  parameters: {
    docs: {
      description: {
        story:
          'Without the drop-off labels the reader is left inferring the loss from band widths alone. Only turn this off when the funnel sits next to a table that already carries the numbers.',
      },
    },
  },
};

export const Empty: Story = {
  args: { data: [], label: 'No sessions in range' },
};
