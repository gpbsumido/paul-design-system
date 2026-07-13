import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('elevated variant applies .card--elevated', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstElementChild).toHaveClass('card--elevated');
  });

  it('interactive variant applies .card--interactive', () => {
    const { container } = render(<Card variant="interactive">Content</Card>);
    expect(container.firstElementChild).toHaveClass('card--interactive');
  });

  it('Card.Header, Card.Body, Card.Footer render correctly', () => {
    render(
      <Card>
        <Card.Header>Head</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Foot</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Head').closest('div')).toHaveClass('card__header');
    expect(screen.getByText('Body').closest('div')).toHaveClass('card__body');
    expect(screen.getByText('Foot').closest('div')).toHaveClass('card__footer');
  });

  it('has correct base class .card', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstElementChild).toHaveClass('card');
  });
});
