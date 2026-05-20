import type { Id, ISODateString } from '@/shared/model'

export type MenuBoard = {
  _id: Id
  userId: {
    _id: Id
    nickname: string
    profileImageUrl: string
  }
  imageUrl: string
  description: string
  isApproved: boolean
  createdAt: ISODateString
}

export type UploadMenuBoardRequest = {
  ramenyaId: string
  menuBoardImages: File[]
  description?: string
}

export type DeleteMenuBoardRequest = {
  ramenyaId: string
  menuBoardId: string
}
