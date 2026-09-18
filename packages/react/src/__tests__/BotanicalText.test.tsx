import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BotanicalText } from '../BotanicalText';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('BotanicalText', () => {
  it('renders as a labelled image with a decorative canvas', () => {
    render(<BotanicalText text="Bloom" />);
    const img = screen.getByRole('img', { name: 'Bloom' });
    expect(img).toBeInTheDocument();
    expect(img.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true');
  });
});
