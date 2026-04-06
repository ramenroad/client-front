# 라멘로드 클라이언트 FSD 개편 초안

## TL;DR

이 프로젝트는 `strict FSD`보다 `light FSD`가 맞습니다.

- 현재 구조는 `pages / components / hooks / api / store / util`처럼 기술 축으로 나뉘어 있습니다.
- 서비스 도메인은 이미 분명합니다. 핵심은 `viewer`, `ramenya`, `review`, `menu-board`, `curation`, `search`, `location/map`입니다.
- 따라서 이번 개편은 모든 파일을 억지로 잘게 쪼개기보다, `도메인 경계`를 먼저 세우고 `페이지를 얇게 만드는 방향`으로 가는 것이 맞습니다.

핵심 원칙은 아래 3개입니다.

1. `pages`는 라우트 엔트리만 남긴다.
2. 비즈니스 모델과 API, 쿼리는 `entities` 가까이 붙인다.
3. 사용자 액션 단위는 `features`, 페이지 조합 단위는 `widgets`로 뺀다.

---

## 현재 구조 진단

### 현재 폴더 구조

현재 `src`는 아래 축으로 나뉘어 있습니다.

- `pages`
- `components`
- `hooks`
- `api`
- `store`
- `states`
- `types`
- `util`
- `constants`

이 구조는 초기 개발 속도에는 유리하지만, 지금 규모에서는 아래 문제가 생깁니다.

### 현재 구조의 문제

#### 1. 도메인 로직이 기술 폴더에 흩어져 있음

예를 들어 `ramenya` 도메인만 봐도 관련 코드가 여러 군데에 퍼져 있습니다.

- API: `src/api/list-page`, `src/api/detail-page`, `src/api/map`
- query: `src/hooks/queries/useRamenyaListQuery.ts`, `src/hooks/queries/useRamenyaDetailQuery.ts`
- UI: `src/components/ramenya-card/RamenyaCard.tsx`
- 타입: `src/types/index.ts`
- 상수: `src/constants/index.ts`
- 페이지: `src/pages/location-page`, `src/pages/genre-page`, `src/pages/detail-page`, `src/pages/map`

이 상태에서는 "라멘야 관련 변경"이 어디까지 영향 가는지 추적하기 어렵습니다.

#### 2. 페이지 파일이 너무 많은 역할을 맡고 있음

특히 아래 파일들은 page라기보다 `page + feature + widget + lib`가 섞여 있습니다.

- `src/pages/review-page/EditReviewPage.tsx` (1019 lines)
- `src/pages/review-page/CreateReviewPage.tsx` (982 lines)
- `src/pages/menu-board-submit-page/index.tsx` (713 lines)
- `src/pages/map/index.tsx` (689 lines)
- `src/components/map/SearchOverlay.tsx` (498 lines)
- `src/components/map/NaverMap.tsx` (371 lines)

페이지가 라우팅만 담당하지 않고 아래까지 다 하고 있습니다.

- 폼 상태
- 업로드 로직
- 이미지 변환/압축
- 라우터 파라미터 동기화
- 도메인 정렬/필터링
- 모달 상태
- API 성공/실패 후처리

#### 3. 중복 로직이 분명하게 존재함

아래 로직은 거의 같은 형태로 3군데 반복됩니다.

- `compressImage`
- `convertHeicToJpeg`
- `isMobileDevice`
- `OptimizedLottie`

현재 중복 위치:

- `src/pages/review-page/CreateReviewPage.tsx`
- `src/pages/review-page/EditReviewPage.tsx`
- `src/pages/menu-board-submit-page/index.tsx`

이건 `shared/lib/image` 혹은 `features/.../lib`로 바로 뽑을 수 있는 후보입니다.

#### 4. 타입 경계가 불명확함

`UserReview`가 중복 선언되어 있습니다.

- `src/types/index.ts`
- `src/types/review/index.ts`

