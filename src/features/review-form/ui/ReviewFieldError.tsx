import render from '@/shared/ui/render'

/**
 * 리뷰 폼 검증 에러문구.
 * 세 섹션(별점/메뉴/리뷰)에서 공유하며, 항상 입력필드 바로 위에 타이트하게 배치한다.
 */
export const ReviewFieldError = render.div('font-12-r text-red')
