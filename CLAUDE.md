# 트롯통 (TrotTong) — AI 개발 가이드

> 이 파일은 AI(Claude 등)와 개발자가 이 프로젝트를 작업할 때 반드시 숙지해야 할 핵심 지침서입니다.

---

## 0. 검증 우선 원칙 (Verification-First Policy)

> ⚠️ **이 섹션은 프로젝트의 최우선 원칙입니다. 코드 작성 전에 반드시 읽으세요.**

### 핵심 원칙: 검증 없는 완료는 없다

모든 기능 구현, 버그 수정, 리팩토링은 반드시 **검증 통과 후** 완료로 간주합니다.
"코드를 작성했다" ≠ "기능이 동작한다". 검증이 기본(default)입니다.

### 검증 3단계 파이프라인

```
[1단계] 정적 검사       [2단계] 빌드 검증       [3단계] E2E 검증
npx tsc --noEmit  →  npx expo export  →  npx playwright test
   (타입 오류 0)      (번들 오류 0)       (시나리오 전체 통과)
```

**모든 단계가 통과해야** PR 머지 / 작업 완료 처리 가능.
어느 한 단계라도 실패하면 수정 후 전체 파이프라인을 다시 실행합니다.

### AI가 코드 수정 후 반드시 실행할 명령

```bash
# 필수 검증 순서 (절대 생략 불가)
npx tsc --noEmit                         # Step 1: 타입 검사
npx expo export --platform web           # Step 2: 빌드
npx playwright test --reporter=list      # Step 3: E2E (Playwright)
```

### 검증 실패 시 행동 규칙

| 실패 유형 | 조치 |
|---|---|
| TypeScript 오류 | 타입 오류 수정 → 재검사 |
| 빌드 오류 | 오류 메시지 분석 → 수정 → 재빌드 |
| Playwright 테스트 실패 | 스크린샷 확인 → 원인 분석 → 수정 → 전체 재실행 |
| 실패 원인 불명확 | 사용자에게 보고 (추측으로 우회 금지) |

---

## 0-1. Playwright E2E 테스트 가이드

### 왜 Playwright인가

- Expo 웹 빌드(`dist/`)를 실제 브라우저에서 검증
- 스크린샷 비교로 시니어 UI 렌더링 확인
- 탭 네비게이션, 모달, 폼 상호작용 자동 검증
- CI/CD 파이프라인에 바로 통합 가능

### 테스트 구조

```
tests/
├── e2e/
│   ├── home.spec.ts          # 홈 화면: 가수 목록, 추천, 탭 UI
│   ├── navigation.spec.ts    # 탭 네비게이션 전환
│   ├── onboarding.spec.ts    # 온보딩 3단계 플로우
│   ├── favorite.spec.ts      # 보관함 (빈 상태, 아이템 삭제)
│   ├── history.spec.ts       # 최근 기록
│   ├── category.spec.ts      # 카테고리 선택 및 영상 목록
│   ├── settings.spec.ts      # 설정: 글씨 크기, 테마
│   └── senior-ux.spec.ts     # 시니어 UX 원칙 자동 검사
└── playwright.config.ts
```

### 테스트 실행 방법

```bash
# 웹 빌드 후 서빙 (테스트 전 준비)
npx expo export --platform web        # dist/ 생성
npx serve dist -p 4173               # 정적 서버 실행

# 별도 터미널에서 테스트 실행
npx playwright test                   # 전체 테스트
npx playwright test home              # 특정 파일만
npx playwright test --ui              # 대화형 UI 모드
npx playwright show-report            # HTML 리포트

# playwright.config.ts의 webServer 설정으로 서버 자동 기동
npx playwright test                   # 빌드 + 서빙 + 테스트 한 번에
```

### 시니어 UX 자동 검증 항목

`tests/e2e/senior-ux.spec.ts`에서 다음 항목을 자동으로 검사합니다:

| 검사 항목 | 기준 | 측정 방법 |
|---|---|---|
| 영어 UI 텍스트 없음 | 버튼/탭/헤더에 영어 금지 | DOM 텍스트 스캔 |
| 최소 터치 영역 44px | 모든 버튼 ≥ 44×44px | bounding box 측정 |
| 폰트 크기 기본 18px+ | body 텍스트 최소 18px | computed style |
| 고대비 (배경/텍스트) | WCAG AA (4.5:1 이상) | 색상 대비 계산 |
| 로그인 화면 없음 | 첫 화면 = 온보딩/홈 | URL + DOM 확인 |

---

## 1. 프로젝트 개요 (Project Overview)

| 항목 | 내용 |
|---|---|
| **앱 이름** | 트롯통 (TrotTong) |
| **플랫폼** | iOS / Android (React Native + Expo) |
| **타겟 사용자** | 60대 이상 스마트폰 사용 시니어 세대 |
| **핵심 목적** | 복잡한 검색 없이 인기 트로트 가수의 유튜브 영상을 원터치로 감상 |
| **핵심 차별점** | 잠들기 타이머, 라디오 모드(화면 꺼짐 방지), 3단계 초대형 글씨, 시니어 전용 UX |
| **수익 모델** | AdMob(배너+전면+보상형) + 프리미엄 구독(월 2,900원) |

### 앱의 존재 이유 (Why This App Exists)
한국 60대 이상 인구는 트로트를 사랑하지만 유튜브 검색은 어렵습니다. 이 앱은 그 간극을 메웁니다. 가수 사진 한 번 터치 → 영상 즉시 재생. 그게 전부입니다. 복잡한 기능 없이, 이 단순함이 핵심 경쟁력입니다.

---

## 2. 기술 스택 (Tech Stack)

### 핵심 프레임워크
- **React Native + Expo (SDK 52+)** — 크로스 플랫폼
- **TypeScript** — 타입 안전성 필수
- **React Navigation v6** — 탭 + 스택 네비게이션

### 필수 라이브러리

