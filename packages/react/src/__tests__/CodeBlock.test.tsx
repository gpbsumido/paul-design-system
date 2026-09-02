import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const user = userEvent.setup();
    render(<CodeBlock code="echo hi" language="bash" />);
    await user.click(screen.getByRole('button', { name: /copy/i }));
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
