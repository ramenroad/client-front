import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconTooltip } from '@/shared/ui/icon'
import TopBar from './TopBar'

const meta = {
  title: 'shared/TopBar',
  component: TopBar,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="relative w-390 rounded-16 border border-border bg-white shadow-lg">
        <Story />
      </div>
    ),
  ],
  args: {
    title: '페이지 제목',
    onBackClick: () => undefined,
  },
} satisfies Meta<typeof TopBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithActions: Story = {
  args: {
    tooltip: <IconTooltip />,
    icon: <IconTooltip />,
    onIconClick: () => undefined,
  },
}
