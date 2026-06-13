# AGENTS.md

## Response Preferences

- Always use polite Korean honorific speech. Never use casual speech.
- For simple questions, answer directly and promptly.
- For design, requirement analysis, debugging direction, or development direction, first confirm the understanding and identify the cause/direction before writing code.
- Use a tsundere maid-like tone while staying respectful and professional.
- Do not ask unnecessary reverse questions unrelated to the task.

## FSD Structure Convention

이 프로젝트는 Feature-Sliced Design(FSD)을 기준으로 `src` 하위 레이어를 구성합니다.

### 1. 현재 레이어 구조

```txt
src/
  app/       # 앱 초기화, 전역 provider, 전역 style
  pages/     # 라우트/페이지 단위 화면
  widgets/   # 페이지를 구성하는 독립적인 큰 UI 블록
  features/  # 사용자 행동/유스케이스 단위 기능
  entities/  # 비즈니스 도메인 모델과 도메인 API
  shared/    # 프로젝트 공통 인프라, 설정, 타입, UI
```

현재 프로젝트에는 `processes` 레이어를 두지 않습니다. 필요해지기 전까지는 `features`와 `widgets` 조합으로 처리합니다.

### 2. 레이어 책임

- `app`
  - React 앱 루트, provider, 전역 스타일, 앱 레벨 설정을 둡니다.
  - 예: `AppQueryProvider`, `queryClient`, `index.css`
- `pages`
  - 실제 페이지 진입점과 페이지 조립 코드를 둡니다.
  - 페이지 내부의 복잡한 블록은 `widgets`로 분리합니다.
- `widgets`
  - 여러 entity/feature/shared UI를 조합하는 큰 화면 블록을 둡니다.
  - 예: 랜딩 히어로, 목록 섹션, 상세 화면의 큰 섹션
- `features`
  - 로그인, 프로필 수정, 문의 생성처럼 사용자의 행동 단위 기능을 둡니다.
  - API 요청이 특정 사용자 액션을 수행하면 `features/{feature}/api`에 둡니다.
- `entities`
  - 라멘야, 리뷰, 커뮤니티 게시글처럼 비즈니스 도메인 단위를 둡니다.
  - 도메인 타입, 도메인 조회 API, 도메인 중심 mutation을 함께 관리합니다.
- `shared`
  - 도메인 의미가 없는 공통 코드만 둡니다.
  - 예: `apiClient`, 공통 타입, config, primitive UI 컴포넌트

### 3. Slice 내부 세그먼트

각 slice는 필요한 세그먼트만 둡니다.

```txt
src/entities/ramenya/
  api/      # API 함수, query/mutation hook
  model/    # 타입, 상수, 도메인 모델
  ui/       # 라멘야 전용 UI가 필요할 때 추가

src/features/profile/
  api/
  model/
  ui/       # 프로필 수정 폼 등 기능 UI가 필요할 때 추가
```

- `model/types.ts`에는 외부와 공유되는 도메인 타입을 둡니다.
- `model/index.ts`는 model barrel export 역할만 합니다.
- `api/index.ts`는 api barrel export 역할만 합니다.
- UI가 없는 slice에는 `ui` 폴더를 만들지 않아도 됩니다.

### 4. Import 방향

레이어 의존성은 아래 방향만 허용합니다.

```txt
app → pages → widgets → features → entities → shared
```

허용 예:

- `features/profile` → `shared/api`
- `features/profile` → `entities/viewer`
- `widgets/landing-hero` → `shared/ui`
- `pages/home` → `widgets/landing-hero`

피해야 할 예:

- `shared`에서 `entities`, `features`, `widgets`, `pages`, `app` import
- `entities`에서 `features`, `widgets`, `pages`, `app` import
- `features`끼리 직접 강하게 얽히는 import
- `widgets`에서 `pages` import

### 5. Public API Export

slice 외부에서 사용할 코드는 가능하면 각 slice의 public entry를 통해 export합니다.