```json
{
  "dependencies": {
    "expo": "~52.x",
    "react-native-youtube-iframe": "^2.3.0",
    "react-native-google-mobile-ads": "^13.x",
    "expo-keep-awake": "~14.x",
    "@react-native-async-storage/async-storage": "^2.x",
    "zustand": "^5.x",
    "expo-notifications": "~0.29.x",
    "expo-store-review": "~7.x",
    "react-native-purchases": "^7.x",
    "@react-native-community/netinfo": "^11.x",
    "@react-native-firebase/app": "^21.x",
    "@react-native-firebase/analytics": "^21.x"
  }
}
```

### 빌드 요구사항
- **EAS Build 필수** — `react-native-google-mobile-ads`는 Expo Go 미지원
- **EAS Secrets** — API 키, AdMob ID, RevenueCat 키는 절대 코드에 하드코딩 금지
- `.env` 파일 + `app.config.ts`의 `Constants.expoConfig.extra` 패턴 사용

---

## 3. UI/UX 개발 원칙 (Strict Senior UI/UX Guidelines)

> ⚠️ 아래 원칙은 **모든 화면 개발에 예외 없이 적용**해야 합니다.

### 원칙 1: 절대적인 한글화
- 'Home', 'Setting', 'Back', 'Play', 'Pause' 등 영어 UI 텍스트 **완전 금지**
- 올바른 표기: '첫 화면', '설정', '뒤로', '재생', '일시 정지'
- 버튼 레이블, 토스트 메시지, 에러 메시지 모두 한국어

### 원칙 2: 3단계 초대형 폰트 시스템
```typescript
// src/constants/fonts.ts
export type FontLevel = 'normal' | 'large' | 'xlarge';

export const FONT_SCALE: Record<FontLevel, number> = {
  normal: 1.0,   // 기본: body 18sp, title 24sp
  large: 1.22,   // 크게: body 22sp, title 29sp
  xlarge: 1.44,  // 아주 크게: body 26sp, title 35sp
};

export const BASE_FONT = {
  body: 18,
  title: 24,
  button: 18,
  caption: 14,
  nav: 14,
};
```
- 최소 터치 영역: **모든 버튼 44px × 44px 이상** (절대 원칙)
- 아이콘은 최소 32px, padding 12px 이상 확보

### 원칙 3: 고대비 색상 팔레트
```typescript
// src/constants/colors.ts
export const LIGHT_THEME = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#0D0D0D',
  textSecondary: '#444444',
  accent: '#C0392B',       // 한국 전통 빨강 — 버튼, 강조
  accentGold: '#B8860B',   // 골드 — 프리미엄, 스타
  border: '#DDDDDD',
  danger: '#E74C3C',
  success: '#27AE60',
};

export const DARK_THEME = {
  background: '#0D0D0D',   // 순수 검정 아닌 미묘한 차이 — 헤일로 효과 감소
  surface: '#1A1A1A',
  textPrimary: '#F5F5F5',
  textSecondary: '#CCCCCC',
  accent: '#FF6B6B',       // 다크모드에서 빨강 밝기 조정
  accentGold: '#FFD700',   // 다크모드 골드 — 매우 잘 보임
  border: '#333333',
  danger: '#FF6B6B',
  success: '#2ECC71',
};
```

### 원칙 4: 즉시 사용 가능 (No Auth)
- 앱 실행 즉시 메인 화면(가수 목록) 표시
- 회원가입/로그인/이메일 인증 **절대 구현 금지**
- 온보딩 3화면은 최초 1회만 (이후 건너뜀)

### 원칙 5: 명확한 버튼 피드백
- 모든 터치 가능 요소: `elevation`(Android) 또는 `shadow`(iOS) 적용
- 터치 시 시각적 피드백: `opacity: 0.7` 또는 배경색 변화
- `activeOpacity={0.7}` 을 TouchableOpacity 기본값으로 사용

### 원칙 6: 다크 모드
- 기본값: 시스템 설정 따름 (`useColorScheme()`)
- 설정 화면에서 수동 전환 가능
- 테마 변경은 `userStore`에 저장, 앱 재시작 시 복원

### 원칙 7: 잠들기 타이머 접근성
- 재생 화면 어디서든 1터치로 잠들기 타이머 설정 가능
- 타이머 종료 2분 전 볼륨 서서히 감소 (100% → 0%)
- 다음 날 앱 열면 "어젯밤 잘 주무셨나요?" 알림 선택지 표시

---

## 4. 핵심 기능 명세 (Core Features)

### 4-1. 메인 화면 (HomeScreen)
- **오늘의 추천**: 상단 가로 스크롤 — 개인화 추천 3명 (history 기반) 또는 기본 3명 (임영웅, 이찬원, 송가인)
- **전체 가수 목록**: 2열 Grid — 가수 사진 + 이름 (큰 글씨) + 인기도 뱃지
- **하단 배너 광고**: 항상 고정 표시 (프리미엄 유저 제외)
- **하단 탭 네비게이션**: 첫화면 / 보관함 / 기록 / 카테고리 / 설정

### 4-2. 재생 화면 (PlayerScreen)
- `react-native-youtube-iframe`으로 유튜브 영상 재생
- **라디오 모드**: `useKeepAwake()` 호출로 화면 꺼짐 방지
- **컨트롤 버튼** (매우 크게, 최소 56px 높이):
  - ◀ 이전 곡 / ▶▶ 다음 곡 / ♥ 보관함에 담기 / ⏰ 잠들기 타이머
- **잠들기 타이머 모달**: 30분 / 1시간 / 2시간 / 직접 설정
- **영상 정보**: 제목, 가수명, 조회수 (큰 글씨)
- 재생 화면 진입 시 `useHistory` 훅으로 기록 자동 저장

### 4-3. 내 보관함 (FavoriteScreen)
- ♥ 누른 영상 목록 (섬네일 + 제목 + 가수명)
- **무료**: 최대 20개 저장 → 초과 시 "광고 보고 10개 추가" 또는 프리미엄 안내
- **프리미엄**: 무제한 저장
- 저장 순서 변경, 삭제 기능
- `AsyncStorage` 키: `@trottong:favorites`

