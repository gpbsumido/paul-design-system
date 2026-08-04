import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordCloud } from '../WordCloud';

const terms = [
  { text: 'angular', weight: 28 },
  { text: 'typescript', weight: 40 },
  { text: 'react', weight: 22 },
  { text: 'svg', weight: 12 },
  { text: 'css', weight: 8 },
];

const words = (container: HTMLElement) => [...container.querySelectorAll('.paul-chart__word')];

describe('WordCloud', () => {
  it('exposes the figure as an image listing every term and weight in rank order', () => {
    render(<WordCloud terms={terms} label="Tag frequency" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe(
      'Tag frequency: typescript 40, angular 28, react 22, svg 12, css 8',
    );
  });

  it('draws one text element per placed term', () => {
    const { container } = render(<WordCloud terms={terms} label="Tag frequency" />);
    expect(words(container).map((w) => w.textContent)).toEqual([
      'typescript',
      'angular',
      'react',
      'svg',
      'css',
    ]);
  });

  it('gives the heaviest term the largest font size', () => {
    const { container } = render(<WordCloud terms={terms} label="Tag frequency" />);
    const sizes = words(container).map((w) => Number(w.getAttribute('font-size')));
    expect(sizes[0]).toBe(Math.max(...sizes));
    expect(sizes[0]).toBeGreaterThan(sizes[sizes.length - 1]);
  });

  it('caps the number rendered at the limit', () => {
    const { container } = render(<WordCloud terms={terms} label="Tag frequency" limit={2} />);
    expect(words(container).map((w) => w.textContent)).toEqual(['typescript', 'angular']);
    // The accessible list is capped the same way, so it never claims more than
    // the picture shows.
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe(
      'Tag frequency: typescript 40, angular 28',
    );
  });

  it('renders identical markup for identical input', () => {
    const first = render(<WordCloud terms={terms} label="Tag frequency" />).container.innerHTML;
    const second = render(<WordCloud terms={terms} label="Tag frequency" />).container.innerHTML;
    expect(second).toBe(first);
  });

  it('cycles categorical colour by rank, never by weight', () => {
    const { container } = render(<WordCloud terms={terms} label="Tag frequency" />);
    const fills = words(container).map((w) => w.getAttribute('fill'));
    // Assigned by index, 1-based, wrapping at 6 — nothing about the fill tracks
    // the weight, so double-encoding can't creep back in.
    expect(fills).toEqual([
      'var(--paul-chart-1)',
      'var(--paul-chart-2)',
      'var(--paul-chart-3)',
      'var(--paul-chart-4)',
      'var(--paul-chart-5)',
    ]);
  });

  it('gives two terms of different weight the same colour slot when their ranks agree', () => {
    const fillOf = (weight: number) =>
      render(<WordCloud terms={[{ text: 'alpha', weight }]} label="Tag frequency" />)
        .container.querySelector('.paul-chart__word')
        ?.getAttribute('fill');
    expect(fillOf(90)).toBe(fillOf(3));
  });

  it('renders an empty state without a chart', () => {
    const { container } = render(<WordCloud terms={[]} label="Tag frequency" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Tag frequency');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });

  it('treats all-zero weights as empty', () => {
    const { container } = render(
      <WordCloud
        terms={[
          { text: 'alpha', weight: 0 },
          { text: 'beta', weight: 0 },
        ]}
        label="Tag frequency"
      />,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Tag frequency');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });
});
