import type { Singer } from '../types';

// 각 가수별 대표 인기 영상 ID (YouTube) — API 없이도 즉시 재생 가능
// 모든 ID는 YouTube 공식 채널 RSS 또는 나무위키에서 추출 후 썸네일 200 OK 검증 완료

export const SINGERS: Singer[] = [
  // ===== 티어1: 메가스타 =====
  {
    id: 'lim-young-woong',
    name: '임영웅',
    nameEn: 'Im Young-woong',
    tier: 'mega',
    searchQuery: '임영웅 노래 모음',
    tags: ['ballad', 'latest'],
    description: '2020년대 최고의 트로트 스타',
    featuredVideoIds: [
      'ym5FbJLg8SY', // 임영웅 공식 채널
      'bFhjEjSeODQ',
      'URbSyQss_cI',
      'mh_OjXxiuHQ',
    ],
  },
  {
    id: 'lee-chan-won',
    name: '이찬원',
    nameEn: 'Lee Chan-won',
    tier: 'mega',
    searchQuery: '이찬원 노래 모음',
    tags: ['ballad', 'latest'],
    description: '미스터 트롯 준우승, 감성 트로트',
    featuredVideoIds: [
      'O9AIX7hBz6I', // 이찬원 공식 채널
      '8dtHRe0BLF8',
      '_mrU10M3_ZY',
      'fzFJMFSQWhU',
    ],
  },
  {
    id: 'young-tak',
    name: '영탁',
    nameEn: 'Young-tak',
    tier: 'mega',
    searchQuery: '영탁 찐이야 노래',
    tags: ['upbeat', 'latest'],
    description: '찐이야로 유명한 흥의 아이콘',
    featuredVideoIds: [
      'H-JAIJJ69io', // YoungTakOfficial 채널
      'Y7Vw9qkcxNY',
      '2Xp2qgcL25Q',
      'NbkCkI0PKw4',
    ],
  },
  {
    id: 'song-ga-in',
    name: '송가인',
    nameEn: 'Song Ga-in',
    tier: 'mega',
    searchQuery: '송가인 노래 모음',
    tags: ['ballad', 'classic'],
    description: '미스 트롯 우승, 여왕의 트로트',
    featuredVideoIds: [
      'xVsiFCTGVlc', // 송가인 공식 채널
      'FG-DWafVGtg',
      'KBro9ynzfWA',
      'K42ZyuZQ_ZA',
    ],
  },
  {
    id: 'na-hoon-a',
    name: '나훈아',
    nameEn: 'Na Hoon-a',
    tier: 'mega',
    searchQuery: '나훈아 노래 모음 명곡',
    tags: ['classic', 'ballad'],
    description: '트로트의 황제, 전설의 국민가수',
    featuredVideoIds: [
      'O9dKe8ageNQ', // 나훈아 - 테스형 공식 MV
      'r3TjBAfB4WY', // 나훈아 공식 채널
      'WsWqQy31sdE',
      'vxrWL3Dt0Ro',
    ],
  },
  // ===== 티어2: 인기 가수 =====
  {
    id: 'joo-hyun-mi',
    name: '주현미',
    nameEn: 'Joo Hyun-mi',
    tier: 'popular',
    searchQuery: '주현미 신사동 그 사람 노래 모음',
    tags: ['classic', 'ballad'],
    description: '트로트 여왕의 원조, 클래식 명곡',
    featuredVideoIds: [], // 공식 채널 없음 — API 검색 사용
  },
  {
    id: 'jin-sung',
    name: '진성',
    nameEn: 'Jin Sung',
    tier: 'popular',
    searchQuery: '진성 안동역에서 노래',
    tags: ['ballad', 'classic'],
    description: '안동역에서, 구성진 목소리',
    featuredVideoIds: [
      'nCIorxQNxfs', // 진성 - 안동역에서 (나무위키 검증)
      'epS7qFFHAQA',
    ],
  },
  {
    id: 'jeong-dong-won',
    name: '정동원',
    nameEn: 'Jeong Dong-won',
    tier: 'popular',
    searchQuery: '정동원 노래 모음',
    tags: ['ballad', 'latest'],
    description: '미스터 트롯 최연소, 천재 소년',
    featuredVideoIds: [
      'vyJQZC52c80', // DongWon_official 채널
      'ofTJIC7FvZU',
      'KMt3mydH8zo',
      'DxgJM7yApdw',
    ],
  },
  {
    id: 'hong-ja',
    name: '홍자',
    nameEn: 'Hong Ja',
    tier: 'popular',
    searchQuery: '홍자 노래 모음',
    tags: ['ballad', 'latest'],
    description: '강렬한 감성의 차세대 여왕',
    featuredVideoIds: [
      'XGY56c367jQ', // 홍자 채널
      'HMHLzDcIrVs',
    ],
  },
  {
    id: 'park-hyun-bin',
    name: '박현빈',
    nameEn: 'Park Hyun-bin',
    tier: 'popular',
    searchQuery: '박현빈 샤방샤방 노래 모음',
    tags: ['upbeat'],
    description: '샤방샤방, 신나는 트로트 킹',
    featuredVideoIds: [
      '6Pt5yCNqzQA', // 박현빈 - 샤방샤방 (나무위키 검증)
      'Gd8fzkashrU',
      'k-6qdALVLk0',
    ],
  },
  // ===== 티어3: 올드 트로트 명인 =====
  {
    id: 'hyun-cheol',
    name: '현철',
    nameEn: 'Hyun Cheol',
    tier: 'classic',
    searchQuery: '현철 봉선화연정 노래',
    tags: ['classic'],
    description: '봉선화연정, 트로트 레전드',
    featuredVideoIds: [
      'Uvn2F8jToJg', // 현철 - 봉선화연정 (나무위키 검증)
      '_1wRfoMyXtM',
    ],
  },
  {
    id: 'tae-jin-a',
    name: '태진아',
    nameEn: 'Tae Jin-a',
    tier: 'classic',
    searchQuery: '태진아 사랑은 아무나 하나',
    tags: ['classic'],
    description: '사랑은 아무나 하나, 국민 트로트',
    featuredVideoIds: [
      '29dmsPOwRIo', // 태진아 (나무위키 검증)
      'F4gy0ydbIQc',
      'jmSdktphwK4',
    ],
  },
  {
    id: 'seol-un-do',
    name: '설운도',
    nameEn: 'Seol Un-do',
    tier: 'classic',
    searchQuery: '설운도 다함께 차차차',
    tags: ['upbeat', 'classic'],
    description: '다함께 차차차, 흥의 클래식',
    featuredVideoIds: [
      '0ykf8A9racU', // 설운도 (나무위키 검증)
      'A5qRXw5H3As',
      'DrfwnqeoGic',
    ],
  },
  {
    id: 'kim-heung-kook',
    name: '김흥국',
    nameEn: 'Kim Heung-kook',
    tier: 'classic',
    searchQuery: '김흥국 호랑나비',
    tags: ['upbeat', 'classic'],
    description: '호랑나비, 신나는 올드 트로트',
    featuredVideoIds: [
      'BcPEWrRBZs0', // 김흥국 (나무위키 검증)
      'GtcpKEJusNw',
      'JoJDrTILSNM',
    ],
  },
  {
    id: 'nam-jin',
    name: '남진',
    nameEn: 'Nam Jin',
    tier: 'classic',
    searchQuery: '남진 여자의 마음 노래',
    tags: ['classic', 'ballad'],
    description: '여자의 마음, 70년대 트로트 황제',
    featuredVideoIds: [
      'zEFRw2zC0tA', // 남진 공식 채널
      'xWI1ajthDxs',
      'XGXNnIOBnpY',
    ],
  },
  {
    id: 'cho-yong-pil',
    name: '조용필',
    nameEn: 'Cho Yong-pil',
    tier: 'classic',
    searchQuery: '조용필 노래 모음 명곡',
    tags: ['classic', 'ballad'],
    description: '국민가수, 장르를 초월한 전설',
    featuredVideoIds: [
      'WINAu3tJXBo', // 조용필 (나무위키 검증)
    ],
  },
  {
    id: 'moon-hee-ok',
    name: '문희옥',
    nameEn: 'Moon Hee-ok',
    tier: 'classic',
    searchQuery: '문희옥 트로트 노래 모음',
    tags: ['classic'],
    description: '클래식 여성 트로트의 정수',
    featuredVideoIds: [], // 공식 채널 없음 — API 검색 사용
  },
  {
    id: 'choi-jin-hee',
    name: '최진희',
    nameEn: 'Choi Jin-hee',
    tier: 'classic',
    searchQuery: '최진희 사랑의 미로',
    tags: ['classic', 'ballad'],
    description: '사랑의 미로, 시대를 초월한 명곡',
    featuredVideoIds: [], // 공식 채널 없음 — API 검색 사용
  },
  {
    id: 'patti-kim',
    name: '패티김',
    nameEn: 'Patti Kim',
    tier: 'classic',
    searchQuery: '패티김 노래 모음',
    tags: ['classic', 'ballad'],
    description: '이별의 노래, 영원한 디바',
    featuredVideoIds: [
      'x6VlGPQXFZw', // 패티김 공식 채널
    ],
  },
  {
    id: 'na-mi',
    name: '나미',
    nameEn: 'Nami',
    tier: 'classic',
    searchQuery: '나미 슬픈 인연',
    tags: ['classic', 'ballad'],
    description: '슬픈 인연, 80년대 감성 명곡',
    featuredVideoIds: [
      'FV6owwkrjrw', // 나미 공식 채널
      'z9QJBC50sYg',
      'bM6QLkRDxng',
    ],
  },
];

// 빠른 조회용 맵
export const SINGER_MAP = new Map(SINGERS.map(s => [s.id, s]));

// 티어별 필터
export const MEGA_SINGERS = SINGERS.filter(s => s.tier === 'mega');
export const POPULAR_SINGERS = SINGERS.filter(s => s.tier === 'popular');
export const CLASSIC_SINGERS = SINGERS.filter(s => s.tier === 'classic');
