import type { Meta, StoryObj } from '@storybook/react';
import { SmoothScrollSlider } from '@paul-portfolio/react';

const meta = {
  title: 'Components/SmoothScrollSlider',
  component: SmoothScrollSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A horizontal rail of cards that grow toward the centre and coast ' +
          'after a flick — wheel, drag or trackpad. Reinterpreted from OriginKit. ' +
          'Under reduced motion the coast is removed and the rail tracks input ' +
          'directly, keeping the spatial centre-scaling.',
      },
    },
  },
  argTypes: {
    smoothness: { control: { type: 'range', min: 1, max: 20, step: 1 } },
    dim: { control: { type: 'range', min: 0, max: 10, step: 1 } },
    sensitivity: { control: { type: 'range', min: 1, max: 10, step: 1 } },
    loop: { control: 'boolean' },
  },
} satisfies Meta<typeof SmoothScrollSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

const ids = [1015, 1016, 1018, 1019, 1024, 1025, 1027, 1035, 1039, 1043];
const slides = ids.map((id) => ({
  image: `https://picsum.photos/id/${id}/600/400`,
  title: `Photo ${id}`,
}));

export const Default: Story = {
  args: { slides, slideWidth: 320, slideHeight: 200, loop: true },
  render: (args) => (
    <div style={{ padding: '40px 0', background: '#0a0a0a' }}>
      <SmoothScrollSlider {...args} />
    </div>
  ),
};
