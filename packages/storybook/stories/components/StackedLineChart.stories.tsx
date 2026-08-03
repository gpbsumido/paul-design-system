import type { Meta, StoryObj } from '@storybook/react';
import { StackedLineChart } from '@paul-portfolio/react';

/** Weekly active users per platform, twelve weeks. */
const platforms = [
  { label: 'Web', values: [820, 845, 910, 968, 1012, 1080, 1124, 1190, 1244, 1301, 1358, 1420] },
  { label: 'iOS', values: [412, 438, 461, 502, 547, 590, 618, 664, 705, 741, 788, 832] },
  { label: 'Android', values: [301, 318, 344, 371, 396, 428, 447, 480, 512, 538, 571, 604] },
  { label: 'Desktop', values: [96, 101, 104, 112, 118, 121, 129, 134, 140, 147, 151, 158] },
];

const meta = {
  title: 'Charts/StackedLineChart',
  component: StackedLineChart,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['lines', 'stacked'] },
    showLegend: { control: 'boolean' },
    label: { control: 'text' },
    width: { control: { type: 'range', min: 120, max: 400, step: 10 } },
    height: { control: { type: 'range', min: 60, max: 300, step: 10 } },
  },
  args: {
    series: platforms,
    label: 'Weekly active users by platform',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Several series over one shared x. Both variants take their y-domain from a single pass across every series — series rescaled to their own extents look comparable and aren't. Series colour is clamped at slot six rather than cycled: a seventh line reusing slot one would read as the first series. Past six, facet or roll the tail into \"Other\".",
      },
    },
  },
} satisfies Meta<typeof StackedLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lines: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Overlaid lines answer "how is each platform trending", because every line starts from the same baseline and can be traced on its own.',
      },
    },
  },
};

export const Stacked: Story = {
  args: { variant: 'stacked', label: 'Weekly active users by platform, part to whole' },
  parameters: {
    docs: {
      description: {
        story:
          'Stacking answers a different question: how the total is composed. Only the bottom band sits on a flat baseline, so the bands above it are hard to read as individual trends — use this when the total is the subject and the split is the detail.',
      },
    },
  },
};

export const SingleSeries: Story = {
  args: {
    series: platforms.slice(0, 1),
    label: 'Weekly active users on web',
  },
  parameters: {
    docs: {
      description: {
        story:
          'One series never gets a legend regardless of `showLegend` — the accessible name already says what the line is, and a one-row key is just clutter.',
      },
    },
  },
};

export const Empty: Story = {
  args: { series: [], label: 'No sessions in range' },
};
