import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Select } from '@paul-portfolio/react';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helper: { control: 'text' },
    error: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Team',
    children: (
      <>
        <option value="atl">Atlanta</option>
        <option value="bos">Boston</option>
        <option value="chi">Chicago</option>
      </>
    ),
  },
  decorators: [
    // Vertical selects are full-width by design; constrain the story so it
    // renders at a realistic field width instead of stretching edge to edge.
    (Story) => (
      <div style={{ maxWidth: '20rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const WithHelper: Story = {
  args: { helper: 'Only teams from the current season' },
};

export const WithError: Story = {
  args: { error: 'Select a team to continue' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const SmallSize: Story = {
  args: { size: 'sm', orientation: 'horizontal' },
};

export const Selecting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox');
    await userEvent.selectOptions(select, 'bos');
    await expect(select).toHaveValue('bos');
  },
};