### 4-4. 최근 기록 (HistoryScreen)
- 최근 재생한 영상 시간순 목록
- 날짜 그룹: "오늘", "어제", "지난 주"
- **무료**: 최근 30개 / **프리미엄**: 최근 200개
- 항목별 스와이프 삭제, 전체 삭제 버튼
- `AsyncStorage` 키: `@trottong:history`

### 4-5. 카테고리 (CategoryScreen)
- 6개 카테고리 카드 + 큐레이션 플레이리스트
- 카테고리: 트로트 발라드 / 신나는 트로트 / 옛날 트로트 / 최신 트로트 / 명절 트로트 / 봄 트로트
- 플레이리스트: 잠들기 좋은 트로트 / 드라이브 트로트 / 아침 트로트 / 이주의 추천 TOP10

### 4-6. 설정 화면 (SettingsScreen)
- **글씨 크기**: 3단계 버튼 (기본 "가" / 크게 "가" / 아주크게 "가")
- **화면 모드**: 밝게 / 어둡게 / 자동 (시스템 따름)
- **알림 설정**: 매일 추천곡 알림 / 시간 설정 / 연속 청취 알림
- **프리미엄**: 구독 상태 표시 / 구독하기 버튼
- **앱 정보**: 버전, 문의, 개인정보처리방침
- **가족에게 공유**: 카카오톡 공유 링크 생성

### 4-7. 온보딩 (OnboardingScreen) — 최초 1회
- **1단계**: 앱 소개 + "손 하나로 즐기는 트로트 방송"
- **2단계**: 좋아하는 가수 선택 (최소 1명) → 추천 시드로 활용
- **3단계**: 알림 동의 — 시스템 권한 전에 앱 내 설명 화면 먼저 표시

---

## 5. 가수 로스터 (Singer Roster — 20명)

```typescript
// src/data/singers.ts

export type SingerTier = 'mega' | 'popular' | 'classic';

export interface Singer {
  id: string;
  name: string;           // 한국어 이름
  nameEn: string;         // 영문 이름 (YouTube 검색용)
  tier: SingerTier;
  channelId?: string;     // YouTube 공식 채널 ID
  searchQuery: string;    // YouTube 검색 쿼리
  thumbnailLocal?: string; // assets/singers/ 로컬 이미지 (오프라인 폴백)
  tags: string[];         // 카테고리 태그
  description: string;    // 한 줄 소개
}

export const SINGERS: Singer[] = [
  // === 티어1: 메가스타 ===
  {
    id: 'lim-young-woong',
    name: '임영웅',
    nameEn: 'Im Young-woong',
    tier: 'mega',
    searchQuery: '임영웅 노래 모음',
    tags: ['ballad', 'latest'],
    description: '2020년대 최고의 트로트 스타',
  },
  {
    id: 'lee-chan-won',
    name: '이찬원',
    nameEn: 'Lee Chan-won',
    tier: 'mega',
    searchQuery: '이찬원 노래 모음',
    tags: ['ballad', 'latest'],
    description: '미스터 트롯 준우승, 감성 트로트',
  },
  {
    id: 'young-tak',
    name: '영탁',
    nameEn: 'Young-tak',
    tier: 'mega',
    searchQuery: '영탁 찐이야 노래',
    tags: ['upbeat', 'latest'],
    description: '찐이야로 유명한 흥의 아이콘',
  },
  {
    id: 'song-ga-in',
    name: '송가인',
    nameEn: 'Song Ga-in',
    tier: 'mega',
    searchQuery: '송가인 노래 모음',
    tags: ['ballad', 'classic'],
    description: '미스 트롯 우승, 여왕의 트로트',
  },
  {
    id: 'na-hoon-a',
    name: '나훈아',
    nameEn: 'Na Hoon-a',
    tier: 'mega',
    searchQuery: '나훈아 노래 모음 명곡',
    tags: ['classic', 'ballad'],
    description: '트로트의 황제, 전설의 국민가수',
  },
  // === 티어2: 인기 가수 ===
  {
    id: 'joo-hyun-mi',
    name: '주현미',
    nameEn: 'Joo Hyun-mi',
    tier: 'popular',
    searchQuery: '주현미 노래 모음',
    tags: ['classic', 'ballad'],
    description: '트로트 여왕의 원조, 클래식 명곡',
  },
  {
    id: 'jin-sung',
    name: '진성',
    nameEn: 'Jin Sung',
    tier: 'popular',
    searchQuery: '진성 안동역에서 노래',
    tags: ['ballad', 'classic'],
    description: '안동역에서, 구성진 목소리',
  },
  {
    id: 'jeong-dong-won',
    name: '정동원',
    nameEn: 'Jeong Dong-won',
    tier: 'popular',
    searchQuery: '정동원 노래 모음',
    tags: ['ballad', 'latest'],
    description: '미스터 트롯 최연소, 천재 소년',
  },
  {
    id: 'hong-ja',
    name: '홍자',
    nameEn: 'Hong Ja',
    tier: 'popular',
    searchQuery: '홍자 노래 모음',
    tags: ['ballad', 'latest'],
    description: '강렬한 감성의 차세대 여왕',
  },
  {
    id: 'park-hyun-bin',
    name: '박현빈',
    nameEn: 'Park Hyun-bin',
    tier: 'popular',
    searchQuery: '박현빈 노래 모음',
    tags: ['upbeat'],
    description: '샤방샤방, 신나는 트로트 킹',
  },
  // === 티어3: 올드 트로트 명인 ===
  {
    id: 'hyun-cheol',
    name: '현철',
    nameEn: 'Hyun Cheol',
    tier: 'classic',
    searchQuery: '현철 봉선화연정 노래',
    tags: ['classic'],
    description: '봉선화연정, 트로트 레전드',
  },
  {
    id: 'tae-jin-a',
    name: '태진아',
    nameEn: 'Tae Jin-a',
    tier: 'classic',
    searchQuery: '태진아 사랑은 아무나 하나',
    tags: ['classic'],
    description: '사랑은 아무나 하나, 국민 트로트',
  },
  {
    id: 'seol-un-do',
    name: '설운도',
    nameEn: 'Seol Un-do',
    tier: 'classic',
    searchQuery: '설운도 다함께 차차차',
    tags: ['upbeat', 'classic'],
    description: '다함께 차차차, 흥의 클래식',
  },
  {
    id: 'kim-heung-kook',
    name: '김흥국',
    nameEn: 'Kim Heung-kook',
    tier: 'classic',
    searchQuery: '김흥국 호랑나비',
    tags: ['upbeat', 'classic'],
    description: '호랑나비, 신나는 올드 트로트',
  },
  {
    id: 'nam-jin',
    name: '남진',
    nameEn: 'Nam Jin',
    tier: 'classic',
    searchQuery: '남진 여자의 마음 노래',
    tags: ['classic', 'ballad'],
    description: '여자의 마음, 70년대 트로트 황제',
  },
  {
    id: 'nami',
    name: '나미',
    nameEn: 'Nami',
    tier: 'classic',
    searchQuery: '나미 슬픈 인연',
    tags: ['classic', 'ballad'],
    description: '슬픈 인연, 80년대 감성 명곡',
  },
  {
    id: 'choi-jin-hee',
    name: '최진희',
    nameEn: 'Choi Jin-hee',
    tier: 'classic',
    searchQuery: '최진희 사랑의 미로',
    tags: ['classic', 'ballad'],
    description: '사랑의 미로, 시대를 초월한 명곡',
  },
  {
    id: 'moon-hee-ok',
    name: '문희옥',
    nameEn: 'Moon Hee-ok',
    tier: 'classic',
    searchQuery: '문희옥 트로트 노래 모음',
    tags: ['classic'],
    description: '클래식 여성 트로트의 정수',
  },
  {
    id: 'cho-yong-pil',
    name: '조용필',
    nameEn: 'Cho Yong-pil',
    tier: 'classic',
    searchQuery: '조용필 노래 모음 명곡',
    tags: ['classic', 'ballad'],
    description: '국민가수, 장르를 초월한 전설',
  },
  {
    id: 'patti-kim',
    name: '패티김',
    nameEn: 'Patti Kim',
    tier: 'classic',
    searchQuery: '패티김 노래 모음',
    tags: ['classic', 'ballad'],
    description: '이별의 노래, 영원한 디바',
  },
];
```