이런 구조는 타입 충돌과 잘못된 import를 만들기 쉽습니다.

#### 5. 전역 상태와 도메인 상태가 섞여 있음

현재 세션/유저/위치 상태가 분산되어 있습니다.

- `src/states/sign-in.ts`
- `src/store/location/useUserInformationStore.ts`
- `src/store/location/useLocationStore.ts`

게다가 `src/api/index.ts`가 직접 `useSignInStore`에 의존하고 있어서, API 베이스 레이어가 도메인 상태를 직접 알고 있습니다.

#### 6. UI 컴포넌트와 기능형 컴포넌트가 같은 계층에 있음

예를 들면 아래는 성격이 다릅니다.

- 진짜 공용 UI: `Button`, `Modal`, `Toggle`, `Tooltip`, `Line`
- 앱 전용 조합 UI: `AppBar`, `Footer`
- 기능형 UI: `SearchOverlay`, `FilterSection`, `ReviewCard`, `MenuBoardSection`

지금은 모두 `components` 아래에 있어서 재사용 범위와 책임이 불명확합니다.

---

## 이번 개편의 목표

이번 개편의 목표는 "FSD스럽게 보이게" 만드는 것이 아니라, 아래를 만족하는 구조로 바꾸는 것입니다.

- 도메인별로 코드를 찾기 쉬울 것
- 페이지 파일은 얇아질 것
- API / query / type / store가 같은 비즈니스 슬라이스 안에 모일 것
- 공용 UI와 기능형 UI가 구분될 것
- `shared`가 쓰레기통이 되지 않을 것

---

## 추천 방향: Light FSD

이 프로젝트에는 `strict FSD`보다 아래 형태가 적합합니다.

- `app`
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

단, `entities`를 과도하게 세분화하지 말고 핵심 도메인 위주로만 나눕니다.

### 핵심 도메인

- `viewer`: 로그인 세션, 현재 유저 정보
- `ramenya`: 매장 리스트, 상세, 장르/지역, 영업상태
- `review`: 리뷰 목록, 리뷰 상세, 리뷰 카드
- `menu-board`: 메뉴판 등록/삭제/조회
- `curation`: 배너, 그룹 큐레이션
- `search`: 자동완성, 최근 검색어
- `location`: 현재 위치, 지도 좌표, 거리 계산

---

## 권장 목표 구조

```txt
src/
  app/
    providers/
    router/
    styles/
    index.tsx

  pages/
    home/
    ramenya-by-region/
    ramenya-by-genre/
    ramenya-detail/
    group/
    map/
    banner/
    login/
    oauth-callback/
    register-nickname/
    my-page/
    my-information/
    user-reviews/
    review-create/
    review-edit/
    review-list/
    menu-board-submit/
    menu-board-images/
    withdraw/

  widgets/
    app-shell/
    navigation/
    home/
    ramenya/
    review/
    map/
    user/

  features/
    auth/
      sign-in/
      logout/
      withdraw-account/
    profile/
      update-nickname/
      update-profile-image/
      toggle-review-visibility/
    search/
      ramenya-search/
      remove-search-history/
    ramenya/
      filter-ramenya/
    review/
      create-review/
      edit-review/
      delete-review/
      share-user-review/
    menu-board/
      submit-menu-board/
      delete-menu-board/
    location/
      use-current-location/

  entities/
    viewer/
    ramenya/
    review/
    menu-board/
    curation/
    search/
    location/

  shared/
    api/
    config/
    lib/
    model/
    ui/
    assets/
```

---

## 레이어별 역할

### `app`

앱 부트스트랩과 전역 설정만 둡니다.

- router
- provider
- query client
- 전역 스타일
- 앱 프레임

현재 파일 기준:

- `src/main.tsx`
- `src/App.tsx`
- `src/pages/Routes.tsx`
- `src/core/queryClient.ts`
- `src/components/popup/PopupProvider.tsx`
- `src/components/toast/ToastProvider.tsx`
- `src/index.css`

