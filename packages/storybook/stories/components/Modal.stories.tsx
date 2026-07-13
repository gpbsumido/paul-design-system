import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../../react/src/Modal';
import { Button } from '../../react/src/Button';

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
};
