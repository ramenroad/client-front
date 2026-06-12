import { useNavigate } from 'react-router-dom'
import { useMyInfoQuery } from '@/entities/viewer/api'
import { useAuthSession } from '@/entities/session/model'
import { openUrl } from '@/shared/lib/browser'
import { useToast } from '@/shared/ui/toast'

const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeUSPlPBD_EEePZwNbeqlwnCup81c0i5LK_57ZgrxKunIvgnQ/viewform?usp=send_form'

export const useMyProfilePage = () => {
  const navigate = useNavigate()
  const authSession = useAuthSession()
  const { openToast } = useToast()
  const myInfoQuery = useMyInfoQuery({ enabled: authSession.isSignIn })
  const profile = myInfoQuery.data
  const isAuthError = myInfoQuery.error?.status === 401
  const isSignedIn = authSession.isSignIn && !isAuthError

  return {
    profile,
    isSignedIn,
    isLoading: isSignedIn && myInfoQuery.isLoading,
    isError: isSignedIn && myInfoQuery.isError && !isAuthError,
    handleProfileClick: () => navigate('/information'),
    handleLoginClick: () => navigate('/login'),
    handleActivityClick: (tab: 'review' | 'post' | 'comment') => navigate(`/my-activity?tab=${tab}`),
    handleSearchClick: () => navigate('/my-search'),
    handleFeedbackClick: () => openUrl(FEEDBACK_FORM_URL),
    // 아직 클라이언트 라우트/기능이 없는 메뉴는 안내 토스트로 대체.
    handleNotReady: () => openToast('준비 중인 기능입니다.'),
  }
}
