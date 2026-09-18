import type { Meta, StoryObj } from '@storybook/react';
import { LiquidGlass } from '@paul-portfolio/react';

const meta = {
  title: 'Components/LiquidGlass',
  component: LiquidGlass,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An iOS-style frosted surface with a specular highlight that drifts ' +
          'across it. Sits over content to frost it. Under prefers-reduced-motion ' +
          'the sheen holds still; under prefers-reduced-transparency it drops the ' +
          'blur and settles onto a solid surface.',
      },
    },
  },
} satisfies Meta<typeof LiquidGlass>;

export default meta;
type Story = StoryObj<typeof meta>;

const contentStyle: React.CSSProperties = {
  padding: 24,
  color: '#fff',
  fontSize: 16,
  fontWeight: 600,
};

export const Default: Story = {
  render: () => (
    <div
      style={{
        padding: 40,
        borderRadius: 24,
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
      }}
    >
      <LiquidGlass>
        <div style={contentStyle}>Bet slip</div>
      </LiquidGlass>
    </div>
  ),
};
