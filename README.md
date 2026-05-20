# new-ra-ising

React + Vite + TypeScript + Tailwind CSS v4 기반의 FSD-ready 스타터 프로젝트입니다.

## Stack

- React 19
- Vite 8
- TypeScript 6
- Tailwind CSS 4 with `@tailwindcss/vite`
- pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

검증 빌드:

```bash
pnpm build
```

## FSD Structure

```txt
src/
  app/        # 앱 엔트리, 전역 스타일, providers
  pages/      # 라우트/페이지 단위 slice
  widgets/    # 페이지를 구성하는 큰 UI/use-case 블록
  features/   # 사용자 가치 중심 기능 slice
  entities/   # 도메인 엔티티 slice
  shared/     # 공용 UI, config, lib, api
```

현재는 `pages/home`, `widgets/landing-hero`, `shared/ui`, `shared/config`를 예시로 구성했습니다.
`features`와 `entities`는 실제 도메인 기능이 생길 때 slice를 추가하면 됩니다.

## Path Alias

`@/*`가 `src/*`를 가리키도록 Vite와 TypeScript에 설정되어 있습니다.

## API/FSD Placement

API 함수와 타입은 `shared`에 모으지 않고 도메인/기능 단위로 둡니다.

```txt
src/shared/api/http.ts      # axios wrapper, token injection, 공통 request helper
src/shared/model/types.ts   # Id, ISODateString, PaginationParams 같은 범용 타입

src/entities/*/api          # ramenya, review, community 등 도메인 조회/CRUD API
src/entities/*/model        # 도메인 타입
src/features/*/api          # auth, profile, inquiry 등 사용자 액션 API
src/features/*/model        # 기능 입력/응답 타입
```
