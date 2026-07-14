import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    clickable: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Chip' },
};

export const Small: Story = {
  args: { label: 'Small Chip', size: 'sm' },
};

export const Clickable: Story = {
  args: { label: 'Clickable', clickable: true },
};

export const Removable: Story = {
  args: { label: 'Removable', removable: true },
};