### `pages`

라우트 진입점만 둡니다.

여기서는 데이터를 직접 조작하지 않고, `widgets`와 `features`를 조합하는 수준으로 유지합니다.

예시:

- `pages/ramenya-detail/Page.tsx`
- `pages/review-create/Page.tsx`
- `pages/map/Page.tsx`

### `widgets`

페이지 단위 조합 블록입니다.

예시:

- 홈 배너 + 섹션 조합
- 라멘야 상세 섹션 묶음
- 리뷰 리스트 섹션
- 앱 하단 네비게이션

이 프로젝트에서 widget 후보:

- `AppBar`
- `Footer`
- `main-page` 내부 섹션들
- `detail-page` 내부 섹션들
- `user-review-page` 상단 프로필 카드

### `features`

사용자 액션 / 유스케이스 단위입니다.

예시:

- 로그인
- 로그아웃
- 닉네임 수정
- 리뷰 작성/수정/삭제
- 리뷰 공개 여부 토글
- 검색어 선택/최근 검색어 삭제
- 메뉴판 등록/삭제

### `entities`

비즈니스 개념 자체를 다룹니다.

예시:

- `ramenya` 타입, API, query, 카드 UI, 영업상태 계산
- `review` 타입, API, review card
- `viewer` 세션 정보와 현재 사용자 정보

### `shared`

도메인 의미가 없는 진짜 공용 코드만 둡니다.

예시:

- `Button`, `Modal`, `Toggle`, `Tooltip`, `Line`
- 순수 유틸
- API base client
- env / route constants
- 아이콘, 이미지, 로띠

`shared`에 넣으면 안 되는 것:

- 라멘 장르 상수
- 리뷰 도메인 타입
- 유저 세션 store
- 검색 기록 로직

---

## 실제 슬라이스 제안

### 1. `entities/ramenya`

가장 먼저 만들어야 할 핵심 슬라이스입니다.

```txt
entities/ramenya/
  api/
    ramenyaApi.ts
  model/
    types.ts
    queryKeys.ts
    useRamenyaListQuery.ts
    useRamenyaDetailQuery.ts
  lib/
    getBusinessStatus.ts
    getBusinessStatusSpecial.ts
  config/
    genre.ts
    location.ts
  ui/
    RamenyaCard.tsx
```

현재 이동 대상:

- `src/api/list-page/index.ts`
- `src/api/detail-page/index.ts`
- `src/api/map/index.ts` 중 라멘야 검색/근처 검색 관련 부분
- `src/hooks/queries/useRamenyaListQuery.ts`
- `src/hooks/queries/useRamenyaDetailQuery.ts`
- `src/components/ramenya-card/RamenyaCard.tsx`
- `src/types/index.ts` 중 `Ramenya`, `BusinessHour`, `RemenyaDetail`, `Coordinate`
- `src/constants/index.ts` 중 라멘 장르/지역 관련 상수
- `src/util/index.ts` 중 영업시간 계산 함수

주의:

- `RamenyaCard` 안의 geolocation side effect는 제거해야 합니다.
- 카드 컴포넌트는 표시만 하고, 현재 위치 수집은 `location` 쪽 feature/entity로 이동해야 합니다.

### 2. `entities/viewer`

현재 로그인 세션과 현재 유저 정보를 한 슬라이스로 모읍니다.

```txt
entities/viewer/
  api/
    viewerApi.ts
    authApi.ts
  model/
    sessionStore.ts
    viewerStore.ts
    useViewerQuery.ts
    types.ts
```

현재 이동 대상:

- `src/states/sign-in.ts`
- `src/store/location/useUserInformationStore.ts`
- `src/hooks/queries/useUserInformationQuery.ts`
- `src/api/auth/index.ts` 중 유저 정보/로그인/로그아웃/탈퇴

권장 사항:

