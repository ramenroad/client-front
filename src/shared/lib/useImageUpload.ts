import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import { optimizeUploadImage } from './image'

export type UploadImageValue = File | string

type UseImageUploadOptions = {
  images: UploadImageValue[]
  maxImages: number
  onImagesChange: (images: UploadImageValue[]) => void
  onLimitExceeded?: (maxImages: number) => void
  onUploadError?: (error: unknown) => void
}

export const useImageUpload = ({
  images,
  maxImages,
  onImagesChange,
  onLimitExceeded,
  onUploadError,
}: UseImageUploadOptions) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleImageClick = useCallback(() => {
    if (images.length < maxImages) {
      fileInputRef.current?.click()
    }
  }, [images.length, maxImages])

  const handleImageUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files

      if (!files) {
        return
      }

      if (images.length + files.length > maxImages) {
        onLimitExceeded?.(maxImages)
        resetFileInput()
        return
      }

      const optimizedImages: File[] = []

      try {
        setIsUploading(true)

        for (const file of Array.from(files)) {
          if (images.length + optimizedImages.length >= maxImages) {
            break
          }

          optimizedImages.push(await optimizeUploadImage(file))
        }

        onImagesChange([...images, ...optimizedImages])
      } catch (error) {
        onUploadError?.(error)
      } finally {
        setIsUploading(false)
        resetFileInput()
      }
    },
    [images, maxImages, onImagesChange, onLimitExceeded, onUploadError, resetFileInput],
  )

  const handleRemoveImage = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length) {
        return
      }

      const nextImages = [...images]
      nextImages.splice(index, 1)
      onImagesChange(nextImages)
    },
    [images, onImagesChange],
  )

  return {
    fileInputRef,
    isUploading,
    handleImageClick,
    handleImageUpload,
    handleRemoveImage,
  }
}
