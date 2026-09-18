import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { RefineFrame } from '../RefineFrame';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('RefineFrame', () => {
  it('announces the stage and shows the content', () => {
    render(
      <RefineFrame status="generating">
        <img src="a.jpg" alt="preview" />
      </RefineFrame>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Generating');
    expect(screen.getByAltText('preview')).toBeInTheDocument();
  });

  it('offers a retry on error', () => {
    const onRetry = vi.fn();
    render(
      <RefineFrame status="error" onRetry={onRetry}>
        <img src="a.jpg" alt="preview" />
      </RefineFrame>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
