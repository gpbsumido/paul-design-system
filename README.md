# Paul Design System

A framework-agnostic design system built on design tokens and CSS custom properties, with first-class React and Angular wrappers.

## Architecture

The system is organized as an npm workspaces monorepo with a clear dependency graph:

```
@paul/tokens          (design tokens - colors, spacing, typography)
    |
    v
@paul/css             (framework-agnostic CSS components, consumes tokens)
    |
    v
@paul/react           (React component wrappers)
@paul/angular         (Angular component wrappers)
```

Tokens flow downward. Each layer builds on the one below it, and consumers pick the layer that fits their stack.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@paul/tokens` | Design tokens as TypeScript constants and CSS custom properties | Scaffold |
| `@paul/css` | Framework-agnostic CSS components using CSS layers | Scaffold |
| `@paul/react` | React component library wrapping CSS primitives | Scaffold |
| `@paul/angular` | Angular component library wrapping CSS primitives | Scaffold |

## Installation

### Tokens only

For projects that only need raw token values (e.g., a Node service generating emails):

```bash
npm install @paul/tokens
```

### Vanilla HTML/CSS

For projects that use plain HTML and CSS without a framework:

```bash
npm install @paul/tokens @paul/css
```

Then import the stylesheet:

```html
<link rel="stylesheet" href="node_modules/@paul/css/src/index.css" />
```

### React

```bash
npm install @paul/tokens @paul/css @paul/react react react-dom
```

```tsx
import { Button } from '@paul/react';
```

### Angular

```bash
npm install @paul/tokens @paul/css @paul/angular @angular/core
```

```typescript
import { PaulButtonComponent } from '@paul/angular';
```

## Local Development

### Prerequisites

- Node.js >= 18
- npm >= 9 (for workspaces support)

### Getting started

```bash
# Clone the repository
git clone https://github.com/gpbsumido/paul-design-system.git
cd paul-design-system

# Install all dependencies
npm install

# Build all packages (tokens first, then the rest)
npm run build

# Run all tests
npm run test

# Clean build artifacts
npm run clean
```

### Build order

Tokens must be built before other packages since they are a dependency:

1. `@paul/tokens`
2. `@paul/css`, `@paul/react`, `@paul/angular` (can build in parallel)

### Testing

All packages use [Vitest](https://vitest.dev/) as the test runner. Tests are colocated with source files or placed in `__tests__/` directories.

```bash
# Run tests across all packages
npm test

# Run tests for a specific package
npm test --workspace=packages/tokens
```

## Design Principles

- **Tokens are the source of truth.** Every color, spacing value, and typographic scale originates in `@paul/tokens`.
- **CSS custom properties are the canonical format.** Tokens compile to CSS custom properties so any consumer -- framework or vanilla -- can use them.
- **CSS layers manage specificity.** The layer order (`reset < tokens < base < components < utilities`) eliminates specificity wars.
- **Framework wrappers are thin.** React and Angular packages wrap the CSS components; they do not reimplement styles.

## License

MIT
