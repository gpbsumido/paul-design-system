import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskScore } from '../RiskScore';

describe('RiskScore', () => {
  it('renders the value and exposes a meter to assistive tech', () => {
    render(<RiskScore value={87} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '87');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('87')).toBeInTheDocument();
  });

  it('has the .risk-score base class', () => {
    const { container } = render(<RiskScore value={40} />);
    expect(container.querySelector('.risk-score')).toBeInTheDocument();
  });

  it('derives the level from the value when none is given', () => {
    const { rerender, container } = render(<RiskScore value={10} />);
    expect(container.querySelector('.risk-score__level--low')).toBeInTheDocument();

    rerender(<RiskScore value={40} />);
    expect(container.querySelector('.risk-score__level--medium')).toBeInTheDocument();

    rerender(<RiskScore value={70} />);
    expect(container.querySelector('.risk-score__level--high')).toBeInTheDocument();

    rerender(<RiskScore value={96} />);
    expect(container.querySelector('.risk-score__level--critical')).toBeInTheDocument();
  });

  it('honours an explicit level over the derived one', () => {
    const { container } = render(<RiskScore value={10} level="critical" />);
    expect(container.querySelector('.risk-score__level--critical')).toBeInTheDocument();
    expect(screen.getByText(/critical/i)).toBeInTheDocument();
  });

  it('shows the level word so meaning is not carried by colour alone', () => {
    render(<RiskScore value={70} />);
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it('draws a track fill in the detailed variant and omits it when compact', () => {
    const { container, rerender } = render(<RiskScore value={50} variant="detailed" />);
    expect(container.querySelector('.risk-score__track')).toBeInTheDocument();

    rerender(<RiskScore value={50} variant="compact" />);
    expect(container.querySelector('.risk-score__track')).not.toBeInTheDocument();
  });

  it('clamps an out-of-range value', () => {
    const { rerender } = render(<RiskScore value={140} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100');

    rerender(<RiskScore value={-20} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
  });

  it('supports a custom max', () => {
    render(<RiskScore value={5} max={10} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuemax', '10');
    expect(meter).toHaveAttribute('aria-valuenow', '5');
  });
});
