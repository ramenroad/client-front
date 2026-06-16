import { useState } from 'react'
import { BridgeMethods, has, invoke } from '@/shared/bridge'
import { createSiteUrl, DEFAULT_SHARE_IMAGE_URL } from '@/shared/config'
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

  const getCurrentPath = () => `${window.location.pathname}${window.location.search}${window.location.hash}`
  const getUrl = () => createSiteUrl(content.url ?? getCurrentPath())

  const handleCopyLink = async () => {
    const url = getUrl()
    try {
      // 앱: 네이티브 clipboard.write(§2.8.3). WebView는 비보안 컨텍스트라 navigator.clipboard가 거부되므로 브리지 우선.
      if (has(BridgeMethods.clipboardWrite)) {
        await invoke(BridgeMethods.clipboardWrite, { text: url })
      } else {
        await navigator.clipboard.writeText(url)
      }
      openToast('주소가 복사되었습니다')
    } catch {
      openToast('주소 복사에 실패했습니다.', undefined, 'error')
    }
  }

  const handleShareMore = async () => {
    // 앱: 네이티브 공유 시트(share.open). WebView에선 navigator.share가 동작 안 할 수 있어 브리지를 우선한다.
    if (has(BridgeMethods.shareOpen)) {
      try {
        await invoke(BridgeMethods.shareOpen, {
          title: content.title,
          text: content.text ?? content.description ?? '',
          url: getUrl(),
        })
      } catch (error) {
        // 취소(E_CANCELLED)·시트를 오래 열어둬 발생한 타임아웃(E_TIMEOUT)은 실패가 아니므로 무시한다.
        const code = (error as { code?: string } | null)?.code
        if (code !== 'E_CANCELLED' && code !== 'E_TIMEOUT') {
          openToast('공유를 완료하지 못했습니다.', undefined, 'error')
        }
      }
      return
    }

    if (!navigator.share) {
      openToast('공유 기능을 지원하지 않는 브라우저입니다', undefined, 'error')
      return
    }

    await navigator.share({
      title: content.title,
      text: content.text ?? content.description ?? '',
      url: getUrl(),
    })
  }

  const handleShareKakao = async () => {
    // 카카오 카드 이미지(절대 URL). 없으면 서비스 기본 OG 이미지로 폴백.
    // 카카오 이미지 스크래퍼는 비ASCII가 인코딩 안 돼 있으면 못 가져오므로 encodeURI로 감싼다(이미 인코딩된 URL엔 무해).
    const imageUrl = encodeURI(content.imageUrl || DEFAULT_SHARE_IMAGE_URL)

    // 앱: 네이티브 카카오 SDK 피드 공유(리치 카드). App.tsx의 KAKAO_NATIVE_APP_KEY 설정 + 카카오 콘솔 등록 + 재빌드가 선행돼야 동작한다.
    if (has(BridgeMethods.kakaoShare)) {
      try {
        await invoke(BridgeMethods.kakaoShare, {
          title: content.title,
          description: content.description ?? '',
          imageUrl,
          url: getUrl(),
          buttonTitle: content.buttonTitle ?? '라이징에서 보기',
        })
      } catch (error) {
        // 취소·타임아웃은 실패가 아니므로 무시한다. 그 외엔 네이티브 사유를 그대로 노출해 설정 문제를 진단할 수 있게 한다.
        const e = error as { code?: string; message?: string } | null
        if (e?.code !== 'E_CANCELLED' && e?.code !== 'E_TIMEOUT') {
          openToast(e?.message || '공유를 완료하지 못했습니다.', undefined, 'error')
        }
      }
      return
    }

    const kakao = await ensureKakaoInitialized()

    if (!kakao?.Share) {
      openToast('카카오 공유를 사용할 수 없습니다.', undefined, 'error')
      return
    }

    const link = {
      mobileWebUrl: getUrl(),
      webUrl: getUrl(),
    }
    const usingDefaultImage = !content.imageUrl

    // 트위터 summary_large_image와 유사한 리치 카드: 대표 이미지 + 제목 + 설명 + CTA 버튼 (imageUrl은 위에서 계산)
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

      openToast('공유를 완료하지 못했습니다.', undefined, 'error')
    }
  }

  return {
    isShareOpen,
    openShare: () => setIsShareOpen(true),
    closeShare: () => setIsShareOpen(false),
    handleShare,
  }
}
