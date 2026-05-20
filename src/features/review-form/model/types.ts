export type ReviewFormMode = 'create' | 'edit'

export type ReviewFormImage = File | string

export type ReviewFormValues = {
  ramenyaId: string
  rating: number
  review: string
  menus: string
  reviewImages: ReviewFormImage[]
}

export type ReviewFormPageCopy = {
  title: string
  submit: string
  submitting: string
  successToast: string
  errorToast: string
  backConfirmText: string
}
