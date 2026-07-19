import type { ReactNode } from 'react';
import { Tooltip } from './Tooltip';

type InfoTipProps = {
  /** The explanation shown in the popover. Text or rich nodes. */
  content: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Accessible name for the trigger. Defaults to "More information". */
  label?: string;
  /** Max width of the popover in px. */
  maxWidth?: number;
  /** Delay before showing, in ms. */
  delay?: number;
};

/**
 * A small "i" glyph that reveals a popover on hover or focus. Built on Tooltip,
 * so it renders at a fixed position (never clipped) and accepts rich content —
 * the common "explain this label" case, with room for a few lines of detail.
 */
export function InfoTip({
  content,
  side = 'top',
  label = 'More information',
  maxWidth,
  delay,
}: InfoTipProps) {
  return (
    <Tooltip content={content} side={side} maxWidth={maxWidth} delay={delay}>
      <span className="info-tip" role="img" aria-label={label} tabIndex={0}>
        i
      </span>
    </Tooltip>
  );
}
