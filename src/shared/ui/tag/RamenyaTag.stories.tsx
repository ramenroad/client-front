import type { Meta, StoryObj } from '@storybook/react-vite'
import { RamenyaTag } from './RamenyaTag'

const meta = {
  title: 'shared/RamenyaTag',
  component: RamenyaTag,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: '라멘야',
  },
} satisfies Meta<typeof RamenyaTag>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
