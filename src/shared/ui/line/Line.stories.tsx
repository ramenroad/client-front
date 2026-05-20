import type { Meta, StoryObj } from '@storybook/react-vite'
import { Line } from './Line'

const meta = {
  title: 'shared/Line',
  component: Line,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Line>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-320">
      <Line />
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    vertical: true,
    className: 'h-80',
  },
}
