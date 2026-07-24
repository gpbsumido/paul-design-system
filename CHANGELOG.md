# Changelog

## [0.2.25] - 2026-07-24

### Added

- `Ticker`, a horizontal ticker strip, generalized from the tickers in paul-explore and ketsup (which had grown their own). It has two modes: `scroll` (default) is an accessible, real scroll container with an ambient JS auto-scroll that pauses on hover/touch and keeps every item reachable by wheel/trackpad/drag/touch (the trailing copy is aria-hidden and pulled out of the tab order); `marquee` is a decorative, aria-hidden CSS loop for pure flavour. It's content-agnostic (takes children), configurable via `edge`/`direction`/`speed`, and both modes honour `prefers-reduced-motion` — scroll collapses to a plain scrollable row, marquee goes static. Added to `@paul-portfolio/css` (`.ticker`, `.ticker--marquee`, `.ticker--top`/`--bottom`) and the React package, with CSS + React tests and Storybook stories. Angular deferred, same as Select/FilterBar. Bumps `@paul-portfolio/css` 0.4.4 → 0.4.5 and `@paul-portfolio/react` 0.4.3 → 0.4.4.

## [0.2.24] - 2026-07-24

### Added

- Hard offset elevation on `@paul-portfolio/tokens`: `--paul-shadow-offset-sm`, `--paul-shadow-offset-md`, and `--paul-shadow-offset-lg` — solid, un-blurred drop shadows (2/6/9px) for retro / neo-brutalist surfaces that want a crisp edge instead of a soft blur. Harvested from ketsup's Kinetic x Dusk theme. Also adds the tokens package's first vitest test. Bumps `@paul-portfolio/tokens` 0.1.9 → 0.1.10.

## [0.2.23] - 2026-07-24

### Added

- `starburst` variant on `Badge`, harvested from the BETA seal in ketsup. It's a spiky seal shape (a fixed square clipped to a burst with a light-to-saturated radial fill) for "new"/"beta" flags, and it composes with the existing colour variants (`starburst` + `warning`, etc.), defaulting to primary. It reads the same in light and dark, so it needs no dark-mode override. Added to `@paul-portfolio/css` (`.badge--starburst`), the React package (`starburst` prop), and Angular (`starburst` input), with CSS + React tests and Storybook stories. Bumps `@paul-portfolio/css` 0.4.3 → 0.4.4, `@paul-portfolio/react` 0.4.2 → 0.4.3, and `@paul-portfolio/angular` 0.1.20 → 0.1.21.

## [0.2.22] - 2026-07-23

### Added

