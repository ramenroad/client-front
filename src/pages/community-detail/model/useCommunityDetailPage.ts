import { useState, type FormEvent } from 'react'
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
import { useShare } from '@/shared/lib/useShare'
import { useToast } from '@/shared/ui/toast'

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
  const share = useShare({
    title: boardQuery.data?.title ?? '라이징',
    description: boardQuery.data?.body ?? '',
    text: boardQuery.data?.title ?? '라이징 커뮤니티 게시글을 확인해보세요!',
    imageUrl: boardQuery.data?.ImageUrls?.[0],
    buttonTitle: '게시글 보러가기',
  })
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

  const board = boardQuery.data
  const isBoardLiked = Boolean(board?.isLiked)
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

  // 공유 후에는 팝업을 닫는 기존 동작을 유지한다.
  const handleShare = async (type: Parameters<typeof share.handleShare>[0]) => {
    await share.handleShare(type)
    share.closeShare()
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
    const liked = comment.isLiked
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
    isSharePopupOpen: share.isShareOpen,
    onOpenShare: share.openShare,
    onCloseShare: share.closeShare,
    onShare: handleShare,
    confirmDialog,
    onCloseConfirmDialog: closeConfirmDialog,
    onConfirmDialog: runConfirmDialog,
    onToggleBoardLike: handleToggleBoardLike,
    onEditBoard: () => navigate(`/community/write/${id}`),
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
    onProfileClick: (userId: string) => navigate(`/user-review/${userId}`),
    onBack: () => navigate(-1),
  }
}
