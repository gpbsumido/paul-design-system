import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../react/src/Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { variant: 'success', children: 'Success' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Warning' },
};

export const Error: Story = {
  args: { variant: 'error', children: 'Error' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'Info' },
};

export const Dot: Story = {
  args: { dot: true, variant: 'success' },
};
