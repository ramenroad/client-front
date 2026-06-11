import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DIST_DIR = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.resolve(__dirname, '../dist')
const INDEX_HTML = path.join(DIST_DIR, 'index.html')
const PORT = Number(process.env.PORT) || 3000
const SITE_ORIGIN = 'https://ra-ising.com'
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`
const DEFAULT_DESCRIPTION = '검증된 다양한 국내외 라멘 맛집 정보를 만나보세요.'

// 빌드 산출물의 index.html을 템플릿으로 메모리 캐싱 (배포 단위로 고정)
const template = fs.readFileSync(INDEX_HTML, 'utf-8')

// 서버 런타임에서 사용할 API 주소. Dockerfile에서 VITE_API_URL을 runner ENV로 전달.
const API_BASE_URL = (process.env.VITE_API_URL || process.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const replaceMetaContent = (html, attr, key, value) => {
  const pattern = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  return html.replace(pattern, `$1${escapeHtml(value)}$2`)
}

// 매장 상세 정보로 OG/트위터 메타와 타이틀을 주입한 HTML을 생성한다.
export const buildDetailHtml = (detail, id) => {
  const title = detail.name || '라이징'
  const description = detail.address || detail.region || DEFAULT_DESCRIPTION
  const image = detail.thumbnailUrl || DEFAULT_OG_IMAGE
  const url = `${SITE_ORIGIN}/detail/${encodeURIComponent(id)}`

  let html = template

  // 기본 1200x630 고정 치수는 동적 썸네일과 맞지 않으므로 상세 페이지에서는 제거
  html = html.replace(/\s*<meta property="og:image:(?:width|height)"[^>]*>/g, '')

  html = replaceMetaContent(html, 'property', 'og:title', title)
  html = replaceMetaContent(html, 'property', 'og:description', description)
  html = replaceMetaContent(html, 'property', 'og:image', image)
  html = replaceMetaContent(html, 'property', 'og:image:alt', title)
  html = replaceMetaContent(html, 'property', 'og:url', url)
  html = replaceMetaContent(html, 'property', 'og:type', 'article')
  html = replaceMetaContent(html, 'name', 'twitter:title', title)
  html = replaceMetaContent(html, 'name', 'twitter:description', description)
  html = replaceMetaContent(html, 'name', 'twitter:image', image)
  html = replaceMetaContent(html, 'name', 'twitter:image:alt', title)
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)} - 라이징</title>`)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapeHtml(url)}$2`)

  return html
}

// 매장 상세 API 조회. 실패/지연 시 null을 반환해 기본 메타로 폴백한다.
const fetchRamenyaDetail = async (id) => {
  if (!API_BASE_URL) {
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)

  try {
    const response = await fetch(`${API_BASE_URL}/v1/ramenya/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })

    if (!response.ok) {
      return null
    }

    const detail = await response.json()

    // 예상 형태(name 보유)가 아니면 폴백
    return detail && typeof detail === 'object' && typeof detail.name === 'string' ? detail : null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

const sendHtml = (res, html) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(html)
}

export const createApp = () => {
  const app = express()

  // 매장 상세: 크롤러용 OG 메타 주입 (브라우저 탭 타이틀도 함께 보정)
  app.get('/detail/:id', async (req, res) => {
    const detail = await fetchRamenyaDetail(req.params.id)
    sendHtml(res, detail ? buildDetailHtml(detail, req.params.id) : template)
  })

  // 정적 자산 서빙 (index.html은 위/아래에서 직접 처리하므로 자동 인덱스 비활성화)
  app.use(express.static(DIST_DIR, { index: false }))

  // SPA fallback: 나머지 모든 경로는 기본 index.html
  app.get('*', (_req, res) => {
    sendHtml(res, template)
  })

  return app
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] || '').href

if (isMain) {
  createApp().listen(PORT, () => {
    console.log(`[server] listening on :${PORT} (api=${API_BASE_URL || 'unset'})`)
  })
}
