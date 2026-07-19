# @paul-portfolio/react

React components for the Paul Design System. Thin, accessible components styled
by [`@paul-portfolio/css`](https://www.npmjs.com/package/@paul-portfolio/css) —
the components render semantic markup with class names, and the CSS package
supplies the looks via design tokens.

## Install

```bash
npm install @paul-portfolio/react @paul-portfolio/css @paul-portfolio/tokens
```

`@paul-portfolio/css` and `@paul-portfolio/tokens` are peer dependencies, along
with `react` and `react-dom` (>=18).

## Setup

Import the token variables and the component styles once, near the root of your
app:

```ts
import "@paul-portfolio/tokens/tokens.css";
import "@paul-portfolio/css/components.css";
```

Then use the components:

```tsx
import { Button } from "@paul-portfolio/react";

export function Example() {
  return <Button variant="primary">Save</Button>;
}
```

## Components

### Button

Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`xs`,
`sm`, `md`, `lg`), `loading`, and an `href` form that renders an `<a>`.

```tsx
<Button variant="outline" size="sm" onClick={save}>Save</Button>
<Button href="/docs" variant="ghost">Docs</Button>
```

### IconButton

A square, icon-only button. Requires `aria-label` since there's no visible text.
Sizes `sm` and `md`.

```tsx
<IconButton aria-label="Close" onClick={close}>✕</IconButton>
```

### Input / Textarea

Labelled fields with `error` and `helper` text. `Input` takes a `size`
(`sm`/`md`); `Textarea` resizes vertically.

```tsx
<Input label="Email" type="email" error={emailError} />
<Textarea label="Bio" helper="Max 200 characters" />
```

### Switch

An on/off toggle. Controlled via `checked` + `onCheckedChange`. Give it an
`aria-label`.

```tsx
<Switch checked={on} onCheckedChange={setOn} aria-label="Notifications" />
```

### Chip

A compact tag, optionally removable and colorable.

```tsx
<Chip label="Design" onRemove={() => remove("design")} />
```

### Modal

An accessible dialog with focus trap, Escape-to-close, and a backdrop. Controlled
via `open` + `onClose`.

```tsx
<Modal open={open} onClose={close} aria-label="Settings">
  <h2>Settings</h2>
</Modal>
```

### Tooltip / InfoTip

`Tooltip` wraps any element and shows text on hover. `InfoTip` is the common
"small i that explains a label" shortcut, built on `Tooltip`.

```tsx
<Tooltip content="Copied to clipboard"><IconButton aria-label="Copy">⧉</IconButton></Tooltip>
<InfoTip content="We never share your email." />
```

### Card

A surface with optional `Card.Header`, `Card.Body`, and `Card.Footer`.

```tsx
<Card>
  <Card.Header>Plan</Card.Header>
  <Card.Body>Pro — $12/mo</Card.Body>
</Card>
```

### Badge / Avatar / Skeleton / Spinner

- **Badge** — a small status label.
- **Avatar** — a rounded user image with initials fallback.
- **Skeleton** — a shimmer placeholder for content that's still loading.
- **Spinner** — an indeterminate loading spinner (`sm`/`md`/`lg`), announced as a
  status region.

```tsx
<Badge>New</Badge>
<Avatar name="Ada Lovelace" src={url} />
<Skeleton width="12rem" />
<Spinner label="Loading results" />
```

### Divider

A thin separator rule, `horizontal` (default) or `vertical`.

```tsx
<Divider />
<Divider orientation="vertical" />
```

### VisuallyHidden

Renders content that's available to screen readers but hidden visually.

```tsx
<VisuallyHidden>Loading</VisuallyHidden>
```

### cx

A tiny classname joiner used internally, exported for convenience.

```ts
cx("card", isActive && "card--active"); // "card card--active"
```

## Accessibility

Every component ships with an axe test in the package's suite. Components that
have no visible text (IconButton, Switch, Spinner) require or default an
accessible name, and interactive components expose the right roles and ARIA
state.

## License

MIT © Paul Sumido
