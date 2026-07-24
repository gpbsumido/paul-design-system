import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders with .badge class', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveClass('badge');
  });

  it('variant classes', () => {
    const { rerender } = render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText('OK')).toHaveClass('badge--success');

    rerender(<Badge variant="warning">Warn</Badge>);
    expect(screen.getByText('Warn')).toHaveClass('badge--warning');

    rerender(<Badge variant="error">Err</Badge>);
    expect(screen.getByText('Err')).toHaveClass('badge--error');

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info')).toHaveClass('badge--info');
  });

  it('dot variant', () => {
    render(<Badge dot />);
    expect(document.querySelector('.badge')).toHaveClass('badge--dot');
  });

  it('starburst variant', () => {
    render(<Badge starburst>Beta</Badge>);
    expect(screen.getByText('Beta')).toHaveClass('badge--starburst');
  });

  it('starburst composes with a color variant', () => {
    render(
      <Badge starburst variant="warning">
        New
      </Badge>,
    );
    const el = screen.getByText('New');
    expect(el).toHaveClass('badge--starburst');
    expect(el).toHaveClass('badge--warning');
  });

  it('renders children text', () => {
    render(<Badge>Hello Badge</Badge>);
    expect(screen.getByText('Hello Badge')).toBeInTheDocument();
  });
});
