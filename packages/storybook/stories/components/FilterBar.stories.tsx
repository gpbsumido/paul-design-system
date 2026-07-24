import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar, Select } from '@paul-portfolio/react';

const meta = {
  title: 'Components/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Team and season filters',
    children: (
      <>
        <Select label="Team" orientation="horizontal" defaultValue="atl">
          <option value="atl">Atlanta</option>
          <option value="bos">Boston</option>
          <option value="chi">Chicago</option>
        </Select>
        <Select label="Season" orientation="horizontal" defaultValue="2025">
          <option value="2025">2024-25</option>
          <option value="2024">2023-24</option>
        </Select>
        <Select label="Stat" orientation="horizontal" defaultValue="pts">
          <option value="pts">Points</option>
          <option value="reb">Rebounds</option>
          <option value="ast">Assists</option>
        </Select>
      </>
    ),
  },
};

export const Wrapping: Story = {
  name: 'Wraps when narrow',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: Default.args,
};
