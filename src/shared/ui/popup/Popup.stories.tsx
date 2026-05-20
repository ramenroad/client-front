import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/shared/ui/button'
import { BottomPopupLayout } from './BottomPopupLayout'
import { Popup } from './Popup'
import PopupConfirm from './PopupConfirm'
import { PopupIframe } from './PopupIframe'

const ConfirmDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="w-180" onClick={() => setIsOpen(true)}>
        확인 팝업 열기
      </Button>
      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopupConfirm
          content="작업을 진행할까요?"
          confirmText="진행"
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
        />
      </Popup>
    </>
  )
}

const BottomDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="w-180" onClick={() => setIsOpen(true)}>
        바텀 팝업 열기
      </Button>
      <Popup isOpen={isOpen} direction="bottom" onClose={() => setIsOpen(false)}>
        <BottomPopupLayout>
          <strong className="font-18-sb text-gray-900">바텀 팝업</strong>
          <p className="mt-12 font-14-r text-gray-600">하단에서 올라오는 레이아웃입니다.</p>
          <Button className="mt-24" onClick={() => setIsOpen(false)}>
            닫기
          </Button>
        </BottomPopupLayout>
      </Popup>
    </>
  )
}

const meta = {
  title: 'shared/Popup',
  component: Popup,
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: false,
    onClose: () => undefined,
    children: null,
  },
} satisfies Meta<typeof Popup>

export default meta

type Story = StoryObj<typeof meta>

export const Confirm: Story = {
  render: () => <ConfirmDemo />,
}

export const Bottom: Story = {
  render: () => <BottomDemo />,
}

export const Iframe: Story = {
  render: () => (
    <div className="overflow-hidden rounded-16 border border-border">
      <PopupIframe url="https://example.com" onClose={() => undefined} />
    </div>
  ),
}
