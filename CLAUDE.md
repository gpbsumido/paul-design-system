# Paul Design System - Project Instructions

## Development Rules

- TDD is non-negotiable. Write tests first, then implementation.
- TypeScript strict mode is required in all packages.
- Test with Vitest.

## Versioning

- Each commit bumps the patch version and updates CHANGELOG.md.

## Tokens

- CSS custom properties are the canonical token format.
- Build tokens before other packages.

## CSS

- CSS layers are used for specificity management.
- Layer order: reset < tokens < base < components < utilities.

## Monorepo

- This is an npm workspaces monorepo.
- All packages live under `packages/`.
- Build order: tokens first, then css/react/angular in parallel.
