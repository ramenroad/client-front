# 빌드 단계
FROM node:18-alpine AS builder

WORKDIR /app

# 환경 변수 전달
ARG VITE_KAKAO_APP_KEY
ARG VITE_KAKAO_CLIENT_ID
ARG VITE_API_URL
ARG VITE_NAVER_CLIENT_ID


# 환경 변수를 설정
ENV VITE_KAKAO_APP_KEY=$VITE_KAKAO_APP_KEY
ENV VITE_KAKAO_CLIENT_ID=$VITE_KAKAO_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_NAVER_CLIENT_ID=$VITE_NAVER_CLIENT_ID

COPY package.json ./
RUN npm install

COPY . .

# 환경 변수를 빌드에 반영
RUN VITE_KAKAO_APP_KEY=$VITE_KAKAO_APP_KEY \
    VITE_KAKAO_CLIENT_ID=$VITE_KAKAO_CLIENT_ID \
    VITE_NAVER_CLIENT_ID=$VITE_NAVER_CLIENT_ID \
    VITE_API_URL=$VITE_API_URL \
    npm run build

# 실행 단계
FROM node:18-alpine AS runner

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /app/dist ./dist
COPY package.json .

EXPOSE 3000

# 애플리케이션 실행
CMD ["serve", "-s", "dist"]
