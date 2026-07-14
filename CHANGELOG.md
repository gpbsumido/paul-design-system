# Changelog

## [0.1.23] - 2026-07-14

- Added Chromatic as dependency

## [0.1.23] - 2026-07-14

### Fixed

- Storybook stories now import from `@paul-portfolio/react` package instead of relative paths into `../../react/src/` — relative imports broke in CI where the react package hadn't been built yet
- Storybook preview imports `@paul-portfolio/css` by package name instead of relative path
- Added `@paul-portfolio/css` and `@paul-portfolio/react` as storybook devDependencies so workspace resolution works

## [0.1.22] - 2026-07-14

### Changed

- Renamed npm scope from `@paul/*` to `@paul-portfolio/*` across all packages
- Fixed spacing token CSS custom property names: dots replaced with underscores (`--paul-spacing-0_5` instead of `--paul-spacing-0.5`) to avoid CSS parsing errors in Next.js/SWC and other strict parsers
- Fixed React and Angular package builds: excluded `__tests__` from tsconfig compilation so dist/ contains actual component output
- Added `disabled` to React Button's `BaseProps` to fix TypeScript union type error
- Bumped tokens to 0.1.4, css to 0.1.10, react to 0.1.13, angular to 0.1.16

### Lessons learned

- CSS custom property names cannot contain dots — they break SWC's CSS parser even though some browsers tolerate them. Always use underscores or hyphens for fractional token names
- Test files must be excluded from tsconfig when the build script is `tsc` — otherwise `__tests__/` directories end up in dist/ and test-only type augmentations (vitest matchers) cause compilation errors
- Discriminated union types in React components (ButtonAsButton | ButtonAsAnchor) require shared props to be in the base type, not just in one branch of the union

## [0.1.21] - 2026-07-13

### Changed

- Comprehensive README with full documentation, component table, architecture decisions
- Updated CLAUDE.md to reflect final project state and all package details

## [0.1.20] - 2026-07-13

### Added

- axe-core accessibility tests for all React components (10 tests, zero violations)
- prefers-reduced-motion support for button, modal, and card transitions
- prefers-contrast (high contrast) support for focus rings, buttons, and inputs
- WCAG 2.1 AA contrast ratio documentation for all token color combinations

## [0.1.19] - 2026-07-13

### Added

- Storybook interaction tests for Button (click, keyboard), Modal (open/close/escape), Input (typing), Tooltip (hover)
- test-storybook script for headless interaction test running
- CI workflow step for interaction tests (commented, requires running Storybook)

## [0.1.18] - 2026-07-13

### Added

- Chromatic visual regression testing integration
- GitHub Actions workflow for automated Chromatic on PRs
- Viewport coverage: 320px (mobile), 768px (tablet), 1280px (desktop)
- Storybook README with development and Chromatic setup docs

## [0.1.17] - 2026-07-13

### Added

- Storybook stories for all React components: Button, Input, Chip, Card, Modal, Tooltip, Avatar, Badge, Skeleton, IconButton
- CSF3 format with autodocs, argTypes controls, and args-based stories
- Modal story with interactive open/close demo
- Skeleton CardSkeleton composed example

## [0.1.16] - 2026-07-13

### Added

- Storybook 8 setup with React Vite framework
- Theme switcher addon (light/dark via data-theme)
- Accessibility addon for inline a11y checks
- Token documentation: Colors, Spacing, Typography MDX pages

## [0.1.15] - 2026-07-13

### Added

- Modal Angular component with backdrop dismiss, Escape key, aria-modal
- Tooltip Angular component with hover trigger and side positioning
- Avatar Angular component with image/fallback and size variants
- Badge Angular component with variant colors and dot mode
- Skeleton Angular component with CSS variable sizing
- VisuallyHidden Angular component

## [0.1.14] - 2026-07-13

### Added

- Input Angular component with label, error, helper, size, aria-describedby
- Chip Angular component with clickable/removable modes
- Card Angular compound components (card, card-header, card-body, card-footer)

## [0.1.13] - 2026-07-13

### Added

