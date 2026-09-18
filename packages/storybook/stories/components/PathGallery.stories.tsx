import type { Meta, StoryObj } from '@storybook/react';
import { PathGallery } from '@paul-portfolio/react';

const meta = {
  title: 'Components/PathGallery',
  component: PathGallery,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Images gliding along a curved closed path, spaced evenly. ' +
          'Reinterpreted from OriginKit using CSS motion path (offset-path) — no ' +
          'dependency. Items are real links; under reduced motion the travel ' +
          'stops and the images rest along the path.',
      },
    },
  },
  argTypes: {
    duration: { control: { type: 'range', min: 10, max: 60, step: 2 } },
    itemSize: { control: { type: 'range', min: 48, max: 120, step: 4 } },
    showPath: { control: 'boolean' },
  },
} satisfies Meta<typeof PathGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const ids = [1015, 1016, 1018, 1019, 1024, 1025, 1027, 1035, 1039, 1043];
const items = ids.map((id) => ({
  image: `https://picsum.photos/id/${id}/200/200`,
  title: `Photo ${id}`,
  href: '#',
}));

export const Default: Story = {
  args: { items, duration: 32, itemSize: 84, showPath: true },
  render: (args) => (
    <div style={{ background: '#0a0a0a', padding: 24 }}>
      <PathGallery {...args} />
    </div>
  ),
};
