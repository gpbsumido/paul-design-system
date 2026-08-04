import type { Meta, StoryObj } from '@storybook/react';
import { GaugeChart } from '@paul-portfolio/react';

const meta = {
  title: 'Charts/GaugeChart',
  component: GaugeChart,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'good', 'warning', 'critical'] },
    label: { control: 'text' },
    unit: { control: 'text' },
    value: { control: { type: 'range', min: -20, max: 140, step: 1 } },
    min: { control: 'number' },
    max: { control: 'number' },
    size: { control: { type: 'range', min: 80, max: 240, step: 10 } },
    thickness: { control: { type: 'range', min: 6, max: 40, step: 2 } },
    sweep: { control: { type: 'range', min: 90, max: 360, step: 10 } },
  },
  args: {
    value: 68,
    label: 'Error budget consumed',
    unit: '%',
  },
  parameters: {
    docs: {
      description: {
        component:
          'One ratio against a limit. The number is the point, so it is a hero figure inside the arc rather than a label hanging off it — the arc gives the reading a position in its range, the text gives it precision. Any tone other than `default` also renders its name as visible text, because status must never be carried by colour alone.',
      },
    },
  },
} satisfies Meta<typeof GaugeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Good: Story = {
  args: { value: 24, tone: 'good', label: 'Error budget consumed' },
};

export const Warning: Story = {
  args: { value: 76, tone: 'warning', label: 'Error budget consumed' },
};

export const Critical: Story = {
  args: { value: 94, tone: 'critical', label: 'Error budget consumed' },
  parameters: {
    docs: {
      description: {
        story:
          'The tone name is printed next to the value. Screenshot this in greyscale and the reading survives — which is the test any status colour has to pass.',
      },
    },
  },
};

export const OverMax: Story = {
  args: { value: 118, max: 100, tone: 'critical', label: 'Quota used' },
  parameters: {
    docs: {
      description: {
        story:
          'The arc clamps to the range so it cannot draw past a full sweep, but the text reports the value verbatim. A gauge that silently rounded 118 down to 100 would hide the overage, which is the one thing worth knowing here.',
      },
    },
  },
};

export const CustomRange: Story = {
  args: {
    value: 41.5,
    min: 20,
    max: 60,
    unit: '°C',
    label: 'Rack inlet temperature',
    tone: 'warning',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A non-zero `min` is for readings whose useful band does not start at zero. The arc fills relative to `min`, so the dial spends its whole length on the range anyone actually watches.',
      },
    },
  },
};
