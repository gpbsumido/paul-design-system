import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Tooltip, Button } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover the trigger and wait out the show-delay so the tooltip is captured. */
const revealTooltip: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.hover(canvas.getByRole('button'));
  const tooltip = await canvas.findByRole('tooltip', undefined, { timeout: 2000 });
  await expect(tooltip).toBeVisible();
};

export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    side: 'top',
    children: <Button>Hover me</Button>,
  },
  play: revealTooltip,
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    side: 'bottom',
    children: <Button>Hover me</Button>,
  },
  play: revealTooltip,
};

export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    side: 'left',
    children: <Button>Hover me</Button>,
  },
  play: revealTooltip,
};

export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    side: 'right',
    children: <Button>Hover me</Button>,
  },
  play: revealTooltip,
};
