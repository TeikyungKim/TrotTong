import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'ballad',
    name: '트로트 발라드',
    emoji: '🎵',
    description: '마음을 적시는 감성 명곡',
    searchQuery: '트로트 발라드 명곡',
    color: '#6B4EAE',
    featuredVideoIds: [
      'cqkO5HSSM2s', // 임영웅 - 이제 나만 믿어요
      'lNxU43Uaudo', // 송가인 - 미워요
      'K5pq7LULOhs', // 진성 - 안동역에서
      'Ocy_-7Z5bx8', // 정동원 - 와
      'O_bJA-AxXGQ', // 주현미 - 신사동 그 사람
      'wEhb5_j5lhM', // 나훈아 - 테스형
    ],
  },
  {
    id: 'upbeat',
    name: '신나는 트로트',
    emoji: '🎉',
    description: '흥이 절로 나는 신나는 트로트',
    searchQuery: '신나는 트로트 최신',
    color: '#E85D04',
    featuredVideoIds: [
      'HZYN7EcAmLk', // 영탁 - 찐이야
      'sRhk30Vqsb8', // 설운도 - 다함께 차차차
      'rHXFALHEMsw', // 김흥국 - 호랑나비
      'YqxVjS6SHU0', // 박현빈 - 샤방샤방
      '0DtFhN_VFHQ', // 영탁 - 막걸리 한잔
    ],
  },
  {
    id: 'classic',
    name: '옛날 트로트',
    emoji: '🎙️',
    description: '70-90년대 추억의 명곡 모음',
    searchQuery: '70년대 80년대 트로트 명곡',
    color: '#588157',
    featuredVideoIds: [
      'Vl8C_cC57oU', // 현철 - 봉선화연정
      'hDtHKYIHVvQ', // 태진아 - 사랑은 아무나 하나
      'cxWGDmllV7A', // 패티김 - 이별의 노래
      'eRR3CK1RicA', // 나미 - 슬픈 인연
      'fAjPinr7aSA', // 조용필 - 단발머리
      '6N8mFZ1hzWc', // 남진 - 빈잔
    ],
  },
  {
    id: 'latest',
    name: '최신 트로트',
    emoji: '✨',
    description: '2020년대 최신 트로트 히트',
    searchQuery: '2024 최신 트로트',
    color: '#0077B6',
    featuredVideoIds: [
      'cqkO5HSSM2s', // 임영웅
      'HZYN7EcAmLk', // 영탁
      '5GVMqBBRiXE', // 이찬원
      'lNxU43Uaudo', // 송가인
      'Ocy_-7Z5bx8', // 정동원
    ],
  },
  {
    id: 'bedtime',
    name: '잠들기 트로트',
    emoji: '🌙',
    description: '잠들기 전 편안하게 듣는 트로트',
    searchQuery: '잠들기 좋은 트로트 발라드',
    color: '#264653',
    featuredVideoIds: [
      'K5pq7LULOhs', // 진성 - 안동역에서
      'v6XHjBRYXpM', // 임영웅 - 사랑은 늘 도망가
      'O_bJA-AxXGQ', // 주현미
      'f4KsZGCJYEk', // 나훈아 - 영영
      'eRR3CK1RicA', // 나미 - 슬픈 인연
      'Z5yLJAfXvRQ', // 패티김
    ],
  },
  {
    id: 'morning',
    name: '아침 트로트',
    emoji: '🌅',
    description: '상쾌한 아침을 여는 신나는 트로트',
    searchQuery: '아침 신나는 트로트',
    color: '#E9C46A',
    featuredVideoIds: [
      'HZYN7EcAmLk', // 영탁 - 찐이야
      'YqxVjS6SHU0', // 박현빈 - 샤방샤방
      'sRhk30Vqsb8', // 설운도
      '5GVMqBBRiXE', // 이찬원
      'rHXFALHEMsw', // 김흥국
    ],
  },
];
