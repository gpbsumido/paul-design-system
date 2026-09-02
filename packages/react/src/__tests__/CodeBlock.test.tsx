import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeBlock } from '../CodeBlock';

describe('CodeBlock', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the code and a language label', () => {
    render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    expect(screen.getByText('ts')).toBeInTheDocument();
  });

  it('copies the code to the clipboard and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // Use fireEvent here: userEvent.setup() installs its own clipboard stub,
    // which would shadow this one.
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    render(<CodeBlock code="echo hi" language="bash" />);
    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith('echo hi');
    expect(await screen.findByRole('button', { name: /copied/i })).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('renders a line number for each line when asked', () => {
    const { container } = render(
      <CodeBlock code={'a\nb\nc'} language="txt" showLineNumbers />,
    );
    expect(container.querySelectorAll('.code-block__ln')).toHaveLength(3);
  });
});
