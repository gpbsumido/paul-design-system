import { useState, useId, type ReactNode } from 'react';
import { cx } from './cx';

type TooltipProps = {
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
};

export function Tooltip({ content, side = 'top', children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <span
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      aria-describedby={id}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      <span
        id={id}
        role="tooltip"
        className={cx('tooltip', `tooltip--${side}`, visible && 'tooltip--visible')}
      >
        {content}
      </span>
    </span>
  );
}
