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
  },
  {
    id: 3,
    title: "Lesson 3: Introduction (Part 1)",
    description: "S1-A07: How old are you (Part 1). Learn to ask names and nationality.",
    vocabulary: [
      { id: 'l3_v1', chinese: '叫', pinyin: 'jiào', english: 'to call / name is', imageKeyword: 'call_name' },
      { id: 'l3_v2', chinese: '什么', pinyin: 'shén me', english: 'what', imageKeyword: 'what' },
      { id: 'l3_v3', chinese: '名字', pinyin: 'míng zi', english: 'name', imageKeyword: 'nametag' },
      { id: 'l3_v4', chinese: '中国', pinyin: 'zhōng guó', english: 'China', imageKeyword: 'china' },
      { id: 'l3_v5', chinese: '人', pinyin: 'rén', english: 'person', imageKeyword: 'person' },
      { id: 'l3_v6', chinese: '哪', pinyin: 'nǎ', english: 'which', imageKeyword: 'map_location' },
      { id: 'l3_v7', chinese: '国', pinyin: 'guó', english: 'country', imageKeyword: 'globe' },
      { id: 'l3_v8', chinese: '国家', pinyin: 'guó jiā', english: 'country / nation', imageKeyword: 'flags' },
    ],
    dialogues: [
      {
        id: 'l3_d1',
        lines: [
          { speaker: 'A', chinese: '你叫什么？', pinyin: 'Nǐ jiào shénme?', english: 'What is your name?' },
          { speaker: 'B', chinese: '我叫乐乐。', pinyin: 'Wǒ jiào Lè Le.', english: 'My name is Lele.' },
        ]
      },
      {
        id: 'l3_d2',
        lines: [
          { speaker: 'A', chinese: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', english: 'Which country are you from?' },
          { speaker: 'B', chinese: '我是中国人。', pinyin: 'Wǒ shì Zhōngguó rén.', english: 'I am Chinese.' },
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Lesson 4: Age & Numbers (Part 2)",
    description: "S1-A08: How old are you (Part 2). Learn numbers 1-5 and asking age.",
    vocabulary: [
      { id: 'l4_v1', chinese: '几', pinyin: 'jǐ', english: 'how many / how much', imageKeyword: 'question_quantity' },
      { id: 'l4_v2', chinese: '岁', pinyin: 'suì', english: 'year (of age)', imageKeyword: 'birthday_cake' },
      { id: 'l4_v3', chinese: '一', pinyin: 'yī', english: 'one', imageKeyword: 'number_1' },
      { id: 'l4_v4', chinese: '二', pinyin: 'èr', english: 'two', imageKeyword: 'number_2' },
      { id: 'l4_v5', chinese: '三', pinyin: 'sān', english: 'three', imageKeyword: 'number_3' },
      { id: 'l4_v6', chinese: '四', pinyin: 'sì', english: 'four', imageKeyword: 'number_4' },
      { id: 'l4_v7', chinese: '五', pinyin: 'wǔ', english: 'five', imageKeyword: 'number_5' },
      { id: 'l4_v8', chinese: '了', pinyin: 'le', english: '(particle)', imageKeyword: 'completed' },
    ],
    dialogues: [
      {
        id: 'l4_d1',
        lines: [
          { speaker: 'A', chinese: '你几岁了？', pinyin: 'Nǐ jǐ suì le?', english: 'How old are you?' },
          { speaker: 'B', chinese: '我三岁了。', pinyin: 'Wǒ sān suì le.', english: 'I am three years old.' },
        ]
      },
      {
        id: 'l4_d2',
        lines: [
          { speaker: 'A', chinese: '你姐姐几岁了？', pinyin: 'Nǐ jiějie jǐ suì le?', english: 'How old is your older sister?' },
          { speaker: 'B', chinese: '我姐姐四岁了。', pinyin: 'Wǒ jiějie sì suì le.', english: 'My sister is four years old.' },
        ]
      },
      {
        id: 'l4_d3',
        lines: [
            { speaker: 'A', chinese: '你叫什么？', pinyin: 'Nǐ jiào shénme?', english: 'What is your name?' },
            { speaker: 'B', chinese: '我叫乐乐，我是中国人，我五岁了。', pinyin: 'Wǒ jiào LèLe, wǒ shì Zhōngguó rén, wǒ wǔ suì le.', english: 'I am Lele, I am Chinese, I am 5.' },
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Lesson 5: Family Members",
    description: "S1-A09: How many people in your family. Learn numbers 6-10 and family terms.",
    vocabulary: [
      { id: 'l5_v1', chinese: '有', pinyin: 'yǒu', english: 'to have', imageKeyword: 'holding' },
      { id: 'l5_v2', chinese: '没', pinyin: 'méi', english: 'not have', imageKeyword: 'empty_box' },
      { id: 'l5_v3', chinese: '口', pinyin: 'kǒu', english: '(measure word for family)', imageKeyword: 'family_icon' },
      { id: 'l5_v4', chinese: '六', pinyin: 'liù', english: 'six', imageKeyword: 'number_6' },
      { id: 'l5_v5', chinese: '七', pinyin: 'qī', english: 'seven', imageKeyword: 'number_7' },
      { id: 'l5_v6', chinese: '八', pinyin: 'bā', english: 'eight', imageKeyword: 'number_8' },
      { id: 'l5_v7', chinese: '九', pinyin: 'jiǔ', english: 'nine', imageKeyword: 'number_9' },
      { id: 'l5_v8', chinese: '十', pinyin: 'shí', english: 'ten', imageKeyword: 'number_10' },
      { id: 'l5_v9', chinese: '家', pinyin: 'jiā', english: 'family / home', imageKeyword: 'house' },
      { id: 'l5_v10', chinese: '呢', pinyin: 'ne', english: '(question particle)', imageKeyword: 'question_mark' },
    ],
    dialogues: [
      {
        id: 'l5_d1',
        lines: [
          { speaker: 'A', chinese: '你家有几口人？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?', english: 'How many people are in your family?' },
          { speaker: 'B', chinese: '我家有七口人。', pinyin: 'Wǒ jiā yǒu qī kǒu rén.', english: 'My family has seven people.' },
        ]
      },
      {
        id: 'l5_d2',
        lines: [
          { speaker: 'A', chinese: '你有哥哥吗？', pinyin: 'Nǐ yǒu gēge ma?', english: 'Do you have an older brother?' },
          { speaker: 'B', chinese: '我没有哥哥，你呢？', pinyin: 'Wǒ méi yǒu gēge, nǐ ne?', english: 'I don\'t have a brother, and you?' },
          { speaker: 'A', chinese: '我有哥哥。', pinyin: 'Wǒ yǒu gēge.', english: 'I have an older brother.' },
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
  'monday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Monday', 
  'tuesday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Tuesday',
  'wednesday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Wednesday',
  'thursday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Thursday',
  'friday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Friday',
  'saturday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Saturday',
  'sunday': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80&text=Sunday',
  'too_hot': 'https://images.unsplash.com/photo-1629814597116-29177112eb1e?w=400&q=80',

  // L3 Assets
  'call_name': 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&q=80', // Chatting/Calling
  'what': 'https://images.unsplash.com/photo-1633511090164-b43840ea1607?w=400&q=80', // Question mark art
  'nametag': 'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?w=400&q=80', // Hello name tag
  'china': 'https://images.unsplash.com/photo-1543158028-2e061730048e?w=400&q=80', // Great Wall/China
  'person': 'https://images.unsplash.com/photo-1542596594-649edbc13630?w=400&q=80', // Happy person
  'map_location': 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&q=80', // Map
  'globe': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80', // Globe
  'flags': 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&q=80', // Flags

  // L4 Assets
  'question_quantity': 'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=400&q=80', // Question
  'birthday_cake': 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80', // Cake
  'number_1': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=1',
  'number_2': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=2',
  'number_3': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=3',
  'number_4': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=4',
  'number_5': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=5',
  'completed': 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=400&q=80', // Checkmark/Done

  // L5 Assets
  'holding': 'https://images.unsplash.com/photo-1616575459392-71c261e0691e?w=400&q=80', // Hands holding
  'empty_box': 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&q=80', // Empty
  'family_icon': 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80', // Family
  'number_6': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=6',
  'number_7': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=7',
  'number_8': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=8',
  'number_9': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=9',
  'number_10': 'https://images.unsplash.com/photo-1555819206-8f85f395632a?w=400&q=80&text=10',
  'house': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80', // Home
  'question_mark': 'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=400&q=80', // Question
  'family_photo': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', // Large family
};