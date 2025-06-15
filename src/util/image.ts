import EXIF from "exif-js";
import heic2any from "heic2any";

export const correctImageOrientation = async (file: File): Promise<File> => {
  // HEIC 파일 처리
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    // heic2any로 JPEG 변환
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
