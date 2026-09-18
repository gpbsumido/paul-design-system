import type { Meta, StoryObj } from '@storybook/react';
import { LightBloom } from '@paul-portfolio/react';

const meta = {
  title: 'Components/LightBloom',
  component: LightBloom,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A glow blooming from one edge, its origin sliding toward the pointer, ' +
          'breathing slowly. Reinterpreted from OriginKit (a WebGL shader) as a ' +
          'CSS radial bloom with optional drifting light shafts. Decorative; pass ' +
          'content to layer over it. Under reduced motion the motion stops.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bloom', 'shaft'] },
    direction: {
      control: 'inline-radio',
      options: ['bottom', 'top', 'left', 'right'],
    },
    spread: { control: { type: 'range', min: 10, max: 90, step: 5 } },
    baseColor: { control: 'color' },
    accentColor: { control: 'color' },
  },
} satisfies Meta<typeof LightBloom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'bloom', direction: 'bottom', spread: 55 },
  render: (args) => (
    <div style={{ height: 520 }}>
      <LightBloom {...args}>
        <div
          style={{
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            color: '#f5f7ff',
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          Light Bloom
        </div>
      </LightBloom>
    </div>
  ),
};

export const Shafts: Story = {
  args: { variant: 'shaft', direction: 'bottom', spread: 60 },
  render: (args) => (
    <LightBloom {...args}>
      <div style={{ height: 520 }} />
    </LightBloom>
  ),
};
