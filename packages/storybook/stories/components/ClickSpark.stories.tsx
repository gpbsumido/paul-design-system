import type { Meta, StoryObj } from '@storybook/react';
import { ClickSpark } from '@paul-portfolio/react';

const meta = {
  title: 'Components/ClickSpark',
  component: ClickSpark,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A ring of rays bursts from the press point, then clears itself. Wrap ' +
          'it around a control — it does not intercept the click. Nothing spawns ' +
          'under prefers-reduced-motion.',
      },
    },
  },
  argTypes: {
    count: { control: { type: 'range', min: 4, max: 16, step: 1 } },
  },
} satisfies Meta<typeof ClickSpark>;

export default meta;
type Story = StoryObj<typeof meta>;

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 999,
  border: '1px solid #333',
  background: '#111',
  color: '#fafafa',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
};

export const Default: Story = {
  args: {
    count: 8,
    children: (
      <button type="button" style={buttonStyle}>
        Press me
      </button>
    ),
  },
};