- `sessionStore`와 `viewerStore`를 분리하되, 둘 다 `viewer` 슬라이스에서 공개합니다.
- `src/api/index.ts`의 토큰 갱신 로직은 `shared/api`와 `entities/viewer` 경계가 보이도록 정리합니다.

### 3. `entities/review`

```txt
entities/review/
  api/
    reviewApi.ts
  model/
    types.ts
    queryKeys.ts
    useReviewListQuery.ts
    useReviewDetailQuery.ts
  ui/
    ReviewCard.tsx
```

현재 이동 대상:

- `src/api/review/index.ts`
- `src/hooks/queries/useRamenyaReviewQuery.ts`
- `src/components/review/ReviewCard.tsx`
- `src/types/review/index.ts`
- `src/types/index.ts` 중 review 관련 타입

### 4. `entities/menu-board`

```txt
entities/menu-board/
  api/
    menuBoardApi.ts
  model/
    types.ts
  ui/
    MenuBoardDetail.tsx
```

현재 이동 대상:

- `src/api/menu-board/index.ts`
- `src/hooks/mutation/useMenuBoardMutation.ts`
- `src/pages/detail-page/MenuBoardDetail.tsx`
- `src/types/index.ts` 중 `MenuBoard`

### 5. `entities/curation`

배너와 그룹은 초기에는 하나의 슬라이스로 묶는 편이 현실적입니다.

```txt
entities/curation/
  api/
    bannerApi.ts
    groupApi.ts
  model/
    types.ts
    useBannerQuery.ts
    useGroupQuery.ts
```

현재 이동 대상:

- `src/api/banner/index.ts`
- `src/api/group/index.ts`
- `src/hooks/queries/useBannerQuery.ts`
- `src/hooks/queries/useRamenyaGroupQuery.ts`

---

## 페이지별 재배치 방향

### `main-page`

현재:

- `src/pages/main-page/index.tsx`
- `src/pages/main-page/GroupCard.tsx`
- `src/pages/main-page/GenreCard.tsx`
- `src/pages/main-page/Section.tsx`
- `src/pages/main-page/RamenroadLogo.tsx`

권장:

- `pages/home/Page.tsx`
- `widgets/home/banner-carousel`
- `widgets/home/genre-grid`
- `widgets/home/location-shortcuts`
- `widgets/home/group-section`

### `location-page`, `genre-page`

둘은 거의 같은 페이지 성격입니다.

권장:

- `pages/ramenya-by-region/Page.tsx`
- `pages/ramenya-by-genre/Page.tsx`
- 공통 리스트 UI는 `widgets/ramenya/ramenya-list`
- 필터 기능은 `features/ramenya/filter-ramenya`

### `detail-page`

현재 상세 페이지는 분리 방향이 비교적 잘 보입니다.

권장:

- `pages/ramenya-detail/Page.tsx`
- `widgets/ramenya/detail-summary`
- `widgets/ramenya/detail-review-preview`
- `widgets/ramenya/detail-map`
- `widgets/ramenya/detail-menu-board`

이때 아래 로직은 page가 아니라 각 slice로 내려야 합니다.

- 리뷰 작성 진입
- 로그인 게이트
- 메뉴판 삭제
- 이미지 팝업
- 영업시간 정렬/가공

### `review-page`

현재 파일이 너무 큽니다.

권장:

- `pages/review-create/Page.tsx`
- `pages/review-edit/Page.tsx`
- `features/review/create-review`
- `features/review/edit-review`
- `shared/lib/image`

특히 아래는 공통 모듈로 추출합니다.

- 이미지 압축
- HEIC 변환
- 미리보기 URL 관리
- 업로드 로딩 오버레이

### `map`

지도 페이지는 마지막에 옮기는 것이 안전합니다.

권장:

- `pages/map/Page.tsx`
- `widgets/map/naver-map`
- `widgets/map/result-overlay`
- `features/search/ramenya-search`
- `features/location/use-current-location`
- `entities/location`