- `Select` and `FilterBar` components, generalized from the fantasy filter rows in paul-explore (PR #204). `Select` is a labelled, accessible `<select>` that shares the input field styling, hides the native chevron and paints its own (inlined, asset-free, with a dark-mode variant), and supports `sm`/`md` sizes, `error`/`helper` text, and a `horizontal` orientation for inline filter rows. `FilterBar` is a labelled `<section>` landmark wrapping a centered, wrapping row of controls, so the region + accessible name are built in rather than copy-pasted per page. Added to `@paul-portfolio/css` (`.select`, `.filter-bar`) and the React package, with CSS + React tests (including axe-core a11y) and Storybook stories. Bumps `@paul-portfolio/css` 0.4.2 → 0.4.3 and `@paul-portfolio/react` 0.4.1 → 0.4.2.

## [0.2.21] - 2026-07-23

### Added

- New `gel` button variant: a glossy gradient fill with a hard offset shadow, harvested from the ketsup redesign. It is theme-agnostic — the gradient is built from the primary tokens and the gloss is a background layer (not a pseudo-element), so it takes on whatever palette the consumer themes and never sits over the label. Added to `@paul-portfolio/css` (`.btn--gel`) and the React `Button` variant union, with a Storybook story and CSS + React tests. Bumps `@paul-portfolio/css` 0.4.1 → 0.4.2 and `@paul-portfolio/react` 0.4.0 → 0.4.1.

## [0.2.20] - 2026-07-20

### Fixed

- Ghost button label vanished on hover in dark mode. `.btn--ghost:hover` filled with a light neutral that never flipped for dark mode, so the foreground-colored label washed out against it. Added a dark-mode hover background (matching the outline variant) so the label keeps contrast. Bumps `@paul-portfolio/css` 0.4.0 → 0.4.1.

## [0.2.19] - 2026-07-19

### Changed

- Bumped the publishable packages so the enhancement work can actually ship: `@paul-portfolio/react` 0.3.0 → 0.4.0 and `@paul-portfolio/css` 0.3.1 → 0.4.0. Those exact versions were already on npm, so the component enhancements and audit fixes (Modal, Avatar, Chip, Skeleton, Input, Button, Badge, Tooltip, etc.) had no new version to publish under. `@paul-portfolio/tokens` is unchanged at 0.1.9.

## [0.2.18] - 2026-07-19

### Fixed

- Disabled Input and Textarea were indistinguishable from the enabled state — there were no disabled styles at all, so they kept the normal surface background and full-strength text. They now use a grayer fill, muted text, and a `not-allowed` cursor, in both light and dark themes.

### Changed

- Input stories now render at a realistic field width (20rem) instead of stretching edge to edge. A full-bleed input made the focus ring look like a line across the top rather than a ring around the field.

## [0.2.17] - 2026-07-19

### Fixed

- Skeleton circle rendered enormous — `.skeleton--circle` set `aspect-ratio: 1` but no width, so a block-level skeleton filled its container and the aspect ratio turned that full width into a giant circle. It now defaults to 40px, and the React `width`/`height` props apply to the circle (and any variant), not just `rect`.

## [0.2.16] - 2026-07-19

### Fixed

- Removable Chip had no visible close affordance — the React `.chip__remove` button rendered empty (the "×" was never in the markup, unlike the Angular component), so it was a blank clickable square. It now renders an `aria-hidden` "×" glyph, sized up a little so it reads clearly.

## [0.2.15] - 2026-07-19

### Changed

- Avatar "WithImage" story now renders at `lg`. With the new `md` size default an unsized image avatar dropped from its old raw-image dimensions to 32px, which looked cramped in the showcase; `lg` shows the image avatar clearly.

## [0.2.14] - 2026-07-19

### Fixed

- Modal panel rendered with no surface: the React component put the dialog styles on `.modal` and the title on `.modal__title`, but the CSS (and the Angular component) style `.modal__content` and `.modal__header`. The panel is now `.modal__content` and the title renders in `.modal__header`, so the dialog gets its background, radius, shadow, and header divider.
- Avatar collapsed when no `size` was given — the size only came from a modifier class, so an unsized avatar had no dimensions. `size` now defaults to `md`. The fallback initials also fill the whole circle instead of hugging the text.

## [0.2.13] - 2026-07-19

### Fixed

- Button loading spinner was invisible: `aria-busy` sets `color: transparent` to hide the label, which also zeroed out the `currentColor` the spinner border relied on. The spinner now uses an explicit color — the foreground on light fills, white on the solid primary/danger variants.
- Badge dot was washed out — the 8px dot reused the pale text-badge background (e.g. `success-100`), which is nearly invisible at that size. Dots now use the saturated `-500` fills.

## [0.2.12] - 2026-07-19

### Changed

- Spinner story: replaced the "CustomLabel" story (visually identical to Default, since `label` is only the accessible name) with a "WithText" story that pairs the spinner with matching visible text, so there's something distinct to see and it shows the real usage.

## [0.2.11] - 2026-07-19

### Fixed

- Storybook was never importing `@paul-portfolio/tokens/tokens.css`, so every `--paul-*` custom property resolved to empty and all component styles fell back to nothing (backgrounds transparent, borders gone). Components with literal text colors looked "sort of there"; token-only ones like Tooltip (white text on white) and Spinner were invisible. The preview now imports the tokens before the css, so everything renders styled — and Chromatic baselines are finally meaningful.

## [0.2.10] - 2026-07-19

### Fixed

- `index.css` was missing the newer components (icon-button, textarea, switch, spinner, info-tip, divider) — it kept its own duplicate import list that never got the additions, so consumers of the full entry point (and Storybook) got no styles for those. `index.css` now imports `components.css` directly, so the two entry points can't drift again.

## [0.2.9] - 2026-07-19

### Fixed

- Tooltip and InfoTip stories now hover to reveal the bubble before Chromatic snapshots, so the baselines actually show the tooltip/popover instead of just the bare trigger. Added an explicit trigger-only InfoTip story for the resting state.

## [0.2.8] - 2026-07-19

### Added

- Storybook stories for Textarea, InfoTip, Switch, Spinner, and Divider, which had none, so the whole component set is documented and covered by Chromatic.

### Fixed

- IconButton story now renders the real IconButton component instead of a Button with a non-existent `btn--icon` class.

## [0.2.7] - 2026-07-19

### Fixed

- Tooltip Storybook interaction test: waits for the tooltip with `findByRole` now that it appears after a show-delay, instead of reading it synchronously right after hover (which failed to render under Chromatic UI Tests).

## [0.2.6] - 2026-07-19

### Added

- Modal: `aria-label`, `aria-labelledby`, and `aria-describedby` passthrough (so it can be labelled without a visible title), a `className`, and a focus trap that moves focus into the dialog on open, cycles Tab within it, and restores focus to the opener on close.

### Notes

- With this, `@paul-portfolio/react` and `/css` are cut to 0.3.0 for the Textarea / Tooltip / InfoTip / Chip / Modal enhancements in this batch.

## [0.2.5] - 2026-07-19

### Added

- Chip: a `color` prop (background color with white text), `fullWidth` to stretch inside a container, and a `title`. When given an `onClick` the label becomes a real focusable button (with the remove button as a sibling, so no button-in-button), and the remove button now names itself "Remove <label>".

## [0.2.4] - 2026-07-19

### Changed

- Tooltip now renders at a fixed screen position instead of absolute, so it's never clipped by an `overflow:hidden` ancestor (grids, cards, chips) and needs no portal. Shows on hover and focus after a `delay`, dismissible with Escape. `content` now accepts rich nodes, plus a `maxWidth`.

### Added

- InfoTip accepts rich `ReactNode` content and a `maxWidth`, built on the fixed-position Tooltip. Brings it to parity with the hand-rolled popover in consuming apps.

## [0.2.3] - 2026-07-19

### Added

- Textarea: `hideLabel` (visually hide the label but keep it accessible), a `required` marker, and an optional live character counter (`showCount` with `maxLength`). Brings it to parity with the richer hand-rolled Textarea in consuming apps so they can back onto it.

## [0.2.2] - 2026-07-16

### Fixed

- Upgrade publish workflow to Node 24 (npm 11.5.1+) required for OIDC trusted publishing
- Remove `registry-url` from setup-node to prevent `.npmrc` `_authToken` line from overriding OIDC

## [0.2.1] - 2026-07-16

### Fixed

- Added job-level `id-token: write` permission to publish workflow for reliable OIDC token minting
- Normalized `repository.url` format with `git+https://` prefix across all packages

## [0.2.0] - 2026-07-16

- testing auto publish

## [0.1.29] - 2026-07-16

- update the publish workflow

## [0.1.28] - 2026-07-16

### Added

- `repository.url` field to all package.json files pointing to `https://github.com/gpbsumido/paul-design-system.git` with per-package `directory` paths

## [0.1.26] - 2026-07-15

### Fixed

- CSS component spacing tokens were referencing the old dot-based names (`--paul-spacing-1\.5`) while the tokens package had already renamed them to underscores (`--paul-spacing-1_5`). This caused missing padding on buttons (sm), chips (sm), badges, tooltips, and missing gap on input wrappers.
- Affected files: button.css, input.css, chip.css, badge.css, tooltip.css

### Added

- `components.css` entry point for `@paul-portfolio/css` — imports all component and utility styles without the reset/base layers. Tailwind consumers use this instead of `index.css` to avoid CSS reset conflicts with preflight.
- New package.json export: `"./components.css": "./src/components.css"`

## [0.1.23] - 2026-07-14

- Updating version to test auto-publish to NPM

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
