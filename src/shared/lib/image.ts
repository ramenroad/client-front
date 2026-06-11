import heic2any from 'heic2any'

const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
const HEIC_EXTENSION_REGEX = /\.heic$/i
const JPEG_MIME_TYPE = 'image/jpeg'

type CompressImageOptions = {
  maxWidth?: number
  quality?: number
}

type OptimizeImageOptions = CompressImageOptions & {
  compressAboveBytes?: number
}

export const isMobileDevice = () => MOBILE_DEVICE_REGEX.test(navigator.userAgent)

const isHeicFile = (file: File) => file.type.includes('heic') || HEIC_EXTENSION_REGEX.test(file.name)

export const convertHeicToJpeg = async (file: File): Promise<File> => {
  if (!isHeicFile(file)) {
    return file
  }

  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: JPEG_MIME_TYPE,
      quality: 0.9,
    })

    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
    const normalizedName = file.name.replace(HEIC_EXTENSION_REGEX, '.jpg')

    return new File([blob], normalizedName, {
      type: JPEG_MIME_TYPE,
      lastModified: file.lastModified || Date.now(),
    })
  } catch (error) {
    const conversionError = new Error('HEIC 파일 변환에 실패했습니다.')
    Object.assign(conversionError, { cause: error })
    throw conversionError
  }
}

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

  const normalizedFile = await convertHeicToJpeg(file)

  if (normalizedFile.size <= compressAboveBytes) {
    return normalizedFile
  }

  return compressImage(normalizedFile, { maxWidth, quality })
}
