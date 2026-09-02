import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessage, Avatar } from '@paul-portfolio/react';

const meta = {
  title: 'Components/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  argTypes: {
    role: { control: 'inline-radio', options: ['user', 'assistant', 'system'] },
    pending: { control: 'boolean' },
  },
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Assistant: Story = {
  args: {
    role: 'assistant',
    name: 'Assistant',
    timestamp: '10:30',
    children: 'Sure — here is a summary of the three options you asked about.',
  },
};

export const User: Story = {
  args: {
    role: 'user',
    name: 'Paul',
    timestamp: '10:31',
    children: 'Great, can you compare them on latency?',
  },
};

export const Conversation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      <ChatMessage role="user" name="Paul" avatar={<Avatar fallback="PS" alt="Paul" />}>
        What can you do?
      </ChatMessage>
      <ChatMessage role="assistant" name="Assistant" avatar={<Avatar fallback="AI" alt="Assistant" />}>
        Plenty. Ask me anything.
      </ChatMessage>
      <ChatMessage role="assistant" name="Assistant" pending />
    </div>
  ),
};
