import type { Meta, StoryObj } from '@storybook/react';
import { FolderFloat } from '@paul-portfolio/react';

const meta = {
  title: 'Components/FolderFloat',
  component: FolderFloat,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A folder whose contents float out above it, fanned and gently bobbing. ' +
          'The ReactBits original runs a matter-js simulation; this reinterprets ' +
          'the feel with a CSS fan and per-chip bob — no physics engine, no ' +
          'dependency. A labelled group; chips are real links. Under reduced ' +
          'motion the bob stops.',
      },
    },
  },
  argTypes: {
    accent: { control: 'color' },
  },
} satisfies Meta<typeof FolderFloat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Projects',
    items: [
      { label: 'Design', href: '#design' },
      { label: 'Research', href: '#research' },
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'Notes', href: '#notes' },
      { label: 'Archive', href: '#archive' },
    ],
  },
};
