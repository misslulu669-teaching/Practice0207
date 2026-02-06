import { VocabularyItem, DialogueGroup } from './types';

export const VOCABULARY: VocabularyItem[] = [
  { id: 'v1', chinese: '昨天', pinyin: 'zuótiān', english: 'yesterday', imageKeyword: 'calendar' },
  { id: 'v2', chinese: '今天', pinyin: 'jīntiān', english: 'today', imageKeyword: 'clock' },
  { id: 'v3', chinese: '明天', pinyin: 'míngtiān', english: 'tomorrow', imageKeyword: 'future' },
  { id: 'v4', chinese: '冷', pinyin: 'lěng', english: 'cold', imageKeyword: 'snow' },
  { id: 'v5', chinese: '热', pinyin: 'rè', english: 'hot', imageKeyword: 'sun' },
  { id: 'v6', chinese: '好吃', pinyin: 'hǎochī', english: 'delicious', imageKeyword: 'burger' },
  { id: 'v7', chinese: '漂亮', pinyin: 'piàoliang', english: 'beautiful', imageKeyword: 'woman' },
];

export const DIALOGUES: DialogueGroup[] = [
  {
    id: 'd1',
    lines: [
      { speaker: 'A', chinese: '昨天冷吗？', pinyin: 'Zuótiān lěng ma?', english: 'Was it cold yesterday?' },
      { speaker: 'B', chinese: '昨天很冷。', pinyin: 'Zuótiān hěn lěng.', english: 'Yesterday was very cold.' },
    ]
  },
  {
    id: 'd2',
    lines: [
      { speaker: 'A', chinese: '今天热吗？', pinyin: 'Jīntiān rè ma?', english: 'Is it hot today?' },
      { speaker: 'B', chinese: '今天不热。', pinyin: 'Jīntiān bú rè.', english: 'Today is not hot.' },
    ]
  },
  {
    id: 'd3',
    lines: [
      { speaker: 'A', chinese: '披萨好吃吗？', pinyin: 'Pīsà hǎochī ma?', english: 'Is pizza delicious?' },
      { speaker: 'B', chinese: '披萨很好吃。', pinyin: 'Pīsà hěn hǎochī.', english: 'Pizza is very delicious.' },
    ]
  }
];

// Sound Effects (using simple beeps/chimes hosted or generated)
export const SOUNDS = {
  CORRECT: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav', // Placeholder pleasant sound
  WRONG: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/player_shoot.wav', // Placeholder distinct sound
  SUCCESS: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav'
};

export const PLACEHOLDER_IMAGES: Record<string, string> = {
  'calendar': 'https://picsum.photos/seed/calendar123/400/300',
  'clock': 'https://picsum.photos/seed/clock456/400/300',
  'future': 'https://picsum.photos/seed/future789/400/300',
  'snow': 'https://picsum.photos/seed/snow321/400/300',
  'sun': 'https://picsum.photos/seed/sun654/400/300',
  'burger': 'https://picsum.photos/seed/burger987/400/300',
  'woman': 'https://picsum.photos/seed/fashion147/400/300',
};