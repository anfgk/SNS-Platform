## 프로젝트 소개

Facebook 클론 프로젝트입니다. 핵심 소셜 기능(게시글, 댓글, 좋아요, 친구, 프로필)을 구현했습니다. Firebase 실시간 데이터 동기화로 작성/수정/삭제와 인터랙션이 즉시 반영되며, React Context와 커스텀 훅으로 상태/비즈니스 로직을 모듈화했습니다.

- **프로젝트 유형**: 팀 프로젝트
- **팀 구성**: 프론트 6명으로 구성

## 실행 방법

```bash
npm install
npm run dev
```

## 주요 목표

- 피드(게시글/댓글/좋아요) 흐름과 실시간 동기화 구현
- 인증(이메일/비밀번호, 소셜)과 보호 라우팅 설계
- 프로필/마이페이지 UI 구성과 이미지 업로드 경험 개선
- 반응형 UI와 다크/라이트 테마 제공

## 역할 및 기여 (팀 프로젝트)
- 메인페이지 UI/UX 총괄: 스토리 섹션 레이아웃 설계, 반응형 구성, 로딩/스켈레톤 처리, 접근성 개선(포커스/대비)
- 스토리 기능 구현: 스토리 업로드/조회, 슬라이드 전환/자동재생, 터치 제스처(모바일) 대응, 이미지 최적화 및 실시간 반영
- 성능 안정화: 불필요 리렌더 최소화(메모이제이션), Firebase 구독 정리 및 의존성 관리

## 기술 스택

- **프론트** `React18` `vite` `React Router`, `Context API` `styled-components`
- **백엔드(BaaS)**: Firebase v9 (Auth, Cloud Firestore, Storage, Hosting)
- **품질/도구**: ESLint, Prettier, Git(GitHub)
- **배포**: Firebase Hosting

## 기능 요약

- **인증**: 이메일/비밀번호 회원가입·로그인, 구글/카카오 소셜 로그인, 로그인 유지/로그아웃(`components/common/kakao.jsx`, `hooks/useAuth.js`)
- **피드**: 텍스트/이미지 게시글 작성·수정·삭제, 좋아요, 댓글 CRUD, 무한 스크롤(`components/common/PostUpload.jsx`, `components/common/Comment.jsx`)
- **프로필/마이페이지**: 프로필 카드, 커버 이미지, 게시물/미디어 리스트(`components/Mypage/*`)
- **UI/UX**: 다크/라이트 테마 토글, 반응형, 로딩/에러 피드백, 실시간 동기화(`contexts/DarkThemeContext.jsx`, `components/common/LoadingScreen.jsx`)
- **최적화**: 이미지 지연 로딩/최적화 컴포넌트(`components/common/OptimizedImage.jsx`), 캐싱(`utils/cacheUtils.js`)

## 페이지 구조

- **Main** (`src/pages/Main.jsx`): 메인 피드, 스토리/라이브 섹션
- **Login** (`src/pages/Login.jsx`): 이메일/소셜 로그인, 추가 정보 입력
- **Signup** (`src/pages/Signup.jsx`): 회원가입 플로우/카테고리 선택
- **Mypage** (`src/pages/Mypage.jsx`): 프로필/게시물/미디어 탭
- **NotFound** (`src/pages/NotFound.jsx`): 404 핸들링

## 데이터/로직 개요

- **인증**: Firebase Auth(이메일/소셜) + `useAuth` 훅으로 세션/가드 처리
- **데이터**: Firestore 컬렉션(`users`, `posts`, `comments`, `likes`)과 Storage(이미지)
- **비즈니스 로직**: `services/firebaseService.js`, `utils/firebaseUtils.js`로 접근 로직 캡슐화
- **상태/구독**: `useFirebaseData`로 실시간 리스너 관리, 의존성/cleanup으로 중복 방지

## 접근성/UX 고려

- 키보드 포커스 가능한 인터랙션 요소, 명확한 포커스 스타일
- 모바일 퍼스트 레이아웃, 라이트/다크 대비 기준 준수

## 회고

- 라우팅/상태/데이터-주도 UI를 일관된 패턴으로 연결해 유지보수성을 높였습니다.
- 실시간 동기화와 이미지 업로드 등 실제 사용자 시나리오를 Firebase로 간결하게 해결했습니다.
- 비즈니스 로직을 훅/서비스로 분리해 확장성과 재사용성을 확보했으며, 테마/반응형으로 다양한 환경에서 일관된 경험을 제공했습니다.


