
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
