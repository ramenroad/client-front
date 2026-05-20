import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingLottie } from './LoadingLottie'

const meta = {
  title: 'shared/LoadingLottie',
  component: LoadingLottie,
  parameters: {
    layout: 'centered',
  },
  args: {
    loop: true,
    autoplay: true,
  },
} satisfies Meta<typeof LoadingLottie>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Large: Story = {
  args: {
    className: 'h-96 w-96',
  },
}
