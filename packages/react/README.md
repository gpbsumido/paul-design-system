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

## AI / LLM app components

A set of interaction-heavy components for building assistant and chat surfaces.
All are keyboard-operable and carry an axe test like the rest of the package.

### RichTextEditor

A small rich-text editor on a `contentEditable` region. The toolbar is
configurable (`bold`, `italic`, `underline`, `h2`, `bulletList`, `orderedList`,
`code`, `link`), Ctrl/Cmd+B/I/U work from the keyboard, and it emits HTML on
every edit.

```tsx
<RichTextEditor
  label="Prompt"
  toolbar={["bold", "italic", "code"]}
  onChange={(html) => setDraft(html)}
/>
```

### ChatMessage

A chat bubble aligned and coloured by `role` (`user` | `assistant` | `system`),
with optional `avatar`, `name`, and `timestamp`. Pass `pending` while a reply is
streaming to show the typing indicator.

```tsx
<ChatMessage role="assistant" name="Assistant" timestamp="10:30">
  Here's the summary you asked for.
</ChatMessage>
<ChatMessage role="assistant" pending />
```

### ChatComposer

An auto-growing prompt field. Enter sends, Shift+Enter inserts a newline, empty
messages don't send, and the control locks while `busy`.

```tsx
<ChatComposer label="Message" onSubmit={send} busy={waiting} maxLength={2000} />
```

### StreamingText

Reveals text a few characters at a time, the way a streamed model reply arrives,
with a caret and a polite live region. Honours `prefers-reduced-motion` by
showing the whole string at once.

```tsx
<StreamingText text={reply} speed={2} interval={30} onDone={scrollToEnd} />
```

### TypingDots

The three-dot "assistant is typing" indicator. The animation is decorative and
hidden from assistive tech; the `label` carries the meaning.

```tsx
<TypingDots label="Assistant is typing" />
```

### CodeBlock

A read-only code panel with a language label and a copy button that reports
success to assistive tech. Optional decorative line numbers.

```tsx
<CodeBlock code={snippet} language="ts" filename="stream.ts" showLineNumbers />
```

### CommandPalette

A ⌘K command menu. Type to filter (label + `keywords`), arrow keys to move, Enter
to run, Escape to close, with optional group headings. Follows the
combobox/listbox pattern with `aria-activedescendant`.

```tsx
<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  commands={[{ id: "new", label: "New chat", onSelect: startChat }]}
/>
```

### Combobox

An accessible autocomplete — a filtering text input with a listbox popup and
full keyboard support. Handy for model/tool pickers.

```tsx
<Combobox label="Model" options={models} value={model} onChange={setModel} />
```

### Toast

Wrap the app in `ToastProvider` and raise notifications with `useToast()`. Toasts
stack in a live region (errors announce assertively) and auto-dismiss unless
`duration` is `0`.

```tsx
const { toast } = useToast();
toast({ title: "Saved", description: "Your changes are safe.", variant: "success" });
```

### TokenUsageMeter

A budget bar for LLM token usage: prompt and completion tokens as two segments of
a track sized against `maxTokens`, with the used total, percent, and an optional
cost estimate. Shifts to a warning tone near the budget and an over tone past it.

```tsx
<TokenUsageMeter
  label="Context window"
  promptTokens={3200}
  completionTokens={1400}
  maxTokens={8000}
  costPerMTok={3}
/>
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
