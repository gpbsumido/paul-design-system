# Paul Design System

A framework-agnostic design system built on design tokens and CSS custom properties, with first-class React and Angular component libraries.

![Build Status](https://img.shields.io/github/actions/workflow/status/gpbsumido/paul-design-system/ci.yml?branch=main)
![npm version](https://img.shields.io/npm/v/@paul/tokens)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

---

## What it is

Paul Design System provides a complete UI foundation that works with any web framework or none at all. Design tokens define every visual decision -- colors, spacing, typography, shadows, motion, and z-index -- and compile to CSS custom properties. A CSS component layer consumes those tokens to build framework-agnostic primitives. Thin React and Angular wrappers expose those primitives as idiomatic components with full type safety.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@paul/tokens` | Design tokens: colors, spacing, typography, shadows, motion, radii, z-index | Ready |
| `@paul/css` | Framework-agnostic CSS components using CSS layers | Ready |
| `@paul/react` | React component library (10 components) | Ready |
| `@paul/angular` | Angular component library (16 standalone components) | Ready |

## Dependency graph

```
  @paul/tokens
  (colors, spacing, typography, shadows, motion, radii, z-index)
       |
       v
  @paul/css
  (button, input, chip, card, modal, tooltip, avatar, badge, skeleton)
       |
       +------------------+
       |                  |
       v                  v
  @paul/react        @paul/angular
  (10 components)    (16 standalone components)
```

Tokens flow downward. Each layer builds on the one below it. Consumers pick the layer that fits their stack.

## Installation

### Tokens only

For projects that need raw token values (e.g., a Node service generating emails, a design tool plugin):

```bash
npm install @paul/tokens
```

```ts
import { colors, spacing, typography } from '@paul/tokens';
```

### Vanilla HTML/CSS

For projects using plain HTML and CSS without a framework:

```bash
npm install @paul/tokens @paul/css
```

```html
<link rel="stylesheet" href="node_modules/@paul/css/src/index.css" />

<button class="paul-btn paul-btn--primary paul-btn--md">Save</button>
```

### React

```bash
npm install @paul/tokens @paul/css @paul/react
```

```tsx
import { Button, Card, Input, Modal } from '@paul/react';

function App() {
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button variant="primary" size="md">Submit</Button>
    </Card>
  );
}
```

### Angular

```bash
npm install @paul/tokens @paul/css @paul/angular
```

```typescript
import { PaulButtonComponent, PaulCardComponent } from '@paul/angular';

@Component({
  standalone: true,
  imports: [PaulButtonComponent, PaulCardComponent],
  template: `
    <paul-card>
      <paul-button variant="primary" size="md">Submit</paul-button>
    </paul-card>
  `,
})
export class AppComponent {}
```

## Components

All components are available in CSS, React, and Angular.

| Component | CSS class | React | Angular |
|-----------|-----------|-------|---------|
| Button | `paul-btn` | `<Button>` | `<paul-button>` |
| Input | `paul-input` | `<Input>` | `<paul-input>` |
| Chip | `paul-chip` | `<Chip>` | `<paul-chip>` |
| Card | `paul-card` | `<Card>` | `<paul-card>` |
| Modal | `paul-modal` | `<Modal>` | `<paul-modal>` |
| Tooltip | `paul-tooltip` | `<Tooltip>` | `<paul-tooltip>` |
| Avatar | `paul-avatar` | `<Avatar>` | `<paul-avatar>` |
| Badge | `paul-badge` | `<Badge>` | `<paul-badge>` |
| Skeleton | `paul-skeleton` | `<Skeleton>` | `<paul-skeleton>` |
| VisuallyHidden | `paul-sr-only` | `<VisuallyHidden>` | `<paul-visually-hidden>` |

The Angular package exports 16 standalone components because compound components (Card, Modal) expose sub-components for header, body, and footer sections.

Button supports an icon-only pattern (documented in Storybook as "IconButton") using the `aria-label` prop for accessibility.

## Design tokens

Tokens are the single source of truth for every visual value in the system.

| Category | Examples | CSS custom property |
|----------|----------|-------------------|
| Colors | 3 palettes (primary, secondary, neutral) with 11 stops each, plus semantic aliases (success, error, warning) | `--paul-color-primary-500` |
| Spacing | 17 steps from `0` to `96px` | `--paul-spacing-4` |
| Typography | Font sizes (xs--5xl), line heights, font weights, letter spacing | `--paul-font-size-base` |
| Shadows | 6 elevation levels (xs--2xl) | `--paul-shadow-md` |
| Motion | 4 durations (fast--glacial), 5 easing curves | `--paul-duration-normal` |
| Radii | 6 border-radius values (sm--full) | `--paul-radius-md` |
| Z-index | 8 named layers (base--toast) | `--paul-z-modal` |

## Accessibility

The design system targets WCAG 2.1 AA compliance:

- All interactive components include proper ARIA attributes and keyboard navigation
- Focus indicators use a visible focus ring (`focus-ring.css` utility)
- `VisuallyHidden` component for screen-reader-only content
- `prefers-reduced-motion` support: animations are disabled when the user requests reduced motion
- `prefers-contrast` support: high-contrast mode adjustments via `contrast-notes.css`
- Components are tested with [axe-core](https://github.com/dequelabs/axe-core) for automated accessibility violations (`a11y.test.tsx`)

## Storybook

Interactive documentation is available via Storybook. Every component has stories with controls for all props.

```bash
# From the repo root
cd packages/storybook
npm run storybook
```

Stories are organized into two sections:

- **Components** -- Button, Input, Chip, Card, Modal, Tooltip, Avatar, Badge, Skeleton, IconButton
- **Tokens** -- Colors, Spacing, Typography (visual reference pages in MDX)

## Chromatic

Visual regression testing is configured via [Chromatic](https://www.chromatic.com/). Each story is captured at three viewport widths to catch responsive layout issues:

- **320px** -- mobile
- **768px** -- tablet
- **1280px** -- desktop

A 300ms delay is applied before capture to allow animations to settle.

## Local development

### Prerequisites

- Node.js >= 18
- npm >= 9 (workspaces support required)

### Setup

```bash
git clone https://github.com/gpbsumido/paul-design-system.git
cd paul-design-system
npm install
```

### Build order

Tokens must be built first since all other packages depend on them:

```bash
# Build everything in dependency order
npm run build

# Or build individually
npm run build --workspace=packages/tokens
npm run build --workspace=packages/css
npm run build --workspace=packages/react
npm run build --workspace=packages/angular
```

1. `@paul/tokens` -- must build first
2. `@paul/css`, `@paul/react`, `@paul/angular` -- can build in parallel after tokens

### Testing

All packages use [Vitest](https://vitest.dev/). Tests are colocated with source files or placed in `__tests__/` directories.

```bash
# Run all tests
npm test

# Run tests for a specific package
npm test --workspace=packages/react

# Run tests in watch mode
npm test --workspace=packages/react -- --watch
```

### Clean

```bash
npm run clean
```

## Architecture decisions

### CSS custom properties as the canonical token format

Tokens compile to CSS custom properties rather than Sass variables or JS-in-CSS. This means any consumer -- framework, vanilla HTML, or server-rendered -- can use tokens without a build step beyond linking the stylesheet.

### CSS layers for specificity management

The CSS package uses `@layer` to establish a strict specificity order:

```
reset < tokens < base < components < utilities
```

This eliminates specificity conflicts between resets, token declarations, component styles, and utility overrides. Consumers never need `!important`.

### Thin framework wrappers

React and Angular packages wrap the CSS components. They do not reimplement styles. This guarantees visual consistency across frameworks and keeps the wrapper packages small and easy to maintain. A bug fix in `@paul/css` automatically fixes both React and Angular.

## License

MIT
