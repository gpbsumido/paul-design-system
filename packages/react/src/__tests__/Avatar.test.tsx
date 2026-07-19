import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders with .avatar class', () => {
    render(<Avatar alt="User" />);
    expect(document.querySelector('.avatar')).toBeInTheDocument();
  });

  it('size variants apply correct class', () => {
    const { rerender } = render(<Avatar size="sm" alt="User" />);
    expect(document.querySelector('.avatar')).toHaveClass('avatar--sm');

    rerender(<Avatar size="md" alt="User" />);
    expect(document.querySelector('.avatar')).toHaveClass('avatar--md');

    rerender(<Avatar size="lg" alt="User" />);
    expect(document.querySelector('.avatar')).toHaveClass('avatar--lg');

    rerender(<Avatar size="xl" alt="User" />);
    expect(document.querySelector('.avatar')).toHaveClass('avatar--xl');
  });

  it('defaults to the md size so it always has dimensions', () => {
    render(<Avatar alt="User" />);
    expect(document.querySelector('.avatar')).toHaveClass('avatar--md');
  });

  it('renders image when src provided', () => {
    render(<Avatar src="/photo.jpg" alt="Jane Doe" />);
    const img = screen.getByRole('img', { name: 'Jane Doe' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/photo.jpg');
  });

  it('renders fallback when no src', () => {
    render(<Avatar fallback="JD" alt="Jane Doe" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const fallback = document.querySelector('.avatar--fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent('JD');
  });
});