---

## 6. 광고 수익화 전략 (Monetization Strategy)

### 6-1. AdMob 구성

```typescript
// src/constants/ads.ts

// ⚠️ 실제 앱 ID와 유닛 ID는 EAS Secrets에서 관리
// 개발 중에는 테스트 ID 사용
export const AD_IDS = {
  APP_ID_ANDROID: process.env.EXPO_PUBLIC_ADMOB_APP_ANDROID ?? 'ca-app-pub-3940256099942544~3347511713',
  APP_ID_IOS: process.env.EXPO_PUBLIC_ADMOB_APP_IOS ?? 'ca-app-pub-3940256099942544~1458002511',

  BANNER_HOME: process.env.EXPO_PUBLIC_BANNER_HOME ?? 'ca-app-pub-3940256099942544/6300978111',
  BANNER_FAVORITE: process.env.EXPO_PUBLIC_BANNER_FAVORITE ?? 'ca-app-pub-3940256099942544/6300978111',
  BANNER_HISTORY: process.env.EXPO_PUBLIC_BANNER_HISTORY ?? 'ca-app-pub-3940256099942544/6300978111',

  INTERSTITIAL: process.env.EXPO_PUBLIC_INTERSTITIAL ?? 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: process.env.EXPO_PUBLIC_REWARDED ?? 'ca-app-pub-3940256099942544/5224354917',
};

// 광고 주파수 설정
export const AD_CONFIG = {
  INTERSTITIAL_MIN_INTERVAL_MS: 5 * 60 * 1000,  // 최소 5분 간격
  INTERSTITIAL_TRIGGER_COUNT: 3,                  // 가수 선택 3회마다
  SESSION_WARMUP_MS: 60 * 1000,                   // 앱 시작 후 1분 유예
  REWARDED_FAVORITES_BONUS: 10,                   // 보상형 광고로 추가되는 즐겨찾기 슬롯
  FREE_FAVORITES_LIMIT: 20,                       // 무료 즐겨찾기 최대값
  FREE_HISTORY_LIMIT: 30,                         // 무료 기록 최대값
};
```

### 6-2. useAdManager 훅 핵심 로직

```typescript
// src/hooks/useAdManager.ts 시그니처

interface AdManagerState {
  singerTapsThisSession: number;
  lastInterstitialTime: number;
  sessionStartTime: number;
}

interface AdManagerActions {
  recordSingerTap: () => void;          // 가수 선택 시 호출
  canShowInterstitial: () => boolean;   // 전면 광고 표시 가능 여부
  onInterstitialShown: () => void;      // 전면 광고 표시 후 호출
  showRewardedAd: (type: 'favorites' | 'ad-free-24h') => Promise<boolean>;
}

// canShowInterstitial() 조건 (모두 충족 시 true):
// 1. 라디오 모드 비활성
// 2. 프리미엄 유저 아님
// 3. singerTapsThisSession % AD_CONFIG.INTERSTITIAL_TRIGGER_COUNT === 0
// 4. Date.now() - lastInterstitialTime > AD_CONFIG.INTERSTITIAL_MIN_INTERVAL_MS
// 5. Date.now() - sessionStartTime > AD_CONFIG.SESSION_WARMUP_MS
```

### 6-3. 프리미엄 구독 (RevenueCat)

