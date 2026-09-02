import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TokenUsageMeter } from '../TokenUsageMeter';

describe('TokenUsageMeter', () => {
  it('exposes usage as a progressbar with the right bounds', () => {
    render(
      <TokenUsageMeter
        label="Context"
        promptTokens={1000}
        completionTokens={1000}
        maxTokens={4000}
      />,
    );
    const bar = screen.getByRole('progressbar', { name: /context/i });
    expect(bar).toHaveAttribute('aria-valuenow', '2000');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '4000');
  });

  it('renders the used total and the percentage', () => {
    render(
      <TokenUsageMeter
        label="Context"
        promptTokens={1500}
        completionTokens={500}
        maxTokens={4000}
      />,
    );
    expect(screen.getByText(/2,000/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('estimates cost from a per-million-token price', () => {
    render(
      <TokenUsageMeter
        label="Context"
        promptTokens={1_000_000}
        completionTokens={0}
        maxTokens={2_000_000}
        costPerMTok={3}
      />,
    );
    expect(screen.getByText(/\$3\.00/)).toBeInTheDocument();
  });

  it('flags an over-budget tone when the max is exceeded', () => {
    const { container } = render(
      <TokenUsageMeter
        label="Context"
        promptTokens={4000}
        completionTokens={1000}
        maxTokens={4000}
      />,
    );
    expect(container.querySelector('.token-meter--over')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4000');
  });
});
