# 빌드 단계
FROM node:20-alpine AS builder

WORKDIR /app

# Vite 빌드 시점에 번들로 인라인되는 환경 변수 (deploy.yml의 build-args로 주입)
ARG VITE_API_URL
ARG VITE_KAKAO_APP_KEY
ARG VITE_KAKAO_CLIENT_ID
ARG VITE_NAVER_CLIENT_ID
ARG VITE_NAVER_MAP_CLIENT_ID
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_APPLE_CLIENT_ID

ENV VITE_API_URL=$VITE_API_URL \
    VITE_KAKAO_APP_KEY=$VITE_KAKAO_APP_KEY \
    VITE_KAKAO_CLIENT_ID=$VITE_KAKAO_CLIENT_ID \
    VITE_NAVER_CLIENT_ID=$VITE_NAVER_CLIENT_ID \
    VITE_NAVER_MAP_CLIENT_ID=$VITE_NAVER_MAP_CLIENT_ID \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_APPLE_CLIENT_ID=$VITE_APPLE_CLIENT_ID

# pnpm 활성화 (corepack 번들)
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate

# 의존성 설치 (lockfile 기준 재현 설치, esbuild 등 빌드 스크립트 허용)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 소스 복사 후 빌드 (tsc -b && vite build → dist)
COPY . .
RUN pnpm build

# 실행 단계
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# SPA 정적 서빙 (deploy.yml이 -p 5010:3000 으로 연결)
CMD ["serve", "-s", "dist", "-l", "3000"]
