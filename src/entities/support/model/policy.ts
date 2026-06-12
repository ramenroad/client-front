import { EXTERNAL_LINKS } from '@/shared/config'

export interface PolicyItem {
  title: string
  url: string
}

// 약관 및 정책 목록 — 클릭 시 외부 문서(노션)로 이동한다.
// 약관 3종은 Footer와, 리뷰 작성 가이드는 리뷰 작성 페이지와 동일한 링크를 공유한다.
export const POLICY_ITEMS: PolicyItem[] = [
  { title: '서비스 이용 약관', url: EXTERNAL_LINKS.serviceTerms },
  { title: '개인정보 처리방침', url: EXTERNAL_LINKS.privacyPolicy },
  { title: '위치정보 이용약관', url: EXTERNAL_LINKS.locationPolicy },
  { title: '리뷰 작성 가이드', url: EXTERNAL_LINKS.reviewGuide },
]
