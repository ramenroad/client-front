import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/shared/ui/button'
import { Modal } from './Modal'

const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="w-180" onClick={() => setIsOpen(true)}>
        모달 열기
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex w-280 flex-col gap-16 p-24">
          <strong className="font-18-sb text-gray-900">모달 타이틀</strong>
          <p className="font-14-r text-gray-600">오버레이를 누르면 닫힙니다.</p>
          <Button onClick={() => setIsOpen(false)}>확인</Button>
        </div>
      </Modal>
    </>
  )
}

const meta = {
  title: 'shared/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: false,
    onClose: () => undefined,
    children: null,
  },
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <ModalDemo />,
}
