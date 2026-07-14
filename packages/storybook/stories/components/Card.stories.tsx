import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'interactive'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [
      <Card.Header key="header">Card Title</Card.Header>,
      <Card.Body key="body">This is the card body content.</Card.Body>,
      <Card.Footer key="footer">Footer actions</Card.Footer>,
    ],
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: [
      <Card.Header key="header">Elevated Card</Card.Header>,
      <Card.Body key="body">This card has an elevated shadow style.</Card.Body>,
    ],
  },
};

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    children: [
      <Card.Header key="header">Interactive Card</Card.Header>,
      <Card.Body key="body">Hover or click this card to see the interactive effect.</Card.Body>,
    ],
  },
};
