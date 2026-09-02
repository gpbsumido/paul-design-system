import type { Meta, StoryObj } from '@storybook/react';
import { StreamingText } from '@paul-portfolio/react';

const meta = {
  title: 'Components/StreamingText',
  component: StreamingText,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    speed: { control: 'number' },
    interval: { control: 'number' },
    cursor: { control: 'boolean' },
  },
  parameters: {
    // The reveal animates over time; give Chromatic a stable frame.
    chromatic: { delay: 1500 },
  },
} satisfies Meta<typeof StreamingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'This response streams in one token at a time, just like a model reply.',
    speed: 2,
    interval: 30,
    cursor: true,
  },
  render: (args) => (
    <p style={{ maxWidth: 480, fontSize: 16 }}>
      <StreamingText {...args} />
    </p>
  ),
};