이유:

- URL search params
- 지도 instance 관리
- marker 선택 상태
- 근처 검색 / 키워드 검색 분기

가 강하게 결합되어 있기 때문입니다.

### `user-review-page`

권장:

- `pages/user-reviews/Page.tsx`
- `widgets/user/profile-summary`
- `widgets/review/user-review-list`
- `features/profile/toggle-review-visibility`
- `features/review/share-user-review`

### `login`, `login-callback`, `register`, `information`, `withdraw`

권장:

- `pages/login`
- `pages/oauth-callback`
- `pages/register-nickname`
- `pages/my-information`
- `pages/withdraw`

그리고 기능은 아래로 뺍니다.

- `features/auth/sign-in`
- `features/auth/logout`
- `features/auth/withdraw-account`
- `features/profile/update-nickname`
- `features/profile/update-profile-image`

---

## 공용 레이어 배치 가이드

### `shared/ui`로 옮길 것

- `src/components/common/Button.tsx`
- `src/components/common/Modal.tsx`
- `src/components/common/Toggle.tsx`
- `src/components/common/Tooltip.tsx`
- `src/components/common/Line.tsx`
- `src/components/common/RamenroadText.tsx`
- `src/components/top-bar/index.tsx`

`TopBar`는 앱 전반에서 반복되는 범용 헤더라서 `shared/ui`에 두는 것이 낫습니다.

### `widgets`로 둘 것

- `src/components/app-bar/index.tsx`
- `src/components/common/Footer.tsx`

이 둘은 디자인 시스템 컴포넌트가 아니라 앱 구조물에 가깝습니다.

### `shared/ui/icon`으로 정리할 것

현재 `src/components/Icon/index.tsx`는 1000줄 이상이라 관리 비용이 큽니다.

권장:

```txt
shared/ui/icon/
  navigation.tsx
  review.tsx
  map.tsx
  social.tsx
  common.tsx
  index.ts
```

### `shared/lib`로 옮길 것

- `src/util/number.ts`
- `src/util/map/index.ts`
- `src/util/image.ts`
- `src/hooks/common/useModal.ts`

단, `src/util/index.ts`는 그대로 옮기지 말고 의미별로 쪼개야 합니다.

권장 예시:

```txt
shared/lib/
  date/
  image/
  text/
  geolocation/

entities/ramenya/lib/
  business-status.ts
```

즉, 도메인 규칙은 `shared`가 아니라 `entities`로 갑니다.

---

## import 규칙

아래 규칙을 강하게 권장합니다.

1. `app -> pages/widgets/features/entities/shared` import 가능
2. `pages -> widgets/features/entities/shared` import 가능
3. `widgets -> features/entities/shared` import 가능
4. `features -> entities/shared` import 가능
5. `entities -> shared` import 가능
6. `shared -> shared`만 가능

금지:

- `entities`가 `features`를 import
- `features`가 다른 `features` 내부 구현을 직접 import
- `pages`끼리 직접 import
- `shared`에 도메인 타입/도메인 상수 넣기

추가 권장:

- 슬라이스 루트에만 `index.ts` 공개 API를 둡니다.
- 깊은 barrel export는 만들지 않습니다.
- 상대경로 지옥을 피하려고 alias를 도입합니다.

예시:

```txt
@/app
@/pages
@/widgets
@/features
@/entities
@/shared
```

---

## 추천 마이그레이션 순서

### 1단계. 기반 정리

먼저 아래를 정리합니다.

- `app`, `shared` 폴더 생성
- `main.tsx`, `App.tsx`, `Routes.tsx`, provider 정리
- path alias 설정
- `components/common`과 `components/Icon` 정리 시작

이 단계에서는 화면 동작 변화가 없어야 합니다.

### 2단계. 공통 중복 제거

아래를 먼저 공통화합니다.

