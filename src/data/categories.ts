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
      'ym5FbJLg8SY', // 임영웅
      'xVsiFCTGVlc', // 송가인
      'nCIorxQNxfs', // 진성 - 안동역에서
      'O9AIX7hBz6I', // 이찬원
      'O9dKe8ageNQ', // 나훈아 - 테스형
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
      'H-JAIJJ69io', // 영탁
      '0ykf8A9racU', // 설운도
      'BcPEWrRBZs0', // 김흥국
      '6Pt5yCNqzQA', // 박현빈 - 샤방샤방
      'A5qRXw5H3As', // 설운도
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
      'Uvn2F8jToJg', // 현철 - 봉선화연정
      '29dmsPOwRIo', // 태진아
      'x6VlGPQXFZw', // 패티김
      'FV6owwkrjrw', // 나미
      'WINAu3tJXBo', // 조용필
      'zEFRw2zC0tA', // 남진
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
      'bFhjEjSeODQ', // 임영웅
      'Y7Vw9qkcxNY', // 영탁
      '8dtHRe0BLF8', // 이찬원
      'FG-DWafVGtg', // 송가인
      'vyJQZC52c80', // 정동원
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
      'epS7qFFHAQA', // 진성
      'URbSyQss_cI', // 임영웅
      'r3TjBAfB4WY', // 나훈아
      'z9QJBC50sYg', // 나미
      'x6VlGPQXFZw', // 패티김
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
      '2Xp2qgcL25Q', // 영탁
      'Gd8fzkashrU', // 박현빈
      'DrfwnqeoGic', // 설운도
      '_mrU10M3_ZY', // 이찬원
      'GtcpKEJusNw', // 김흥국
    ],
  },
];
