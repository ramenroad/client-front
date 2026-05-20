import type { Meta, StoryObj } from '@storybook/react-vite'
import { RaisingText } from './RaisingText'

const meta = {
  title: 'shared/RaisingText',
  component: RaisingText,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: '라이징 텍스트',
    size: 16,
    weight: 'sb',
  },
  argTypes: {
    size: {
      control: 'select',
      options: [10, 12, 14, 16, 18, 20, 22],
    },
    weight: {
      control: 'select',
      options: ['r', 'm', 'sb', 'b'],
    },
  },
} satisfies Meta<typeof RaisingText>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-8 text-gray-900">
      {[10, 12, 14, 16, 18, 20, 22].map((size) => (
        <RaisingText key={size} size={size as 10 | 12 | 14 | 16 | 18 | 20 | 22} weight="sb">
          {size}px · 세미볼드 텍스트
        </RaisingText>
      ))}
    </div>
  ),
}
