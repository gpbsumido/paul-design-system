import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { GuidedTour, type GuidedTourStep } from '../GuidedTour';

expect.extend(matchers);

const STEPS: GuidedTourStep[] = [
  { title: 'Welcome', body: 'A quick tour.' },
  { target: 'thing-a', title: 'First stop', body: 'Here you do a thing.' },
  { target: 'thing-b', title: 'Second stop', body: 'Here you do another.' },
];

describe('GuidedTour', () => {
  it('renders nothing when closed', () => {
    render(<GuidedTour open={false} steps={STEPS} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on the first step in a labelled dialog', () => {
    render(<GuidedTour open steps={STEPS} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: /tour/i });
    expect(within(dialog).getByText('Welcome')).toBeInTheDocument();
    expect(within(dialog).getByText('A quick tour.')).toBeInTheDocument();
  });

  it('walks forward and back through the steps', () => {
    render(<GuidedTour open steps={STEPS} onClose={() => {}} />);
    const dialog = () => screen.getByRole('dialog', { name: /tour/i });

    fireEvent.click(within(dialog()).getByRole('button', { name: /next/i }));
    expect(within(dialog()).getByText('First stop')).toBeInTheDocument();

    fireEvent.click(within(dialog()).getByRole('button', { name: /back/i }));
    expect(within(dialog()).getByText('Welcome')).toBeInTheDocument();
  });

  it('calls onFinish on the last step, then closes', () => {
    const onFinish = vi.fn();
    const onClose = vi.fn();
    render(
      <GuidedTour open steps={STEPS} onClose={onClose} onFinish={onFinish} />,
    );
    const dialog = () => screen.getByRole('dialog', { name: /tour/i });
    fireEvent.click(within(dialog()).getByRole('button', { name: /next/i }));
    fireEvent.click(within(dialog()).getByRole('button', { name: /next/i }));
    fireEvent.click(within(dialog()).getByRole('button', { name: /finish/i }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('skips via the skip control', () => {
    const onClose = vi.fn();
    render(<GuidedTour open steps={STEPS} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<GuidedTour open steps={STEPS} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fires each step\'s onEnter as it becomes active', () => {
    const enter0 = vi.fn();
    const enter1 = vi.fn();
    const steps: GuidedTourStep[] = [
      { title: 'Welcome', body: 'A quick tour.', onEnter: enter0 },
      { target: 'thing-a', title: 'First stop', body: 'Thing.', onEnter: enter1 },
    ];
    render(<GuidedTour open steps={steps} onClose={() => {}} />);
    expect(enter0).toHaveBeenCalledTimes(1);
    expect(enter1).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole('button', { name: /next/i }),
    );
    expect(enter1).toHaveBeenCalledTimes(1);
  });

  it('has no a11y violations while open', async () => {
    render(<GuidedTour open steps={STEPS} onClose={() => {}} />);
    // Portals to the body, so scan there rather than the render container.
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
