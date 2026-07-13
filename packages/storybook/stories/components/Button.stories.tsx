import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect, userEvent, within } from '@storybook/test';
import { Button } from '../../react/src/Button';

const meta = {
  title: 'Components/Button',
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
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Button' },
};

export const Primary: Story = {
  args: { children: 'Primary', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
};

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
};

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
};

export const Danger: Story = {
  args: { children: 'Danger', variant: 'danger' },
};

export const Loading: Story = {
  args: { children: 'Loading...', variant: 'primary', loading: true },
};

export const Disabled: Story = {
  args: { children: 'Disabled', variant: 'primary', disabled: true },
};

export const AsLink: Story = {
  args: { children: 'Visit Site', variant: 'primary', href: 'https://example.com' },
};

export const Small: Story = {
  args: { children: 'Small', variant: 'primary', size: 'sm' },
};

export const Large: Story = {
  args: { children: 'Large', variant: 'primary', size: 'lg' },
};

export const ClickTest: Story = {
  args: {
    children: 'Click Me',
    variant: 'primary',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const KeyboardActivation: Story = {
  args: {
    children: 'Press Me',
    variant: 'primary',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};
