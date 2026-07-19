import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('is a labelled status region', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading');
  });

  it('accepts a custom label', () => {
    render(<Spinner label="Fetching results" />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Fetching results');
  });

  it('applies the size class', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('spinner', 'spinner--lg');
  });
});
