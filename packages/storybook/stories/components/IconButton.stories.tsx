import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../react/src/Button';

const meta = {
  title: 'Components/IconButton',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '\u2715',
    className: 'btn--icon',
    'aria-label': 'Close',
  },
};

export const Primary: Story = {
  args: {
    children: '\u2715',
    variant: 'primary',
    className: 'btn--icon',
    'aria-label': 'Close',
  },
};

export const Ghost: Story = {
  args: {
    children: '\u2715',
    variant: 'ghost',
    className: 'btn--icon',
    'aria-label': 'Close',
  },
};

export const Small: Story = {
  args: {
    children: '\u2715',
    size: 'sm',
    className: 'btn--icon',
    'aria-label': 'Close',
  },
};
