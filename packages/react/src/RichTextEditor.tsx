import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { cx } from './cx';

/** The formatting controls the toolbar can offer, in render order. */
export type RichTextControl =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'h2'
  | 'bulletList'
  | 'orderedList'
  | 'code'
  | 'link';

type ControlSpec = {
  label: string;
  command: string;
  value?: string;
  /** Ctrl/Cmd shortcut key, if any. */
  shortcut?: string;
  /** Prompt for a URL before running (used by link). */
  prompt?: boolean;
  glyph: string;
};

const CONTROLS: Record<RichTextControl, ControlSpec> = {
  bold: { label: 'Bold', command: 'bold', shortcut: 'b', glyph: 'B' },
  italic: { label: 'Italic', command: 'italic', shortcut: 'i', glyph: 'I' },
  underline: { label: 'Underline', command: 'underline', shortcut: 'u', glyph: 'U' },
  h2: { label: 'Heading', command: 'formatBlock', value: 'H2', glyph: 'H2' },
  bulletList: { label: 'Bullet list', command: 'insertUnorderedList', glyph: '•' },
  orderedList: { label: 'Numbered list', command: 'insertOrderedList', glyph: '1.' },
  code: { label: 'Code block', command: 'formatBlock', value: 'PRE', glyph: '</>' },
  link: { label: 'Link', command: 'createLink', prompt: true, glyph: '🔗' },
};

const DEFAULT_TOOLBAR: RichTextControl[] = [
  'bold',
  'italic',
  'underline',
  'h2',
  'bulletList',
  'code',
  'link',
];

const SHORTCUTS: Record<string, RichTextControl> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

type RichTextEditorProps = {
  /** Accessible name for the editable region. */
  label: string;
  /** Visually hide the label while keeping it for screen readers. */
  hideLabel?: boolean;
  /** Initial HTML for an uncontrolled editor. */
  defaultValue?: string;
  /** Controlled HTML value. Pair with onChange. */
  value?: string;
  /** Fires with the editor's HTML whenever the content changes. */
  onChange?: (html: string) => void;
  placeholder?: string;
  /** Which controls to show, and in what order. */
  toolbar?: RichTextControl[];
  disabled?: boolean;
  className?: string;
};

/**
 * A small rich-text editor built on a contentEditable region and the browser's
 * execCommand formatting. The toolbar is configurable, every button carries an
 * accessible label, and Ctrl/Cmd+B/I/U work from the keyboard. Emits HTML on
 * every edit so it drops straight into an AI compose surface.
 */
export function RichTextEditor({
  label,
  hideLabel = false,
  defaultValue,
  value,
  onChange,
  placeholder,
  toolbar = DEFAULT_TOOLBAR,
  disabled = false,
  className,
}: RichTextEditorProps) {
  const id = useId();
  const editorRef = useRef<HTMLDivElement>(null);
  const controlled = value !== undefined;

  // Seed the initial HTML once. React never re-renders contentEditable content,
  // so mutating innerHTML by hand is the supported path here.
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = controlled ? value : defaultValue;
    if (next != null && el.innerHTML !== next) {
      el.innerHTML = next;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled ? value : undefined]);

  function exec(spec: ControlSpec) {
    const el = editorRef.current;
    if (!el || disabled) return;
    el.focus();
    let commandValue = spec.value;
    if (spec.prompt) {
      const url = window.prompt('Link URL');
      if (!url) return;
      commandValue = url;
    }
    document.execCommand(spec.command, false, commandValue);
    onChange?.(el.innerHTML);
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (!(e.ctrlKey || e.metaKey)) return;
    const control = SHORTCUTS[e.key.toLowerCase()];
    if (!control || !toolbar.includes(control)) return;
    e.preventDefault();
    exec(CONTROLS[control]);
  }

  return (
    <div className={cx('rich-text', disabled && 'rich-text--disabled', className)}>
      <label className={hideLabel ? 'sr-only' : 'rich-text__label'} htmlFor={id}>
        {label}
      </label>
      <div className="rich-text__toolbar" role="toolbar" aria-label={`${label} formatting`}>
        {toolbar.map((key) => {
          const spec = CONTROLS[key];
          return (
            <button
              key={key}
              type="button"
              className="rich-text__tool"
              aria-label={spec.label}
              title={spec.label}
              disabled={disabled}
              // Keep the selection while the button takes the click.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(spec)}
            >
              <span aria-hidden="true">{spec.glyph}</span>
            </button>
          );
        })}
      </div>
      <div
        ref={editorRef}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        aria-disabled={disabled || undefined}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className="rich-text__editable"
        onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
