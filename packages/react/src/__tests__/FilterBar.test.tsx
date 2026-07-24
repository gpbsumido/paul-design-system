import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { FilterBar } from '../FilterBar';
import { Select } from '../Select';

describe('FilterBar', () => {
  it('renders a region landmark named by the label', () => {
    render(<FilterBar label="Team and player filters"><span>child</span></FilterBar>);
    expect(screen.getByRole('region', { name: 'Team and player filters' })).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <FilterBar label="Filters">
        <Select label="Team"><option value="a">A</option></Select>
      </FilterBar>,
    );
    expect(screen.getByRole('combobox', { name: 'Team' })).toBeInTheDocument();
  });

  it('applies the filter-bar class and a centered row', () => {
    const { container } = render(<FilterBar label="Filters"><span>child</span></FilterBar>);
    expect(container.querySelector('section')).toHaveClass('filter-bar');
    expect(container.querySelector('.filter-bar__row')).toBeInTheDocument();
  });

  it('merges a custom className onto the section', () => {
    const { container } = render(<FilterBar label="Filters" className="extra"><span>child</span></FilterBar>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('filter-bar');
    expect(section).toHaveClass('extra');
  });

  it('forwards ref to the section element', () => {
    const ref = createRef<HTMLElement>();
    render(<FilterBar label="Filters" ref={ref}><span>child</span></FilterBar>);
    expect(ref.current?.tagName).toBe('SECTION');
  });
});
