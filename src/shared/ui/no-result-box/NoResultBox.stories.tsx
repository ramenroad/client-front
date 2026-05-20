import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/shared/ui/button'
import NoResultBox from './NoResultBox'

const meta = {
  title: 'shared/NoResultBox',
  component: NoResultBox,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="h-360 w-320 rounded-16 border border-border bg-white p-20">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoResultBox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    actionButton: <Button className="w-180">제보하기</Button>,
  },
}
