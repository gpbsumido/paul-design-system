import type { Meta, StoryObj } from '@storybook/react';
import { ParticleText } from '@paul-portfolio/react';

const meta = {
  title: 'Components/ParticleText',
  component: ParticleText,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Text drawn as a cloud of particles that assemble into the letters, ' +
          'drift, and scatter from the pointer. Reinterpreted from ReactBits on ' +
          'the built-in 2D canvas — no renderer or dependency. The container is a ' +
          'labelled `role="img"`, so the words are read; under reduced motion the ' +
          'particles are drawn at rest.',
      },
    },
  },
  argTypes: {
    fontSize: { control: { type: 'range', min: 60, max: 200, step: 10 } },
    density: { control: { type: 'range', min: 2, max: 8, step: 1 } },
    color: { control: 'color' },
  },
} satisfies Meta<typeof ParticleText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: 'BLOOM', color: '#a5c8ff', fontSize: 140, density: 4 },
  render: (args) => (
    <div style={{ background: '#05060a', padding: '48px 24px' }}>
      <ParticleText {...args} />
    </div>
  ),
};
