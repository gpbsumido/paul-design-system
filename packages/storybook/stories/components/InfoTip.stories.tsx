import type { Meta, StoryObj } from '@storybook/react';
import { InfoTip } from '@paul-portfolio/react';

const meta = {
  title: 'Components/InfoTip',
  component: InfoTip,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    label: { control: 'text' },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    maxWidth: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { content: 'We never share your email.' },
};

export const Bottom: Story = {
  args: { content: 'Shown below the trigger.', side: 'bottom' },
};

export const RichContent: Story = {
  args: {
    maxWidth: 240,
    content: (
      <span>
        <strong>Sync modes</strong>
        <br />
        Local only, Push (read-only), or Two-way.
      </span>
    ),
  },
};
