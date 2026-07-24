import type { Meta, StoryObj } from '@storybook/react';
import { Ticker, Chip } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Ticker',
  component: Ticker,
  tags: ['autodocs'],
  // Constrain the width so the content actually overflows the strip — scroll
  // mode is a scroll container, so it only moves when there's somewhere to
  // scroll. In a full-width canvas the sample content fits and looks static.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420, border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    mode: { control: 'inline-radio', options: ['scroll', 'marquee'] },
    edge: { control: 'inline-radio', options: ['top', 'bottom'] },
    direction: { control: 'inline-radio', options: ['left', 'right'] },
    speed: { control: 'number' },
  },
} satisfies Meta<typeof Ticker>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliet',
];

export const Scroll: Story = {
  args: {
    label: 'Demo ticker',
    mode: 'scroll',
    children: items.map((t) => <Chip key={t}>{t}</Chip>),
  },
};

export const Marquee: Story = {
  args: {
    label: 'Flavour ticker',
    mode: 'marquee',
    children: items.map((t) => (
      <span key={t} style={{ padding: '0 24px', whiteSpace: 'nowrap' }}>
        {t}
      </span>
    )),
  },
};
