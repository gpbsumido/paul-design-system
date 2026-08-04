import { Component } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { PaulFilterBarComponent } from '../filter-bar';
import { PaulSelectComponent } from '../select';
import { renderComponent, host } from './render';

@Component({
  selector: 'paul-filter-bar-host',
  standalone: true,
  imports: [PaulFilterBarComponent, PaulSelectComponent],
  template: `
    <paul-filter-bar label="Team and player filters">
      <paul-select label="Team"><option value="a">A</option></paul-select>
    </paul-filter-bar>
  `,
})
class FilterBarHost {}

/** Mirrors packages/react/src/__tests__/FilterBar.test.tsx. */
describe('PaulFilterBar', () => {
  it('renders a section landmark named by the label', () => {
    const el = host(renderComponent(FilterBarHost));
    const section = el.querySelector('section') as HTMLElement;
    expect(section.getAttribute('aria-label')).toBe('Team and player filters');
    expect(section.className).toContain('filter-bar');
  });

  it('wraps its content in a row', () => {
    const el = host(renderComponent(FilterBarHost));
    expect(el.querySelector('.filter-bar__row')).not.toBeNull();
  });

  it('projects its children', () => {
    const el = host(renderComponent(FilterBarHost));
    const row = el.querySelector('.filter-bar__row') as HTMLElement;
    expect(row.querySelector('select')).not.toBeNull();
  });

  it('renders an empty row when nothing is projected', () => {
    const el = host(renderComponent(PaulFilterBarComponent, { label: 'Filters' }));
    const row = el.querySelector('.filter-bar__row') as HTMLElement;
    expect(row).not.toBeNull();
    expect(row.textContent?.trim()).toBe('');
  });
});
