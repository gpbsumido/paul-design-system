import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SquishSwitch } from '@paul-portfolio/react';

const meta = {
  title: 'Components/SquishSwitch',
  component: SquishSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A toggle whose thumb springs across and compresses on press — the ' +
          'tactile feel of a physical switch. A real role="switch". Static ' +
          'under prefers-reduced-motion.',
      },
    },
  },
} satisfies Meta<typeof SquishSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return <SquishSwitch checked={on} onChange={setOn} label="Dark mode" />;
  },
};
