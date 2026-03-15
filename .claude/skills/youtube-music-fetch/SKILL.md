---
name: youtube-music-fetch
description: YouTube에서 특정 아티스트/검색어의 공식 음악 영상 ID를 수집하여 프로젝트 데이터 파일에 활용
user_invocable: true
---

# YouTube 음악 영상 ID 수집 스킬

유튜브에서 특정 아티스트 또는 검색어의 **노래/뮤직비디오 영상만** 필터링하여 비디오 ID 목록을 가져온다.

## 사용자 입력

- `$QUERY`: 검색할 아티스트명 또는 검색어 (필수)
- `$MAX_RESULTS`: 가져올 최대 영상 수 (기본값: 20)
- `$ARGUMENTS`: 추가 옵션 (--playlist, --save, --no-filter)

사용자가 인자를 제공하지 않으면, 먼저 검색어를 물어본다.

## 실행 방법

이 스킬 디렉토리 내의 `youtube_music_fetcher.py` 스크립트를 사용한다.

### 기본 검색

```bash
cd f:/Projects/TrotTong && python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "$QUERY" --max $MAX_RESULTS
```

### 플레이리스트 모드 (PL로 시작하는 ID가 주어진 경우)

```bash
cd f:/Projects/TrotTong && python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "$QUERY" --playlist --max $MAX_RESULTS
```

### JSON 저장이 필요한 경우

```bash
cd f:/Projects/TrotTong && python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "$QUERY" --max $MAX_RESULTS --save results_${QUERY}.json
```

### 필터 완화 (결과가 부족할 때)

```bash
cd f:/Projects/TrotTong && python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "$QUERY" --max $MAX_RESULTS --no-filter
```

## 스크립트 기능 요약

### 검색 전략

1. **검색 API 호출**: `{query} official MV OR official video OR music video` 쿼리로 Music 카테고리(10)에서 한국 리전 검색
2. **제목 기반 필터링**:
   - 포함 키워드 (하나 이상 매치): MV, M/V, Official Video, Official Audio, Music Video, Lyrics, 가사, 뮤직비디오, 공식
   - 제외 키워드: reaction, cover, 커버, dance practice, behind, 비하인드, making, interview, vlog, fancam, 직캠, remix, instrumental, karaoke, 노래방, shorts 등
3. **영상 길이 필터**: 1분 30초 ~ 10분 범위만 유지 (쇼츠/컴필레이션 제거)

### 출력 형식

스크립트는 3가지 형식으로 결과를 출력한다:
1. **상세 목록**: 제목, 채널, 길이, ID, URL
2. **비디오 ID 목록**: 복사용 플레인 텍스트
3. **TypeScript 배열**: `src/data/categories.ts` 또는 `src/data/playlists.ts`에 바로 붙여넣기 가능

### 에러 처리

- API 키 미설정 → 설정 안내 출력
- API 할당량 초과 → 명확한 안내
- 네트워크 오류 → 최대 3회 재시도
- 결과 0건 → `--no-filter` 옵션 제안

## 의존성

- `google-api-python-client` (pip install google-api-python-client)
- `python-dotenv` (선택, pip install python-dotenv)
- 환경변수 `YOUTUBE_API_KEY` 또는 `.env` 파일에 설정 필요

## 결과 활용

수집된 비디오 ID는 다음 파일에 활용한다:

- `src/data/categories.ts` — 카테고리별 영상 ID 배열
- `src/data/playlists.ts` — 큐레이션 플레이리스트 영상 ID
- `src/data/singers.ts` — 가수별 대표 영상 참조

스크립트 출력의 **TypeScript 배열 형식** 섹션을 복사하여 해당 파일에 붙여넣으면 된다.

## 사용 예시

```
/youtube-music-fetch 임영웅
/youtube-music-fetch 이찬원 --max 30
/youtube-music-fetch PLxxxxxx --playlist
/youtube-music-fetch 송가인 --save results.json
/youtube-music-fetch 마크툽 --no-filter
```
