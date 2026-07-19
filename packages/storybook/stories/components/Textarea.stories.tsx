import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Textarea } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helper: { control: 'text' },
    error: { control: 'text' },
    hideLabel: { control: 'boolean' },
    showCount: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Bio', placeholder: 'Tell us about yourself...' },
};

export const WithHelper: Story = {
  args: { label: 'Notes', helper: 'Markdown is supported' },
};

export const WithError: Story = {
  args: { label: 'Bio', error: 'This field is required', value: '' },
};

export const Required: Story = {
  args: { label: 'Bio', required: true },
};

export const HiddenLabel: Story = {
  args: { label: 'Search notes', hideLabel: true, placeholder: 'Search...' },
};

export const WithCharacterCount: Story = {
  args: { label: 'Tweet', maxLength: 140, showCount: true, defaultValue: 'Hello' },
};

export const Typing: Story = {
  args: { label: 'Message', maxLength: 200, showCount: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox');
    await userEvent.type(field, 'Hi there');
    await expect(field).toHaveValue('Hi there');
    await expect(canvas.getByText('8 / 200')).toBeVisible();
  },
};
