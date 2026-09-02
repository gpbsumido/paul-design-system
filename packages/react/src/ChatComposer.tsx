import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { cx } from './cx';

type ChatComposerProps = {
  /** Accessible name for the message field. */
  label: string;
  /** Visually hide the label; keep it for screen readers. */
  hideLabel?: boolean;
  /** Fires with the trimmed message when the user sends. */
  onSubmit: (message: string) => void;
  placeholder?: string;
  /** Disable the field and button, e.g. while a reply is in flight. */
  busy?: boolean;
  disabled?: boolean;
  /** Label for the send button. */
  submitLabel?: string;
  maxLength?: number;
  className?: string;
};

const MAX_ROWS_HEIGHT = 200;

/**
 * A prompt composer for chat/AI surfaces: an auto-growing textarea that sends
 * on Enter and inserts a newline on Shift+Enter. Empty messages don't send, and
 * the whole control locks while `busy`.
 */
export function ChatComposer({
  label,
  hideLabel = true,
  onSubmit,
  placeholder = 'Send a message…',
  busy = false,
  disabled = false,
  submitLabel = 'Send',
  maxLength,
  className,
}: ChatComposerProps) {
  const id = useId();
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const locked = busy || disabled;

  function grow() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_ROWS_HEIGHT)}px`;
  }

  function send() {
    const message = value.trim();
    if (!message || locked) return;
    onSubmit(message);
    setValue('');
    const el = textareaRef.current;
    if (el) el.style.height = 'auto';
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <form className={cx('chat-composer', className)} onSubmit={handleSubmit}>
      <label className={hideLabel ? 'sr-only' : 'chat-composer__label'} htmlFor={id}>
        {label}
      </label>
      <div className="chat-composer__row">
        <textarea
          ref={textareaRef}
          id={id}
          className="chat-composer__field"
          rows={1}
          value={value}
          placeholder={placeholder}
          disabled={locked}
          maxLength={maxLength}
          onChange={(e) => {
            setValue(e.target.value);
            grow();
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="chat-composer__send"
          disabled={locked || value.trim().length === 0}
        >
          {submitLabel}
        </button>
      </div>
      {maxLength != null && (
        <span className="chat-composer__count" aria-live="polite">
          {value.length} / {maxLength}
        </span>
      )}
    </form>
  );
}
