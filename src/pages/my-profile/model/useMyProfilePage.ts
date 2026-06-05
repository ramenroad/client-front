import { useNavigate } from 'react-router-dom'
import { useMyInfoQuery } from '@/entities/viewer/api'
import { useAuthSession } from '@/entities/session/model'

export const useMyProfilePage = () => {
  const navigate = useNavigate()
  const authSession = useAuthSession()
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
    handleReviewClick: () => {
      if (profile?._id) {
        navigate(`/user-review/${profile._id}`)
      }
    },
  }
}
