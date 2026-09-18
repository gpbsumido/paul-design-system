import type { Meta, StoryObj } from '@storybook/react';
import { BotanicalText } from '@paul-portfolio/react';

const meta = {
  title: 'Components/BotanicalText',
  component: BotanicalText,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Text grown from tiny flowers and leaves that sway. Reinterpreted from ' +
          'OriginKit — the original renders instanced sprites in Three.js; this ' +
          'samples the text on the built-in 2D canvas and draws little blooms, so ' +
          'there is no WebGL and nothing to install. A labelled `role="img"`; ' +
          'under reduced motion the sway stops.',
      },
    },
  },
  argTypes: {
    bloomHue: { control: { type: 'range', min: 0, max: 360, step: 10 } },
    leafHue: { control: { type: 'range', min: 60, max: 160, step: 5 } },
    leafMix: { control: { type: 'range', min: 0, max: 0.6, step: 0.05 } },
    density: { control: { type: 'range', min: 5, max: 14, step: 1 } },
  },
} satisfies Meta<typeof BotanicalText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: 'BLOOM', bloomHue: 330, leafHue: 120, leafMix: 0.28, fontSize: 150 },
  render: (args) => (
    <div style={{ background: '#111014', padding: '56px 24px' }}>
      <BotanicalText {...args} />
    </div>
  ),
};
