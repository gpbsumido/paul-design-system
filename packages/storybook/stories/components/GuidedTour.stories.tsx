import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { GuidedTour, Button, type GuidedTourStep } from '@paul-portfolio/react';

const STEPS: GuidedTourStep[] = [
  {
    title: 'Welcome',
    body: "A quick walk-through of what this is and how to use it — a few clicks, no commitment.",
  },
  {
    target: 'gt-search',
    title: 'Search',
    body: 'Type here to filter instantly.',
  },
  {
    target: 'gt-filters',
    title: 'Filters',
    body: 'Narrow things down with these controls.',
  },
];

const meta = {
  title: 'Components/GuidedTour',
  component: GuidedTour,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
  parameters: {
    // Portals to document.body, so Chromatic needs full-page snapshots.
    chromatic: { delay: 300, diffThreshold: 0.3 },
  },
} satisfies Meta<typeof GuidedTour>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A little page to spotlight, so the targeted steps have something to point at. */
function Stage({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <input id="gt-search" placeholder="Search…" style={{ padding: 8 }} />
      <div id="gt-filters" style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary">All</Button>
        <Button variant="secondary">Recent</Button>
        <Button variant="secondary">Starred</Button>
      </div>
      {children}
    </div>
  );
}

function GuidedTourDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Stage>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Take the tour
      </Button>
      <GuidedTour open={open} steps={STEPS} onClose={() => setOpen(false)} />
    </Stage>
  );
}

export const Default: Story = {
  args: { open: false, steps: STEPS, onClose: () => {} },
  render: () => <GuidedTourDemo />,
  parameters: {
    // Skip the interactive story in Chromatic — the portal renders outside #storybook-root.
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /take the tour/i }));

    const dialog = await within(document.body).findByRole('dialog', { name: /tour/i });
    await expect(dialog).toBeVisible();

    await userEvent.click(within(dialog).getByRole('button', { name: /next/i }));
    await expect(within(document.body).getByText('Search')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(
      within(document.body).queryByRole('dialog', { name: /tour/i }),
    ).not.toBeInTheDocument();
  },
};

/** Static open state (first, centred step) for Chromatic visual regression. */
export const Open: Story = {
  args: { open: true, steps: STEPS, onClose: () => {} },
  render: (args) => (
    <Stage>
      <GuidedTour {...args} />
    </Stage>
  ),
};
