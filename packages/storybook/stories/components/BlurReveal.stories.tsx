import type { Meta, StoryObj } from '@storybook/react';
import { BlurReveal } from '@paul-portfolio/react';

const meta = {
  title: 'Components/BlurReveal',
  component: BlurReveal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Content resolves from a soft blur as it rises into place. A one-shot ' +
          'entrance on mount (reload the story to replay it); present at rest ' +
          'under prefers-reduced-motion.',
      },
    },
  },
  argTypes: {
    delayMs: { control: { type: 'range', min: 0, max: 600, step: 30 } },
  },
} satisfies Meta<typeof BlurReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Now you see me',
  },
};

export const Heading: Story = {
  args: {
    as: 'h2',
    delayMs: 120,
    children: 'A staggered heading',
  },
};
