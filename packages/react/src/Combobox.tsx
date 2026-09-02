import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { cx } from './cx';

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  label: string;
  hideLabel?: boolean;
  options: ComboboxOption[];
  /** Controlled selected value. */
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * An accessible autocomplete — a text input that filters a list of options and
 * commits one on Enter or click. Great for model/tool pickers. Implements the
 * ARIA combobox pattern with aria-expanded and aria-activedescendant so the
 * active option is announced while focus stays in the input.
 */
export function Combobox({
  label,
  hideLabel = false,
  options,
  value,
  onChange,
  placeholder,
  className,
}: ComboboxProps) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';
  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Reflect an externally-changed value back into the field.
  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  // While closed the field shows the selected label, so don't filter by it.
  const filtered = useMemo(() => {
    if (!open) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, open]);

  const optionId = (index: number) => `${baseId}-opt-${index}`;

  function commit(option: ComboboxOption | undefined) {
    if (!option) return;
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActive((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (open && active >= 0) {
          e.preventDefault();
          commit(filtered[active]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setActive(-1);
        break;
    }
  }

  // Close when focus leaves the whole control.
  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div className={cx('combobox', className)} onBlur={handleBlur}>
      <label className={hideLabel ? 'sr-only' : 'combobox__label'} htmlFor={baseId}>
        {label}
      </label>
      <input
        id={baseId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={open && filtered.length > 0 ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        className="combobox__input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul id={listId} role="listbox" aria-label={label} className="combobox__list">
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={option.value === value}
              className={cx(
                'combobox__option',
                index === active && 'combobox__option--active',
              )}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
