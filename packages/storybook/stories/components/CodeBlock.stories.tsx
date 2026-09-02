import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from '@paul-portfolio/react';

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    language: { control: 'text' },
    filename: { control: 'text' },
    showLineNumbers: { control: 'boolean' },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const sample = `import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();
const stream = await client.messages.stream({
  model: 'claude-sonnet-5',
  messages: [{ role: 'user', content: 'Hello' }],
});`;

export const Default: Story = {
  args: {
    code: sample,
    language: 'ts',
    filename: 'stream.ts',
    showLineNumbers: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 620 }}>
      <CodeBlock {...args} />
    </div>
  ),
};

export const NoLineNumbers: Story = {
  args: { code: 'npm install @paul-portfolio/react', language: 'bash' },
};
