import { type ReactNode } from 'react';
import { cx } from './cx';
import { Card } from './Card';
import { Badge } from './Badge';

export type AgentDecision = 'approve' | 'decline' | 'review';

type AgentDecisionCardProps = {
  /** The verdict the agent reached. */
  decision: AgentDecision;
  /** What the decision is about, e.g. "Payment $4,200 to a new payee". */
  title: string;
  /** Model confidence, 0–1. Rendered as a rounded percentage when given. */
  confidence?: number;
  /** The signals behind the decision, shown as a list. */
  rationale?: string[];
  /** Footer controls — typically confirm / override buttons. */
  actions?: ReactNode;
  /** Who made the call. Defaults to "Risk Agent". */
  agentName?: string;
  className?: string;
  children?: ReactNode;
};

const DECISION_LABEL: Record<AgentDecision, string> = {
  approve: 'Approve',
  decline: 'Decline',
  review: 'Review',
};

const DECISION_VARIANT: Record<AgentDecision, 'success' | 'warning' | 'error'> = {
  approve: 'success',
  decline: 'error',
  review: 'warning',
};

/**
 * The shell for an AI-made risk decision: the verdict, how confident the model
 * is, the signals it fired on, and the actions a reviewer can take. Built on
 * `Card`, and exposed as a `region` landmark whose accessible name carries the
 * decision, so a screen-reader user can jump between verdicts. The decision is a
 * `Badge` word (not a bare colour), and the rationale is a real list.
 */
export function AgentDecisionCard({
  decision,
  title,
  confidence,
  rationale,
  actions,
  agentName = 'Risk Agent',
  className,
  children,
}: AgentDecisionCardProps) {
  const decisionLabel = DECISION_LABEL[decision];
  const pct = confidence != null ? Math.round(confidence * 100) : undefined;

  return (
    <Card
      role="region"
      aria-label={`${agentName} decision: ${decisionLabel}`}
      className={cx('agent-decision', `agent-decision--${decision}`, className)}
    >
      <Card.Header className="agent-decision__header">
        <span className="agent-decision__agent">{agentName}</span>
        <Badge variant={DECISION_VARIANT[decision]}>{decisionLabel}</Badge>
        {pct != null && (
          <span className="agent-decision__confidence">{pct}% confidence</span>
        )}
      </Card.Header>
      <Card.Body className="agent-decision__body">
        <p className="agent-decision__title">{title}</p>
        {children}
        {rationale && rationale.length > 0 && (
          <ul className="agent-decision__rationale">
            {rationale.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        )}
      </Card.Body>
      {actions && <Card.Footer className="agent-decision__actions">{actions}</Card.Footer>}
    </Card>
  );
}
