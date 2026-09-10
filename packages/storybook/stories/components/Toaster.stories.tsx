import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Toaster, toast, Button } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    // Portals to document.body and is driven imperatively, so no static snapshot.
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mount `<Toaster />` once near the app root, then call `toast.error(...)` from
 * anywhere — a handler, or a plain module like a query-client error hook.
 */
export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        variant="secondary"
        onClick={() => toast.success('Saved', 'Your changes are in.')}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error('Something failed', 'Please try again.')}
      >
        Error
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /error/i }));
    // The toast portals to the body, not the canvas.
    await expect(
      await within(document.body).findByText('Something failed'),
    ).toBeVisible();
  },
};
