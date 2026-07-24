import { describe, it, expect } from 'vitest';
import { shadows } from '../shadows.js';

describe('shadow tokens', () => {
  it('keeps the soft elevation scale', () => {
    expect(shadows.md).toContain('rgb');
    expect(shadows['2xl']).toContain('50px');
  });

  it('adds a hard offset elevation scale (un-blurred, crisp edge)', () => {
    expect(shadows['offset-sm']).toBe('2px 2px 0 rgb(0 0 0 / 0.9)');
    expect(shadows['offset-md']).toContain('6px 6px 0');
    expect(shadows['offset-lg']).toContain('9px 9px 0');
  });
});
