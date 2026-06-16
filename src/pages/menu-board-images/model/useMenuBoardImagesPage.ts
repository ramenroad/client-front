import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useDeleteMenuBoardMutation } from '@/entities/menu-board/api'
import { ramenyaQueryKeys, useRamenyaDetailQuery } from '@/entities/ramenya/api'
import { useMyInfoQuery } from '@/entities/viewer/api'
import { useAuthSession } from '@/entities/session/model'
import { useToast } from '@/shared/ui/toast'

export const useMenuBoardImagesPage = () => {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const authSession = useAuthSession()
  const detailQuery = useRamenyaDetailQuery(id)
  const myInfoQuery = useMyInfoQuery({ enabled: authSession.isSignIn })
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isRemoveMenuBoardModalOpen, setIsRemoveMenuBoardModalOpen] = useState(false)
  const menuBoards = useMemo(() => detailQuery.data?.menuBoard ?? [], [detailQuery.data?.menuBoard])
  const images = useMemo(() => menuBoards.map((menu) => menu.imageUrl), [menuBoards])
  const selectedMenuBoard = selectedImageIndex !== null ? menuBoards[selectedImageIndex] : undefined
  const deleteMenuBoardMutation = useDeleteMenuBoardMutation({
    onSuccess: () => {
      openToast('메뉴판 삭제 성공')
      queryClient.invalidateQueries({ queryKey: ramenyaQueryKeys.detail(id) })
      setSelectedImageIndex((currentIndex) => {
        if (currentIndex === null) {
          return null
        }

        return currentIndex === 0 ? 0 : currentIndex - 1
      })
      setIsRemoveMenuBoardModalOpen(false)
    },
    onError: () => {
      openToast('메뉴판 삭제에 실패했습니다.', undefined, 'error')
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRemoveMenuBoard = () => {
    if (!selectedMenuBoard || !id) {
      return
    }

    deleteMenuBoardMutation.mutate({ menuBoardId: selectedMenuBoard._id, ramenyaId: id })
  }

  return {
    title: detailQuery.data?.name ?? '메뉴판',
    images,
    menuBoards,
    selectedImageIndex,
    selectedMenuBoard,
    setSelectedImageIndex,
    isImagePopupOpen: selectedImageIndex !== null,
    closeImagePopup: () => setSelectedImageIndex(null),
    isRemoveMenuBoardModalOpen,
    openRemoveMenuBoardModal: () => setIsRemoveMenuBoardModalOpen(true),
    closeRemoveMenuBoardModal: () => setIsRemoveMenuBoardModalOpen(false),
    isRemovePending: deleteMenuBoardMutation.isPending,
    isMine: Boolean(selectedMenuBoard && myInfoQuery.data?._id === selectedMenuBoard.userId._id),
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    handleRemoveMenuBoard,
  }
}
