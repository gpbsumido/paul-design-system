import type { Meta, StoryObj } from '@storybook/react';
import { TextLoop } from '@paul-portfolio/react';

const meta = {
  title: 'Components/TextLoop',
  component: TextLoop,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Cycles a list of phrases in place, each sliding up as the next ' +
          'arrives. Only the active phrase is exposed to assistive tech. Swaps ' +
          'without sliding under prefers-reduced-motion.',
      },
    },
  },
  argTypes: {
    intervalMs: { control: { type: 'range', min: 800, max: 4000, step: 200 } },
  },
} satisfies Meta<typeof TextLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: ['fast', 'safe', 'fair'], intervalMs: 2000 },
  render: (args) => (
    <div style={{ fontSize: 28, fontWeight: 700 }}>
      Bets that are <TextLoop {...args} />
    </div>
  ),
};