| 플랜 | 가격 | 혜택 |
|---|---|---|
| **트롯통 PLUS 월간** | 2,900원/월 | 광고 없음, 무제한 즐겨찾기, 최근 기록 200개 |
| **트롯통 PLUS 연간** | 19,900원/년 | 위 동일 (월 환산 1,658원, 43% 할인) |

**구독 유도 시점**:
1. 즐겨찾기 20개 초과 시도 시
2. 전면 광고 3회 이상 노출 후 설정 진입 시
3. 설정 화면 프리미엄 섹션 (항상 노출)

**마케팅 프레이밍**: "한 달에 커피 한 잔 값으로 광고 없이 트로트를 즐기세요"

### 6-4. 수익 예측

```
보수적 시나리오 (DAU 1,000명):
- 세션당 배너 10회 노출 × 4세션/일 = 40,000 노출/일
- eCPM 한국 시니어: ~2,000원/1,000회
- 배너 수익: 80,000원/일 = 약 240만원/월

- 전면 광고: 1,000명 × 1회/일 × 30% CTR = 300회/일 → 약 30만원/월

- 프리미엄 구독 전환율 2%: 20명 × 2,900원 = 58,000원/월

- 합계: 약 330만원/월 (DAU 1,000 기준)
```

---

## 7. 디렉토리 구조 (Directory Structure)

```text
TrotTong/
├── App.tsx                          # 진입점, Navigation + Theme Provider
├── app.json                         # Expo 기본 설정
├── app.config.ts                    # Expo 동적 설정 (플러그인, 환경변수)
├── .env                             # 로컬 환경변수 (Git 제외!)
├── .env.example                     # 환경변수 템플릿 (Git 포함)
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── SingerCard.tsx       # 가수 선택 카드 (Grid 아이템)
│   │   │   ├── VideoCard.tsx        # 영상 목록 아이템
│   │   │   ├── AdBanner.tsx         # 애드몹 배너 래퍼
│   │   │   ├── SleepTimerModal.tsx  # 잠들기 타이머 모달
│   │   │   ├── FontSizeToggle.tsx   # 3단계 글씨 크기 토글
│   │   │   ├── RatingPrompt.tsx     # 앱 평점 유도 모달
│   │   │   └── PremiumBadge.tsx     # 프리미엄 뱃지
│   │   ├── player/
│   │   │   ├── YoutubePlayer.tsx    # YouTube iframe 래퍼
│   │   │   ├── PlayerControls.tsx   # 이전/다음/보관함/타이머 버튼
│   │   │   ├── RadioModeBar.tsx     # 라디오 모드 상태 표시바
│   │   │   └── SleepTimerProgress.tsx # 잠들기 타이머 남은 시간
│   │   └── onboarding/
│   │       └── OnboardingSlide.tsx  # 온보딩 슬라이드 컴포넌트
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx           # 메인 — 추천 + 가수 Grid
│   │   ├── PlayerScreen.tsx         # 유튜브 재생 화면
│   │   ├── FavoriteScreen.tsx       # 내 보관함
│   │   ├── HistoryScreen.tsx        # 최근 기록
│   │   ├── CategoryScreen.tsx       # 카테고리 + 플레이리스트
│   │   ├── SettingsScreen.tsx       # 설정
│   │   └── OnboardingScreen.tsx     # 온보딩 (최초 1회)
│   │
│   ├── hooks/
│   │   ├── useFavorites.ts          # 즐겨찾기 CRUD (AsyncStorage)
│   │   ├── useHistory.ts            # 최근 재생 기록 관리
│   │   ├── useSleepTimer.ts         # 잠들기 타이머 카운트다운
│   │   ├── useNotifications.ts      # 로컬 알림 스케줄링
│   │   ├── useFontSize.ts           # 글씨 크기 설정 관리
│   │   ├── useAdManager.ts          # 광고 주파수 제어
│   │   ├── useStreaks.ts             # 연속 청취 스트릭
│   │   ├── useRecommendations.ts    # 개인화 추천
│   │   └── useAppRating.ts          # 앱 평점 유도 트리거
│   │
│   ├── store/                       # Zustand 전역 상태
│   │   ├── playerStore.ts           # 현재 재생, 큐, 라디오 모드
│   │   ├── userStore.ts             # 프리미엄, 폰트크기, 다크모드, 스트릭
│   │   └── contentStore.ts          # 가수목록, 카테고리, 플레이리스트
│   │
│   ├── services/
│   │   ├── youtube.ts               # YouTube Data API v3 호출
│   │   ├── analytics.ts             # Firebase Analytics 래퍼
│   │   ├── notifications.ts         # expo-notifications 서비스
│   │   ├── storage.ts               # AsyncStorage 추상화 레이어
│   │   └── admob.ts                 # AdMob 초기화 및 설정
│   │
│   ├── data/
│   │   ├── singers.ts               # 가수 20명 전체 데이터
│   │   ├── categories.ts            # 카테고리 6개 정의
│   │   └── playlists.ts             # 큐레이션 플레이리스트
│   │
│   ├── constants/
│   │   ├── colors.ts                # 라이트/다크 고대비 팔레트
│   │   ├── fonts.ts                 # 3단계 폰트 스케일
│   │   ├── ads.ts                   # 애드몹 유닛 ID
│   │   └── config.ts                # 앱 전체 설정값
│   │
│   └── types/
│       └── index.ts                 # TypeScript 인터페이스 전체
│
└── assets/
    ├── singers/                     # 가수 썸네일 (오프라인 폴백)
    ├── icons/                       # 앱 아이콘
    └── onboarding/                  # 온보딩 일러스트
```

---

## 8. 핵심 타입 정의 (Core Types)

