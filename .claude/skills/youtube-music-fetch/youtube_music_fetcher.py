#!/usr/bin/env python3
"""
YouTube 음악 영상 ID 수집기

특정 아티스트/검색어의 공식 뮤직비디오만 필터링하여 비디오 ID 목록을 수집합니다.
YouTube Data API v3를 사용합니다.

사용법:
    python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "임영웅"
    python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "BTS" --max 30
    python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "PLxxxxxx" --playlist
    python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "아이유" --save results.json
    python .claude/skills/youtube-music-fetch/youtube_music_fetcher.py "마크툽" --no-filter
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from typing import Optional

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    print("오류: google-api-python-client 패키지가 필요합니다.")
    print("설치: pip install google-api-python-client")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv 없어도 환경변수에서 직접 읽기 가능


# ── 필터 키워드 ──────────────────────────────────────────────

INCLUDE_KEYWORDS = [
    "mv", "m/v", "official video", "official audio", "music video",
    "lyrics", "가사", "뮤직비디오", "공식",
]

EXCLUDE_KEYWORDS = [
    "reaction", "cover", "커버", "dance practice", "behind", "비하인드",
    "making", "메이킹", "interview", "인터뷰", "vlog", "브이로그",
    "unboxing", "언박싱", "live", "concert", "fancam", "직캠",
    "remix", "inst", "instrumental", "karaoke", "노래방", "tutorial",
    "shorts", "behind the scenes", "리액션", "챌린지", "challenge",
    "practice", "연습", "teaser", "티저", "preview",
]

# 영상 길이 범위 (초)
MIN_DURATION_SEC = 90   # 1분 30초
MAX_DURATION_SEC = 600  # 10분

MAX_RETRIES = 3
RETRY_DELAY_SEC = 2


# ── API 키 ───────────────────────────────────────────────────

def get_api_key() -> str:
    """환경변수 또는 .env에서 YouTube API 키를 로드합니다."""
    key = os.environ.get("YOUTUBE_API_KEY") or os.environ.get("EXPO_PUBLIC_YOUTUBE_API_KEY")
    if not key:
        print("오류: YouTube API 키가 설정되지 않았습니다.")
        print()
        print("다음 중 하나의 방법으로 설정하세요:")
        print("  1. 환경변수: export YOUTUBE_API_KEY=AIzaSy...")
        print("  2. .env 파일에 YOUTUBE_API_KEY=AIzaSy... 추가")
        print()
        print("API 키 발급: https://console.cloud.google.com/apis/credentials")
        sys.exit(1)
    return key


def build_youtube_client(api_key: str):
    """YouTube Data API v3 클라이언트를 생성합니다."""
    return build("youtube", "v3", developerKey=api_key)


# ── ISO 8601 duration 파싱 ───────────────────────────────────

def parse_duration_to_seconds(duration: str) -> int:
    """ISO 8601 duration 문자열(PT3M45S)을 초 단위로 변환합니다."""
    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def format_duration(duration: str) -> str:
    """ISO 8601 duration을 사람이 읽기 쉬운 형태로 변환합니다."""
    total = parse_duration_to_seconds(duration)
    m, s = divmod(total, 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


# ── API 호출 (재시도 포함) ───────────────────────────────────

def _execute_with_retry(request, description: str = "API 호출"):
    """API 요청을 최대 MAX_RETRIES 회 재시도합니다."""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return request.execute()
        except HttpError as e:
            status = e.resp.status if e.resp else None
            if status == 403 and "quotaExceeded" in str(e):
                print(f"오류: YouTube API 일일 할당량이 초과되었습니다.")
                print("내일 다시 시도하거나, Google Cloud Console에서 할당량을 늘려주세요.")
                sys.exit(1)
            if attempt < MAX_RETRIES:
                wait = RETRY_DELAY_SEC * attempt
                print(f"  {description} 실패 (시도 {attempt}/{MAX_RETRIES}), {wait}초 후 재시도...")
                time.sleep(wait)
            else:
                print(f"오류: {description} 실패 — {e}")
                raise
        except Exception as e:
            if attempt < MAX_RETRIES:
                wait = RETRY_DELAY_SEC * attempt
                print(f"  네트워크 오류 (시도 {attempt}/{MAX_RETRIES}), {wait}초 후 재시도...")
                time.sleep(wait)
            else:
                print(f"오류: 네트워크 연결 실패 — {e}")
                raise


# ── 검색 ─────────────────────────────────────────────────────

def search_music_videos(youtube, query: str, max_results: int = 20, no_filter: bool = False) -> list[dict]:
    """YouTube에서 음악 영상을 검색하고 필터링합니다."""

    search_query = f"{query} official MV OR official video OR music video"
    fetch_count = min(max_results * 3, 50)  # 필터링 손실 대비

    print(f"검색 중: \"{search_query}\" (최대 {fetch_count}건 조회)...")

    request = youtube.search().list(
        part="snippet",
        q=search_query,
        type="video",
        videoCategoryId="10",  # Music
        maxResults=fetch_count,
        order="relevance",
        regionCode="KR",
    )
    response = _execute_with_retry(request, "검색 API")

    videos = []
    for item in response.get("items", []):
        video = {
            "id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"],
            "published_at": item["snippet"].get("publishedAt", ""),
        }
        videos.append(video)

    print(f"  검색 결과: {len(videos)}건")

    if not no_filter:
        videos = filter_by_title(videos)
        print(f"  제목 필터 후: {len(videos)}건")

    if videos:
        videos = filter_by_duration(youtube, videos)
        print(f"  길이 필터 후: {len(videos)}건")

    # 결과가 0건이면 필터 완화 제안
    if not videos:
        print()
        print("필터링 후 결과가 없습니다.")
        print("다음을 시도해보세요:")
        print(f"  --no-filter 옵션으로 제목 필터 비활성화")
        print(f"  검색어를 더 구체적으로 변경 (예: \"{query} 노래 모음\")")
        return []

    return videos[:max_results]


# ── 플레이리스트 ─────────────────────────────────────────────

def get_playlist_videos(youtube, playlist_id: str, max_results: int = 50) -> list[dict]:
    """플레이리스트에서 비디오 ID를 수집합니다."""
    print(f"플레이리스트 조회 중: {playlist_id}...")

    videos = []
    next_page = None

    while len(videos) < max_results:
        request = youtube.playlistItems().list(
            part="contentDetails,snippet",
            playlistId=playlist_id,
            maxResults=min(50, max_results - len(videos)),
            pageToken=next_page,
        )
        response = _execute_with_retry(request, "플레이리스트 API")

        for item in response.get("items", []):
            video = {
                "id": item["contentDetails"]["videoId"],
                "title": item["snippet"]["title"],
                "channel": item["snippet"].get("videoOwnerChannelTitle", ""),
                "published_at": item["snippet"].get("publishedAt", ""),
            }
            videos.append(video)

        next_page = response.get("nextPageToken")
        if not next_page:
            break

    print(f"  플레이리스트 영상: {len(videos)}건")

    if videos:
        videos = filter_by_duration(youtube, videos)
        print(f"  길이 필터 후: {len(videos)}건")

    return videos[:max_results]


# ── 필터링 ───────────────────────────────────────────────────

def filter_by_title(videos: list[dict]) -> list[dict]:
    """제목 기반으로 공식 음악 영상만 필터링합니다."""
    filtered = []
    for video in videos:
        title_lower = video["title"].lower()

        # 제외 키워드 체크
        if any(kw in title_lower for kw in EXCLUDE_KEYWORDS):
            continue

        # 포함 키워드 체크 (하나 이상 매치)
        if any(kw in title_lower for kw in INCLUDE_KEYWORDS):
            filtered.append(video)

    return filtered


def filter_by_duration(youtube, videos: list[dict]) -> list[dict]:
    """영상 길이 기반으로 필터링합니다 (1분30초 ~ 10분)."""
    if not videos:
        return []

    video_ids = [v["id"] for v in videos]

    # 50개씩 나눠서 조회 (API 제한)
    duration_map: dict[str, str] = {}
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i:i + 50]
        request = youtube.videos().list(
            part="contentDetails",
            id=",".join(chunk),
        )
        response = _execute_with_retry(request, "영상 상세정보 API")

        for item in response.get("items", []):
            duration_map[item["id"]] = item["contentDetails"]["duration"]

    filtered = []
    for video in videos:
        duration = duration_map.get(video["id"], "")
        if not duration:
            continue
        seconds = parse_duration_to_seconds(duration)
        if MIN_DURATION_SEC <= seconds <= MAX_DURATION_SEC:
            video["duration"] = duration
            filtered.append(video)

    return filtered


# ── 출력 ─────────────────────────────────────────────────────

def format_results(videos: list[dict], query: str) -> str:
    """결과를 보기 좋은 형식으로 포맷합니다."""
    lines = []
    lines.append("=" * 50)
    lines.append("  YouTube 음악 영상 검색 결과")
    lines.append("=" * 50)
    lines.append(f"검색어: {query}")
    lines.append(f"결과: {len(videos)}건")
    lines.append(f"수집 시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("")

    for i, video in enumerate(videos, 1):
        duration_str = format_duration(video.get("duration", "")) if video.get("duration") else "?"
        lines.append(f"{i:2d}. [제목]  {video['title']}")
        lines.append(f"    [채널]  {video['channel']}")
        lines.append(f"    [길이]  {duration_str}")
        lines.append(f"    [ID]    {video['id']}")
        lines.append(f"    [URL]   https://youtu.be/{video['id']}")
        lines.append("")

    lines.append("=" * 50)
    lines.append("  비디오 ID 목록 (복사용)")
    lines.append("=" * 50)
    for video in videos:
        lines.append(video["id"])

    # TypeScript 배열 형식도 출력 (트롯통 프로젝트 연동용)
    lines.append("")
    lines.append("=" * 50)
    lines.append("  TypeScript 배열 형식 (categories.ts / playlists.ts 용)")
    lines.append("=" * 50)
    id_strings = [f"  '{video['id']}'" for video in videos]
    lines.append("[")
    lines.append(",\n".join(id_strings))
    lines.append("]")

    return "\n".join(lines)


def save_to_json(videos: list[dict], query: str, filename: str):
    """결과를 JSON 파일로 저장합니다."""
    data = {
        "query": query,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "count": len(videos),
        "videos": [
            {
                "id": v["id"],
                "title": v["title"],
                "channel": v["channel"],
                "duration": v.get("duration", ""),
                "url": f"https://youtu.be/{v['id']}",
            }
            for v in videos
        ],
    }

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nJSON 저장 완료: {filename}")


# ── 메인 ─────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="YouTube 음악 영상 ID 수집기",
        epilog="예: python youtube_music_fetcher.py \"임영웅\" --max 20 --save results.json",
    )
    parser.add_argument(
        "query",
        help="검색할 아티스트명/검색어, 또는 --playlist와 함께 플레이리스트 ID",
    )
    parser.add_argument(
        "--max", type=int, default=20,
        help="가져올 최대 영상 수 (기본값: 20)",
    )
    parser.add_argument(
        "--playlist", action="store_true",
        help="query를 플레이리스트 ID로 취급",
    )
    parser.add_argument(
        "--save", metavar="FILE",
        help="결과를 JSON 파일로 저장",
    )
    parser.add_argument(
        "--no-filter", action="store_true",
        help="제목 기반 필터링 비활성화 (더 많은 결과)",
    )

    args = parser.parse_args()

    api_key = get_api_key()
    youtube = build_youtube_client(api_key)

    # 플레이리스트 모드 자동 감지
    is_playlist = args.playlist or args.query.startswith("PL")

    if is_playlist:
        videos = get_playlist_videos(youtube, args.query, args.max)
    else:
        videos = search_music_videos(youtube, args.query, args.max, args.no_filter)

    if not videos:
        sys.exit(0)

    # 결과 출력
    print()
    print(format_results(videos, args.query))

    # JSON 저장
    if args.save:
        save_to_json(videos, args.query, args.save)


if __name__ == "__main__":
    main()
