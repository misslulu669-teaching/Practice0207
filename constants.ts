import { Lesson } from './types';

// Using standard Unicode Pinyin with spaces between syllables for card display
// Chars: ā á ǎ à, ē é ě è, ī í ǐ ì, ō ó ǒ ò, ū ú ǔ ù, ǖ ǘ ǚ ǜ
export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1: Weather & Time",
    description: "Learn about yesterday, today, and describing weather.",
    vocabulary: [
      { id: 'l1_v1', chinese: '昨天', pinyin: 'zuó tiān', english: 'yesterday', imageKeyword: 'calendar' },
      { id: 'l1_v2', chinese: '今天', pinyin: 'jīn tiān', english: 'today', imageKeyword: 'clock' },
      { id: 'l1_v3', chinese: '明天', pinyin: 'míng tiān', english: 'tomorrow', imageKeyword: 'future' },
      { id: 'l1_v4', chinese: '冷', pinyin: 'lěng', english: 'cold', imageKeyword: 'snow' },
      { id: 'l1_v5', chinese: '热', pinyin: 'rè', english: 'hot', imageKeyword: 'sun' },
      { id: 'l1_v6', chinese: '好吃', pinyin: 'hǎo chī', english: 'delicious', imageKeyword: 'burger' },
      { id: 'l1_v7', chinese: '漂亮', pinyin: 'piào liang', english: 'beautiful', imageKeyword: 'woman' },
    ],
    dialogues: [
      {
        id: 'l1_d1',
        lines: [
          { speaker: 'A', chinese: '昨天冷吗？', pinyin: 'Zuótiān lěng ma?', english: 'Was it cold yesterday?' },
          { speaker: 'B', chinese: '昨天很冷。', pinyin: 'Zuótiān hěn lěng.', english: 'Yesterday was very cold.' },
        ]
      },
      {
        id: 'l1_d2',
        lines: [
          { speaker: 'A', chinese: '今天热吗？', pinyin: 'Jīntiān rè ma?', english: 'Is it hot today?' },
          { speaker: 'B', chinese: '今天不热。', pinyin: 'Jīntiān bú rè.', english: 'Today is not hot.' },
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Lesson 2: Days of the Week",
    description: "Learn Monday to Sunday and ask about the date.",
    vocabulary: [
      { id: 'l2_v1', chinese: '星期一', pinyin: 'xīng qī yī', english: 'Monday', imageKeyword: 'monday' },
      { id: 'l2_v2', chinese: '星期二', pinyin: 'xīng qī èr', english: 'Tuesday', imageKeyword: 'tuesday' },
      { id: 'l2_v3', chinese: '星期三', pinyin: 'xīng qī sān', english: 'Wednesday', imageKeyword: 'wednesday' },
      { id: 'l2_v4', chinese: '星期四', pinyin: 'xīng qī sì', english: 'Thursday', imageKeyword: 'thursday' },
      { id: 'l2_v5', chinese: '星期五', pinyin: 'xīng qī wǔ', english: 'Friday', imageKeyword: 'friday' },
      { id: 'l2_v6', chinese: '星期六', pinyin: 'xīng qī liù', english: 'Saturday', imageKeyword: 'saturday' },
      { id: 'l2_v7', chinese: '星期天', pinyin: 'xīng qī tiān', english: 'Sunday', imageKeyword: 'sunday' },
      { id: 'l2_v8', chinese: '太', pinyin: 'tài', english: 'Too / Extremely', imageKeyword: 'too_hot' },
    ],
    dialogues: [
      {
        id: 'l2_d1',
        lines: [
          { speaker: 'A', chinese: '今天星期几？', pinyin: 'Jīntiān xīngqī jǐ?', english: 'What day is today?' },
          { speaker: 'B', chinese: '今天星期六。', pinyin: 'Jīntiān xīngqī liù.', english: 'Today is Saturday.' },
        ]
      },
      {
        id: 'l2_d2',
        lines: [
          { speaker: 'A', chinese: '明天星期几？', pinyin: 'Míngtiān xīngqī jǐ?', english: 'What day is tomorrow?' },
          { speaker: 'B', chinese: '明天星期日。', pinyin: 'Míngtiān xīngqīrì.', english: 'Tomorrow is Sunday.' },
        ]
      },
      {
        id: 'l2_d3',
        lines: [
          { speaker: 'A', chinese: '星期一冷吗？', pinyin: 'Xīngqī yī lěng ma?', english: 'Is Monday cold?' },
          { speaker: 'B', chinese: '星期一太冷了。', pinyin: 'Xīngqī yī tài lěng le.', english: 'Monday was too cold.' },
        ]
      },
      {
        id: 'l2_d4',
        lines: [
          { speaker: 'A', chinese: '星期五热吗？', pinyin: 'Xīngqī wǔ rè ma?', english: 'Is Friday hot?' },
          { speaker: 'B', chinese: '星期五不热。', pinyin: 'Xīngqī wǔ bú rè.', english: 'Friday is not hot.' },
        ]
      }
    ]
  }
];

export const SOUNDS = {
  CORRECT: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav', 
  WRONG: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/player_shoot.wav', 
  SUCCESS: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav'
};

export const PLACEHOLDER_IMAGES: Record<string, string> = {
  // L1
  'calendar': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
  'clock': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80',
  'future': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
  'snow': 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?w=400&q=80',
  'sun': 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=400&q=80',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'woman': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
  
  // L2
  'monday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Monday', // Using generic generic images for days
  'tuesday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Tuesday',
  'wednesday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Wednesday',
  'thursday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Thursday',
  'friday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Friday',
  'saturday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Saturday',
  'sunday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Sunday',
  'too_hot': 'https://images.unsplash.com/photo-1629814597116-29177112eb1e?w=400&q=80',
};