```typescript
// src/types/index.ts

export interface Singer {
  id: string;
  name: string;
  nameEn: string;
  tier: 'mega' | 'popular' | 'classic';
  channelId?: string;
  searchQuery: string;
  thumbnailUrl?: string;
  thumbnailLocal?: string;
  tags: string[];
  description: string;
}

export interface Video {
  id: string;               // YouTube videoId
  title: string;
  singerId: string;
  singerName: string;
  thumbnailUrl: string;
  duration?: string;        // 'PT3M45S' 형식
  viewCount?: string;
  publishedAt?: string;
}

export interface HistoryItem extends Video {
  playedAt: number;         // timestamp
}

export interface Category {
  id: string;
  name: string;            // 한국어
  emoji: string;
  description: string;
  searchQuery: string;
  color: string;
}

export interface Playlist {
  id: string;
  name: string;            // 한국어
  emoji: string;
  description: string;
  videoIds: string[];      // 큐레이션된 YouTube 영상 ID 목록
  updatedAt: number;
}

export type FontLevel = 'normal' | 'large' | 'xlarge';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface UserPreferences {
  fontLevel: FontLevel;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  notificationTime: string;  // 'HH:MM' 형식, 예: '10:00'
  isPremium: boolean;
  premiumExpiresAt?: number;
  hasCompletedOnboarding: boolean;
  favoriteSingerIds: string[]; // 온보딩에서 선택
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastListenDate: string;  // 'YYYY-MM-DD' 형식
  totalDaysListened: number;
}

export type RewardedAdType = 'favorites' | 'ad-free-24h';
```

---

## 9. 리텐션 기능 상세 (Retention Features)

### 9-1. 잠들기 타이머 (useSleepTimer)

```typescript
// src/hooks/useSleepTimer.ts 시그니처

interface SleepTimerState {
  isActive: boolean;
  remainingSeconds: number;
  targetMinutes: number;
}

interface SleepTimerActions {
  startTimer: (minutes: number) => void;
  cancelTimer: () => void;
  // 내부 동작:
  // - 타이머 종료 120초 전: 플레이어 볼륨 서서히 감소
  // - 타이머 종료: 플레이어 정지, 화면 딤
  // - 마지막 설정값 AsyncStorage에 저장 (다음 번 기본값으로 활용)
}
```

### 9-2. 연속 청취 스트릭 (useStreaks)

- 매일 앱 열 때 오늘 날짜 vs `lastListenDate` 비교
- 연속 달성 알림 토스트: 7일 "🔥 7일 연속!", 30일 "🎉 한 달 달성!", 100일 "👑 100일 트로트 마스터!"
- 홈 탭 아이콘에 스트릭 뱃지 표시 (`🔥 7일`)
- 스트릭이 끊기면 "어제 못 들으셨군요. 오늘 다시 시작해요! 💪" 메시지

### 9-3. 로컬 푸시 알림 (useNotifications)

3가지 알림 타입 (서버 없이 expo-notifications 로컬 스케줄링):

1. **매일 추천곡 알림** — 사용자 설정 시간(기본 오전 10시)
   - "오늘의 트롯 🎵 {가수명}의 노래가 기다려요!"
   - 매일 reschedule (자정 지나면 다음 날 예약)

2. **스트릭 유지 알림** — 오후 7시, 스트릭 2일 이상 & 당일 미청취 시
   - "{streak}일 연속 트롯 감상 중! 오늘도 들으러 오세요 🎶"

3. **앱 깨우기 알림** — 3일 이상 미접속 시
   - "보고 싶었어요! 새 트로트 영상이 추가됐어요 🎵"

**권한 요청 전략**:
- 온보딩 3단계에서 앱 내 설명 화면 먼저 표시
- "예, 알려주세요" 탭 시에만 시스템 권한 다이얼로그 표시
- 거부해도 설정 화면에서 언제든 활성화 가능

### 9-4. 앱 평점 유도 (useAppRating)

```typescript
// 평점 요청 조건 (모두 충족 시):
// 1. 앱 실행 횟수 >= 5
// 2. 영상 1개 이상 80% 이상 시청
// 3. 설치 후 3일 이상 경과
// 4. 이전 평점 요청 없음 (hasRatedApp: false)
// 5. 마지막 요청 후 7일 이상 경과
//
// 시스템 다이얼로그 바로 띄우지 않음!
// 먼저 앱 내 프리 프롬프트 표시:
// "트롯통이 마음에 드셨나요? ⭐"
// [별점 주기] [다음에] 버튼
// → "별점 주기" 터치 시 StoreReview.requestReview() 호출
```

---

## 10. 앱스토어 최적화 (ASO)

### 앱 메타데이터

```
앱 제목 (30자): 트롯통 - 트로트 무료 라디오
부제목 (30자): 임영웅·이찬원·송가인 한방에
```

### iOS 키워드 (100자 이내)
```
트로트,트롯,임영웅,이찬원,송가인,영탁,나훈아,라디오,노래,트롯라디오,어르신,실버,가요
```

### 앱 설명 오프닝 (첫 3줄이 핵심)
```
📱 버튼 하나로 트로트 유튜브 영상을 바로 보세요!
어르신도 쉽게 쓰는 큰 글씨 트로트 앱
임영웅, 이찬원, 송가인, 영탁, 나훈아... 인기 가수 모두 있어요
```

### 스크린샷 6장 구성

| 순서 | 화면 | 오버레이 카피 |
|---|---|---|
| 1 | 홈 — 가수 Grid | "좋아하는 가수 바로 선택" |
| 2 | 재생 화면 | "유튜브 영상 바로 재생" |
| 3 | 라디오 모드 | "화면 켜두고 라디오처럼" |
| 4 | 잠들기 타이머 | "주무시면서도 트로트를" |
| 5 | 큰 글씨 모드 | "큰 글씨로 더 쉽게" |
| 6 | 보관함 화면 | "좋아하는 노래 모아두기" |

### 마케팅 전략 — "효도 앱" 각도

> 핵심 인사이트: 한국 시니어 앱의 최고 획득 채널은 **자녀의 추천**입니다.

- **카카오톡 공유 기능** 필수 구현: "부모님께 트롯통 선물하기" 버튼
  - 공유 메시지: "엄마(아빠), 이 앱 깔아보세요! 트로트 영상 바로 볼 수 있어요 😊"
