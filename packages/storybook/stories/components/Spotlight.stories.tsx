import type { Meta, StoryObj } from '@storybook/react';
import { Spotlight } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Spotlight',
  component: Spotlight,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An interactive background: a soft radial glow that follows the cursor. ' +
          'The glow is decorative and clipped to the container; content sits on ' +
          'top. Under prefers-reduced-motion the glow is pinned to the centre ' +
          'and stops tracking.',
      },
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Spotlight>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyle: React.CSSProperties = {
  minHeight: 260,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  borderRadius: 12,
  background: '#0a0a0a',
  color: '#fafafa',
  fontSize: 20,
  fontWeight: 600,
};

export const Default: Story = {
  args: {
    size: 350,
    style: panelStyle,
    children: 'Move your cursor across the panel',
  },
};

export const WarmGlow: Story = {
  args: {
    size: 450,
    color: 'rgb(245 158 11 / 0.35)',
    style: panelStyle,
    children: 'A warmer, larger spotlight',
  },
};
