import type { Meta, StoryObj } from '@storybook/react';
import { Ticker, Chip } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Ticker',
  component: Ticker,
  tags: ['autodocs'],
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

const items = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];

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
