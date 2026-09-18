import type { Meta, StoryObj } from '@storybook/react';
import { ShineSweep } from '@paul-portfolio/react';

const meta = {
  title: 'Components/ShineSweep',
  component: ShineSweep,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A specular bar travels diagonally across the element, the way a ' +
          'highlight moves over glossy hardware. Wrap a button or a badge. The ' +
          'sheen is not rendered under prefers-reduced-motion.',
      },
    },
  },
} satisfies Meta<typeof ShineSweep>;

export default meta;
type Story = StoryObj<typeof meta>;

const buttonStyle: React.CSSProperties = {
  padding: '10px 22px',
  borderRadius: 10,
  border: 'none',
  background: '#4f46e5',
  color: '#fff',
  fontSize: 15,
  fontWeight: 600,
};

export const Default: Story = {
  args: {
    children: (
      <button type="button" style={buttonStyle}>
        Place bet
      </button>
    ),
  },
};
