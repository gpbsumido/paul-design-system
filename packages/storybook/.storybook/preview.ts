import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Tokens define the --paul-* custom properties everything else reads, so they
// must load first. Without them all the component styles resolve to empty.
import '@paul-portfolio/tokens/tokens.css';
// Import the CSS package for global styles
import '@paul-portfolio/css/index.css';

const preview: Preview = {
  parameters: {
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
