import EXIF from "exif-js";

// 이미지 방향 보정 함수 (기존 util/image.ts에서 가져옴)
export const correctImageOrientation = async (file: File): Promise<File> => {
  // HEIC 파일 처리
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    // heic2any로 JPEG 변환
    const heic2any = (await import("heic2any")).default;
    const convertedBlob = (await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.95,
    })) as Blob;
    // 변환된 Blob을 File로 변환
    const jpegFile = new File(
      [convertedBlob],
      file.name.replace(/\.heic$/i, ".jpg"),
      {
        type: "image/jpeg",
        lastModified: file.lastModified,
      }
    );
    // JPEG 변환 후, 아래의 orientation 보정 로직 재귀 호출
    return correctImageOrientation(jpegFile);
  }

  // JPG/JPEG/PNG 등 기존 로직
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      EXIF.getData(img as any, function (this: { [key: string]: any }) {
        const orientation = EXIF.getTag(this as any, "Orientation") || 1;
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
            const correctedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: file.lastModified,
            });
            resolve(correctedFile);
          },
          "image/jpeg",
          0.95
        );
      });
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  });
};

// 이미지 압축 및 리사이징 함수
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // 비율 유지하면서 리사이징
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // 모바일에서 성능 향상을 위한 최적화 설정
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality,
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// HEIC 파일을 JPEG로 변환하는 함수 (단순 변환용, 방향 보정은 correctImageOrientation 사용)
export const convertHeicToJpeg = async (file: File): Promise<File> => {
  // HEIC 파일이 아닌 경우 그대로 반환
  if (!file.type.includes("heic") && !file.name.toLowerCase().endsWith(".heic")) {
    return file;
  }

  try {
    // 동적 import로 heic2any 로드 (필요한 경우에만)
    const heic2any = (await import("heic2any")).default;

    // heic2any를 사용하여 HEIC를 JPEG로 변환
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    // 파일명에서 .heic 확장자를 .jpg로 변경
    const fileName = file.name.replace(/\.heic$/i, ".jpg");

    // Blob을 File로 변환
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    const convertedFile = new File([blob], fileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    return convertedFile;
  } catch (error) {
    console.error("HEIC 변환 실패:", error);
    throw new Error("HEIC 파일 변환에 실패했습니다.");
  }
};

// 모바일 디바이스 감지 함수
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 이미지 파일을 Base64 문자열로 변환하는 함수 (react-hook-form용)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 다중 파일을 Base64로 변환하는 함수
export const filesToBase64 = async (files: File[]): Promise<string[]> => {
  const promises = files.map(file => fileToBase64(file));
  return Promise.all(promises);
};

// 이미지 검증 함수
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // 파일 크기 제한 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: "파일 크기가 10MB를 초과합니다." };
  }

  // 지원하는 파일 형식
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return { isValid: false, error: "지원하지 않는 파일 형식입니다." };
  }

  return { isValid: true };
};
