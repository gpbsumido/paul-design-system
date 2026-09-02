import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Combobox } from '@paul-portfolio/react';

const options = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'claude-opus', label: 'Claude Opus' },
  { value: 'claude-sonnet', label: 'Claude Sonnet' },
  { value: 'llama-3', label: 'Llama 3' },
  { value: 'gemini', label: 'Gemini 1.5' },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Model', placeholder: 'Search models…', options },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: 320 }}>
        <Combobox {...args} value={value} onChange={setValue} />
        {value && <p style={{ marginTop: 8 }}>Selected: {value}</p>}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, 'clau');
    await expect(canvas.getAllByRole('option').length).toBeGreaterThan(0);
  },
};
