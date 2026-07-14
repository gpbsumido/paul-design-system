# Paul Design System - Project Instructions

## Project status

All four packages are implemented and feature-complete:

- `@paul-portfolio/tokens` -- Design tokens (colors, spacing, typography, shadows, motion, radii, z-index)
- `@paul-portfolio/css` -- 9 CSS components + 4 utilities (focus-ring, sr-only, visually-hidden, contrast-notes)
- `@paul-portfolio/react` -- 10 React components with full test coverage including axe-core a11y tests
- `@paul-portfolio/angular` -- 16 standalone Angular components (compound components for Card and Modal)
- `packages/storybook` -- Storybook stories for all components + token documentation pages, Chromatic configured

## Development rules

- TDD is non-negotiable. Write tests first, then implementation.
- TypeScript strict mode is required in all packages.
- Test with Vitest. React components use Testing Library and axe-core.
- All components must meet WCAG 2.1 AA accessibility requirements.

## Versioning

- Each commit bumps the patch version and updates CHANGELOG.md.
- Current version: 0.1.20

## Tokens

- CSS custom properties are the canonical token format.
- Build tokens before other packages.
- Token categories: colors, spacing, typography, shadows, motion, radii, z-index.

## CSS

- CSS layers are used for specificity management.
- Layer order: reset < tokens < base < components < utilities.
- Components: button, input, chip, card, modal, tooltip, avatar, badge, skeleton.
- Utilities: focus-ring, sr-only, visually-hidden, contrast-notes.

## React

- 10 components: Button, Input, Chip, Card, Modal, Tooltip, Avatar, Badge, Skeleton, VisuallyHidden.
- Components wrap CSS primitives; they do not reimplement styles.
- `cx` utility exported for class name merging.

## Angular

- 16 standalone components (Card and Modal have sub-components for header, body, footer).
- Components: PaulButton, PaulInput, PaulChip, PaulCard (+ header/body/footer), PaulModal (+ header/body/footer), PaulTooltip, PaulAvatar, PaulBadge, PaulSkeleton, PaulVisuallyHidden.

## Monorepo

- This is an npm workspaces monorepo.
- All packages live under `packages/`.
- Build order: tokens first, then css/react/angular in parallel.

## Storybook

- Lives in `packages/storybook`.
- Component stories with controls for all props.
- Token documentation pages in MDX (Colors, Spacing, Typography).
- Chromatic configured for visual regression at viewports 320, 768, 1280.
