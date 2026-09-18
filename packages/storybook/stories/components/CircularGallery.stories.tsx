import type { Meta, StoryObj } from '@storybook/react';
import { CircularGallery } from '@paul-portfolio/react';

const meta = {
  title: 'Components/CircularGallery',
  component: CircularGallery,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Cards on a rotating 3D cylinder you can spin with a drag. The ' +
          'OriginKit original is WebGL; this reinterprets it as a CSS ' +
          'preserve-3d ring — no dependency. Cards are real links; under reduced ' +
          'motion the auto-spin and coast drop and it only turns while dragged.',
      },
    },
  },
  argTypes: {
    radius: { control: { type: 'range', min: 200, max: 500, step: 20 } },
    autoRotate: { control: 'boolean' },
  },
} satisfies Meta<typeof CircularGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const ids = [1015, 1016, 1018, 1019, 1024, 1025, 1027, 1035];
const items = ids.map((id) => ({
  image: `https://picsum.photos/id/${id}/400/280`,
  title: `Photo ${id}`,
  href: '#',
}));

export const Default: Story = {
  args: { items, radius: 340, cardWidth: 220, cardHeight: 150, autoRotate: true },
  render: (args) => (
    <div style={{ background: '#0a0a0a', padding: '32px 0' }}>
      <CircularGallery {...args} />
    </div>
  ),
};
