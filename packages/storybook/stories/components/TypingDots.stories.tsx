import type { Meta, StoryObj } from '@storybook/react';
import { TypingDots } from '@paul-portfolio/react';

const meta = {
  title: 'Components/TypingDots',
  component: TypingDots,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof TypingDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Assistant is typing' },
};

export const InABubble: Story = {
  args: { label: 'Assistant is typing' },
  render: (args) => (
    <div
      style={{
        display: 'inline-flex',
        padding: '10px 14px',
        borderRadius: 12,
        background: 'var(--paul-color-neutral-100)',
      }}
    >
      <TypingDots {...args} />
    </div>
  ),
};
