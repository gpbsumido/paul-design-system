import { type ReactNode } from 'react';
import { cx } from './cx';
import { TypingDots } from './TypingDots';

export type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessageProps = {
  role: ChatRole;
  /** Display name for the sender. */
  name?: string;
  /** Rendered timestamp string (already formatted by the caller). */
  timestamp?: string;
  /** Optional avatar node (e.g. an <Avatar />). */
  avatar?: ReactNode;
  /** Show a typing indicator instead of content. */
  pending?: boolean;
  className?: string;
  children?: ReactNode;
};

const ROLE_LABEL: Record<ChatRole, string> = {
  user: 'You',
  assistant: 'Assistant',
  system: 'System',
};

/**
 * A single chat bubble, aligned and coloured by role. Renders as an article so
 * each turn is a navigable landmark, with the role in its accessible name.
 * Pass `pending` while an assistant reply is streaming to show TypingDots.
 */
export function ChatMessage({
  role,
  name,
  timestamp,
  avatar,
  pending = false,
  className,
  children,
}: ChatMessageProps) {
  const roleLabel = ROLE_LABEL[role];
  return (
    <article
      className={cx('chat-message', `chat-message--${role}`, className)}
      aria-label={`${roleLabel} message`}
    >
      {avatar && <div className="chat-message__avatar">{avatar}</div>}
      <div className="chat-message__main">
        {(name || timestamp) && (
          <div className="chat-message__meta">
            {name && <span className="chat-message__name">{name}</span>}
            {timestamp && <span className="chat-message__time">{timestamp}</span>}
          </div>
        )}
        <div className="chat-message__bubble">
          {pending ? <TypingDots label={`${roleLabel} is typing`} /> : children}
        </div>
      </div>
    </article>
  );
}
