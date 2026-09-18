import type { Meta, StoryObj } from '@storybook/react';
import { DriftWall } from '@paul-portfolio/react';

const meta = {
  title: 'Components/DriftWall',
  component: DriftWall,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A 3D wall of image tiles — columns drift at their own speed, the ' +
          'plane tilts toward the pointer, and the hovered or focused tile lifts ' +
          'forward and brightens. Ported from ReactBits. Under reduced motion ' +
          'the columns hold still and only the focus lift remains.',
      },
    },
  },
  argTypes: {
    columns: { control: { type: 'range', min: 2, max: 7, step: 1 } },
    speed: { control: { type: 'range', min: 0, max: 120, step: 6 } },
    parallax: { control: { type: 'range', min: 0, max: 1.5, step: 0.1 } },
    grayscale: { control: 'boolean' },
    pauseOnHover: { control: 'boolean' },
  },
} satisfies Meta<typeof DriftWall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { columns: 5, speed: 42, parallax: 0.6 },
  render: (args) => (
    <div style={{ height: 560, background: '#060010' }}>
      <DriftWall {...args} />
    </div>
  ),
};
