import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders with .skeleton class', () => {
    render(<Skeleton />);
    expect(document.querySelector('.skeleton')).toBeInTheDocument();
  });

  it('text variant', () => {
    render(<Skeleton variant="text" />);
    expect(document.querySelector('.skeleton')).toHaveClass('skeleton--text');
  });

  it('circle variant', () => {
    render(<Skeleton variant="circle" />);
    expect(document.querySelector('.skeleton')).toHaveClass('skeleton--circle');
  });

  it('rect variant', () => {
    render(<Skeleton variant="rect" width="100px" height="50px" />);
    const el = document.querySelector('.skeleton');
    expect(el).toHaveClass('skeleton--rect');
    expect(el).toHaveStyle({ '--skeleton-w': '100px', '--skeleton-h': '50px' });
  });
});
