import { useRef, useState, type ChangeEvent, type RefObject } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import noResultImage from '@/assets/images/no-results.png'
import storeImage from '@/assets/images/store.png'
import { ImageUploadGrid } from './ImageUploadGrid'
import { UploadLoadingOverlay } from './UploadLoadingOverlay'

const ImageUploadGridDemo = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<(File | string)[]>([noResultImage, storeImage])

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setImages((currentImages) => [...currentImages, ...files].slice(0, 5))
    event.target.value = ''
  }

  return (
    <ImageUploadGrid
      images={images}
      maxImages={5}
      fileInputRef={fileInputRef}
      onAddClick={() => fileInputRef.current?.click()}
      onImageUpload={handleUpload}
      onRemoveImage={(index) => setImages((currentImages) => currentImages.filter((_, imageIndex) => imageIndex !== index))}
    />
  )
}

const meta = {
  title: 'shared/ImageUploadGrid',
  component: ImageUploadGrid,
  parameters: {
    layout: 'centered',
  },
  args: {
    images: [],
    maxImages: 5,
    fileInputRef: { current: null } as RefObject<HTMLInputElement | null>,
    onAddClick: () => undefined,
    onImageUpload: () => undefined,
    onRemoveImage: () => undefined,
  },
} satisfies Meta<typeof ImageUploadGrid>

export default meta

type Story = StoryObj<typeof meta>

export const Grid: Story = {
  render: () => <ImageUploadGridDemo />,
}

export const LoadingOverlay: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <UploadLoadingOverlay />,
}
