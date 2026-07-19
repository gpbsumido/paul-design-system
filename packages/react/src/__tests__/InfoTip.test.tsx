import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoTip } from '../InfoTip';

describe('InfoTip', () => {
  it('exposes an accessible trigger and the tooltip content', () => {
    render(<InfoTip content="Shown on hover" />);
    expect(screen.getByRole('img', { name: 'More information' })).toHaveClass('info-tip');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Shown on hover');
  });

  it('accepts a custom label and side', () => {
    render(<InfoTip content="Details" label="What is this" side="bottom" />);
    expect(screen.getByRole('img', { name: 'What is this' })).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--bottom');
  });

  it('keeps the trigger keyboard focusable', () => {
    render(<InfoTip content="Details" />);
    expect(screen.getByRole('img', { name: 'More information' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });
});
