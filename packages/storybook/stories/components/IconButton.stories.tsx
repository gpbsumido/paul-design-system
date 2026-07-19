import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '@paul-portfolio/react';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '✕',
    'aria-label': 'Close',
  },
};

export const Small: Story = {
  args: {
    children: '✕',
    size: 'sm',
    'aria-label': 'Close',
  },
};

export const Disabled: Story = {
  args: {
    children: '✕',
    disabled: true,
    'aria-label': 'Close',
  },
};
