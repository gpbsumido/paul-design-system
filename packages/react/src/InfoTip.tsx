import { Tooltip } from './Tooltip';

type InfoTipProps = {
  /** The explanatory text shown in the tooltip. */
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Accessible name for the trigger. Defaults to "More information". */
  label?: string;
};

/**
 * A small "i" glyph that reveals a tooltip on hover or focus. A convenience
 * wrapper over Tooltip for the very common "explain this label" case.
 */
export function InfoTip({ content, side = 'top', label = 'More information' }: InfoTipProps) {
  return (
    <Tooltip content={content} side={side}>
      <span className="info-tip" role="img" aria-label={label} tabIndex={0}>
        i
      </span>
    </Tooltip>
  );
}
