import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../react/src/Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { variant: 'text' },
};

export const Circle: Story = {
  args: { variant: 'circle' },
};

export const Rect: Story = {
  args: { variant: 'rect', width: '200px', height: '120px' },
};

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
      <Skeleton variant="rect" width="300px" height="160px" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Skeleton variant="circle" />
        <Skeleton variant="text" />
      </div>
    </div>
  ),
  args: { variant: 'rect' },
};
