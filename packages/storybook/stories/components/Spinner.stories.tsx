import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

// `label` is the accessible name (aria-label), not visible text, so on its own
// it looks identical to the default. Here it's paired with matching visible
// text — the usual "loading…" pattern — so there's actually something to see.
export const WithText: Story = {
  args: { label: 'Loading results' },
  render: (args) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <Spinner {...args} />
      <span>Loading results…</span>
    </span>
  ),
};
