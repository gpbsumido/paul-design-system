import { useRef, useState } from 'react';
import { cx } from './cx';

type CodeBlockProps = {
  code: string;
  /** Language label shown in the header (display only). */
  language?: string;
  /** Optional filename shown alongside the language. */
  filename?: string;
  /** Prefix each line with a line number. */
  showLineNumbers?: boolean;
  className?: string;
};

/**
 * A read-only code panel with a language label and a copy button that reports
 * success back to assistive tech. Line numbers are decorative and hidden from
 * the a11y tree so a screen reader reads the code, not the gutter.
 */
export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions/insecure context) — leave state as is.
    }
  }

  const lines = code.split('\n');

  return (
    <div className={cx('code-block', className)}>
      <div className="code-block__head">
        <span className="code-block__lang">
          {filename && <span className="code-block__file">{filename}</span>}
          {language}
        </span>
        <button
          type="button"
          className="code-block__copy"
          aria-label={copied ? 'Copied' : 'Copy code'}
          onClick={copy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-block__pre">
        <code>
          {showLineNumbers
            ? lines.map((line, i) => (
                <span className="code-block__line" key={i}>
                  <span className="code-block__ln" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="code-block__code">{line}</span>
                </span>
              ))
            : code}
        </code>
      </pre>
    </div>
  );
}
