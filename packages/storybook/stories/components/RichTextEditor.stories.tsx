import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '@paul-portfolio/react';

const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Message',
    placeholder: 'Write a prompt…',
    defaultValue: '<p>Draft your <strong>prompt</strong> here.</p>',
  },
  render: (args) => {
    const [html, setHtml] = useState(args.defaultValue ?? '');
    return (
      <div style={{ maxWidth: 640 }}>
        <RichTextEditor {...args} onChange={setHtml} />
        <pre style={{ marginTop: 12, fontSize: 12, color: 'var(--paul-color-muted)' }}>
          {html}
        </pre>
      </div>
    );
  },
};

export const MinimalToolbar: Story = {
  args: {
    label: 'Note',
    toolbar: ['bold', 'italic', 'code'],
    placeholder: 'Bold, italic and code only…',
  },
};
