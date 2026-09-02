import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ChatComposer } from '@paul-portfolio/react';

const meta = {
  title: 'Components/ChatComposer',
  component: ChatComposer,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    busy: { control: 'boolean' },
    maxLength: { control: 'number' },
  },
} satisfies Meta<typeof ChatComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Message', placeholder: 'Send a message…', maxLength: 500 },
  render: (args) => {
    const [sent, setSent] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: 560 }}>
        <ul>
          {sent.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        <ChatComposer {...args} onSubmit={(m) => setSent((s) => [...s, m])} />
      </div>
    );
  },
};

export const Busy: Story = {
  args: { label: 'Message', busy: true, placeholder: 'Waiting for a reply…' },
};

export const SendsOnEnter: Story = {
  args: { label: 'Message' },
  render: (args) => {
    const [sent, setSent] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: 560 }}>
        <div data-testid="log">{sent.join(',')}</div>
        <ChatComposer {...args} onSubmit={(m) => setSent((s) => [...s, m])} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox');
    await userEvent.type(field, 'hello{Enter}');
    await expect(canvas.getByTestId('log')).toHaveTextContent('hello');
  },
};
