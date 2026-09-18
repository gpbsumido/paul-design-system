import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { FolderFloat } from '../FolderFloat';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('FolderFloat', () => {
  it('renders a labelled group with the items as links', () => {
    render(
      <FolderFloat
        label="Projects"
        items={[
          { label: 'Alpha', href: '#a' },
          { label: 'Beta', href: '#b' },
        ]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('href', '#a');
  });

  it('renders plain chips when items have no href', () => {
    const { container } = render(
      <FolderFloat label="Files" items={[{ label: 'Notes' }]} />,
    );
    const chip = container.querySelector('.folder-float__chip');
    expect(chip?.tagName).toBe('SPAN');
    expect(chip).toHaveTextContent('Notes');
  });
});
