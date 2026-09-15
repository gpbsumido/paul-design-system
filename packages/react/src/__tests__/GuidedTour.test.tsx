import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderToStaticMarkup } from 'react-dom/server';
import { GuidedTour, cardStyle, type GuidedTourStep } from '../GuidedTour';

expect.extend(matchers);

const rect = (o: Partial<DOMRect>): DOMRect =>
  ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON() {}, ...o }) as DOMRect;

describe('cardStyle', () => {
  it('centres the card when there is no target', () => {
    expect(cardStyle(null, { width: 336, height: 200 }, { width: 375, height: 800 })).toMatchObject({
      top: '50%',
      left: '50%',
    });
  });

  it('pins the card under the target when it fits', () => {
    const style = cardStyle(
      rect({ top: 100, bottom: 140, left: 40, width: 120, height: 40 }),
      { width: 336, height: 180 },
      { width: 1280, height: 900 },
    );
    expect(style.top).toBe(152); // bottom (140) + 12
    expect(style.left).toBe(40);
  });

  it('keeps a tall card fully on screen on a small (mobile) viewport', () => {
    const viewport = { width: 375, height: 640 };
    const card = { width: 343, height: 380 }; // taller than the old 220px guess
    const style = cardStyle(
      rect({ top: 500, bottom: 540, left: 30, width: 120, height: 40 }),
      card,
      viewport,
    );
    const top = style.top as number;
    const left = style.left as number;
    expect(top).toBeGreaterThanOrEqual(12);
    expect(top + card.height).toBeLessThanOrEqual(viewport.height - 12); // bottom stays on screen
    expect(left).toBeGreaterThanOrEqual(12);
    expect(left + card.width).toBeLessThanOrEqual(viewport.width - 12); // right stays on screen
  });
});

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

  it('renders nothing on the server, even when open (no document)', () => {
    const original = globalThis.document;
    // Simulate SSR: the overlay portals to document.body, which isn't there.
    // @ts-expect-error deliberately removing document to emulate the server
    delete globalThis.document;
    try {
      const markup = renderToStaticMarkup(
        <GuidedTour open steps={STEPS} onClose={() => {}} />,
      );
      expect(markup).toBe('');
    } finally {
      globalThis.document = original;
    }
  });

  it('has no a11y violations while open', async () => {
    render(<GuidedTour open steps={STEPS} onClose={() => {}} />);
    // Portals to the body, so scan there rather than the render container.
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
