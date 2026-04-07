import EXIF from "exif-js";
import heic2any from "heic2any";

const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const HEIC_EXTENSION_REGEX = /\.heic$/i;
const JPEG_MIME_TYPE = "image/jpeg";

interface CompressImageOptions {
  maxWidth?: number;
  quality?: number;
}

interface OptimizeImageOptions extends CompressImageOptions {
  compressAboveBytes?: number;
}

export const isMobileDevice = () => {
  return MOBILE_DEVICE_REGEX.test(navigator.userAgent);
};

const isHeicFile = (file: File) => file.type.includes("heic") || HEIC_EXTENSION_REGEX.test(file.name);

const createJpegFile = (blob: Blob, file: File, fileName = file.name.replace(HEIC_EXTENSION_REGEX, ".jpg")) => {
  return new File([blob], fileName, {
    type: JPEG_MIME_TYPE,
    lastModified: file.lastModified || Date.now(),
  });
};

export const compressImage = async (file: File, options: CompressImageOptions = {}): Promise<File> => {
  const { maxWidth = 800, quality = 0.8 } = options;

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const ratio = Math.min(1, maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          resolve(
            new File([blob], file.name, {
              type: JPEG_MIME_TYPE,
              lastModified: Date.now(),
            }),
          );
        },
        JPEG_MIME_TYPE,
        quality,
      );
    };

    img.src = objectUrl;
  });
};

export const convertHeicToJpeg = async (file: File): Promise<File> => {
  if (!isHeicFile(file)) {
    return file;
  }

  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: JPEG_MIME_TYPE,
      quality: 0.9,
    });

    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    return createJpegFile(blob, file, file.name.replace(HEIC_EXTENSION_REGEX, ".jpg"));
  } catch (error) {
    const conversionError = new Error("HEIC 파일 변환에 실패했습니다.");
    Object.assign(conversionError, { cause: error });
    throw conversionError;
  }
};

export const optimizeUploadImage = async (file: File, options: OptimizeImageOptions = {}) => {
  const { compressAboveBytes = 1024 * 1024, maxWidth = 800, quality = 0.8 } = options;

  let optimizedFile = await convertHeicToJpeg(file);

  if (optimizedFile.size > compressAboveBytes) {
    optimizedFile = await compressImage(optimizedFile, { maxWidth, quality });
  }

  return optimizedFile;
};

export const correctImageOrientation = async (file: File): Promise<File> => {
  const normalizedFile = isHeicFile(file) ? await convertHeicToJpeg(file) : file;

  if (normalizedFile !== file) {
    return correctImageOrientation(normalizedFile);
  }

  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      EXIF.getData(img as never, function onExif(this: Record<string, unknown>) {
        const orientation = (EXIF.getTag(this as never, "Orientation") as number) || 1;
        let width = img.width;
        let height = img.height;

        if (orientation > 4) {
          [width, height] = [height, width];
        }

        canvas.width = width;
        canvas.height = height;

        ctx.save();

        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, width, height);
            break;
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, height, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, height, width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, width);
            break;
          default:
            break;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            resolve(
              new File([blob], normalizedFile.name, {
                type: JPEG_MIME_TYPE,
                lastModified: normalizedFile.lastModified,
              }),
            );
          },
          JPEG_MIME_TYPE,
          0.95,
        );
      });
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(normalizedFile);
  });
};
