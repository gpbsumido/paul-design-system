import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';

const ITEMS = [
  { id: '1', title: 'Session started', time: '10:02', status: 'default' as const },
  { id: '2', title: 'Device flagged', time: '10:03', status: 'warning' as const },
  { id: '3', title: 'Payment declined', time: '10:05', status: 'error' as const },
];

describe('Timeline', () => {
  it('renders an ordered list of the items', () => {
    render(<Timeline items={ITEMS} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders each item title and time', () => {
    render(<Timeline items={ITEMS} />);
    expect(screen.getByText('Session started')).toBeInTheDocument();
    expect(screen.getByText('Device flagged')).toBeInTheDocument();
    expect(screen.getByText('10:05')).toBeInTheDocument();
  });

  it('applies a status marker class per item', () => {
    const { container } = render(<Timeline items={ITEMS} />);
    expect(container.querySelector('.timeline__marker--warning')).toBeInTheDocument();
    expect(container.querySelector('.timeline__marker--error')).toBeInTheDocument();
  });

  it('names the status in text so it is not carried by colour alone', () => {
    render(<Timeline items={ITEMS} />);
    // A non-default status contributes a screen-reader word.
    expect(screen.getByText(/warning/i)).toBeInTheDocument();
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('takes an accessible name for the list', () => {
    render(<Timeline items={ITEMS} label="Case activity" />);
    expect(screen.getByRole('list', { name: 'Case activity' })).toBeInTheDocument();
  });

  it('renders a description when present', () => {
    render(
      <Timeline
        items={[{ id: '1', title: 'Note', description: 'Analyst added a comment' }]}
      />,
    );
    expect(screen.getByText('Analyst added a comment')).toBeInTheDocument();
  });
});