- 이미지 업로드/압축/HEIC 변환
- 모달/토스트 hook 위치 정리
- `UserReview` 타입 중복 제거

이 단계는 리스크가 낮고 효과가 큽니다.

### 3단계. `viewer`, `ramenya`, `review` 엔티티 추출

가장 중요한 도메인 3개를 먼저 묶습니다.

- 로그인/유저 정보
- 라멘야 리스트/상세
- 리뷰 목록/상세/카드

이 단계가 끝나면 이후 page refactor가 쉬워집니다.

### 4단계. feature 추출

아래 액션들을 feature로 분리합니다.

- 로그인/로그아웃/탈퇴
- 닉네임 수정/프로필 이미지 수정
- 리뷰 생성/수정/삭제
- 메뉴판 등록/삭제
- 검색어 선택/히스토리 삭제
- 리뷰 공개 토글/공유

### 5단계. 페이지를 얇게 만들기

우선순위:

1. `review-create`, `review-edit`
2. `menu-board-submit`
3. `ramenya-detail`
4. `home`
5. `user-reviews`
6. `map`

`map`은 마지막에 하는 것이 안전합니다.

### 6단계. 기존 기술 축 폴더 제거

마지막에 아래 레거시 폴더를 비웁니다.

- `components`
- `hooks`
- `api`
- `store`
- `states`
- `types`
- `util`
- `constants`

중간 단계에서는 공존해도 되지만, 최종적으로는 제거하는 것이 맞습니다.

---

## 바로 실행 가능한 1차 작업 단위

처음부터 전체를 뒤집지 말고 아래 순서로 가는 것을 권장합니다.

### 작업 묶음 A

- `app`, `shared`, alias 세팅
- `queryClient`, `PopupProvider`, `ToastProvider` 이동
- `common` UI와 `Icon` 정리

### 작업 묶음 B

- 업로드 유틸 공통화
- `CreateReviewPage`, `EditReviewPage`, `MenuBoardSubmitPage` 중복 제거

### 작업 묶음 C

- `entities/viewer`
- `entities/review`
- `features/auth`
- `features/profile`

### 작업 묶음 D

- `entities/ramenya`
- `widgets/ramenya/*`
- `pages/ramenya-*`

### 작업 묶음 E

- `map/search/location` 계열 정리

---

## 이 프로젝트에서 피해야 할 실수

### 1. `shared`에 라멘 도메인 상수를 넣는 것

예:

- `genrePath`
- `genreDescriptions`
- `RAMENYA_LOCATION_LIST`
- `OpenStatus`

이런 값은 `entities/ramenya` 또는 `entities/location` 소속입니다.

### 2. `components`를 이름만 바꿔서 `widgets`로 옮기는 것

`widgets`는 "큰 UI"가 아니라 "페이지 조합 블록"입니다.
진짜 공용 UI는 `shared/ui`에 있어야 합니다.

### 3. page에서 query/mutation/store를 계속 다 잡는 것

FSD 폴더만 바꾸고 로직이 그대로 page에 남아 있으면 효과가 거의 없습니다.

### 4. 초기부터 entity를 너무 많이 만드는 것

처음엔 아래만 분명히 해도 충분합니다.

- `viewer`
- `ramenya`
- `review`
- `menu-board`

`curation`, `search`, `location`은 점진적으로 정리해도 됩니다.

---

## 최종 결론

이 프로젝트는 `full strict FSD`보다 `light FSD + 도메인 우선 재배치`가 맞습니다.

가장 좋은 시작점은 아래입니다.

1. `app/shared` 기반 먼저 만들기
2. 중복 업로드 로직 제거하기
3. `viewer`, `review`, `ramenya`를 entity로 묶기
4. 큰 page를 `pages + widgets + features`로 얇게 만들기
5. `map`은 마지막에 정리하기

이 순서로 가면 현재 서비스 동작을 크게 흔들지 않으면서도, 구조를 실제로 개선할 수 있습니다.
