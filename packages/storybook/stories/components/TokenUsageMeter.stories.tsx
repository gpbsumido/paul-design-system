import type { Meta, StoryObj } from '@storybook/react';
import { TokenUsageMeter } from '@paul-portfolio/react';

const meta = {
  title: 'Components/TokenUsageMeter',
  component: TokenUsageMeter,
  tags: ['autodocs'],
  argTypes: {
    promptTokens: { control: 'number' },
    completionTokens: { control: 'number' },
    maxTokens: { control: 'number' },
    costPerMTok: { control: 'number' },
  },
} satisfies Meta<typeof TokenUsageMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Context window',
    promptTokens: 3200,
    completionTokens: 1400,
    maxTokens: 8000,
    costPerMTok: 3,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <TokenUsageMeter {...args} />
    </div>
  ),
};

export const NearLimit: Story = {
  args: {
    label: 'Context window',
    promptTokens: 7000,
    completionTokens: 600,
    maxTokens: 8000,
    costPerMTok: 3,
  },
};

export const OverBudget: Story = {
  args: {
    label: 'Context window',
    promptTokens: 7800,
    completionTokens: 900,
    maxTokens: 8000,
    costPerMTok: 3,
  },
};
