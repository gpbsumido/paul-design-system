import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Button } from '../Button';
import { Input } from '../Input';
import { Chip } from '../Chip';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Avatar } from '../Avatar';
import { Skeleton } from '../Skeleton';
import { VisuallyHidden } from '../VisuallyHidden';

expect.extend(matchers);

describe('Accessibility', () => {
  it('Button has no a11y violations', async () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Button disabled has no a11y violations', async () => {
    const { container } = render(<Button variant="primary" disabled>Disabled</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input with label has no a11y violations', async () => {
    const { container } = render(<Input label="Email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input with error has no a11y violations', async () => {
    const { container } = render(<Input label="Email" error="Required field" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Chip has no a11y violations', async () => {
    const { container } = render(<Chip label="Tag" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Card has no a11y violations', async () => {
    const { container } = render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Badge has no a11y violations', async () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Avatar with alt text has no a11y violations', async () => {
    const { container } = render(<Avatar fallback="PS" alt="Paul Sumido" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Skeleton has no a11y violations', async () => {
    const { container } = render(<Skeleton variant="text" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('VisuallyHidden has no a11y violations', async () => {
    const { container } = render(<VisuallyHidden>Screen reader text</VisuallyHidden>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
