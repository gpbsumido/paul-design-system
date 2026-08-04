import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Tokens define the --paul-* custom properties everything else reads, so they
// must load first. Without them all the component styles resolve to empty.
import '@paul-portfolio/tokens/tokens.css';
// Import the CSS package for global styles
import '@paul-portfolio/css/index.css';

const preview: Preview = {
  parameters: {
    chromatic: {
      // Chromatic screenshots a live page, so anything still moving when the
      // shutter opens produces a different image every run — that's what the
      // "changes detected are different" warning is. Freezing CSS animations at
      // their end state makes Skeleton, Spinner, GradientBackground and the
      // marquee Ticker deterministic. A JS-driven animation can't be frozen this
      // way; see the Ticker's scroll story.
      pauseAnimationAtEnd: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Enable a11y checks on all stories by default
      element: '#storybook-root',
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
