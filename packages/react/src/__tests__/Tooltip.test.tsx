import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('hidden by default', () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).not.toHaveClass('tooltip--visible');
  });

  it('visible on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    await user.hover(screen.getByText('Hover me'));
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('tooltip--visible');
  });

  it('has role="tooltip"', () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('side prop applies correct position class', () => {
    const { rerender } = render(
      <Tooltip content="Tip" side="top">
        <button>Hover</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--top');

    rerender(
      <Tooltip content="Tip" side="bottom">
        <button>Hover</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--bottom');

    rerender(
      <Tooltip content="Tip" side="left">
        <button>Hover</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--left');

    rerender(
      <Tooltip content="Tip" side="right">
        <button>Hover</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip--right');
  });
});
