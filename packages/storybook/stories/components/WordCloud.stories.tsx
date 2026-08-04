import type { Meta, StoryObj } from '@storybook/react';
import { WordCloud } from '@paul-portfolio/react';

/** Tag frequency across a quarter of support tickets. */
const tags = [
  { text: 'billing', weight: 148 },
  { text: 'login', weight: 121 },
  { text: 'internationalization', weight: 34 },
  { text: 'export', weight: 96 },
  { text: 'sso', weight: 88 },
  { text: 'latency', weight: 74 },
  { text: 'mobile', weight: 67 },
  { text: 'webhooks', weight: 59 },
  { text: 'api', weight: 52 },
  { text: 'permissions', weight: 45 },
  { text: 'search', weight: 38 },
  { text: 'onboarding', weight: 31 },
  { text: 'notifications', weight: 27 },
  { text: 'audit log', weight: 22 },
  { text: 'sandbox', weight: 18 },
  { text: 'quota', weight: 14 },
];

const meta = {
  title: 'Charts/WordCloud',
  component: WordCloud,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    limit: { control: { type: 'range', min: 1, max: 50, step: 1 } },
    minFontSize: { control: { type: 'range', min: 6, max: 24, step: 1 } },
    maxFontSize: { control: { type: 'range', min: 20, max: 72, step: 2 } },
    width: { control: { type: 'range', min: 200, max: 600, step: 20 } },
    height: { control: { type: 'range', min: 120, max: 400, step: 10 } },
  },
  args: {
    terms: tags,
    label: 'Support ticket tags this quarter',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Read this before reaching for it: glyph AREA is not a comparable encoding. A long word reads as bigger than a short one at the same weight — "internationalization" at weight 34 looks heavier here than "sso" at 88 — so nobody can recover the numbers from the picture. `BarChart` shows exactly this data honestly, on a shared baseline. This component exists because galleries want one; when the numbers matter, reach for the bars. The accessible name carries the ranked term/weight list, so a screen reader gets the better chart. The layout has no randomness in it: the same input renders the same picture every time.',
      },
    },
  },
} satisfies Meta<typeof WordCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Colour cycles by rank and encodes nothing. Weight is already carried by font size, so ramping colour by weight too would state the same number twice.',
      },
    },
  },
};

export const Limited: Story = {
  args: { limit: 6, label: 'Top six support ticket tags this quarter' },
  parameters: {
    docs: {
      description: {
        story:
          'Cutting the tail is the one reliable way to make a cloud legible — fewer terms means a wider spread between the largest and smallest type. It still will not let you compare two words; it just stops the small ones from being noise.',
      },
    },
  },
};

export const Empty: Story = {
  args: { terms: [], label: 'No tagged tickets in range' },
};
