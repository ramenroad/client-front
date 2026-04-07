# 라멘로드 클라이언트 코드 컨벤션

## 목적

이 문서는 현재 `raising-client` 코드베이스에서 실제로 사용 중인 코드 작성 방식을 정리한 문서입니다.

- 목표는 "이상적인 규칙"을 새로 만드는 것이 아니라, 현재 코드에서 반복적으로 나타나는 패턴을 기준으로 컨벤션을 명문화하는 것입니다.
- 완전히 통일되지 않은 부분은 `현재 예외 / 불일치`로 따로 적었습니다.

---

## 1. 기본 포맷팅

### Prettier

현재 `.prettierrc` 기준 포맷팅 규칙은 아래와 같습니다.

- 세미콜론 사용: `true`
- 문자열: `double quote`
- 들여쓰기: `2 spaces`
- trailing comma: `all`
- print width: `120`

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120
}
```

### ESLint

현재 `eslint.config.js` 기준 규칙은 아래가 핵심입니다.

- `@eslint/js` 기본 권장 규칙 사용
- `typescript-eslint` 권장 규칙 사용
- `react-hooks` 권장 규칙 사용
- `react-refresh/only-export-components` 경고 사용

즉, 새 코드는 아래 전제를 따르는 것이 맞습니다.

- hook 규칙을 어기지 않는다
- React 컴포넌트 파일에 불필요한 export를 늘리지 않는다
- TypeScript 타입 오류를 남기지 않는다

### TypeScript

현재 `tsconfig.app.json` 기준:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

즉, 타입은 느슨하게 두지 않고, 사용하지 않는 변수나 파라미터는 남기지 않는 방향입니다.

---

## 2. 기술 스택 기준 코드 스타일

이 프로젝트의 UI 코드는 아래 조합을 기준으로 작성됩니다.

- `React + TypeScript`
- `react-router-dom`
- `@tanstack/react-query`
- `zustand`
- `@emotion/styled`
- `TailwindCSS v4`
- `src/shared/ui/render`

스타일링은 CSS Module이나 SCSS보다 아래 방식이 기본입니다.

- 정적인 스타일: `render.div("...")` 같은 named render component
- 조건부 스타일: `className` 조합 또는 `styled(...)`
- 공용 텍스트 스타일: `RaisingText`

---

## 3. 폴더 역할

현재 프로젝트는 기능 중심 구조가 아니라 기술 중심 구조를 사용합니다.

### 현재 주요 폴더

- `src/pages`: 라우트 단위 화면
- `src/components`: 공용 및 화면 조합 컴포넌트
- `src/hooks/common`: 브라우저/공용 훅
- `src/hooks/queries`: React Query 조회 훅
- `src/hooks/mutation`: React Query 변경 훅
- `src/api`: API 호출 함수
- `src/store`, `src/states`: Zustand store
- `src/types`: 공용 타입
- `src/util`: 유틸 함수
- `src/constants`: 상수
- `src/core`: 전역 query client 등 핵심 설정

현재는 path alias를 쓰지 않기 때문에 import는 상대경로 기준입니다.

---

## 4. 네이밍 컨벤션

## 4.1 파일/폴더 이름

### 페이지 폴더

페이지 폴더는 주로 `kebab-case`를 사용합니다.

예:

- `main-page`
- `detail-page`
- `review-page`
- `menu-board-submit-page`
- `user-review-page`

페이지 엔트리는 보통 `index.tsx`를 사용합니다.

예외적으로 하위 페이지는 명시적인 컴포넌트 파일명을 쓰기도 합니다.

예:

- `CreateReviewPage.tsx`
- `EditReviewPage.tsx`
- `ReviewListPage.tsx`

### 컴포넌트 파일

재사용 컴포넌트 파일명은 주로 `PascalCase.tsx`를 사용합니다.

예:

- `Button.tsx`
- `Modal.tsx`
- `RamenyaCard.tsx`
- `ReviewCard.tsx`

### 훅 파일

커스텀 훅은 `use` 접두사를 사용합니다.

예:

- `useDebounce`
- `useModal`
- `useRamenyaListQuery`
- `useAuthMutation`

### store 파일

Zustand store는 `use...Store` 형태를 사용합니다.

예:

- `useSignInStore`
- `useLocationStore`
- `useUserInformationStore`

### 상수

상수는 대체로 `UPPER_SNAKE_CASE`를 사용합니다.

예:

- `RAMENYA_TYPES`
- `RAMENYA_LOCATION_LIST`
- `MAP_MODE`
- `OVERLAY_HEIGHTS`
- `SEARCH_MODE`

## 4.2 타입/인터페이스 이름

- props 타입: `XxxProps`
- hook 입력 타입: `UseXxxProps`, `QueryParams` 등 목적형 이름
- 도메인 타입: `Ramenya`, `MenuBoard`, `UserInformation`

현재 프로젝트는 `type`보다 `interface` 사용 비중이 높습니다.

예:

- `interface ButtonProps`
- `interface TopBarProps`
- `interface UserInformation`

---

## 5. export 컨벤션

현재 export 스타일은 아래 패턴이 가장 많이 보입니다.

### 기본 패턴

- 페이지 컴포넌트: `default export`를 자주 사용
- 공용 컴포넌트/훅/API 함수: `named export`를 자주 사용

예:

```ts
const LoginPage = () => { ... };
export default LoginPage;
```

```ts
export const Button = (...) => { ... };
export const useAuthMutation = () => { ... };
export const getBanner = async () => { ... };
```

### 현재 예외 / 불일치

- 페이지도 `named export` 후 `default export`를 같이 두는 경우가 있음
- 일부 shared component도 `default export`를 사용함

즉, 현재는 아래 정도로 이해하는 것이 맞습니다.

- 외부에서 하나만 소비되는 페이지 엔트리는 `default export` 허용
- 재사용 함수/훅/유틸은 `named export` 선호

---

## 6. import 컨벤션

현재 프로젝트는 import alias 없이 상대경로를 사용합니다.

예:

```ts
import { useRamenyaDetailQuery } from "../../hooks/queries/useRamenyaDetailQuery";
import { Modal } from "../../components/common/Modal";
```

### 현재 주된 순서

엄격히 강제되지는 않지만, 많은 파일이 아래 순서를 따릅니다.

1. React / 라이브러리 import
2. 프로젝트 내부 모듈 import
3. 같은 폴더 로컬 import

예:

```ts
import { useNavigate } from "react-router-dom";
import render from "@/shared/ui/render";
import { useRamenyaDetailQuery } from "../../hooks/queries/useRamenyaDetailQuery";
import { RamenyaInformationSection } from "./RamenyaInformationSection";
```

### 현재 예외 / 불일치

- import 정렬은 자동화되어 있지 않음
- 어떤 파일은 외부/내부 import가 섞여 있음
- 어떤 파일은 `React` import를 명시하고, 어떤 파일은 하지 않음

새 코드도 최소한 아래는 맞추는 것이 좋습니다.

- 외부 라이브러리 import를 먼저 둔다
- 내부 모듈 import를 그 다음에 둔다
- 같은 폴더 파일은 마지막에 둔다

---

## 7. React 컴포넌트 작성 방식

## 7.1 함수형 컴포넌트 사용

클래스 컴포넌트는 사용하지 않고, 모두 함수형 컴포넌트로 작성합니다.

예:

```ts
const TopBar = (props: TopBarProps) => { ... };
```

또는

```ts
export const Banner = () => { ... };
```

## 7.2 Props 타입 선언

props는 인라인보다 별도 인터페이스로 분리하는 방식이 많습니다.

예:

```ts
interface TopBarProps {
  title: string;
  navigate?: string;
  onBackClick?: () => void;
}
```

DOM props를 확장해야 할 때는 `ComponentProps<"...">`를 사용합니다.

예:

```ts
interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "gray" | "gray-outline";
}
```

## 7.3 핸들러 네이밍

이벤트 핸들러는 `handle...` 패턴을 사용합니다.

예:

- `handleLogin`
- `handleSubmit`
- `handleBackClick`
- `handleImageUpload`
- `handleRemoveImage`

## 7.4 boolean 상태 네이밍

boolean 상태는 `is...`, `has...` 형태를 사용합니다.

예:

- `isOpen`
- `isSignIn`
- `isMobile`
- `isDirty`
- `hasError`

---

## 8. Hook 컨벤션

## 8.1 공용 훅

브라우저 API나 반복 로직은 `hooks/common`에 둡니다.

예:

- `useDebounce`
- `useIntersectionObserver`
- `useModal`
- `useUserLocation`
- `useMobileState`

## 8.2 Query 훅

조회성 서버 상태는 `hooks/queries`에서 감쌉니다.

네이밍은 `useXxxQuery`를 사용합니다.

예:

- `useBannerQuery`
- `useUserInformationQuery`
- `useRamenyaDetailQuery`
- `useRamenyaListQuery`

### Query 작성 패턴

- API 함수는 `src/api`에서 가져온다
- query key는 `queryKeys`에서 가져온다
- 필요한 경우 `select`, `enabled`를 사용한다

예:

```ts
export const useRamenyaDetailQuery = (id?: string) => {
  return useQuery({
    ...queryKeys.ramenya.detail(id!),
    queryFn: () => getRamenyaDetail(id!),
    enabled: !!id,
  });
};
```

## 8.3 Mutation 훅

변경성 서버 상태는 `hooks/mutation`에 둡니다.

네이밍은 `useXxxMutation`을 사용합니다.

예:

- `useAuthMutation`
- `useUserInfoMutation`
- `useMenuBoardMutation`
- `useSearchHistoryMutation`

### Mutation 작성 패턴

- `useMutation`으로 감싼다
- 성공 후 `queryClient.invalidateQueries`를 자주 사용한다
- toast, navigate, store 업데이트를 `onSuccess`에서 처리하는 경우가 많다

예:

```ts
const updateNicknameMutation = useMutation({
  mutationFn: (nickname: string) => updateUserNickname(nickname),
  onSuccess: () => {
    openToast("닉네임 설정 완료");
    queryClient.invalidateQueries({
      ...queryKeys.user.information,
    });
    navigate("/mypage");
  },
});
```

## 8.4 Hook 반환값 스타일

현재는 두 패턴이 공존합니다.

### 패턴 A: named object 반환

```ts
return { userInformationQuery };
return { addMenuBoard, removeMenuBoard };
```

### 패턴 B: mutation/query 객체를 그대로 반환

```ts
return useQuery(...);
return useMutation(...);
```

현재 프로젝트에서 더 자주 보이는 패턴은 `named object 반환`입니다.

---

## 9. 서버 데이터 / API 컨벤션

## 9.1 API 함수 위치

API 호출 함수는 `src/api/<domain>/index.ts`에 둡니다.

예:

- `src/api/auth/index.ts`
- `src/api/review/index.ts`
- `src/api/detail-page/index.ts`

## 9.2 함수명

API 함수명은 동사로 시작합니다.

- 조회: `get...`
- 생성: `post...`
- 수정: `update...`, `edit...`, `patch...`
- 삭제: `delete...`, `remove...`

예:

- `getBanner`
- `getRamenyaDetail`
- `postReview`
- `editReview`
- `deleteReview`
- `patchMyPagePublic`

## 9.3 axios 인스턴스 사용

공통 axios 인스턴스는 `src/api/index.ts`에서 만듭니다.

- `instance`
- `instanceWithNoVersioning`

현재 패턴:

- 버전이 필요한 API는 `instance`
- 버전 없이 호출하는 API는 `instanceWithNoVersioning`

## 9.4 Query Key 관리

React Query key는 `src/hooks/queries/queryKeys.ts`에서 중앙 관리합니다.

`@lukemorales/query-key-factory`를 사용합니다.

예:

```ts
export const queryKeys = createQueryKeyStore({
  ramenya: {
    detail: (id: string) => [id],
  },
});
```

새 query/mutation은 가능하면 이 파일의 key를 재사용하는 방식이 현재 컨벤션에 맞습니다.

---

## 10. 상태 관리 컨벤션

## 10.1 Zustand 사용

클라이언트 상태는 `zustand`를 사용합니다.

현재 저장소 예:

- 로그인 세션: `useSignInStore`
- 위치: `useLocationStore`
- 유저 정보: `useUserInformationStore`

## 10.2 Store 이름

store hook 이름은 `use...Store` 형태입니다.

예:

```ts
export const useSignInStore = create<SignInState>()(...)
```

## 10.3 Store 보조 함수

현재 store 바깥에서 setter helper를 같이 export하는 패턴도 있습니다.

예:

```ts
export const setCurrentLocation = (current: Coordinate) => { ... };
export const setUserInformation = (userInformation: UserInformation) => { ... };
```

이 패턴은 현재 코드베이스에서 이미 쓰이고 있으므로 유지해도 무방합니다.

---

## 11. 스타일링 컨벤션

## 11.1 기본 원칙

이 프로젝트의 스타일링 기본 조합은 `TailwindCSS v4 + className + render component + emotion`입니다.

### 정적 스타일

정적인 스타일은 raw HTML 태그 대신 이름 있는 render component를 먼저 선언해서 사용합니다.

예:

```ts
const Layout = render.div("flex flex-col w-full h-full");
```

### 조건부 스타일

props에 따라 스타일이 갈리면 `styled` 또는 `className` 조합을 사용합니다.

예:

```ts
const FilterButton = styled.button<FilterButtonProps>(({ active }) => [
  {
    padding: "4px 12px",
    borderRadius: "50px",
  },
  active && {
    backgroundColor: "#fff4eb",
    color: "#ff5e00",
  },
]);
```

### 기존 컴포넌트 확장

기존 컴포넌트를 확장할 때는 `render.extend(Component, "...")` 패턴을 사용합니다.

예:

```ts
const ArrowRightForReview = render.extend(IconArrowRight, "ml-auto");
```

## 11.2 디자인 토큰 사용 방식

Tailwind 설정이 px 단위 기반으로 크게 확장되어 있어서, 다음과 같은 클래스 사용이 일반적입니다.

- `w-390`
- `h-48`
- `px-20`
- `rounded-[8px]`
- `font-16-sb`

즉, 추상화된 spacing scale보다 실제 픽셀 기반 값을 직접 쓰는 방식이 현재 프로젝트의 주된 스타일입니다.

## 11.3 텍스트 스타일

텍스트는 아래 두 방식이 자주 사용됩니다.

1. 직접 `font-14-r`, `font-16-sb` 같은 클래스 사용
2. `RaisingText` 컴포넌트 사용

공용 텍스트 스타일이 필요하면 `RaisingText` 사용이 현재 패턴에 더 가깝습니다.

## 11.4 색상 사용

색상은 Tailwind theme에 정의된 semantic color를 사용합니다.

예:

- `text-orange`
- `bg-border`
- `text-gray-700`
- `bg-kakao`

하드코딩 색상도 일부 존재하지만, 가능하면 theme color를 우선 사용하는 것이 현재 흐름에 맞습니다.

---

## 12. 라우팅 컨벤션

라우팅은 `src/pages/Routes.tsx`에서 중앙 관리합니다.

- `createBrowserRouter` 사용
- layout route 사용
- 실제 화면은 `src/pages/**` 아래에 위치

레이아웃은 `src/components/layout`에 둡니다.

예:

- `AppBarLayout`
- `WithoutAppBarLayout`
- `MapLayout`

즉, 현재 라우트 추가 시 기본 흐름은 아래입니다.

1. `src/pages/...`에 화면 생성
2. 필요한 layout 결정
3. `src/pages/Routes.tsx`에 경로 등록

---

## 13. 타입 작성 컨벤션

## 13.1 interface 우선

도메인 객체와 props는 `interface` 사용 비중이 높습니다.

예:

- `interface UserInformation`
- `interface FilterOptions`
- `interface ButtonProps`

## 13.2 공용 타입 위치

현재 타입은 아래 위치에 둡니다.

- 전역/복합 타입: `src/types/index.ts`
- 도메인별 타입: `src/types/review`, `src/types/user`, `src/types/filter`

## 13.3 현재 예외 / 불일치

현재 타입 정의는 완전히 정리돼 있지 않습니다.

예:

- `UserReview`가 여러 위치에 중복 정의됨
- review 타입이 `src/types/index.ts`와 `src/types/review/index.ts`에 나뉘어 있음

따라서 새 코드에서 중요한 것은 아래입니다.

- 이미 존재하는 타입과 이름이 충돌하지 않는지 먼저 확인한다
- 같은 도메인 타입을 새로 만들기 전에 기존 타입 위치를 먼저 찾는다

---

## 14. 주석과 문서화

현재 프로젝트는 주석이 많은 편은 아닙니다.

주석을 쓰는 경우는 아래가 중심입니다.

- 복잡한 로직 설명
- 예외 케이스 설명
- 섹션 구분

예:

- 이미지 압축/변환 로직 설명
- OAuth 예외 분기 설명
- `// 모바일 최적화된 Lottie 컴포넌트`

즉, 자명한 코드에는 주석을 달지 않고, 맥락이 필요한 로직에만 설명을 붙이는 편입니다.

---

## 15. 현재 코드베이스에서 자주 보이는 패턴

### 15.1 핸들러를 컴포넌트 내부에 선언

작은 UI 로직은 컴포넌트 내부 `handle...` 함수로 처리합니다.

### 15.2 navigate / toast / modal을 화면 단에서 직접 조합

현재는 feature layer가 없어서 page/component 안에서 아래를 함께 다루는 경우가 많습니다.

- `navigate`
- `openToast`
- `useModal`
- mutation success/error handling

### 15.3 브라우저 API 접근은 hook으로 분리

반복되는 브라우저 API는 커스텀 hook으로 분리하는 편입니다.

예:

- geolocation
- intersection observer
- debounce

---

## 16. 현재 예외 / 불일치

이 프로젝트는 아래 항목이 아직 완전히 통일돼 있지 않습니다.

### 16.1 포맷팅 불일치

- 일부 파일은 single quote 사용
- 일부 파일은 4칸 들여쓰기 사용
- 일부 파일은 세미콜론/줄바꿈 스타일이 들쭉날쭉함

Prettier 기준으로 다시 정리 가능한 상태입니다.

### 16.2 export 스타일 혼재

- `default export`
- `named export`
- 둘을 함께 쓰는 경우

가 혼재합니다.

### 16.3 query hook 반환 형식 혼재

- raw query/mutation 반환
- named object 반환

둘 다 존재합니다.

### 16.4 타입 위치 중복

- 동일 개념 타입이 여러 파일에 흩어져 있음

### 16.5 페이지 파일 크기 편차 큼

- 일부 page가 700~1000줄 이상
- 중복 로직이 여러 page에 반복됨

즉, 현재 컨벤션은 "대체로 이 방향"은 분명하지만, 완전히 일관된 상태는 아닙니다.

---

## 17. 새 코드 작성 시 최소 준수 기준

현재 프로젝트 흐름에 맞추려면 새 코드는 최소 아래를 지키는 것이 좋습니다.

1. Prettier 규칙을 따른다.
2. React 함수형 컴포넌트 + TypeScript interface 기반으로 작성한다.
3. 공용 훅은 `use...`, query는 `use...Query`, mutation은 `use...Mutation`으로 네이밍한다.
4. API 함수는 `src/api`에 두고 동사형 이름을 사용한다.
5. 서버 상태는 React Query, 클라이언트 상태는 Zustand를 우선 사용한다.
6. 스타일은 `TailwindCSS v4 + className + render component` 기준으로 작성한다.
7. JSX에서 raw HTML 태그를 직접 렌더링하지 말고, `render.div(...)` 같은 이름 있는 컴포넌트를 먼저 선언해 사용한다.
8. 상대경로 import를 사용하되, 외부 라이브러리 import를 먼저 둔다.
9. props 타입은 `XxxProps`로 분리한다.
10. 기존 도메인 타입/상수/훅과 중복 정의하지 않는다.

---

## 18. 참고 파일

현재 컨벤션을 파악할 때 기준이 되는 파일들:

- `/.prettierrc`
- `/eslint.config.js`
- `/tsconfig.app.json`
- `/src/app/styles/global.css`
- `/src/pages/Routes.tsx`
- `/src/hooks/queries/queryKeys.ts`
- `/src/api/index.ts`
- `/src/components/common/Button.tsx`
- `/src/components/common/Modal.tsx`
- `/src/components/common/RamenroadText.tsx`
- `/src/states/sign-in.ts`
