import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Modal, Button } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Example Modal">
        <Modal.Body>
          This is the modal content. Press Escape or click outside to close.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const Default: Story = {
  args: {
    open: false,
    title: 'Example Modal',
    children: 'Modal content',
    onClose: () => {},
  },
  render: () => <ModalDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the open button
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);

    // Verify dialog is visible
    const dialog = await canvas.findByRole('dialog');
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await userEvent.keyboard('{Escape}');

    // Verify dialog is closed
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
