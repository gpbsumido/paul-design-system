import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgentDecisionCard } from '../AgentDecisionCard';

describe('AgentDecisionCard', () => {
  it('renders the title and the decision word', () => {
    render(
      <AgentDecisionCard decision="decline" title="Payment $4,200 to a new payee" />,
    );
    expect(screen.getByText('Payment $4,200 to a new payee')).toBeInTheDocument();
    expect(screen.getByText(/decline/i)).toBeInTheDocument();
  });

  it('is a region whose accessible name carries the decision', () => {
    render(<AgentDecisionCard decision="approve" title="Login from known device" />);
    const region = screen.getByRole('region', { name: /approve/i });
    expect(region).toBeInTheDocument();
  });

  it('renders the confidence as a percentage', () => {
    render(
      <AgentDecisionCard decision="review" title="Velocity spike" confidence={0.92} />,
    );
    expect(screen.getByText(/92%/)).toBeInTheDocument();
  });

  it('lists the rationale signals', () => {
    render(
      <AgentDecisionCard
        decision="decline"
        title="Chargeback risk"
        rationale={['New payee', 'Device seen with 3 accounts', 'Amount 6x the median']}
      />,
    );
    expect(screen.getByText('New payee')).toBeInTheDocument();
    expect(screen.getByText('Device seen with 3 accounts')).toBeInTheDocument();
    expect(screen.getByText('Amount 6x the median')).toBeInTheDocument();
  });

  it('renders footer actions', () => {
    render(
      <AgentDecisionCard
        decision="decline"
        title="Chargeback risk"
        actions={<button type="button">Override</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Override' })).toBeInTheDocument();
  });

  it('shows the agent name', () => {
    render(
      <AgentDecisionCard decision="approve" title="Low-risk transfer" agentName="AML Agent" />,
    );
    expect(screen.getByText('AML Agent')).toBeInTheDocument();
  });
});
