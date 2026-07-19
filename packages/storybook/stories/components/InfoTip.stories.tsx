import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { InfoTip } from '@paul-portfolio/react';

const meta = {
  title: 'Components/InfoTip',
  component: InfoTip,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    label: { control: 'text' },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    maxWidth: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover the trigger and wait out the show-delay so the popover is captured. */
const revealPopover: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.hover(canvas.getByRole('img'));
  const tip = await canvas.findByRole('tooltip', undefined, { timeout: 2000 });
  await expect(tip).toBeVisible();
};

export const Default: Story = {
  args: { content: 'We never share your email.' },
  play: revealPopover,
};

export const Bottom: Story = {
  args: { content: 'Shown below the trigger.', side: 'bottom' },
  play: revealPopover,
};

export const RichContent: Story = {
  args: {
    maxWidth: 240,
    content: (
      <span>
        <strong>Sync modes</strong>
        <br />
        Local only, Push (read-only), or Two-way.
      </span>
    ),
  },
  play: revealPopover,
};

/** The resting state, without the popover — just the trigger glyph. */
export const TriggerOnly: Story = {
  args: { content: 'Hover to see me.' },
};
