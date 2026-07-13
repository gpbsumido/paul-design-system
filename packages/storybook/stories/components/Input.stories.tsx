import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Input } from '../../react/src/Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helper: { control: 'text' },
    error: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const WithLabel: Story = {
  args: { label: 'Email', placeholder: 'you@example.com' },
};

export const WithHelper: Story = {
  args: { label: 'Password', helper: 'Must be at least 8 characters', type: 'password' },
};

export const WithError: Story = {
  args: { label: 'Email', error: 'Invalid email address', value: 'not-an-email' },
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true, value: 'Cannot edit' },
};

export const SmallSize: Story = {
  args: { label: 'Small input', size: 'sm', placeholder: 'Small...' },
};

export const Typing: Story = {
  args: { label: 'Name' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'Hello World');
    await expect(input).toHaveValue('Hello World');
  },
};
