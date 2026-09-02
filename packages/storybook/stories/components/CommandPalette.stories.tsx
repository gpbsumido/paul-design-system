import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { CommandPalette, Button } from '@paul-portfolio/react';

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    chromatic: { delay: 300, diffThreshold: 0.3 },
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

function makeCommands(log: (m: string) => void) {
  return [
    { id: 'new', label: 'New chat', group: 'Chat', hint: '⌘N', onSelect: () => log('New chat') },
    { id: 'clear', label: 'Clear history', group: 'Chat', onSelect: () => log('Clear history') },
    { id: 'model', label: 'Switch model', group: 'Settings', keywords: ['gpt', 'claude'], onSelect: () => log('Switch model') },
    { id: 'theme', label: 'Toggle theme', group: 'Settings', keywords: ['dark', 'light'], onSelect: () => log('Toggle theme') },
  ];
}

export const Default: Story = {
  args: { open: false, onClose: () => {}, commands: [] },
  render: () => {
    const [open, setOpen] = useState(false);
    const [last, setLast] = useState('');
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open command palette
        </Button>
        {last && <p>Ran: {last}</p>}
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          commands={makeCommands(setLast)}
        />
      </>
    );
  },
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /open command palette/i }));
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const Open: Story = {
  args: { open: true, onClose: () => {}, commands: makeCommands(() => {}) },
};
