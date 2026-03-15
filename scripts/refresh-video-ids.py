#!/usr/bin/env python3
"""
트롯통 비디오 ID 일괄 갱신 스크립트

GitHub Actions에서 매일 실행되어 YouTube API로 최신 비디오 ID를 수집하고
JSON 파일로 출력합니다. GitHub Pages로 배포되어 앱에서 fetch합니다.

사용법:
    python scripts/refresh-video-ids.py \
        --config scripts/data-sources.json \
        --output output/video-ids.json

    # 이전 데이터 폴백 포함
    python scripts/refresh-video-ids.py \
        --config scripts/data-sources.json \
        --previous output/previous.json \
        --output output/video-ids.json
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone

# 기존 youtube_music_fetcher.py의 함수를 재사용
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
FETCHER_DIR = os.path.join(PROJECT_ROOT, ".claude", "skills", "youtube-music-fetch")
sys.path.insert(0, FETCHER_DIR)

from youtube_music_fetcher import (
    get_api_key,
    build_youtube_client,
    search_music_videos,
)

# 엔티티당 목표 비디오 수
TARGET_COUNT = 12


def load_config(config_path: str) -> dict:
    """data-sources.json 설정 파일을 로드합니다."""
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_previous(previous_path: str | None) -> dict | None:
    """이전 video-ids.json을 로드합니다 (폴백용)."""
    if not previous_path or not os.path.exists(previous_path):
        return None
    try:
        with open(previous_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if data.get("version") == 1:
            return data
    except (json.JSONDecodeError, KeyError):
        pass
    return None


def fetch_video_ids(youtube, query: str, no_filter: bool = False) -> list[str]:
    """검색어로 비디오 ID 목록을 수집합니다."""
    try:
        videos = search_music_videos(youtube, query, max_results=TARGET_COUNT, no_filter=no_filter)
        ids = [v["id"] for v in videos]
        # 중복 제거 (순서 유지)
        seen = set()
        unique = []
        for vid in ids:
            if vid not in seen:
                seen.add(vid)
                unique.append(vid)
        return unique
    except Exception as e:
        print(f"  경고: '{query}' 검색 실패 — {e}")
        return []


def fetch_with_fallback(
    youtube, entity_id: str, query: str, no_filter: bool,
    previous_ids: list[str] | None,
) -> list[str]:
    """비디오 ID를 수집하고, 실패 시 이전 데이터로 폴백합니다."""
    ids = fetch_video_ids(youtube, query, no_filter=no_filter)

    if not ids and previous_ids:
        print(f"  → '{entity_id}' 결과 없음, 이전 데이터 유지 ({len(previous_ids)}건)")
        return previous_ids

    if ids:
        print(f"  → '{entity_id}' 수집 완료: {len(ids)}건")
    else:
        print(f"  → '{entity_id}' 결과 없음 (이전 데이터도 없음)")

    return ids


def main():
    parser = argparse.ArgumentParser(description="트롯통 비디오 ID 일괄 갱신")
    parser.add_argument("--config", required=True, help="data-sources.json 경로")
    parser.add_argument("--previous", help="이전 video-ids.json 경로 (폴백용)")
    parser.add_argument("--output", required=True, help="출력 JSON 파일 경로")
    args = parser.parse_args()

    # 설정 로드
    config = load_config(args.config)
    previous = load_previous(args.previous)

    # YouTube API 클라이언트 생성
    api_key = get_api_key()
    youtube = build_youtube_client(api_key)

    result = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "singers": {},
        "categories": {},
        "playlists": {},
    }

    total_entities = (
        len(config.get("singers", []))
        + len(config.get("categories", []))
        + len(config.get("playlists", []))
    )
    processed = 0
    failed = 0

    # ── 가수별 수집 ──────────────────────────────────────────
    print("\n" + "=" * 50)
    print("  가수별 비디오 ID 수집")
    print("=" * 50)

    for singer in config.get("singers", []):
        processed += 1
        sid = singer["id"]
        query = singer["searchQuery"]
        tier = singer.get("tier", "popular")
        no_filter = tier == "classic"

        print(f"\n[{processed}/{total_entities}] {sid}")

        prev_ids = None
        if previous:
            prev_ids = previous.get("singers", {}).get(sid)

        ids = fetch_with_fallback(youtube, sid, query, no_filter, prev_ids)
        if ids:
            result["singers"][sid] = ids
        else:
            failed += 1

        # API 속도 제한 방지
        time.sleep(0.5)

    # ── 카테고리별 수집 ──────────────────────────────────────
    print("\n" + "=" * 50)
    print("  카테고리별 비디오 ID 수집")
    print("=" * 50)

    for category in config.get("categories", []):
        processed += 1
        cid = category["id"]
        query = category["searchQuery"]

        print(f"\n[{processed}/{total_entities}] {cid}")

        prev_ids = None
        if previous:
            prev_ids = previous.get("categories", {}).get(cid)

        ids = fetch_with_fallback(youtube, cid, query, False, prev_ids)
        if ids:
            result["categories"][cid] = ids
        else:
            failed += 1

        time.sleep(0.5)

    # ── 플레이리스트별 수집 ──────────────────────────────────
    print("\n" + "=" * 50)
    print("  플레이리스트별 비디오 ID 수집")
    print("=" * 50)

    for playlist in config.get("playlists", []):
        processed += 1
        pid = playlist["id"]
        query = playlist["searchQuery"]

        print(f"\n[{processed}/{total_entities}] {pid}")

        prev_ids = None
        if previous:
            prev_ids = previous.get("playlists", {}).get(pid)

        ids = fetch_with_fallback(youtube, pid, query, False, prev_ids)
        if ids:
            result["playlists"][pid] = ids
        else:
            failed += 1

        time.sleep(0.5)

    # ── 결과 저장 ────────────────────────────────────────────
    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # ── 요약 ─────────────────────────────────────────────────
    singer_count = len(result["singers"])
    category_count = len(result["categories"])
    playlist_count = len(result["playlists"])
    total_ids = (
        sum(len(v) for v in result["singers"].values())
        + sum(len(v) for v in result["categories"].values())
        + sum(len(v) for v in result["playlists"].values())
    )

    print("\n" + "=" * 50)
    print("  갱신 완료")
    print("=" * 50)
    print(f"  가수: {singer_count}명")
    print(f"  카테고리: {category_count}개")
    print(f"  플레이리스트: {playlist_count}개")
    print(f"  총 비디오 ID: {total_ids}개")
    print(f"  실패: {failed}건")
    print(f"  출력: {args.output}")
    print(f"  시각: {result['generatedAt']}")

    if failed > 0:
        print(f"\n경고: {failed}건의 엔티티에서 비디오를 수집하지 못했습니다.")
        # 부분 실패는 exit 0 (이전 데이터 폴백이 있으므로)
        # 전체 실패만 exit 1
        if singer_count == 0 and category_count == 0 and playlist_count == 0:
            print("오류: 모든 엔티티 수집 실패!")
            sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
