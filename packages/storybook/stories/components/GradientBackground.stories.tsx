import type { Meta, StoryObj } from '@storybook/react';
import { GradientBackground } from '@paul-portfolio/react';

const meta = {
  title: 'Components/GradientBackground',
  component: GradientBackground,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A decorative surface painted with a flowing multi-stop gradient. ' +
          'Children render on top and carry the real content. The ambient flow ' +
          'is pure CSS and goes static under prefers-reduced-motion.',
      },
    },
  },
  argTypes: {
    angle: { control: { type: 'range', min: 0, max: 360, step: 5 } },
    speed: { control: 'inline-radio', options: ['slow', 'normal', 'fast'] },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof GradientBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyle: React.CSSProperties = {
  minHeight: 260,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  borderRadius: 12,
  color: '#fff',
  fontSize: 24,
  fontWeight: 600,
  textShadow: '0 1px 2px rgb(0 0 0 / 0.4)',
};

export const Default: Story = {
  args: {
    angle: 120,
    speed: 'normal',
    animate: true,
    style: panelStyle,
    children: 'Flowing brand gradient',
  },
};

export const SunsetFast: Story = {
  args: {
    colors: ['#ff7e5f', '#feb47b', '#ff6a88'],
    angle: 90,
    speed: 'fast',
    style: panelStyle,
    children: 'Custom sunset palette',
  },
};

export const Static: Story = {
  args: {
    animate: false,
    style: panelStyle,
    children: 'Animation off',
  },
};
