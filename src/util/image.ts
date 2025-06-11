import EXIF from 'exif-js';

/**
 * 이미지 파일의 EXIF 방향 정보를 보정하여 올바른 방향으로 회전된 파일을 반환합니다.
 */
export const correctImageOrientation = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
  
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EXIF.getData(img as any, function(this: { [key: string]: any }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const orientation = EXIF.getTag(this as any, 'Orientation') || 1;
          
          let width = img.width;
          let height = img.height;
  
          // 회전이 필요한 방향인 경우 캔버스 크기 조정
          if (orientation > 4) {
            [width, height] = [height, width];
          }
          
          canvas.width = width;
          canvas.height = height;
  
          // 방향에 따른 적절한 변환 적용
          ctx.save();
          switch (orientation) {
            case 2: // 좌우 반전
              ctx.transform(-1, 0, 0, 1, width, 0);
              break;
            case 3: // 180도 회전
              ctx.transform(-1, 0, 0, -1, width, height);
              break;
            case 4: // 상하 반전
              ctx.transform(1, 0, 0, -1, 0, height);
              break;
            case 5: // 좌우 반전 후 90도 회전
              ctx.transform(0, 1, 1, 0, 0, 0);
              break;
            case 6: // 90도 회전
              ctx.transform(0, 1, -1, 0, height, 0);
              break;
            case 7: // 좌우 반전 후 -90도 회전
              ctx.transform(0, -1, -1, 0, height, width);
              break;
            case 8: // -90도 회전
              ctx.transform(0, -1, 1, 0, 0, width);
              break;
            default: // 기본값 (1)
              break;
          }
  
          // 이미지 그리기
          ctx.drawImage(img, 0, 0, img.width, img.height);
          ctx.restore();
  
          // Canvas를 Blob으로 변환
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Blob을 File로 변환
            const correctedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: file.lastModified,
            });
            resolve(correctedFile);
          }, 'image/jpeg', 0.95);
        });
      };
  
      // 이미지 로드
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  };
  