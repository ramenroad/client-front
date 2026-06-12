import { useEffect, useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  communityQueryKeys,
  useAddCommunityBoardLikeMutation,
  useAddCommunityCommentLikeMutation,
  useCommunityBoardDetailQuery,
  useCommunityCommentsQuery,
  useCreateCommunityCommentMutation,
  useDeleteCommunityBoardLikeMutation,
  useDeleteCommunityBoardMutation,
  useDeleteCommunityCommentLikeMutation,
  useDeleteCommunityCommentMutation,
  useUpdateCommunityCommentMutation,
} from '@/entities/community/api'
import type { CommunityCommentNode } from '@/entities/community/model'
import { useAuthSession } from '@/entities/session/model'
import { useMyInfoQuery } from '@/entities/viewer/api'
import { useToast } from '@/shared/ui/toast'

type ShareType = 'kakao' | 'url' | 'more'

type KakaoShareApi = {
  isInitialized: () => boolean
  init: (appKey: string) => void
  Share: {
    sendDefault: (payload: {
      objectType: string
      content: { title: string; description: string; link: { mobileWebUrl: string; webUrl: string } }
    }) => void
  }
}

const getKakaoApi = () => (window as Window & { Kakao?: KakaoShareApi }).Kakao

export const useCommunityDetailPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isSignIn } = useAuthSession()
  const { openToast } = useToast()

  const boardQuery = useCommunityBoardDetailQuery(id)
  const commentsQuery = useCommunityCommentsQuery(id)
  const myInfoQuery = useMyInfoQuery({ enabled: isSignIn })
  const myId = myInfoQuery.data?._id ?? ''

  const [commentInput, setCommentInput] = useState('')
  const [replyTarget, setReplyTarget] = useState<{ commentId: string; nickname: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string
    message: string
    confirmText: string
    onConfirm: () => void
  } | null>(null)
  const closeConfirmDialog = () => setConfirmDialog(null)
  const runConfirmDialog = () => {
    confirmDialog?.onConfirm()
    setConfirmDialog(null)
  }

  const addBoardLike = useAddCommunityBoardLikeMutation()
  const deleteBoardLike = useDeleteCommunityBoardLikeMutation()
  const deleteBoard = useDeleteCommunityBoardMutation()
  const createComment = useCreateCommunityCommentMutation()
  const updateComment = useUpdateCommunityCommentMutation()
  const deleteComment = useDeleteCommunityCommentMutation()
  const addCommentLike = useAddCommunityCommentLikeMutation()
  const deleteCommentLike = useDeleteCommunityCommentLikeMutation()

  const invalidateBoard = () =>
    queryClient.invalidateQueries({ queryKey: communityQueryKeys.boardDetail(id) })
  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: communityQueryKeys.comments(id) })

  const requireSignIn = () => {
    if (isSignIn) {
      return true
    }
    setConfirmDialog({
      title: '로그인이 필요해요',
      message: '로그인 하시겠습니까?',
      confirmText: '확인',
      onConfirm: () => navigate('/login'),
    })
    return false
  }

  // 카카오 공유 SDK 초기화 (user-reviews 공유 방식과 동일)
  useEffect(() => {
    const kakao = getKakaoApi()
    const appKey = import.meta.env.VITE_KAKAO_APP_KEY

    if (kakao && appKey && !kakao.isInitialized()) {
      kakao.init(appKey)
    }
  }, [])

  const board = boardQuery.data
  const isBoardLiked = Boolean(myId) && Boolean(board?.likeUserIds.includes(myId))
  const isMyBoard = Boolean(myId) && board?.userId?._id === myId

  const handleToggleBoardLike = () => {
    if (!board || !requireSignIn()) {
      return
    }
    const mutation = isBoardLiked ? deleteBoardLike : addBoardLike
    mutation.mutate(id, { onSuccess: invalidateBoard })
  }

  const handleDeleteBoard = () => {
    setConfirmDialog({
      title: '게시물 삭제',
      message: '정말 삭제하시겠어요?',
      confirmText: '삭제',
      onConfirm: () => {
        deleteBoard.mutate(id, {
          onSuccess: () => {
            openToast('게시글을 삭제했어요.')
            navigate(-1)
          },
          onError: () => openToast('게시글 삭제에 실패했어요.'),
        })
      },
    })
  }

  // 저장/신고는 서버 API(interaction)가 아직 없어 안내만 노출하는 placeholder.
  const handleSaveBoard = () => openToast('준비 중인 기능이에요.')
  const handleReportBoard = () => openToast('준비 중인 기능이에요.')
  const handleReportComment = () => openToast('준비 중인 기능이에요.')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
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
      title: '라이징',
      text: board?.title ?? '라이징 커뮤니티 게시글을 확인해보세요!',
      url: window.location.href,
    })
  }

  const handleShareKakao = () => {
    const kakao = getKakaoApi()
    if (!kakao?.isInitialized()) {
      openToast('카카오 공유를 사용할 수 없습니다.')
      return
    }
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: board?.title ?? '라이징',
        description: board?.body ?? '',
        link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
      },
    })
  }

  const handleShare = async (type: ShareType) => {
    if (type === 'kakao') {
      handleShareKakao()
    } else if (type === 'url') {
      await handleCopyLink()
    } else {
      await handleShareMore()
    }
    setIsSharePopupOpen(false)
  }

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = commentInput.trim()
    if (!body || !requireSignIn()) {
      return
    }
    createComment.mutate(
      { boardId: id, data: replyTarget ? { body, parentCommentId: replyTarget.commentId } : { body } },
      {
        onSuccess: () => {
          setCommentInput('')
          setReplyTarget(null)
          invalidateComments()
          invalidateBoard()
        },
        onError: () => openToast('댓글 등록에 실패했어요.'),
      },
    )
  }

  const handleToggleCommentLike = (comment: CommunityCommentNode) => {
    if (!requireSignIn()) {
      return
    }
    const liked = comment.likeUserIds.includes(myId)
    const mutation = liked ? deleteCommentLike : addCommentLike
    mutation.mutate({ boardId: id, commentId: comment._id }, { onSuccess: invalidateComments })
  }

  const handleStartReply = (comment: CommunityCommentNode) => {
    if (!requireSignIn()) {
      return
    }
    setReplyTarget({ commentId: comment._id, nickname: comment.userId?.nickname ?? '사용자' })
  }

  const handleStartEdit = (comment: CommunityCommentNode) => {
    setEditingId(comment._id)
    setEditingValue(comment.body)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingValue('')
  }

  const handleSubmitEdit = () => {
    const body = editingValue.trim()
    if (!body || !editingId) {
      return
    }
    updateComment.mutate(
      { boardId: id, commentId: editingId, data: { body } },
      {
        onSuccess: () => {
          handleCancelEdit()
          invalidateComments()
        },
        onError: () => openToast('댓글 수정에 실패했어요.'),
      },
    )
  }

  const handleDeleteComment = (commentId: string) => {
    setConfirmDialog({
      title: '댓글 삭제',
      message: '정말 삭제하시겠어요?',
      confirmText: '삭제',
      onConfirm: () => {
        deleteComment.mutate(
          { boardId: id, commentId },
          {
            onSuccess: () => {
              invalidateComments()
              invalidateBoard()
            },
            onError: () => openToast('댓글 삭제에 실패했어요.'),
          },
        )
      },
    })
  }

  return {
    board,
    isLoading: boardQuery.isLoading,
    isError: boardQuery.isError,
    comments: commentsQuery.data ?? [],
    myId,
    isBoardLiked,
    isMyBoard,
    commentInput,
    onCommentInputChange: setCommentInput,
    replyTarget,
    onCancelReply: () => setReplyTarget(null),
    editingId,
    editingValue,
    onEditingValueChange: setEditingValue,
    isSubmittingComment: createComment.isPending,
    isSharePopupOpen,
    onOpenShare: () => setIsSharePopupOpen(true),
    onCloseShare: () => setIsSharePopupOpen(false),
    onShare: handleShare,
    confirmDialog,
    onCloseConfirmDialog: closeConfirmDialog,
    onConfirmDialog: runConfirmDialog,
    onToggleBoardLike: handleToggleBoardLike,
    onDeleteBoard: handleDeleteBoard,
    onSaveBoard: handleSaveBoard,
    onReportBoard: handleReportBoard,
    onReportComment: handleReportComment,
    onSubmitComment: handleSubmitComment,
    onToggleCommentLike: handleToggleCommentLike,
    onStartReply: handleStartReply,
    onStartEdit: handleStartEdit,
    onSubmitEdit: handleSubmitEdit,
    onCancelEdit: handleCancelEdit,
    onDeleteComment: handleDeleteComment,
    onBack: () => navigate(-1),
  }
}