- 네이버 카페 '노인복지', '트로트 팬' 커뮤니티 홍보
- 카카오톡 시니어 단체방 바이럴 — 입소문 마케팅

---

## 11. 개발 로드맵 (Development Roadmap)

### Phase 1 — 수익 기반 구축 (1-3주)

우선순위 순서 (수익/노력 비율 기준):

1. Expo 프로젝트 초기화 + EAS 설정
2. 기본 네비게이션 (탭 5개 + 플레이어 스택)
3. `SINGERS` 데이터 + `HomeScreen` 가수 Grid
4. `PlayerScreen` — YouTube iframe + 기본 컨트롤
5. **AdMob 배너 광고** 연동 (`AdBanner.tsx` + 화면 3곳)
6. **전면 광고** + `useAdManager` (주파수 제어)
7. **`useSleepTimer`** + `SleepTimerModal` — 킬러 기능 1순위
8. `useHistory` + `HistoryScreen`
9. `useFontSize` + `FontSizeToggle` + `FontSizeContext`
10. 다크 모드 (`userStore` + 테마 컨텍스트)

### Phase 2 — 콘텐츠 & 리텐션 (4-6주)

11. 가수 20명 전체 로스터 + 썸네일
12. `CategoryScreen` — 6개 카테고리
13. 큐레이션 플레이리스트 3개
14. **온보딩 3화면** (가수 선택 + 알림 동의)
15. **로컬 푸시 알림** `useNotifications`
16. `useStreaks` + 스트릭 뱃지 UI
17. `useRecommendations` + 홈 "자주 듣는 가수" 섹션

### Phase 3 — 수익 심화 (7-9주)

18. **RevenueCat** 구독 연동 (`react-native-purchases`)
19. 보상형 광고 (`REWARDED` 유닛)
20. 보관함 슬롯 제한 + 업그레이드 유도 UI
21. `useAppRating` + 평점 프리 프롬프트
22. **카카오톡 공유** 기능
23. `SettingsScreen` 완성 (구독 관리 포함)

### Phase 4 — 분석 & 최적화 (10주+)

24. Firebase Analytics 전체 이벤트 연동
25. 전면 광고 주파수 A/B 테스트 (3회 vs 5회)
26. YouTube API 캐시 최적화 (24시간 TTL)
27. 오프라인 모드 (캐시된 목록 표시)
28. ASO 키워드 최적화
29. 앱 성능 프로파일링

---

## 12. Firebase Analytics 이벤트 (Analytics Events)

```typescript
// src/utils/analytics.ts 에 정의할 이벤트 상수

export const ANALYTICS_EVENTS = {
  // 콘텐츠
  SINGER_SELECTED: 'singer_selected',          // { singer_name, source }
  VIDEO_PLAYED: 'video_played',                // { video_id, singer_name, category }
  VIDEO_COMPLETED: 'video_completed',          // { video_id, singer_name }
  RADIO_MODE_STARTED: 'radio_mode_started',    // { singer_name }
  SLEEP_TIMER_SET: 'sleep_timer_set',          // { duration_minutes }

  // 보관함
  FAVORITE_ADDED: 'favorite_added',            // { singer_name, video_id }
  FAVORITE_REMOVED: 'favorite_removed',        // { singer_name, video_id }

  // 광고
  AD_BANNER_LOADED: 'ad_banner_loaded',        // { screen }
  AD_INTERSTITIAL_SHOWN: 'ad_interstitial_shown', // { trigger_count }
  AD_REWARDED_STARTED: 'ad_rewarded_started',  // { reward_type }
  AD_REWARDED_COMPLETED: 'ad_rewarded_completed', // { reward_type }

  // 수익
  PREMIUM_PROMPT_SHOWN: 'premium_prompt_shown',  // { trigger }
  PREMIUM_PURCHASE_STARTED: 'premium_purchase_started',
  PREMIUM_PURCHASE_COMPLETED: 'premium_purchase_completed',

  // UX
  FONT_SIZE_CHANGED: 'font_size_changed',      // { level }
  DARK_MODE_TOGGLED: 'dark_mode_toggled',      // { enabled }
  NOTIFICATION_TAPPED: 'notification_tapped',  // { type }
  STREAK_MILESTONE: 'streak_milestone',        // { streak_days }
  RATING_PROMPT_SHOWN: 'rating_prompt_shown',
  RATING_SUBMITTED: 'rating_submitted',
  SHARE_TAPPED: 'share_tapped',                // { platform }
} as const;
```

---

## 13. 환경 설정 (Environment Setup)

```bash
# .env.example — 이 파일은 Git에 포함, 실제 값 없이 키만

EXPO_PUBLIC_ADMOB_APP_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_APP_IOS=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_BANNER_HOME=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_BANNER_FAVORITE=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_BANNER_HISTORY=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_INTERSTITIAL=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_REWARDED=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_YOUTUBE_API_KEY=AIzaSy...
EXPO_PUBLIC_REVENUECAT_IOS=appl_...
EXPO_PUBLIC_REVENUECAT_ANDROID=goog_...
```

```typescript
// app.config.ts — 동적 설정
import 'dotenv/config';

export default {
  expo: {
    name: '트롯통',
    slug: 'trottong',
    version: '1.0.0',
    plugins: [
      ['react-native-google-mobile-ads', {
        androidAppId: process.env.EXPO_PUBLIC_ADMOB_APP_ANDROID,
        iosAppId: process.env.EXPO_PUBLIC_ADMOB_APP_IOS,
      }],
      '@react-native-firebase/app',
    ],
    extra: {
      youtubeApiKey: process.env.EXPO_PUBLIC_YOUTUBE_API_KEY,
      revenueCatIos: process.env.EXPO_PUBLIC_REVENUECAT_IOS,
      revenueCatAndroid: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID,
      eas: { projectId: 'YOUR_EAS_PROJECT_ID' },
    },
  },
};
```

---

## 14. 개발 규칙 및 금지사항 (Rules & Prohibitions)

