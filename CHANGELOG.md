# Changelog

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
- Four package stubs: @paul/tokens, @paul/css, @paul/react, @paul/angular