- Angular package scaffold with standalone components
- Button Angular component with signal inputs, variant/size/disabled/loading/href

## [0.1.12] - 2026-07-13

### Added

- Modal React component with portal, backdrop click, Escape key, focus trap, aria-modal
- Tooltip React component with hover trigger, side positioning, aria-describedby
- Avatar React component with image/fallback modes and size variants
- Badge React component with success/warning/error/info variants and dot mode
- Skeleton React component with text/circle/rect variants and CSS variable sizing
- VisuallyHidden React component wrapping .visually-hidden

## [0.1.11] - 2026-07-13

### Added

- Input React component with label, error, helper text, size variants, and aria-describedby
- Chip React component with clickable/removable modes
- Card React compound component (Card.Header, Card.Body, Card.Footer)

## [0.1.10] - 2026-07-13

### Added

- React package scaffold with vitest + Testing Library + jsdom
- Button React component with variant/size/loading/disabled/href props
- forwardRef support on Button
- Polymorphic rendering (button or anchor) based on href prop
- cx() classname utility
- Vitest workspace config for monorepo-wide testing

## [0.1.9] - 2026-07-13

### Added

- Tooltip CSS component with top/bottom/left/right positioning
- CSS triangle arrows via pseudo-elements
- prefers-reduced-motion support for tooltip transitions
- Dark mode tooltip color inversion

## [0.1.8] - 2026-07-13

### Added

- Skeleton loader CSS component with shimmer animation and text/circle/rect variants
- Custom skeleton sizing via --skeleton-w and --skeleton-h CSS variables
- Modal CSS component with backdrop blur, content panel, header/body/footer sections
- prefers-reduced-motion support for skeleton animation
- Body scroll lock via .modal--open class

## [0.1.7] - 2026-07-13

### Added

- Chip CSS component with sizes, clickable, and removable variants
- Badge CSS component with success/warning/error/info variants and dot indicator
- Avatar CSS component with sizes (sm/md/lg/xl) and fallback initials
- Card CSS component with elevated/interactive variants and header/body/footer sections

## [0.1.6] - 2026-07-13

### Added

- Input CSS component with validation states (error via aria-invalid)
- Input sizes (sm, md) and wrapper/label/helper layout
- Textarea component extending input styles
- Dark mode input adjustments

## [0.1.5] - 2026-07-13

### Added

- Button CSS component with variants (primary, secondary, outline, ghost, danger)
- Button sizes (xs, sm, md, lg) and icon-only variant
- Button states: disabled, loading (aria-busy), focus-visible ring
- Dark mode button adjustments

## [0.1.4] - 2026-07-13

### Added

- CSS reset with modern defaults
- Base typography styles using design tokens
- Focus ring utility (.focus-ring, .focus-ring-inset) with dark mode support
- Screen-reader-only utility (.sr-only)
- Visually hidden utility (.visually-hidden)
- CSS layer ordering: reset < tokens < base < components < utilities

## [0.1.3] - 2026-07-13

### Added

- SCSS variable output (build/tokens.scss) with $paul-tokens map
- JSON structured output (build/tokens.json)
- Package exports for CSS, SCSS, and JSON token files
- prepublishOnly script for automated builds

## [0.1.2] - 2026-07-13

### Added

- Spacing tokens (4px base scale, 0-24)
- Typography tokens: fontSize, lineHeight, fontWeight, letterSpacing, fontFamily
- Border radius tokens (sm-full)
- Shadow tokens (xs-2xl)
- Motion tokens: duration and easing
- Z-index tokens (base-toast)
- CSS custom properties for all new token categories

## [0.1.1] - 2026-07-13

### Added

- Full color palette: primary, secondary, neutral, error, success, warning (50-950 shades)
- Semantic color aliases with light/dark mode support
- CSS custom property output in build/tokens.css

## [0.1.0] - 2026-07-13

### Added

- Initial monorepo scaffold with workspace config
- Four package stubs: @paul-portfolio/tokens, @paul-portfolio/css, @paul-portfolio/react, @paul-portfolio/angular
