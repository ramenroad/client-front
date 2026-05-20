const EXTERNAL_URL_PATTERN = /^https?:\/\//i

export const isExternalUrl = (url: string) => EXTERNAL_URL_PATTERN.test(url)

export const openUrl = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
