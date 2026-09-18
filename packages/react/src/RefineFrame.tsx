import { type CSSProperties, type ReactNode } from 'react';
import { cx } from './cx';

export type RefineStatus =
  | 'queued'
  | 'generating'
  | 'refining'
  | 'complete'
  | 'error';

const STAGES: Record<
  RefineStatus,
  { blur: number; sat: number; scale: number; opacity: number }
> = {
  queued: { blur: 4, sat: 0.6, scale: 1.04, opacity: 0.55 },
  generating: { blur: 1.5, sat: 0.8, scale: 1.02, opacity: 0.85 },
  refining: { blur: 0.5, sat: 0.95, scale: 1.005, opacity: 1 },
  complete: { blur: 0, sat: 1, scale: 1, opacity: 1 },
  error: { blur: 2, sat: 0.5, scale: 1, opacity: 0.28 },
};

const DEFAULT_LABELS: Record<RefineStatus, string> = {
  queued: 'Queued',
  generating: 'Generating',
  refining: 'Refining',
  complete: 'Ready',
  error: 'Failed',
};

const ACTIVE = new Set<RefineStatus>(['queued', 'generating', 'refining']);

function StatusIcon({ status }: { status: RefineStatus }) {
  if (status === 'complete') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M5 13l4 4L19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === 'error') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M12 3l9 16H3z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M12 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="refine-frame__spinner">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

type RefineFrameProps = {
  status?: RefineStatus;
  children: ReactNode;
  aspectRatio?: string;
  radius?: number;
  stageDuration?: number;
  sweep?: boolean;
  showStatus?: boolean;
  labels?: Partial<Record<RefineStatus, string>>;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

/**
 * A frame that shows content resolving from blurred and desaturated to sharp as
 * its status advances — the "generating → refining → ready" preview an image
 * model gives you. Reinterpreted on the tokens from the ReactBits component:
 * the original pixelates on a canvas; this drives CSS `filter`/scale/opacity per
 * stage (no canvas, no icon dependency), with a glint sweeping while it works
 * and a `role="status"` pill announcing the stage. Under reduced motion the
 * sweep is dropped and the spinner pulses instead of spinning.
 */
export function RefineFrame({
  status = 'generating',
  children,
  aspectRatio = '4 / 3',
  radius = 16,
  stageDuration = 400,
  sweep = true,
  showStatus = true,
  labels,
  retryLabel = 'Retry',
  onRetry,
  className,
}: RefineFrameProps) {
  const stage = STAGES[status] ?? STAGES.generating;
  const active = ACTIVE.has(status);
  const label = { ...DEFAULT_LABELS, ...labels }[status];
  const style = {
    aspectRatio,
    borderRadius: `${radius}px`,
    '--rf-blur': `${stage.blur}px`,
    '--rf-sat': stage.sat,
    '--rf-scale': stage.scale,
    '--rf-opacity': stage.opacity,
    '--rf-dur': `${stageDuration}ms`,
  } as CSSProperties;

  return (
    <div className={cx('refine-frame', className)} data-status={status} style={style}>
      <div className="refine-frame__content">{children}</div>
      {sweep && active ? (
        <span aria-hidden="true" className="refine-frame__sweep" />
      ) : null}
      {showStatus ? (
        <div className="refine-frame__status" role="status">
          <span className="refine-frame__icon">
            <StatusIcon status={status} />
          </span>
          <span>{label}</span>
          {status === 'error' && onRetry ? (
            <button type="button" className="refine-frame__retry" onClick={onRetry}>
              {retryLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
