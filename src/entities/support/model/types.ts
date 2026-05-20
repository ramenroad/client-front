import type { Id, ISODateString } from '@/shared/model'

export type NoticeType = '공지사항' | '패치노트' | '약관' | string

export type Notice = {
  _id: Id
  type: NoticeType
  title: string
  url: string
  createdAt: ISODateString
}

export type NoticeDetail = Notice & {
  body: string
}
