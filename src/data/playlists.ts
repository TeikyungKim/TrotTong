import type { Playlist } from '../types';

export const PLAYLISTS: Playlist[] = [
  {
    id: 'top10-this-week',
    name: '이주의 트롯 TOP 10',
    emoji: '🏆',
    description: '이번 주 가장 많이 들은 트로트 10곡',
    updatedAt: Date.now(),
    videoIds: [
      'cqkO5HSSM2s', // 임영웅
      'HZYN7EcAmLk', // 영탁
      '5GVMqBBRiXE', // 이찬원
      'lNxU43Uaudo', // 송가인
      'wEhb5_j5lhM', // 나훈아
      'K5pq7LULOhs', // 진성
      'Ocy_-7Z5bx8', // 정동원
      'O_bJA-AxXGQ', // 주현미
      'YqxVjS6SHU0', // 박현빈
      'Vl8C_cC57oU', // 현철
    ],
  },
  {
    id: 'bedtime',
    name: '잠들기 좋은 트로트',
    emoji: '🌙',
    description: '조용히 잠들 수 있는 감성 발라드 모음',
    updatedAt: Date.now(),
    videoIds: [
      'K5pq7LULOhs', // 진성 - 안동역에서
      'v6XHjBRYXpM', // 임영웅 - 사랑은 늘 도망가
      'f4KsZGCJYEk', // 나훈아 - 영영
      'eRR3CK1RicA', // 나미 - 슬픈 인연
      'Z5yLJAfXvRQ', // 패티김
      'O_bJA-AxXGQ', // 주현미
      'cxWGDmllV7A', // 패티김 - 이별의 노래
    ],
  },
  {
    id: 'drive',
    name: '드라이브 트로트',
    emoji: '🚗',
    description: '드라이브할 때 신나게 부르는 트로트',
    updatedAt: Date.now(),
    videoIds: [
      'HZYN7EcAmLk', // 영탁 - 찐이야
      'sRhk30Vqsb8', // 설운도
      'rHXFALHEMsw', // 김흥국
      'YqxVjS6SHU0', // 박현빈
      '0DtFhN_VFHQ', // 영탁 - 막걸리 한잔
      'fAjPinr7aSA', // 조용필 - 단발머리
    ],
  },
  {
    id: 'morning',
    name: '아침에 듣는 트로트',
    emoji: '🌅',
    description: '상쾌한 하루를 시작하는 아침 트로트',
    updatedAt: Date.now(),
    videoIds: [
      '5GVMqBBRiXE', // 이찬원
      'HZYN7EcAmLk', // 영탁
      'YqxVjS6SHU0', // 박현빈
      'cqkO5HSSM2s', // 임영웅
      'lNxU43Uaudo', // 송가인
    ],
  },
  {
    id: 'classic-legends',
    name: '추억의 레전드 트로트',
    emoji: '🎙️',
    description: '70~90년대 불멸의 트로트 명곡',
    updatedAt: Date.now(),
    videoIds: [
      'Vl8C_cC57oU', // 현철
      'hDtHKYIHVvQ', // 태진아
      'cxWGDmllV7A', // 패티김
      'eRR3CK1RicA', // 나미
      'fAjPinr7aSA', // 조용필
      '6N8mFZ1hzWc', // 남진
      'sRhk30Vqsb8', // 설운도
      'rHXFALHEMsw', // 김흥국
    ],
  },
];
