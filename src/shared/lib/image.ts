const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
const JPEG_MIME_TYPE = 'image/jpeg'

type CompressImageOptions = {
  maxWidth?: number
  quality?: number
}

type OptimizeImageOptions = CompressImageOptions & {
  compressAboveBytes?: number
}

export const isMobileDevice = () => MOBILE_DEVICE_REGEX.test(navigator.userAgent)

const createCompressedFile = (blob: Blob, file: File) => {
  const normalizedName = file.name.replace(/\.[^.]+$/, '.jpg')

  return new File([blob], normalizedName, {
    type: JPEG_MIME_TYPE,
    lastModified: Date.now(),
  })
}

export const compressImage = async (file: File, options: CompressImageOptions = {}): Promise<File> => {
  const { maxWidth = 800, quality = 0.8 } = options

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const ratio = Math.min(1, maxWidth / image.width, maxWidth / image.height)
      canvas.width = image.width * ratio
      canvas.height = image.height * ratio

      if (context) {
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'medium'
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
      }

      canvas.toBlob(
        (blob) => {
          resolve(blob ? createCompressedFile(blob, file) : file)
        },
        JPEG_MIME_TYPE,
        quality,
      )
    }

    image.src = objectUrl
  })
}

export const optimizeUploadImage = async (file: File, options: OptimizeImageOptions = {}) => {
  const { compressAboveBytes = 1024 * 1024, maxWidth = 800, quality = 0.8 } = options

  if (file.size <= compressAboveBytes) {
    return file
  }

  return compressImage(file, { maxWidth, quality })
}
