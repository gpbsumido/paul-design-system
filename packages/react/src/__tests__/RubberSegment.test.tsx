import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { RubberSegment } from '../RubberSegment';

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('RubberSegment', () => {
  it('renders radios and reports the picked one', () => {
    stubReducedMotion(false);
    const onChange = vi.fn();
    render(
      <RubberSegment
        segments={['Day', 'Week', 'Month']}
        value="Week"
        onChange={onChange}
      />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(onChange).toHaveBeenCalledWith('Month');
  });

  it('drives the indicator position from the active index', () => {
    stubReducedMotion(false);
    const { container } = render(
      <RubberSegment
        segments={['Day', 'Week', 'Month']}
        value="Month"
        onChange={() => {}}
      />,
    );
    const indicator = container.querySelector(
      '.rubber-segment__indicator',
    ) as HTMLElement;
    expect(indicator.style.getPropertyValue('--paul-segment-index')).toBe('2');
    expect(indicator.style.getPropertyValue('--paul-segment-count')).toBe('3');
  });
});
