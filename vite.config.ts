import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // LAN/실기기 접근 허용 (192.168.x.x:5173)
    proxy: {
      // dev: 프론트는 로컬, /api 요청만 실서버로 중계 → 페이지 입장에선 동일 출처라 CORS 없음.
      '/api': {
        target: 'https://ra-ising.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '', // 실서버 쿠키 Domain 제거 → 로컬 호스트에 저장
      },
    },
  },
})
