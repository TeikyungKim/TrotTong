
## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 실행

| 목적 | 명령어 |
|------|--------|
| Expo Go로 QR 스캔 (Android/iOS 공통) | `npm start` |
| Android 에뮬레이터 / 기기 | `npm run android` |
| iOS 시뮬레이터 / 기기 | `npm run ios` |
| 웹 브라우저 (프록시 포함) | `npm run web:dev` |
| 웹 브라우저 (프록시 없이) | `npm run web` |

#### Expo Go QR 스캔 상세 (`npm start`)

에뮬레이터/USB 연결 없이 실제 기기에서 바로 테스트할 수 있는 가장 빠른 방법입니다.

1. 핸드폰에 **Expo Go** 앱 설치
   - Android: Play 스토어 → "Expo Go" 검색
   - iOS: App Store → "Expo Go" 검색

2. PC에서 개발 서버 실행:
   ```bash
   npm start
   # 또는
   npx expo start
   ```

3. 터미널에 표시된 QR 코드 스캔
   - Android: Expo Go 앱 → **"Scan QR code"**
   - iOS: 기본 카메라 앱으로 QR 스캔

> **필수 조건:** PC와 핸드폰이 **같은 WiFi 네트워크**에 연결되어 있어야 합니다.
>
> **주의:** 네이티브 모듈(expo-secure-store 등)이 포함된 이 프로젝트는 Expo Go의 내장 네이티브 모듈 범위 내에서만 정상 동작합니다. 커스텀 네이티브 코드 추가 시에는 `npm run android` 또는 EAS Build를 사용해야 합니다.

### 3. Android 네이티브 빌드 (`run:android`)

`npx expo run:android`는 Expo Go 없이 네이티브 APK를 직접 빌드해 기기/에뮬레이터에 설치합니다.
단, 빌드 모드에 따라 Metro 번들러 실행 여부가 달라집니다.

| 모드 | 명령어 | Metro 필요 | 설명 |
|------|--------|-----------|------|
| Debug (기본) | `npx expo run:android` | **필요** | JS 번들을 Metro에서 실시간으로 받아옴. Expo 서버 종료 시 앱 실행 불가 |
| Release | `npx expo run:android --variant release` | 불필요 | JS 번들이 APK에 포함됨. 독립 실행 가능 |

> 개발 중에는 debug 모드를 사용하고(핫리로드 지원), 배포·테스트 배포용은 release 또는 EAS Build를 사용하세요.

### 4. 배포용 빌드 (EAS Build)

```bash
# EAS CLI 설치 (최초 1회)
npm install -g eas-cli
eas login

# Android APK / AAB
npx eas build --platform android

# iOS IPA
npx eas build --platform ios

# 전체 플랫폼
npx eas build --platform all
```

---

## AdMob 광고 설정

### 개요

앱 하단에 AdMob 배너 광고가 표시됩니다. 개발 중(Expo Go)에는 Mock 배너가 표시되고, EAS Build 시 실제 AdMob 광고로 전환됩니다.

### 배너 광고 적용 화면

| 화면 | 컴포넌트 | 위치 |
|---|---|---|
| 홈 (HomeScreen) | `<AdBanner screen="home" />` | 하단 고정 |
| 보관함 (FavoriteScreen) | `<AdBanner screen="favorite" />` | 하단 고정 |
| 최근 기록 (HistoryScreen) | `<AdBanner screen="history" />` | 하단 고정 |
| 카테고리 (CategoryScreen) | `<AdBanner screen="category" />` | 하단 고정 |

> PlayerScreen(재생 화면)에는 배너 광고를 넣지 않습니다 (영상 감상 방해 방지).

### 광고 종류

| 종류 | 설명 | 노출 조건 |
|---|---|---|
| **배너 광고** | 화면 하단 고정 320x50 배너 | 프리미엄 유저가 아닌 경우 항상 표시 |
| **전면 광고** | 가수 선택 3회마다 전체 화면 | 5분 간격 + 세션 시작 1분 후부터 |
| **보상형 광고** | 즐겨찾기 슬롯 추가, 24시간 광고 제거 | 사용자가 직접 선택 |