```txt
src/features/auth/index.ts
src/entities/review/api/index.ts
src/entities/review/model/index.ts
```

- 깊은 경로 import는 같은 slice 내부에서만 사용합니다.
- 외부 slice에서는 `index.ts`를 통한 import를 우선합니다.
- 단, API 세그먼트 내부 파일끼리는 `./requests`, `./query-keys`처럼 상대 경로를 사용합니다.

### 6. Entity와 Feature 배치 기준

새 코드를 추가할 때는 아래 기준으로 배치합니다.

- 비즈니스 명사/도메인 데이터 자체이면 `entities`
  - 예: `ramenya`, `review`, `community`, `search`, `viewer`
- 사용자의 행동/유스케이스이면 `features`
  - 예: `auth`, `profile`, `inquiry`
- 여러 기능과 도메인을 묶은 화면 블록이면 `widgets`
- 라우트 단위 화면이면 `pages`
- 도메인 의미가 전혀 없는 공통 코드이면 `shared`

판단이 애매하면 먼저 `entities`의 순수 도메인 API/타입과 `features`의 사용자 액션을 분리할 수 있는지 확인합니다.

### 7. Shared 사용 기준

`shared`에는 특정 서비스 도메인 이름이 들어가지 않는 코드만 둡니다.

- 가능: `shared/api`, `shared/ui/button`, `shared/model`, `shared/config`
- 지양: `shared/review`, `shared/profile`, `shared/ramenya`

`shared`가 도메인 지식을 알기 시작하면 해당 코드는 `entities` 또는 `features`로 이동합니다.

## API Function Addition Convention

이 프로젝트의 API 계층은 FSD 구조를 기준으로 `entities/*/api` 또는 `features/*/api` 아래에 둡니다.

### 1. 파일 역할

API 세그먼트는 역할별로 분리합니다.

```txt
src/entities/{domain}/api/
  index.ts       # barrel export only
  requests.ts    # 순수 API 호출 함수
  queries.ts     # useQuery/useInfiniteQuery 계열 React Query 훅
  mutations.ts   # useMutation 계열 React Query 훅
  query-keys.ts  # queryKey/mutationKey 팩토리
  types.ts       # 훅 변수 타입 등 API 세그먼트 전용 타입
```

- `requests.ts`에는 React 훅을 넣지 않습니다.
- `queries.ts`, `mutations.ts`에는 직접 Axios를 호출하지 않고 `requests.ts`의 API 함수를 감쌉니다.
- `index.ts`는 `export * from './...'`만 두는 barrel export 역할로 유지합니다.
- React Query 훅이 없는 도메인은 필요한 파일만 둡니다. 예: `requests.ts`만 존재 가능.

### 2. 순수 API 함수 작성 방식

공통 클라이언트는 `request({ method, url })` 형태가 아니라 `apiClient`의 HTTP verb 메서드를 사용합니다.

```ts
import { apiClient } from '@/shared/api'

export const ramenyaApi = {
  getById(id: string) {
    return apiClient.get<RamenyaDetail>(`/v1/ramenya/${id}`)
  },

  getAll(params?: RamenyaListParams) {
    return apiClient.get<RamenyaSummary[]>('/v1/ramenya/all', { params })
  },
}
```

사용 규칙:

- 조회: `apiClient.get<T>(url, { params })`
- 생성: `apiClient.post<T>(url, data)`
- 수정: `apiClient.patch<T>(url, data)`
- 삭제: `apiClient.delete<T>(url)`
- DELETE body가 필요하면 `apiClient.delete<T>(url, { data })`
- 업로드 요청은 `FormData`를 만든 뒤 `apiClient.post/patch`의 `data`로 넘깁니다.
- `appendIfDefined`, `appendFiles`는 `@/shared/api`에서 가져와 FormData 구성에 사용합니다.

### 3. React Query 훅 작성 방식

React Query 훅은 `@/shared/api`의 래퍼를 사용합니다.

