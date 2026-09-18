import type { Meta, StoryObj } from '@storybook/react';
import { StarBorder } from '@paul-portfolio/react';

const meta = {
  title: 'Components/StarBorder',
  component: StarBorder,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A conic gradient sweeps around the border, tinted from currentColor ' +
          '(set the wrapper text colour) and clipped to a thin animated edge. ' +
          'Stops rotating under prefers-reduced-motion.',
      },
    },
  },
} satisfies Meta<typeof StarBorder>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardStyle: React.CSSProperties = {
  padding: 24,
  minWidth: 220,
  color: '#fafafa',
  fontSize: 16,
  fontWeight: 600,
};

export const Default: Story = {
  render: () => (
    <div style={{ color: '#22c55e', borderRadius: 16 }}>
      <StarBorder>
        <div style={cardStyle}>Biggest underdog</div>
      </StarBorder>
    </div>
  ),
};

export const AmberTint: Story = {
  render: () => (
    <div style={{ color: '#f59e0b', borderRadius: 16 }}>
      <StarBorder>
        <div style={cardStyle}>Closest game</div>
      </StarBorder>
    </div>
  ),
};
