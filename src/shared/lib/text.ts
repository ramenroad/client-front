interface TextMatchParams {
  query: string
  target: string
}

export const getTextMatch = ({ query, target }: TextMatchParams) => {
  if (!query) {
    return {
      matchedText: '',
      unMatchedText: target,
    }
  }

  const normalizedTarget = target.toLowerCase()
  const normalizedQuery = query.toLowerCase()
  const startIndex = normalizedTarget.indexOf(normalizedQuery)

  if (startIndex === -1) {
    return {
      matchedText: '',
      unMatchedText: target,
    }
  }

  return {
    matchedText: target.slice(startIndex, startIndex + query.length),
    unMatchedText: target.slice(0, startIndex) + target.slice(startIndex + query.length),
  }
}
