import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconTooltip } from '@/shared/ui/icon'
import Tooltip from './Tooltip'

const meta = {
  title: 'shared/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: '안내',
    content: '아이콘을 클릭하면 툴팁이 표시됩니다.',
    children: <IconTooltip />,
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
