import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PaulWordCloudComponent } from '../word-cloud';
import { renderComponent, host } from './render';

const terms = [
  { text: 'angular', weight: 28 },
  { text: 'typescript', weight: 40 },
  { text: 'react', weight: 22 },
  { text: 'svg', weight: 12 },
  { text: 'css', weight: 8 },
];

/** Mirrors packages/react/src/__tests__/WordCloud.test.tsx. */
describe('PaulWordCloud', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(renderComponent(PaulWordCloudComponent, { terms, label: 'Tag frequency', ...inputs }));

  const words = (el: HTMLElement) => [...el.querySelectorAll('.paul-chart__word')];

  /** A second mount inside one test needs a fresh TestBed. */
  const renderAgain = (inputs: Record<string, unknown> = {}) => {
    TestBed.resetTestingModule();
    return render_(inputs);
  };

  it('exposes the figure as an image listing every term and weight in rank order', () => {
    expect(render_().querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
      'Tag frequency: typescript 40, angular 28, react 22, svg 12, css 8',
    );
  });

  it('draws one text element per placed term', () => {
    expect(words(render_()).map((w) => w.textContent)).toEqual([
      'typescript',
      'angular',
      'react',
      'svg',
      'css',
    ]);
  });

  it('gives the heaviest term the largest font size', () => {
    const sizes = words(render_()).map((w) => Number(w.getAttribute('font-size')));
    expect(sizes[0]).toBe(Math.max(...sizes));
    expect(sizes[0]).toBeGreaterThan(sizes[sizes.length - 1]);
  });

  it('caps the number rendered at the limit', () => {
    const el = render_({ limit: 2 });
    expect(words(el).map((w) => w.textContent)).toEqual(['typescript', 'angular']);
    // The accessible list is capped the same way, so it never claims more than
    // the picture shows.
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
      'Tag frequency: typescript 40, angular 28',
    );
  });

  it('renders identical markup for identical input', () => {
    const first = renderAgain().innerHTML;
    expect(renderAgain().innerHTML).toBe(first);
  });

  it('cycles categorical colour by rank, never by weight', () => {
    // Assigned by index, 1-based, wrapping at 6 — nothing about the fill tracks
    // the weight, so double-encoding can't creep back in.
    expect(words(render_()).map((w) => w.getAttribute('fill'))).toEqual([
      'var(--paul-chart-1)',
      'var(--paul-chart-2)',
      'var(--paul-chart-3)',
      'var(--paul-chart-4)',
      'var(--paul-chart-5)',
    ]);
  });

  it('gives two terms of different weight the same colour slot when their ranks agree', () => {
    const fillOf = (weight: number) =>
      renderAgain({ terms: [{ text: 'alpha', weight }] })
        .querySelector('.paul-chart__word')
        ?.getAttribute('fill');
    expect(fillOf(90)).toBe(fillOf(3));
  });

  it('renders an empty state without a chart', () => {
    const el = render_({ terms: [] });
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Tag frequency');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });

  it('treats all-zero weights as empty', () => {
    const el = render_({
      terms: [
        { text: 'alpha', weight: 0 },
        { text: 'beta', weight: 0 },
      ],
    });
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Tag frequency');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });
});
