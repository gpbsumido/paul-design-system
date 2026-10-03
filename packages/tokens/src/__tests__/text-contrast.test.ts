import { describe, it, expect } from 'vitest';
import { semanticColors } from '../colors.js';
import { contrast } from './palette-check.js';

/**
 * Every token a component paints body-size text in has to clear WCAG AA (4.5:1)
 * on the surfaces that text sits on, in both themes. muted-foreground shipped
 * at 2.41:1 on the light surface and 4.03:1 on the dark one, and StatCard,
 * Timeline and AgentDecisionCard set their secondary text in it, so a consumer
 * scanning a page with any of them failed axe's color-contrast rule.
 */
const TEXT_TOKENS = ['foreground', 'muted', 'muted-foreground'] as const;
const SURFACES = ['surface', 'background'] as const;
const AA = 4.5;

describe('text tokens hold AA contrast', () => {
  for (const theme of ['light', 'dark'] as const) {
    const palette = semanticColors[theme];
    for (const token of TEXT_TOKENS) {
      for (const surface of SURFACES) {
        it(`${theme} ${token} on ${surface}`, () => {
          const ratio = contrast(palette[token], palette[surface]);
          expect(ratio, `${palette[token]} on ${palette[surface]}`).toBeGreaterThanOrEqual(AA);
        });
      }
    }
  }
});
