import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import noResultImage from '@/assets/images/no-results.png'
import storeImage from '@/assets/images/store.png'
import { Button } from '@/shared/ui/button'
import { ImagePopup } from './ImagePopup'

const images = [noResultImage, storeImage]

const ImagePopupDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <>
      <Button className="w-180" onClick={() => setIsOpen(true)}>
        이미지 팝업 열기
      </Button>
      <ImagePopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        images={images}
        selectedIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}

const meta = {
  title: 'shared/ImagePopup',
  component: ImagePopup,
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: false,
    onClose: () => undefined,
    images,
    selectedIndex: 0,
    onIndexChange: () => undefined,
  },
} satisfies Meta<typeof ImagePopup>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <ImagePopupDemo />,
}
