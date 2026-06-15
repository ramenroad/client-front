export const SITE_ORIGIN = 'https://ra-ising.com'

export function createSiteUrl(pathOrUrl = '/') {
  const url = new URL(pathOrUrl, SITE_ORIGIN)

  return `${SITE_ORIGIN}${url.pathname}${url.search}${url.hash}`
}

export const DEFAULT_SHARE_IMAGE_URL = createSiteUrl('/og-image.png')
