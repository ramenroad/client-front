export const formatShortDate = (date?: string) => {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const year = String(parsedDate.getFullYear()).slice(-2)
  const month = parsedDate.getMonth() + 1
  const day = String(parsedDate.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

export const getReviewCreatedTime = (createdAt?: string) => {
  return createdAt ? new Date(createdAt).getTime() : 0
}

export const formatFullDate = (date?: string) => {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}
