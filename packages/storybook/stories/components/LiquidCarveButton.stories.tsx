import type { Meta, StoryObj } from '@storybook/react';
import { LiquidCarveButton } from '@paul-portfolio/react';
const meta = {
  title: 'Components/LiquidCarveButton', component: LiquidCarveButton, tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'An SVG mask carves through the surface. Independent critically damped springs retain velocity on reversal and stop at rest. Keyboard and touch keep native button feedback; reduced motion removes the carve. Supply matching fillColor/textColor when overriding the token palette.' } } },
  args: { label: 'Explore the collection' },
  argTypes: { blobColor: { control: 'color' }, fillColor: { control: 'color' }, textColor: { control: 'color' }, disabled: { control: 'boolean' } },
} satisfies Meta<typeof LiquidCarveButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Link: Story = { args: { href: '#collection', label: 'View the collection' } };
export const Disabled: Story = { args: { disabled: true } };
export const Multiple: Story = { render: args => <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}><LiquidCarveButton {...args} /><LiquidCarveButton {...args} label="Another perspective" /></div> };
