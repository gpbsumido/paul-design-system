import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renders the label and value', () => {
    render(<StatCard label="Approval rate" value="98.2%" />);
    expect(screen.getByText('Approval rate')).toBeInTheDocument();
    expect(screen.getByText('98.2%')).toBeInTheDocument();
  });

  it('has the .stat-card base class', () => {
    const { container } = render(<StatCard label="Alerts" value={128} />);
    expect(container.querySelector('.stat-card')).toBeInTheDocument();
  });

  it('renders a delta with a direction class and value', () => {
    const { container } = render(
      <StatCard
        label="Approval rate"
        value="98.2%"
        delta={{ value: '+1.4pt', direction: 'up' }}
      />,
    );
    expect(container.querySelector('.stat-card__delta')).toBeInTheDocument();
    expect(screen.getByText('+1.4pt')).toBeInTheDocument();
  });

  it('names the delta direction in text so it is not carried by colour alone', () => {
    render(
      <StatCard label="Chargebacks" value="0.9%" delta={{ value: '-0.2pt', direction: 'down' }} />,
    );
    // A screen-reader word for the direction.
    expect(screen.getByText(/decrease/i)).toBeInTheDocument();
  });

  it('renders a Sparkline only when a trend is given', () => {
    const { rerender } = render(<StatCard label="Volume" value="12.4k" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    rerender(
      <StatCard label="Volume" value="12.4k" trend={[3, 6, 4, 9, 7, 11]} trendLabel="Volume trend" />,
    );
    expect(screen.getByRole('img', { name: 'Volume trend' })).toBeInTheDocument();
  });

  it('renders a footnote when present', () => {
    render(<StatCard label="Volume" value="12.4k" footnote="Last 24h" />);
    expect(screen.getByText('Last 24h')).toBeInTheDocument();
  });
});
