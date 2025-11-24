import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Table from './Table';

const meta = {
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {},
    columns: [],
    pagination: {}
  }
};