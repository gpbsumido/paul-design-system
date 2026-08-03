import path from 'node:path';
import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    // Docs is configured on its own rather than through essentials, because the
    // MDX compiler options only reach it that way. Without GFM every markdown
    // table in the token pages renders as a paragraph of literal pipes — which
    // is exactly what they were doing.
    { name: '@storybook/addon-essentials', options: { docs: false } },
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@paul-portfolio/react': path.resolve(__dirname, '../../react/src'),
    };
    // Use automatic JSX runtime so source TSX files don't need `import React`
    config.esbuild = {
      ...config.esbuild,
      jsx: 'automatic',
    };
    return config;
  },
};

export default config;
