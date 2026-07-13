import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../react/src/Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    fallback: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/100',
    alt: 'User avatar',
  },
};

export const Fallback: Story = {
  args: {
    fallback: 'PS',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar src="https://i.pravatar.cc/100?u=sm" alt="Small" size="sm" />
      <Avatar src="https://i.pravatar.cc/100?u=md" alt="Medium" size="md" />
      <Avatar src="https://i.pravatar.cc/100?u=lg" alt="Large" size="lg" />
      <Avatar src="https://i.pravatar.cc/100?u=xl" alt="Extra Large" size="xl" />
    </div>
  ),
  args: {
    src: 'https://i.pravatar.cc/100',
    alt: 'Avatar',
  },
};
