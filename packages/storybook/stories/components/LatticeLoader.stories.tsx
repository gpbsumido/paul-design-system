import type { Meta, StoryObj } from '@storybook/react';
import { LatticeLoader } from '@paul-portfolio/react';

const meta = {
  title: 'Components/LatticeLoader',
  component: LatticeLoader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A grid of cells that light in a travelling pattern while working, ' +
          'resolving into a check or cross when done. Ported from ReactBits and ' +
          'reimplemented on the tokens. role="status" with an off-screen spoken ' +
          'update; under reduced motion the pulse slows and stops travelling.',
      },
    },
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['working', 'done', 'error'] },
    grid: { control: 'inline-radio', options: [3, 4] },
    pattern: {
      control: 'select',
      options: ['orbit', 'sweep', 'dots', 'ripple', 'spiral', 'snake', 'pulse'],
    },
    cellSize: { control: { type: 'range', min: 4, max: 14, step: 1 } },
  },
} satisfies Meta<typeof LatticeLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Working: Story = {
  args: { label: 'Thinking', grid: 3, pattern: 'orbit', cellSize: 8 },
};

export const Done: Story = {
  args: { status: 'done', doneLabel: 'Done in', elapsed: 2.4, cellSize: 8 },
};

export const Error: Story = {
  args: { status: 'error', errorLabel: 'Failed after', elapsed: 1.1, cellSize: 8 },
};
