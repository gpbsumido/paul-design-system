import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { ClickSpark } from '../ClickSpark';

/** Stub matchMedia so the reduced-motion hook sees the given preference. */
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

describe('ClickSpark', () => {
  it('renders its children and leaves their click working', () => {
    stubReducedMotion(false);
    const onClick = vi.fn();
    render(
      <ClickSpark>
        <button type="button" onClick={onClick}>
          pick
        </button>
      </ClickSpark>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('bursts the requested number of rays from the press point', () => {
    stubReducedMotion(false);
    const { container } = render(
      <ClickSpark count={6}>
        <button type="button">pick</button>
      </ClickSpark>,
    );
    expect(container.querySelectorAll('.click-spark__burst')).toHaveLength(0);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 5, clientY: 5 });
    const burst = container.querySelector('.click-spark__burst');
    expect(burst).not.toBeNull();
    expect(burst?.querySelectorAll('.click-spark__ray')).toHaveLength(6);
  });
});
