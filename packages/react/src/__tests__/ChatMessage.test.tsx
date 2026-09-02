import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '../ChatMessage';

describe('ChatMessage', () => {
  it('renders its content inside a labelled group', () => {
    render(
      <ChatMessage role="assistant" name="Assistant">
        Hello there
      </ChatMessage>,
    );
    const article = screen.getByRole('article', { name: /assistant/i });
    expect(article).toHaveTextContent('Hello there');
    expect(article).toHaveClass('chat-message--assistant');
  });

  it('marks up the sender and timestamp', () => {
    render(
      <ChatMessage role="user" name="Paul" timestamp="10:30">
        Hi
      </ChatMessage>,
    );
    expect(screen.getByText('Paul')).toBeInTheDocument();
    expect(screen.getByText('10:30')).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('chat-message--user');
  });

  it('shows a typing indicator when pending', () => {
    render(<ChatMessage role="assistant" pending />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
