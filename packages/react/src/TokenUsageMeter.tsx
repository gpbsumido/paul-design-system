import { cx } from './cx';

type TokenUsageMeterProps = {
  /** Accessible name for the meter, e.g. "Context window". */
  label: string;
  promptTokens: number;
  completionTokens: number;
  /** The budget the usage is measured against (e.g. the context window). */
  maxTokens: number;
  /** Price per million tokens, in dollars. Shows an estimated cost when set. */
  costPerMTok?: number;
  /** Fraction (0–1) of the budget at which the "near limit" tone kicks in. */
  warnAt?: number;
  className?: string;
};

const fmt = (n: number) => n.toLocaleString('en-US');

/**
 * A budget bar for LLM token usage: prompt and completion tokens as two
 * segments of a track sized against `maxTokens`, with the used total, percent,
 * and an optional cost estimate. Exposes progressbar semantics and switches to
 * a warning/over tone as usage approaches or passes the budget.
 */
export function TokenUsageMeter({
  label,
  promptTokens,
  completionTokens,
  maxTokens,
  costPerMTok,
  warnAt = 0.9,
  className,
}: TokenUsageMeterProps) {
  const used = promptTokens + completionTokens;
  const safeMax = maxTokens > 0 ? maxTokens : 1;
  const fraction = used / safeMax;
  const percent = Math.round(fraction * 100);
  const clamped = Math.min(used, maxTokens);

  const over = used > maxTokens;
  const warn = !over && fraction >= warnAt;
  const promptPct = Math.min((promptTokens / safeMax) * 100, 100);
  const completionPct = Math.min((completionTokens / safeMax) * 100, 100 - promptPct);

  const cost = costPerMTok != null ? (used / 1_000_000) * costPerMTok : null;

  return (
    <div
      className={cx(
        'token-meter',
        warn && 'token-meter--warn',
        over && 'token-meter--over',
        className,
      )}
    >
      <div className="token-meter__head">
        <span className="token-meter__label">{label}</span>
        <span className="token-meter__stat">
          {fmt(used)} / {fmt(maxTokens)} ({percent}%)
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={maxTokens}
        aria-valuenow={clamped}
        aria-valuetext={`${fmt(used)} of ${fmt(maxTokens)} tokens (${percent}%)`}
        className="token-meter__track"
      >
        <div
          className="token-meter__seg token-meter__seg--prompt"
          style={{ width: `${promptPct}%` }}
        />
        <div
          className="token-meter__seg token-meter__seg--completion"
          style={{ width: `${completionPct}%` }}
        />
      </div>
      <div className="token-meter__footer">
        <span className="token-meter__legend">
          <span className="token-meter__key token-meter__key--prompt" aria-hidden="true" />
          {fmt(promptTokens)} prompt
          <span className="token-meter__key token-meter__key--completion" aria-hidden="true" />
          {fmt(completionTokens)} completion
        </span>
        {cost != null && <span className="token-meter__cost">${cost.toFixed(2)}</span>}
      </div>
    </div>
  );
}
