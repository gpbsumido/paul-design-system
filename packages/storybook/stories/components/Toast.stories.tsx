import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ToastProvider, useToast, Button } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    chromatic: { delay: 300, diffThreshold: 0.3 },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="primary" onClick={() => toast({ title: 'Saved', description: 'Your changes are safe.', variant: 'success' })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Request failed', description: 'Try again.', variant: 'error' })}>
        Error
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Success' }));
    await expect(await within(document.body).findByText('Saved')).toBeVisible();
  },
};
