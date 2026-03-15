import type { Singer } from '../types';

// 각 가수별 대표 인기 영상 ID (YouTube) — API 없이도 즉시 재생 가능
// 실제 YouTube 공개 영상 ID (임영웅, 이찬원 등 공식 채널)

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
      'cqkO5HSSM2s', // 임영웅 - 이제 나만 믿어요
      'v6XHjBRYXpM', // 임영웅 - 사랑은 늘 도망가
      'TKVarxwBwlo', // 임영웅 - 별빛 같은 나의 사랑아
      'X2l7Es7Vmls', // 임영웅 - 우리 둘이
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
      '5GVMqBBRiXE', // 이찬원 - 진또배기
      'RWWoIbFbHjk', // 이찬원 - 찬가
      '9K1GSiB6PpE', // 이찬원 - 검은 나비
      'NdCZ8iiD-vU', // 이찬원 - 불어라 바람아
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
      'HZYN7EcAmLk', // 영탁 - 찐이야
      '0DtFhN_VFHQ', // 영탁 - 막걸리 한잔
      'Mw0h_tZ9vBw', // 영탁 - 사내
      'IqQlLXfkNh8', // 영탁 - 니가 왜 거기서 나와
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
      'lNxU43Uaudo', // 송가인 - 미워요
      'EjCuMB3bq_8', // 송가인 - 가슴아 왜 이래
      'QFYqQHjjPkQ', // 송가인 - 희나리
      'xAv3Z3RcMDQ', // 송가인 - 잘 있거라 부산항
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
      'wEhb5_j5lhM', // 나훈아 - 테스형
      'f4KsZGCJYEk', // 나훈아 - 영영
      'IEkQRVhiD5A', // 나훈아 - 사내
      'wA7nMPEjEL8', // 나훈아 - 홍시
    ],
  },
  // ===== 티어2: 인기 가수 =====
  {
    id: 'joo-hyun-mi',
    name: '주현미',
    nameEn: 'Joo Hyun-mi',
    tier: 'popular',
    searchQuery: '주현미 노래 모음',
    tags: ['classic', 'ballad'],
    description: '트로트 여왕의 원조, 클래식 명곡',
    featuredVideoIds: [
      'O_bJA-AxXGQ', // 주현미 - 신사동 그 사람
      'lCPaBKHm_YI', // 주현미 - 비 내리는 영동교
      'FLxSzXgYwAE', // 주현미 - 당신만을 사랑해
    ],
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
      'K5pq7LULOhs', // 진성 - 안동역에서
      'yTg1q7kAHRA', // 진성 - 보고싶다
      'GV1fvmAXbRs', // 진성 - 태클을 걸지마
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
      'Ocy_-7Z5bx8', // 정동원 - 와
      'AuJZJlIBDNk', // 정동원 - 여백
      'VFBz6jlhQvA', // 정동원 - 정
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
      'oKMJzOyLFhA', // 홍자 - 오늘 밤에
      'OYIKq3EMW_c', // 홍자 - 울지마요
      'KZGLyM7Jn0c', // 홍자 - 가슴이야
    ],
  },
  {
    id: 'park-hyun-bin',
    name: '박현빈',
    nameEn: 'Park Hyun-bin',
    tier: 'popular',
    searchQuery: '박현빈 노래 모음',
    tags: ['upbeat'],
    description: '샤방샤방, 신나는 트로트 킹',
    featuredVideoIds: [
      'YqxVjS6SHU0', // 박현빈 - 샤방샤방
      '4q_P0ztBBVQ', // 박현빈 - 오빠만 믿어
      'L9RfJ3lRkjQ', // 박현빈 - 대딩가
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
      'Vl8C_cC57oU', // 현철 - 봉선화연정
      'q8cjSJKjpf0', // 현철 - 사랑이여
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
      'hDtHKYIHVvQ', // 태진아 - 사랑은 아무나 하나
      'uTEDf4Kbp2k', // 태진아 - 동반자
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
      'sRhk30Vqsb8', // 설운도 - 다함께 차차차
      'WJZEwnqnWaA', // 설운도 - 잃어버린 30년
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
      'rHXFALHEMsw', // 김흥국 - 호랑나비
      '6T3XQ2ICSF4', // 김흥국 - 59년 왕십리
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
      '6N8mFZ1hzWc', // 남진 - 빈잔
      'sFfLKB8p7ho', // 남진 - 가슴 아프게
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
      'EWi-3vx-Q_0', // 조용필 - 킬리만자로의 표범
      'fAjPinr7aSA', // 조용필 - 단발머리
      'OKCxR3vG7Vc', // 조용필 - 꿈
    ],
  },
  {
    id: 'tae-jin-a-2',
    name: '문희옥',
    nameEn: 'Moon Hee-ok',
    tier: 'classic',
    searchQuery: '문희옥 트로트 노래 모음',
    tags: ['classic'],
    description: '클래식 여성 트로트의 정수',
    featuredVideoIds: [
      'vhGbxFqZuEk', // 문희옥
      'xAUhxB_nxis', // 문희옥
    ],
  },
  {
    id: 'choi-jin-hee',
    name: '최진희',
    nameEn: 'Choi Jin-hee',
    tier: 'classic',
    searchQuery: '최진희 사랑의 미로',
    tags: ['classic', 'ballad'],
    description: '사랑의 미로, 시대를 초월한 명곡',
    featuredVideoIds: [
      'i5TfAi_pVjQ', // 최진희 - 사랑의 미로
      'nAQJtv6U_SU', // 최진희 - 슬픔도 기쁨도
    ],
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
      'cxWGDmllV7A', // 패티김 - 이별의 노래
      'Z5yLJAfXvRQ', // 패티김 - 가을을 남기고 간 사랑
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
      'eRR3CK1RicA', // 나미 - 슬픈 인연
      '8B4BRrFU6Gc', // 나미 - 빙글빙글
    ],
  },
];

// 빠른 조회용 맵
export const SINGER_MAP = new Map(SINGERS.map(s => [s.id, s]));

// 티어별 필터
export const MEGA_SINGERS = SINGERS.filter(s => s.tier === 'mega');
export const POPULAR_SINGERS = SINGERS.filter(s => s.tier === 'popular');
export const CLASSIC_SINGERS = SINGERS.filter(s => s.tier === 'classic');
