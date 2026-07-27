import type { Meta, StoryObj } from '@storybook/react';
import { TiltCard, Card, Badge } from '@paul-portfolio/react';

const meta = {
  title: 'Components/TiltCard',
  component: TiltCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A surface that tilts in 3D toward the pointer, with a cursor-tracking ' +
          'glare. The effect is decorative and pointer-only; the content stays ' +
          'readable and keyboard users are unaffected. Under prefers-reduced-motion ' +
          'it renders as a flat, static card.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 48, maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    maxTilt: { control: { type: 'range', min: 0, max: 25, step: 1 } },
    glare: { control: 'boolean' },
  },
} satisfies Meta<typeof TiltCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxTilt: 12,
    glare: true,
    children: (
      <Card variant="elevated">
        <Card.Header>
          <strong>Design tokens</strong> <Badge variant="success">New</Badge>
        </Card.Header>
        <Card.Body>
          Move your pointer across this card to feel the 3D tilt and the glare
          that tracks your cursor.
        </Card.Body>
      </Card>
    ),
  },
};

export const Subtle: Story = {
  args: {
    maxTilt: 6,
    glare: false,
    children: (
      <Card variant="elevated">
        <Card.Body>A gentler tilt with no glare.</Card.Body>
      </Card>
    ),
  },
};
