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
  parameters: {
    // Modal uses createPortal to document.body, so Chromatic needs full-page snapshots
    chromatic: { delay: 300, diffThreshold: 0.3 },
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
  parameters: {
    // Skip the interactive story in Chromatic since the portal renders outside #storybook-root
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the open button
    const openButton = canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);

    // Verify dialog is visible — portal renders to document.body, not canvasElement
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await userEvent.keyboard('{Escape}');

    // Verify dialog is closed
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/** Static open state for Chromatic visual regression snapshots */
export const Open: Story = {
  args: {
    open: true,
    title: 'Example Modal',
    onClose: () => {},
    children: (
      <>
        <Modal.Body>
          This is the modal content. Press Escape or click outside to close.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </Modal.Footer>
      </>
    ),
  },
};
