import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';

export type Command = {
  id: string;
  label: string;
  /** Runs when the command is chosen. */
  onSelect: () => void;
  /** Extra terms to match against, beyond the label. */
  keywords?: string[];
  /** Optional group heading to bucket the command under. */
  group?: string;
  /** Decorative leading glyph/icon. */
  icon?: ReactNode;
  /** Trailing hint, e.g. a shortcut. */
  hint?: string;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  placeholder?: string;
  emptyMessage?: string;
  /** Accessible name for the dialog. */
  label?: string;
  className?: string;
};

function matches(command: Command, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [command.label, ...(command.keywords ?? [])].join(' ').toLowerCase();
  return haystack.includes(q);
}

/**
 * A ⌘K-style command menu. Type to filter, arrow keys to move, Enter to run,
 * Escape to close. Follows the combobox/listbox pattern: the input owns
 * aria-activedescendant so the active option is announced without moving focus.
 */
export function CommandPalette({
  open,
  onClose,
  commands,
  placeholder = 'Type a command…',
  emptyMessage = 'No commands found',
  label = 'Command palette',
  className,
}: CommandPaletteProps) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const filtered = useMemo(
    () => commands.filter((c) => matches(c, query)),
    [commands, query],
  );

  // Reset and focus each time the palette opens.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    inputRef.current?.focus();
  }, [open]);

  // Keep the active index in range as the filtered set shrinks.
  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  if (!open) return null;

  const optionId = (index: number) => `${baseId}-opt-${index}`;

  function choose(index: number) {
    const command = filtered[index];
    if (!command) return;
    command.onSelect();
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }

  // Preserve command order while grouping under optional headings.
  const groups: { name?: string; items: { command: Command; index: number }[] }[] = [];
  filtered.forEach((command, index) => {
    const last = groups[groups.length - 1];
    if (last && last.name === command.group) {
      last.items.push({ command, index });
    } else {
      groups.push({ name: command.group, items: [{ command, index }] });
    }
  });

  return createPortal(
    <div className="command-palette__backdrop" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cx('command-palette', className)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={filtered.length > 0}
          aria-controls={filtered.length ? listId : undefined}
          aria-activedescendant={filtered.length ? optionId(active) : undefined}
          aria-autocomplete="list"
          aria-label={label}
          className="command-palette__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {filtered.length === 0 ? (
          <p className="command-palette__empty">{emptyMessage}</p>
        ) : (
          <ul id={listId} role="listbox" aria-label={label} className="command-palette__list">
            {groups.map((group, gi) => (
              <li key={group.name ?? gi} role="presentation">
                {group.name && (
                  <p className="command-palette__group" role="presentation">
                    {group.name}
                  </p>
                )}
                <ul role="presentation" className="command-palette__group-items">
                  {group.items.map(({ command, index }) => (
                    <li
                      key={command.id}
                      id={optionId(index)}
                      role="option"
                      aria-selected={index === active}
                      className={cx(
                        'command-palette__option',
                        index === active && 'command-palette__option--active',
                      )}
                      onMouseEnter={() => setActive(index)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(index)}
                    >
                      {command.icon && (
                        <span className="command-palette__icon" aria-hidden="true">
                          {command.icon}
                        </span>
                      )}
                      <span className="command-palette__label">{command.label}</span>
                      {command.hint && (
                        <span className="command-palette__hint">{command.hint}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}
