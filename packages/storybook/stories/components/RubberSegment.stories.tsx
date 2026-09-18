import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RubberSegment } from '@paul-portfolio/react';

const meta = {
  title: 'Components/RubberSegment',
  component: RubberSegment,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A segmented control whose selection indicator rubber-bands between ' +
          'segments, overshooting and settling. A role="radiogroup" of radios. ' +
          'Jumps without the elastic travel under prefers-reduced-motion.',
      },
    },
  },
} satisfies Meta<typeof RubberSegment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('Week');
    return (
      <RubberSegment
        segments={['Day', 'Week', 'Month']}
        value={value}
        onChange={setValue}
      />
    );
  },
};