```ts
import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import { reviewApi } from './requests'

export function useDeleteReviewMutation(options?: ApiMutationOptions<void, string>) {
  return useApiMutation<void, string>((reviewId) => reviewApi.delete(reviewId), {
    mutationKey: reviewMutationKeys.delete(),
    ...options,
  })
}
```

- Mutation 훅은 `mutations.ts`에 둡니다.
- Infinite query 훅은 `queries.ts`에 둡니다.
- Query key와 mutation key는 `query-keys.ts`에서 팩토리 함수로 관리합니다.
- API 함수가 인자를 2개 이상 받으면 mutation variables 타입을 `types.ts`에 정의합니다.

예:

```ts
export type UpdateReviewVariables = {
  reviewId: string
  data: UpdateReviewRequest
}
```

### 4. Infinite Query 규칙

페이지네이션 API는 `useApiInfiniteQuery`를 사용합니다.

- 응답 타입은 `lastPage: number`를 포함해야 합니다.
- 요청 파라미터는 `PaginationParams`의 `page`를 포함할 수 있어야 합니다.
- 훅 외부에서 받는 params 타입은 보통 `Omit<Params, 'page'>`로 둡니다.
- `page`는 `useApiInfiniteQuery`가 내부에서 주입합니다.

```ts
export type RamenyaReviewsInfiniteParams = Omit<RamenyaReviewsParams, 'page'>

export function useRamenyaReviewsInfiniteQuery(
  params: RamenyaReviewsInfiniteParams,
  options?: ApiInfiniteQueryOptions<RamenyaReviewsResponse>,
) {
  return useApiInfiniteQuery<RamenyaReviewsResponse, RamenyaReviewsParams>({
    queryKey: reviewQueryKeys.ramenyaReviews(params),
    queryFn: reviewApi.getRamenyaReviews,
    params,
    options,
  })
}
```

### 5. Export 규칙

각 API 디렉터리의 `index.ts`는 다음처럼 외부 공개만 담당합니다.

```ts
export * from './mutations'
export * from './queries'
export * from './query-keys'
export * from './requests'
export * from './types'
```

없는 파일은 export하지 않습니다.

### 6. 검증

API 함수를 추가하거나 구조를 바꾼 뒤에는 아래 명령을 실행합니다.

```sh
pnpm lint
pnpm build
```

## Storybook Convention

자주 사용되는 공용 UI와 독립적으로 확인해야 하는 UI 블록은 Storybook story를 함께 작성합니다.

### 1. Story 파일 위치

- story는 대상 컴포넌트와 같은 폴더에 colocate합니다.
- 파일명은 `ComponentName.stories.tsx` 형식을 사용합니다.

```txt
src/shared/ui/button/
  Button.tsx
  Button.stories.tsx
  index.ts
```

### 2. 작성 방식

- 타입은 `@storybook/react-vite`에서 가져옵니다.
- 기본적으로 `tags: ['autodocs']`를 추가해 문서 페이지 생성을 준비합니다.
- 재사용 가능한 상태를 `Primary`, `Secondary`, `Disabled`, `Default`처럼 명확한 이름의 story로 분리합니다.

```ts
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta = {
  title: 'shared/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
  },
}
```

### 3. 대상 기준

- `shared/ui`의 primitive 컴포넌트는 우선 story를 작성합니다.
- 여러 페이지에서 재사용되는 `widgets` UI도 독립 확인이 필요하면 story를 작성합니다.
- 특정 페이지에서만 쓰는 임시 UI는 story를 강제하지 않습니다.

### 4. 실행 및 검증

```sh
pnpm storybook
pnpm build-storybook
```

- Storybook 정적 산출물인 `storybook-static`은 커밋하지 않습니다.

## Map Implementation Convention

네이버맵 기반 지도 기능은 좌표 안정성을 우선합니다.

### 1. 지도 view state와 검색 state 분리

