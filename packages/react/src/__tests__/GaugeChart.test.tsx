import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GaugeChart } from '../GaugeChart';

describe('GaugeChart', () => {
  it('exposes the figure as an image with the value summary', () => {
    render(<GaugeChart value={62} label="Disk used" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Disk used: 62 of 100 (62%)');
  });

  it('always draws the track, and draws no fill at zero', () => {
    const { container } = render(<GaugeChart value={0} label="Disk used" />);
    expect(container.querySelector('.paul-chart__gauge-track')).toBeInTheDocument();
    expect(container.querySelector('.paul-chart__gauge-fill')).toBeNull();
  });

  it('draws a fill once there is something to show', () => {
    const { container } = render(<GaugeChart value={62} label="Disk used" />);
    expect(container.querySelector('.paul-chart__gauge-fill')).toBeInTheDocument();
  });

  it('renders the value and unit as visible text', () => {
    const { container } = render(<GaugeChart value={62} label="Disk used" unit="%" />);
    expect(container.querySelector('.paul-chart__value')?.textContent).toBe('62%');
    expect(container.querySelector('.paul-chart__unit')?.textContent).toBe('%');
    // The hero number is real text, not a decoration hidden from assistive tech.
    expect(container.querySelector('.paul-chart__value')?.getAttribute('aria-hidden')).toBeNull();
  });

  it('captions the value with the top of the range', () => {
    render(<GaugeChart value={180} label="Storage" max={250} unit=" GB" />);
    expect(screen.getByText('of 250')).toBeInTheDocument();
  });

  it('takes the percentage from a custom min and max', () => {
    render(<GaugeChart value={25} label="Load" min={0} max={50} />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('(50%)');
  });

  it('clamps a value below the minimum and above the maximum', () => {
    const { unmount } = render(<GaugeChart value={-10} label="Load" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('(0%)');
    unmount();
    render(<GaugeChart value={140} label="Load" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('(100%)');
  });

  it('gives each tone its status colour AND a text label', () => {
    const cases = [
      ['good', 'Good', '--paul-color-success-600'],
      ['warning', 'Warning', '--paul-color-warning-600'],
      ['critical', 'Critical', '--paul-color-error-600'],
    ] as const;
    for (const [tone, text, token] of cases) {
      const { container, unmount } = render(<GaugeChart value={62} label="Load" tone={tone} />);
      expect(container.querySelector('.paul-chart__gauge-fill')?.getAttribute('fill')).toContain(
        token,
      );
      // Colour alone never carries status, so the tone is spelled out too.
      expect(screen.getByText(text)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders no tone label for the default tone', () => {
    const { container } = render(<GaugeChart value={62} label="Load" />);
    expect(container.querySelector('.paul-chart__tone')).toBeNull();
    expect(container.querySelector('.paul-chart__gauge-fill')?.getAttribute('fill')).toBe(
      'var(--paul-chart-1)',
    );
  });

  it('handles a zero-width range without NaN', () => {
    const { container } = render(<GaugeChart value={5} label="Load" min={5} max={5} />);
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toContain('(0%)');
    expect(name).not.toContain('NaN');
    expect(container.querySelector('.paul-chart__gauge-track')?.getAttribute('d')).not.toContain(
      'NaN',
    );
  });
});

describe('GaugeChart caption and range', () => {
  it('names only the maximum when the range starts at zero', () => {
    render(<GaugeChart label="Disk used" value={62} unit="%" />);
    expect(screen.getByText('of 100')).toBeInTheDocument();
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('62 of 100 (62%)');
  });

  it('names both ends when the range does not start at zero', () => {
    // "of 60" would invite the reader to compute 41.5/60 when the arc means
    // (41.5-20)/(60-20) = 54%.
    render(<GaugeChart label="Rack temperature" value={41.5} min={20} max={60} />);
    expect(screen.getByText('of 20 to 60')).toBeInTheDocument();
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toContain('41.5 of 20 to 60');
    expect(name).toContain('(53.75%)');
  });
});
