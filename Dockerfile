FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /app/dist ./dist
COPY package.json .

EXPOSE 3000

# 애플리케이션 실행
CMD [ "serve", "-s", "dist" ]