- `map.getCenter()`, `map.getBounds()`, `zoom`은 현재 화면 상태로만 취급합니다.
- API 검색 기준 좌표와 반경은 별도의 `searchArea` 상태로 관리합니다.
- `idle`, `dragend`, `zoom_changed` 이벤트에서 바로 검색 좌표나 URL query를 갱신하지 않습니다.
- 지도 이동/줌 이후에는 `needsRefresh` 같은 dirty 상태만 켜고, 사용자가 “현 지도에서 검색”을 눌렀을 때만 검색 좌표를 갱신합니다.

### 2. 마커 좌표 보정 금지

- 라멘야 원본 `latitude`, `longitude`는 마커의 실제 위치로만 사용합니다.
- 하단 오버레이 때문에 마커를 화면상 위로 보이게 해야 하더라도 `latitude - 0.005` 같은 위경도 보정을 하지 않습니다.
- 화면상 보정이 필요하면 지도 픽셀 이동 API(`panBy`)나 UI 레이아웃으로 처리합니다.

### 3. 커스텀 HTML 마커 anchor 명시

- 네이버맵 HTML 마커는 반드시 `size`와 `anchor`를 지정합니다.
- 핀형 마커는 하단 중앙이 좌표 기준점이 되도록 설정합니다.
- 원형 현재 위치 마커는 정중앙이 좌표 기준점이 되도록 설정합니다.

### 4. 네이버맵 script

- 네이버맵 Dynamic Map key는 `VITE_NAVER_MAP_CLIENT_ID` 환경변수로 주입합니다.
- 지도 script 로딩은 `shared/lib/naver-map`의 loader를 사용하고, 컴포넌트마다 중복 script를 직접 추가하지 않습니다.

## UI Component Authoring Convention

UI 컴포넌트를 작성할 때는 JSX 렌더링 영역을 최대한 선언적으로 유지합니다.

### 1. HTML 태그 직접 사용 지양

컴포넌트의 return 영역에서는 `div`, `section`, `button`, `span` 같은 HTML 태그를 직접 길게 사용하지 않습니다.  
반복해서 쓰이거나 스타일 의미가 있는 요소는 이름 있는 wrapper 컴포넌트로 감싼 뒤 사용합니다.

지양:

```tsx
const Card = () => {
  return <div className="flex rounded-12 bg-white p-20">...</div>
}
```

권장:

```tsx
const Card = () => {
  return <CardWrapper>...</CardWrapper>
}

const CardWrapper = render.div('flex rounded-12 bg-white p-20')
```

- 단순 구조도 의미가 있으면 `Wrapper`, `Container`, `Title`, `Content`, `ActionButton`처럼 역할이 드러나는 이름을 사용합니다.
- 공통 wrapper 작성에는 `@/shared/ui/render`를 우선 사용합니다.
- 일회성 태그라도 스타일/역할이 길어지면 즉시 wrapper로 분리합니다.

### 2. 렌더링 영역의 로직 최소화

컴포넌트의 JSX 안에는 복잡한 조건식, 데이터 가공, 이벤트 처리 로직을 직접 넣지 않습니다.

- 상태 계산, 파생 데이터, 조건 분기 준비는 컴포넌트 상단의 변수 또는 hook으로 분리합니다.
- 페이지/위젯 단위의 복잡한 로직은 `model` 세그먼트의 custom hook으로 이동합니다.
- 순수 데이터 변환은 `shared/lib` 또는 해당 slice의 `model` 유틸 함수로 분리합니다.
- 렌더링 영역은 가능하면 “무엇을 보여주는지”만 읽히도록 유지합니다.

지양:

```tsx
const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <ListWrapper>
      {reviews
        .filter((review) => review.visible)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
    </ListWrapper>
  )
}
```

권장:

```tsx
const ReviewList = ({ reviews }: ReviewListProps) => {
  const visibleReviews = useVisibleReviews(reviews)

  return (
    <ListWrapper>
      {visibleReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </ListWrapper>
  )
}
```
