import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/shared/ui/button'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

const ToastDemo = () => {
  const { openToast } = useToast()

  return (
    <Button className="w-220" onClick={() => openToast('토스트 메시지입니다.')}>토스트 열기</Button>
  )
}

const meta = {
  title: 'shared/ToastProvider',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof ToastProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
}
