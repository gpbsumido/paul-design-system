import type { Meta, StoryObj } from '@storybook/react';
import { HoverImageReveal } from '@paul-portfolio/react';

const meta = {
  title: 'Components/HoverImageReveal',
  component: HoverImageReveal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A vertical text menu that reveals an image per row on hover, in a ' +
          'window that trails the cursor. Reinterpreted from OriginKit. Rows are ' +
          'real links; the images are decorative. Under reduced motion the ' +
          'window stops trailing and hover just swaps the image.',
      },
    },
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
  },
} satisfies Meta<typeof HoverImageReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: 'Mountains', image: 'https://picsum.photos/id/1015/600/800', href: '#mountains' },
  { label: 'Harbour', image: 'https://picsum.photos/id/1016/600/800', href: '#harbour' },
  { label: 'Forest', image: 'https://picsum.photos/id/1018/600/800', href: '#forest' },
  { label: 'Desert', image: 'https://picsum.photos/id/1019/600/800', href: '#desert' },
];

export const Default: Story = {
  args: { items, align: 'left' },
};
