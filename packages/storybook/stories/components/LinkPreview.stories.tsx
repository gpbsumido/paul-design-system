import type { Meta, StoryObj } from '@storybook/react';
import { LinkPreview } from '@paul-portfolio/react';

const meta = {
  title: 'Components/LinkPreview',
  component: LinkPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An inline link that raises a floating thumbnail on hover, leaning ' +
          'toward the pointer. Reinterpreted from OriginKit (custom-image mode, ' +
          'no external screenshot API). The card is decorative; the real link ' +
          'carries the href. Under reduced motion the lean drops and it fades.',
      },
    },
  },
} satisfies Meta<typeof LinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    image: 'https://picsum.photos/id/1025/520/300',
    children: 'this link',
  },
  render: (args) => (
    <p style={{ fontSize: 18, maxWidth: 440, lineHeight: 1.7 }}>
      Hover over <LinkPreview {...args} /> to raise a preview that leans toward
      your cursor.
    </p>
  ),
};
