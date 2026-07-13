# @paul/storybook

Storybook documentation and visual regression testing for the Paul Design System.

## Development

```bash
# Start Storybook dev server
npm run storybook --workspace=packages/storybook

# Build static Storybook
npm run build-storybook --workspace=packages/storybook
```

## Chromatic Visual Regression

Chromatic runs automatically on PRs via GitHub Actions. To run manually:

```bash
# Set your project token
export CHROMATIC_PROJECT_TOKEN=your-token

# Run Chromatic
npm run chromatic --workspace=packages/storybook
```

### Viewport coverage
- 320px (mobile)
- 768px (tablet)
- 1280px (desktop)

### Theme coverage
- Light mode (default)
- Dark mode (via data-theme attribute)

### Setup
1. Create a Chromatic account at chromatic.com
2. Add this repo as a project
3. Add `CHROMATIC_PROJECT_TOKEN` as a GitHub Actions secret
