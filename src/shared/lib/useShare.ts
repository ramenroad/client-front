import { useState } from 'react'
import { useToast } from '@/shared/ui/toast'
import { ensureKakaoInitialized } from './kakao-sdk'

export type ShareType = 'kakao' | 'url' | 'more'

// index.html의 og:image와 동일. 콘텐츠 대표 이미지가 없을 때 트위터 카드처럼 보이도록 폴백으로 쓴다.
const DEFAULT_SHARE_IMAGE_URL = 'https://ra-ising.com/og-image.png'

export type ShareContent = {
  /** 카카오/네이티브 공유 제목 */
  title: string
  /** 카카오 공유 설명 */
  description?: string
  /** 공유할 URL. 기본값은 현재 페이지 주소. */
  url?: string
  /** 네이티브 공유(navigator.share) 본문. 기본값은 description. */
  text?: string
  /** 카카오 카드 대표 이미지(절대 URL). 없으면 서비스 기본 OG 이미지로 폴백. */
  imageUrl?: string
  /** 카카오 카드 하단 버튼 문구. 기본값은 '라이징에서 보기'. */
  buttonTitle?: string
}

/**
 * 공유 팝업 상태 + 카카오/URL복사/더보기 공유 핸들러를 묶어 제공한다.
 * 카카오 SDK 초기화는 ensureKakaoInitialized로 일원화한다.
 */
export const useShare = (content: ShareContent) => {
  const { openToast } = useToast()
  const [isShareOpen, setIsShareOpen] = useState(false)

  const getUrl = () => content.url ?? window.location.href

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      openToast('주소가 복사되었습니다')
    } catch {
      openToast('주소 복사에 실패했습니다.')
    }
  }

  const handleShareMore = async () => {
    if (!navigator.share) {
      openToast('공유 기능을 지원하지 않는 브라우저입니다')
      return
    }

    await navigator.share({
      title: content.title,
      text: content.text ?? content.description ?? '',
      url: getUrl(),
    })
  }

  const handleShareKakao = async () => {
    const kakao = await ensureKakaoInitialized()

    if (!kakao?.Share) {
      openToast('카카오 공유를 사용할 수 없습니다.')
      return
    }

    const link = {
      mobileWebUrl: getUrl(),
      webUrl: getUrl(),
    }
    const usingDefaultImage = !content.imageUrl
    // 카카오 이미지 스크래퍼는 URL에 인코딩 안 된 한글 등 비ASCII가 있으면 이미지를 못 가져온다.
    // encodeURI로 감싸 안전하게 만든다(이미 인코딩된 URL에는 영향 없음).
    const imageUrl = encodeURI(content.imageUrl || DEFAULT_SHARE_IMAGE_URL)

    // 트위터 summary_large_image와 유사한 리치 카드: 대표 이미지 + 제목 + 설명 + CTA 버튼
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: content.title,
        description: content.description ?? '',
        imageUrl,
        // 기본 OG 이미지는 1200x630(와이드)이라 큰 이미지 카드로 보이도록 크기를 명시한다.
        ...(usingDefaultImage ? { imageWidth: 1200, imageHeight: 630 } : {}),
        link,
      },
      buttons: [
        {
          title: content.buttonTitle ?? '라이징에서 보기',
          link,
        },
      ],
    })
  }

  const handleShare = async (type: ShareType) => {
    if (type === 'kakao') {
      await handleShareKakao()
      return
    }

    if (type === 'url') {
      await handleCopyLink()
      return
    }

    try {
      await handleShareMore()
    } catch (error) {
      // 사용자가 네이티브 공유 시트를 닫으면 AbortError가 발생하는데, 취소는 실패가 아니므로 무시한다.
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      openToast('공유를 완료하지 못했습니다.')
    }
  }

  return {
    isShareOpen,
    openShare: () => setIsShareOpen(true),
    closeShare: () => setIsShareOpen(false),
    handleShare,
  }
}
