interface TextMatchParams {
  query: string
  target: string
}

/**
 * 대소문자 무시 첫 일치 구간을 기준으로 원문을 앞/일치/뒤 3구간으로 나눈다.
 * 자동완성 제안에서 일치 부분만 강조할 때 원문 순서를 유지한 채(제자리) 렌더링하기 위한 형태.
 * 일치가 없으면 전체가 before로 온다 — 소비처는 match만 강조하면 된다.
 */
export const getTextMatchParts = ({ query, target }: TextMatchParams) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return { before: target, match: '', after: '' }
  }

  const startIndex = target.toLowerCase().indexOf(normalizedQuery)

  if (startIndex === -1) {
    return { before: target, match: '', after: '' }
  }

  return {
    before: target.slice(0, startIndex),
    match: target.slice(startIndex, startIndex + normalizedQuery.length),
    after: target.slice(startIndex + normalizedQuery.length),
  }
}
