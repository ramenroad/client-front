import { useState } from 'react'
import { useToast } from '@/shared/ui/toast'
import { ensureKakaoInitialized } from './kakao-sdk'

export type ShareType = 'kakao' | 'url' | 'more'

export type ShareContent = {
  /** 카카오/네이티브 공유 제목 */
  title: string
  /** 카카오 공유 설명 */
  description?: string
  /** 공유할 URL. 기본값은 현재 페이지 주소. */
  url?: string
  /** 네이티브 공유(navigator.share) 본문. 기본값은 description. */
  text?: string
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

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: content.title,
        description: content.description ?? '',
        link: {
          mobileWebUrl: getUrl(),
          webUrl: getUrl(),
        },
      },
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
