import type { Meta, StoryObj } from '@storybook/react';
import { RefineFrame } from '@paul-portfolio/react';

const meta = {
  title: 'Components/RefineFrame',
  component: RefineFrame,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A frame whose content resolves from blurred and desaturated to sharp ' +
          'as its status advances — the "generating → refining → ready" preview ' +
          'an image model gives you. Reinterpreted from ReactBits with CSS ' +
          'filters (no canvas, no icon dependency); a glint sweeps while it ' +
          'works and a role="status" pill announces the stage. Under reduced ' +
          'motion the sweep drops and the spinner pulses.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['queued', 'generating', 'refining', 'complete', 'error'],
    },
    sweep: { control: 'boolean' },
    showStatus: { control: 'boolean' },
  },
} satisfies Meta<typeof RefineFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Generating: Story = {
  args: { status: 'generating' },
  render: (args) => (
    <RefineFrame {...args}>
      <img src="https://picsum.photos/id/1025/400/300" alt="A generated preview" />
    </RefineFrame>
  ),
};

export const Ready: Story = {
  args: { status: 'complete' },
  render: (args) => (
    <RefineFrame {...args}>
      <img src="https://picsum.photos/id/1025/400/300" alt="A generated preview" />
    </RefineFrame>
  ),
};