### AdMob API 키 설정

#### 1단계: Google AdMob 계정 생성

1. [Google AdMob](https://admob.google.com/) 접속 → 계정 생성
2. 앱 등록: **앱 추가** → 플랫폼 선택 (Android / iOS)
3. 앱 ID 확인 (예: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

#### 2단계: 광고 단위(Unit) 생성

AdMob 콘솔에서 아래 5개 광고 단위를 생성합니다:

| 광고 단위 | 형식 | 환경변수 키 |
|---|---|---|
| 홈 배너 | 배너 | `EXPO_PUBLIC_BANNER_HOME` |
| 보관함 배너 | 배너 | `EXPO_PUBLIC_BANNER_FAVORITE` |
| 기록 배너 | 배너 | `EXPO_PUBLIC_BANNER_HISTORY` |
| 전면 광고 | 전면 | `EXPO_PUBLIC_INTERSTITIAL` |
| 보상형 광고 | 보상형 | `EXPO_PUBLIC_REWARDED` |

#### 3단계: 환경변수 설정 (로컬 개발)

`.env` 파일에 AdMob 키를 추가합니다:

```bash
# .env (로컬 개발용 — Git에 포함하지 않음)
EXPO_PUBLIC_ADMOB_APP_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_APP_IOS=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_BANNER_HOME=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_BANNER_FAVORITE=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_BANNER_HISTORY=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_INTERSTITIAL=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_REWARDED=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

> 환경변수 없으면 자동으로 Google 테스트 ID가 사용됩니다 (개발 중 안전).

#### 4단계: EAS Secrets 설정 (프로덕션 빌드)

프로덕션 빌드에서는 EAS Secrets로 키를 관리합니다:

```bash
# EAS CLI로 시크릿 등록
eas secret:create --name EXPO_PUBLIC_ADMOB_APP_ANDROID --value "ca-app-pub-..."
eas secret:create --name EXPO_PUBLIC_ADMOB_APP_IOS --value "ca-app-pub-..."
eas secret:create --name EXPO_PUBLIC_BANNER_HOME --value "ca-app-pub-..."
eas secret:create --name EXPO_PUBLIC_BANNER_FAVORITE --value "ca-app-pub-..."
eas secret:create --name EXPO_PUBLIC_BANNER_HISTORY --value "ca-app-pub-..."
eas secret:create --name EXPO_PUBLIC_INTERSTITIAL --value "ca-app-pub-..."
eas secret:create --name EXPO_PUBLIC_REWARDED --value "ca-app-pub-..."
```

#### 5단계: 네이티브 모듈 설치 (EAS Build 전)

```bash
# AdMob 네이티브 모듈 설치
npm install react-native-google-mobile-ads

# app.json plugins에 추가 (또는 app.config.ts 생성)
# "plugins": [
#   ["react-native-google-mobile-ads", {
#     "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
#     "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
#   }]
# ]
```

#### 6단계: Mock → 실제 광고 전환

`src/components/ui/AdBanner.tsx`에서 주석 처리된 `BannerAd` import를 해제합니다:

```typescript
// 주석 해제:
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../services/admob';
```

### 관련 파일

| 파일 | 역할 |
|---|---|
| `src/components/ui/AdBanner.tsx` | 배너 광고 컴포넌트 (Mock/실제 전환) |
| `src/services/admob.ts` | 광고 단위 ID + 전면/보상형 광고 함수 |
| `src/hooks/useAdManager.ts` | 전면 광고 주파수 제어 (3회/5분 간격) |
| `src/constants/config.ts` | 광고 주파수 설정값 |
| `src/store/userStore.ts` | 프리미엄/광고 제거 상태 관리 |

### 주의사항

- **Expo Go에서는 AdMob 동작 불가** — 네이티브 모듈 필요, EAS Build 필수
- **테스트 시 반드시 테스트 ID 사용** — 실제 ID로 테스트하면 AdMob 계정 정지 위험
- **라디오 모드 중에는 전면 광고 차단** — 사용자 경험 보호
- **프리미엄 유저에게는 모든 광고 숨김** — `isAdFree()` 체크

---

## 비디오 ID 자동 갱신 시스템 (GitHub Actions + GitHub Pages)

`src/data/` 폴더의 비디오 ID는 **GitHub Actions + GitHub Pages**를 통해 매일 자동 갱신됩니다.
앱에 하드코딩된 번들 데이터는 폴백으로 유지되며, 앱 시작 시 원격 데이터를 우선 사용합니다.

### 아키텍처

```
┌─────────────────┐   매일 06:00 KST   ┌───────────────┐    JSON 배포     ┌──────────────────┐
│ GitHub Actions   │ ────────────────→  │ YouTube API   │ ──────────────→  │ GitHub Pages     │
│ (cron 스케줄)    │   스크립트 실행     │ 데이터 수집    │   gh-pages 브랜치 │ (정적 CDN 역할)   │
└─────────────────┘                     └───────────────┘                  └──────────────────┘
                                                                                   │
                                          https://teikyungkim.github.io/TrotTong/data/video-ids.json
                                                                                   │
                                                                            ┌──────▼──────┐
                                                                            │  앱 시작 시   │
                                                                            │ fetch + 캐시  │
                                                                            │ 실패 → 번들   │
                                                                            └─────────────┘
```

### 앱의 4단계 폴백 전략

| 우선순위 | 소스 | 조건 |
|---|---|---|
| 1 | AsyncStorage 캐시 | 24시간 이내 |
| 2 | GitHub Pages fetch | 네트워크 가능, 5초 타임아웃 |
| 3 | 만료된 캐시 | 네트워크 실패 시 |
| 4 | 번들 데이터 (`src/data/*.ts`) | 최초 실행 + 오프라인 |

### 관련 파일

| 파일 | 역할 |
|---|---|
| `.github/workflows/refresh-video-ids.yml` | GitHub Actions 워크플로우 (매일 cron + 수동 트리거) |
| `scripts/refresh-video-ids.py` | YouTube API 일괄 수집 스크립트 |
| `scripts/data-sources.json` | 가수/카테고리/플레이리스트 검색어 설정 |
| `src/services/remoteData.ts` | 앱 fetch + 캐시 + 폴백 서비스 |

### JSON 출력 형식

```json
{
  "version": 1,
  "generatedAt": "2026-03-15T21:00:00Z",
  "singers": {
    "lim-young-woong": ["videoId1", "videoId2", "..."],
    "lee-chan-won": ["videoId1", "videoId2", "..."]
  },
  "categories": {
    "ballad": ["videoId1", "videoId2", "..."]
  },
  "playlists": {
    "top10-this-week": ["videoId1", "videoId2", "..."]
  }
}
```

### 초기 설정 (한 번만)

1. GitHub repo Settings > **Secrets and variables** > **Actions** > `YOUTUBE_API_KEY` 추가
2. Google Cloud Console에서 해당 프로젝트의 **YouTube Data API v3** 활성화
3. GitHub repo Settings > **Pages** > Source: **Deploy from a branch** > `gh-pages` / `/ (root)`
4. Actions 탭에서 **Refresh Video IDs** > **Run workflow**로 첫 실행

### 수동 실행

GitHub Actions 탭 > Refresh Video IDs > **Run workflow** 버튼 클릭

### API 할당량

- 일일 사용량: ~3,100 유닛 (한도 10,000)
- 가수 20명 × 검색 = ~2,000 유닛 / 카테고리 6개 + 플레이리스트 5개 = ~1,100 유닛
- 할당량 리셋: 태평양 시간 자정 (한국시간 오후 4시)

### 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| `quotaExceeded` 오류 | API 일일 할당량 초과 | 오후 4시(KST) 이후 재실행 또는 새 프로젝트 API 키 사용 |
| `API has not been used` 오류 | YouTube Data API v3 미활성화 | Google Cloud Console에서 API 활성화 |
| 앱에서 번들 데이터만 사용 | GitHub Pages 미설정 또는 네트워크 오류 | Pages 설정 확인, URL 접근 테스트 |
| 특정 가수 결과 0건 | 검색 필터에 걸림 | `scripts/data-sources.json`에서 searchQuery 조정 |

---

## 카테고리 비디오 ID 수집 로직

카테고리별 비디오 ID는 원격/번들 데이터 + 가수 태그 자동 보충으로 구성됩니다.

### 카테고리 검색어 (`src/data/categories.ts`)

| ID | 이름 | `searchQuery` |
|---|---|---|
| `ballad` | 트로트 발라드 | `트로트 발라드 명곡` |
| `upbeat` | 신나는 트로트 | `신나는 트로트 최신` |
| `classic` | 옛날 트로트 | `70년대 80년대 트로트 명곡` |
| `latest` | 최신 트로트 | `2024 최신 트로트` |
| `bedtime` | 잠들기 트로트 | `잠들기 좋은 트로트 발라드` |
| `morning` | 아침 트로트 | `아침 신나는 트로트` |

> `searchQuery`는 앱 런타임에서 직접 사용되지 않으며, `/youtube-music-fetch` 스킬이나 `scripts/refresh-video-ids.py`에서 비디오 ID를 수집할 때 검색어로 사용됩니다.

### 비디오 ID 로딩 우선순위 (`src/services/remoteData.ts`)

```
1. 원격 데이터 (GitHub Pages JSON의 categories[id])
2. 번들 데이터 (categories.ts의 featuredVideoIds)
3. 어느 쪽이든 15개 미만이면 → 가수 태그 기반 자동 보충
```

### 가수 태그 자동 보충 (`CATEGORY_TAG_MAP`)

카테고리 비디오가 15개(`TARGET_CATEGORY_SIZE`) 미만일 때, 매핑된 태그를 가진 가수들의 `featuredVideoIds`에서 중복 없이 채웁니다.

| 카테고리 ID | 보충 태그 | 설명 |
|---|---|---|
| `ballad` | `['ballad']` | 발라드 태그 가수 |
| `upbeat` | `['upbeat']` | 신나는 태그 가수 |
| `classic` | `['classic']` | 클래식 태그 가수 |
| `latest` | `['latest']` | 최신 태그 가수 |
| `bedtime` | `['ballad', 'classic']` | 발라드 + 클래식 가수 |
| `morning` | `['upbeat', 'latest']` | 신나는 + 최신 가수 |

`supplementFromSingerTags()` 함수가 `SINGERS` 배열을 순회하며 해당 태그를 가진 가수의 비디오 ID를 15개까지 채웁니다.

---

## 비디오 ID 수동 갱신 (Claude Code 스킬)

자동 갱신과 별도로, Claude Code에서 `/youtube-music-fetch` 스킬을 사용해 수동 갱신도 가능합니다.

### 사전 준비

```bash
pip install google-api-python-client python-dotenv
echo "YOUTUBE_API_KEY=AIzaSy..." >> .env
```

### 사용법

```bash
# 직접 실행
python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "임영웅 노래" --max 12
python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "현철 봉선화연정" --max 12 --no-filter

# Claude Code 스킬 (권장)
/youtube-music-fetch 임영웅 노래 --max 12
```

### 갱신 대상 파일

| 파일 | 내용 | 비디오 ID 필드 |
|---|---|---|
| `src/data/singers.ts` | 가수 20명 × 각 10개 이상 | `featuredVideoIds` |
| `src/data/categories.ts` | 카테고리 6개 × 각 10개 이상 | `featuredVideoIds` |
| `src/data/playlists.ts` | 플레이리스트 5개 × 각 10개 이상 | `videoIds` |

---

## YouTube URL 패턴 가이드

YouTube는 영상 ID(`VIDEO_ID`)를 기반으로 다양한 리소스에 접근할 수 있는 URL 패턴을 제공합니다.

### 썸네일 (Thumbnail)

모든 YouTube 영상은 `https://img.youtube.com/vi/{VIDEO_ID}/` 경로에서 여러 해상도의 썸네일을 제공합니다.

| 이름 | URL | 해상도 | 비고 |
|------|-----|--------|------|
| Default | `https://img.youtube.com/vi/{VIDEO_ID}/default.jpg` | 120×90 | 가장 작은 크기 |
| Medium Quality | `https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg` | 320×180 | 16:9 비율 |
| High Quality | `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg` | 480×360 | 4:3 비율, 상하 레터박스 |
| Standard Definition | `https://img.youtube.com/vi/{VIDEO_ID}/sddefault.jpg` | 640×480 | 4:3 비율 |
| Max Resolution | `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg` | 1280×720 | HD, 일부 영상만 제공 |

> **참고:** `maxresdefault.jpg`는 HD 이상 영상에서만 존재합니다. 없을 경우 404를 반환하므로 `hqdefault.jpg`를 폴백으로 사용하세요.

**숫자 인덱스 썸네일** — 영상 내 자동 캡처 프레임:

| URL | 설명 |
|-----|------|
| `https://img.youtube.com/vi/{VIDEO_ID}/0.jpg` | 대표 썸네일 (480×360) |
| `https://img.youtube.com/vi/{VIDEO_ID}/1.jpg` | 1/4 지점 캡처 |
| `https://img.youtube.com/vi/{VIDEO_ID}/2.jpg` | 2/4 지점 캡처 |
| `https://img.youtube.com/vi/{VIDEO_ID}/3.jpg` | 3/4 지점 캡처 |

**대체 도메인** — `i.ytimg.com`도 동일하게 동작합니다:
```
https://i.ytimg.com/vi/{VIDEO_ID}/hqdefault.jpg
```

### 영상 시청 (Watch)

| 용도 | URL |
|------|-----|
| 일반 시청 | `https://www.youtube.com/watch?v={VIDEO_ID}` |
| 특정 시간부터 재생 | `https://www.youtube.com/watch?v={VIDEO_ID}&t={SECONDS}s` |
| 짧은 공유 링크 | `https://youtu.be/{VIDEO_ID}` |
| 시간 지정 공유 | `https://youtu.be/{VIDEO_ID}?t={SECONDS}` |

### 임베드 (Embed)

| 용도 | URL |
|------|-----|
| 기본 임베드 | `https://www.youtube.com/embed/{VIDEO_ID}` |
| 자동 재생 | `https://www.youtube.com/embed/{VIDEO_ID}?autoplay=1` |
| 반복 재생 | `https://www.youtube.com/embed/{VIDEO_ID}?loop=1&playlist={VIDEO_ID}` |
| 컨트롤 숨김 | `https://www.youtube.com/embed/{VIDEO_ID}?controls=0` |
| 관련 영상 숨김 | `https://www.youtube.com/embed/{VIDEO_ID}?rel=0` |
| 복합 파라미터 | `https://www.youtube.com/embed/{VIDEO_ID}?autoplay=1&rel=0&modestbranding=1` |

> **앱 내 사용:** `react-native-youtube-iframe`은 내부적으로 임베드 URL을 사용합니다. `videoId` prop만 전달하면 됩니다.

### 채널 (Channel)

| 용도 | URL |
|------|-----|
| 채널 ID로 접근 | `https://www.youtube.com/channel/{CHANNEL_ID}` |
| 핸들로 접근 | `https://www.youtube.com/@{HANDLE}` |
| 채널 영상 목록 | `https://www.youtube.com/channel/{CHANNEL_ID}/videos` |

### 플레이리스트 (Playlist)

| 용도 | URL |
|------|-----|
| 플레이리스트 페이지 | `https://www.youtube.com/playlist?list={PLAYLIST_ID}` |
| 플레이리스트 임베드 | `https://www.youtube.com/embed/videoseries?list={PLAYLIST_ID}` |

### 프로젝트 내 활용 예시

```typescript
// 썸네일 URL 생성 헬퍼
const getThumbnailUrl = (videoId: string, quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'hq') => {
  const prefix = quality === 'default' ? '' : quality;
  return `https://img.youtube.com/vi/${videoId}/${prefix}default.jpg`;
};

// categories.ts에서 사용 중인 패턴
const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
```

---

## 스택

- **Expo SDK 54** + **Expo Router 6** (파일 기반 라우팅)