### 반드시 지켜야 할 규칙 ✅

1. **모든 UI 텍스트는 한국어** — 예외 없음
2. **최소 터치 영역 44px** — 모든 인터랙티브 요소
3. **API 키는 절대 코드에 하드코딩 금지** — .env + EAS Secrets 사용
4. **가수 선택 후 즉시 전면 광고 금지** — `useAdManager` 조건 엄수
5. **라디오 모드 중 광고 차단** — 사용자 경험 보호
6. **AsyncStorage 키 네이밍**: `@trottong:{key}` 형식 통일
7. **Zustand 스토어 3개만** — `playerStore`, `userStore`, `contentStore`

### 금지사항 ❌

- 회원가입/로그인 화면 구현
- 영어 UI 텍스트 사용
- 전면 광고를 매 가수 선택마다 표시
- YouTube API 결과를 캐시 없이 매번 호출 (쿼터 낭비)
- 배경 오디오 추출 (YouTube ToS 위반 위험)
- 순수 검정(#000000) 배경 사용 (헤일로 효과)

---

## 15. YouTube API 사용 가이드

```typescript
// src/services/youtube.ts 핵심 패턴

// API 쿼터 절약을 위한 캐시 전략
// - 검색 결과: 24시간 TTL
// - AsyncStorage 키: @trottong:yt_cache_{singerId}_{timestamp}
// - 쿼터 할당: 10,000 유닛/일 (검색 1회 = 100 유닛)
// - 권장: 가수당 1회/일 이하 호출

// 우선순위:
// 1. channelId 있는 경우: channels.list API (search보다 신뢰성 높음)
// 2. channelId 없는 경우: search.list API
// 3. 캐시 만료 전: AsyncStorage 캐시 반환 (API 호출 불필요)

interface YouTubeService {
  getSingerVideos(singer: Singer, maxResults?: number): Promise<Video[]>;
  getVideoDetails(videoIds: string[]): Promise<Video[]>;
  searchVideos(query: string, maxResults?: number): Promise<Video[]>;
}
```

---

## 15-1. YouTube 비디오 ID 갱신 (Video ID Refresh)

> `src/data/` 파일들의 비디오 ID는 API 없이 즉시 재생을 위해 하드코딩되어 있습니다.
> 영상 삭제/비공개 전환에 대비하여 **월 1회** 갱신을 권장합니다.

### 갱신 도구

`/youtube-music-fetch` 스킬을 사용합니다.
스킬 내부의 Python 스크립트(`.claude/skills/youtube-music-fetch/youtube_music_fetcher.py`)가 YouTube Data API v3을 호출합니다.

```bash
# 사전 준비
pip install google-api-python-client python-dotenv
# .env에 YOUTUBE_API_KEY=AIzaSy... 설정 필요
```

### AI가 비디오 ID 갱신 시 사용할 스킬

각 가수의 `searchQuery`를 사용하여 **최소 10개 이상** 수집합니다.

```
# 기본 사용법
/youtube-music-fetch {가수 searchQuery} --max 12

# 클래식 가수 (결과 부족 시 필터 완화)
/youtube-music-fetch {가수 searchQuery} --max 12 --no-filter

# 카테고리/플레이리스트
/youtube-music-fetch {카테고리 searchQuery} --max 12
```

### 갱신 대상 및 필드

| 파일 | 대상 | 필드명 | 최소 개수 |
|---|---|---|---|
| `src/data/singers.ts` | 가수 20명 | `featuredVideoIds` | 10개 |
| `src/data/categories.ts` | 카테고리 6개 | `featuredVideoIds` | 10개 |
| `src/data/playlists.ts` | 플레이리스트 5개 | `videoIds` | 10개 |

### 갱신 규칙

1. **중복 금지**: 같은 파일 내에서 동일 비디오 ID가 중복되지 않도록 확인
2. **스크립트 출력 활용**: TypeScript 배열 형식 출력을 복사하여 해당 배열에 붙여넣기
3. **클래식 가수**: `--no-filter` 옵션 사용 (공식 MV가 적어 필터링 시 결과 부족)
4. **API 할당량 주의**: 전체 갱신 ≈ 3,200 유닛 (일일 한도 10,000 유닛)
5. **갱신 후 검증**: 반드시 `npx tsc --noEmit` 실행하여 타입 오류 확인

### 빠른 갱신 요청 (사용자 → AI)

```
src/data/ 폴더의 모든 파일의 비디오 ID를 /youtube-music-fetch 스킬로 재갱신해줘.
노래는 중복되지 않도록 가능하면 10개 이상으로.
```

### API 할당량 초과 시

- **증상**: `quotaExceeded` 오류 발생
- **리셋 시간**: 태평양 시간 자정 (한국시간 오후 4시)
- **대안**: 다른 Google Cloud 프로젝트의 API 키 사용 또는 다음 날 재시도

---

## 16. 검증 체크리스트 (Verification Checklist)

모든 작업 완료 전 아래를 체크합니다.

### 코드 품질
- [ ] `npx tsc --noEmit` — TypeScript 오류 0개
- [ ] 영어 UI 텍스트 없음 (버튼, 탭, 헤더, 토스트)
- [ ] 새 버튼/터치 요소 최소 44px 확인

### 빌드
- [ ] `npx expo export --platform web` 성공
- [ ] 번들 크기 이전 대비 +20% 이하

### Playwright E2E
- [ ] `npx playwright test` 전체 통과
- [ ] 실패한 테스트 스크린샷 확인 및 수정
- [ ] 신규 기능에 대한 테스트 케이스 추가

### 시니어 UX
- [ ] `senior-ux.spec.ts` 통과 (고대비, 폰트 크기, 터치 영역)
- [ ] 온보딩 플로우 정상 동작
- [ ] 다크모드에서 렌더링 확인

---

*이 문서는 트롯통 개발의 단일 진실 공급원(Single Source of Truth)입니다. 새로운 기능 추가 시 이 문서를 먼저 업데이트하세요.*
