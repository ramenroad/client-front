import type { Meta, StoryObj } from '@storybook/react-vite'
import NoStoreBox from './NoStoreBox'

const meta = {
  title: 'shared/NoStoreBox',
  component: NoStoreBox,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="h-300 w-320 rounded-16 border border-border bg-white p-20">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['list', 'map'],
    },
  },
} satisfies Meta<typeof NoStoreBox>

export default meta

type Story = StoryObj<typeof meta>

export const List: Story = {
  args: {
    type: 'list',
  },
}

export const Map: Story = {
  args: {
    type: 'map',
  },
}
