import { Lesson } from './types';

export const PLACEHOLDER_IMAGES: Record<string, string> = {
  // L1
  'calendar': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
  'clock': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80',
  'future': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
  'snow': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><g stroke="#bae6fd" stroke-width="8" stroke-linecap="round"><line x1="100" y1="30" x2="100" y2="170"/><line x1="30" y1="100" x2="170" y2="100"/><line x1="50" y1="50" x2="150" y2="150"/><line x1="50" y1="150" x2="150" y2="50"/></g></svg>`)}`,
  'sun': 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=400&q=80',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'woman': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
  
  // L2
  'monday': 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Monday', 
  'tuesday': 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Tuesday',
  'wednesday': 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Wednesday',
  'thursday': 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Thursday',
  'friday': 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Friday',
  'saturday': 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Saturday',
  'sunday': 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Sunday',
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
  'number_1': 'https://placehold.co/400x400/10B981/FFFFFF?text=1',
  'number_2': 'https://placehold.co/400x400/10B981/FFFFFF?text=2',
  'number_3': 'https://placehold.co/400x400/10B981/FFFFFF?text=3',
  'number_4': 'https://placehold.co/400x400/10B981/FFFFFF?text=4',
  'number_5': 'https://placehold.co/400x400/10B981/FFFFFF?text=5',
  'completed': 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=400&q=80', // Checkmark/Done

  // L5 Assets
  'holding': 'https://images.unsplash.com/photo-1616575459392-71c261e0691e?w=400&q=80', // Hands holding
  'empty_box': 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&q=80', // Empty
  'family_icon': 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80', // Family
  'number_6': 'https://placehold.co/400x400/F59E0B/FFFFFF?text=6',
  'number_7': 'https://placehold.co/400x400/F59E0B/FFFFFF?text=7',
  'number_8': 'https://placehold.co/400x400/F59E0B/FFFFFF?text=8',
  'number_9': 'https://placehold.co/400x400/F59E0B/FFFFFF?text=9',
  'number_10': 'https://placehold.co/400x400/F59E0B/FFFFFF?text=10',
  'house': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80', // Home
  'question_mark': 'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=400&q=80', // Question
  'family_photo': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', // Large family
  
  // L6 Assets
  'how_many': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><circle cx="70" cy="120" r="25" fill="#ef4444"/><circle cx="110" cy="130" r="25" fill="#ef4444"/><circle cx="100" cy="100" r="25" fill="#ef4444"/><text x="140" y="80" font-family="sans-serif" font-size="40" font-weight="bold" fill="black">?</text></svg>`)}`,
  'thermometer': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><rect x="55" y="40" width="30" height="90" rx="15" fill="#e5e7eb" stroke="black" stroke-width="2"/><circle cx="70" cy="140" r="25" fill="#ef4444" stroke="black" stroke-width="2"/><rect x="62.5" y="80" width="15" height="50" fill="#ef4444"/><text x="120" y="100" font-family="sans-serif" font-size="24" fill="black">18</text><text x="120" y="130" font-family="sans-serif" font-size="24" fill="black">°C</text></svg>`)}`,
  'number_100': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><text x="100" y="125" font-family="sans-serif" font-size="80" font-weight="bold" fill="black" text-anchor="middle">100</text></svg>`)}`,
  'daytime': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><clipPath id="circleClip"><circle cx="100" cy="100" r="95" /></clipPath><circle cx="100" cy="100" r="95" fill="#e0f2fe" stroke="#3b82f6" stroke-width="4"/><g clip-path="url(#circleClip)"><circle cx="70" cy="60" r="30" fill="#fde047"/><rect x="30" y="100" width="40" height="100" fill="#94a3b8"/><rect x="80" y="80" width="50" height="120" fill="#64748b"/><rect x="140" y="110" width="40" height="90" fill="#cbd5e1"/></g></svg>`)}`,
  'nighttime': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><clipPath id="circleClipNight"><circle cx="100" cy="100" r="95" /></clipPath><circle cx="100" cy="100" r="95" fill="#1e3a8a" stroke="#3b82f6" stroke-width="4"/><g clip-path="url(#circleClipNight)"><path d="M 60 50 A 25 25 0 1 0 80 30 A 30 30 0 0 1 60 50" fill="#fef08a"/><rect x="30" y="100" width="40" height="100" fill="#334155"/><rect x="80" y="80" width="50" height="120" fill="#1e293b"/><rect x="140" y="110" width="40" height="90" fill="#475569"/></g></svg>`)}`,
  'number_0': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><text x="100" y="130" font-family="sans-serif" font-size="110" font-weight="bold" fill="#60a5fa" text-anchor="middle">0</text></svg>`)}`,
  'moon': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><circle cx="100" cy="100" r="70" fill="#fef08a"/><circle cx="75" cy="85" r="12" fill="#eab308" opacity="0.3"/><circle cx="115" cy="125" r="18" fill="#eab308" opacity="0.3"/><circle cx="130" cy="80" r="10" fill="#eab308" opacity="0.3"/><circle cx="85" cy="135" r="8" fill="#eab308" opacity="0.3"/><circle cx="105" cy="65" r="6" fill="#eab308" opacity="0.3"/></svg>`)}`,
  'elder_sister': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><circle cx="100" cy="80" r="30" fill="#fde68a"/><path d="M 65 90 Q 100 20 135 90" fill="#78350f"/><path d="M 60 180 Q 100 100 140 180 Z" fill="#ef4444"/></svg>`)}`,
  'ear': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><path d="M 80 50 C 130 40 160 80 130 130 C 100 180 80 160 80 140 C 80 120 100 120 100 100 C 100 80 80 90 80 50" fill="#fde68a" stroke="#d97706" stroke-width="5"/><path d="M 140 80 Q 155 95 140 110" fill="none" stroke="gray" stroke-width="3" stroke-linecap="round"/><path d="M 155 70 Q 175 95 155 120" fill="none" stroke="gray" stroke-width="3" stroke-linecap="round"/></svg>`)}`,
  
  // L7 Assets
  'rain': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><path d="M 50 100 Q 100 20 150 100 Z" fill="#3b82f6"/><path d="M 95 100 L 95 140 A 10 10 0 0 0 115 140" fill="none" stroke="#60a5fa" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="120" r="4" fill="#3b82f6"/><circle cx="130" cy="130" r="4" fill="#3b82f6"/><circle cx="90" cy="140" r="4" fill="#3b82f6"/><circle cx="75" cy="135" r="4" fill="#3b82f6"/><circle cx="120" cy="115" r="4" fill="#3b82f6"/></svg>`)}`,
  'wind': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><path d="M 40 80 Q 100 60 140 80 Q 150 85 145 95 Q 140 105 130 95" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/><path d="M 50 110 Q 110 130 160 110 Q 170 105 165 95 Q 160 85 150 95" fill="none" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/><path d="M 70 140 Q 120 145 150 135" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="70" r="3" fill="#64748b"/><circle cx="155" cy="120" r="4" fill="#64748b"/><circle cx="90" cy="125" r="3" fill="#64748b"/></svg>`)}`,
  'big': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><circle cx="100" cy="100" r="60" fill="#ef4444"/><path d="M 100 40 Q 110 20 120 30" fill="none" stroke="#22c55e" stroke-width="6" stroke-linecap="round"/></svg>`)}`,
  'small': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><circle cx="100" cy="100" r="25" fill="#ef4444"/><path d="M 100 75 Q 105 65 110 70" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/></svg>`)}`,
  'day_before_yesterday': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><rect x="40" y="70" width="35" height="40" fill="#94a3b8" rx="4"/><rect x="85" y="70" width="35" height="40" fill="#cbd5e1" rx="4"/><rect x="130" y="70" width="35" height="40" fill="#e2e8f0" rx="4"/><path d="M 70 140 L 40 140 L 55 125 M 40 140 L 55 155" fill="none" stroke="#3b82f6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="45" y1="140" x2="160" y2="140" stroke="#3b82f6" stroke-width="6" stroke-linecap="round"/></svg>`)}`,
  'day_after_tomorrow': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><rect x="40" y="70" width="35" height="40" fill="#e2e8f0" rx="4"/><rect x="85" y="70" width="35" height="40" fill="#cbd5e1" rx="4"/><rect x="130" y="70" width="35" height="40" fill="#94a3b8" rx="4"/><path d="M 130 140 L 160 140 L 145 125 M 160 140 L 145 155" fill="none" stroke="#3b82f6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="40" y1="140" x2="155" y2="140" stroke="#3b82f6" stroke-width="6" stroke-linecap="round"/></svg>`)}`,
  'soup': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><path d="M 50 100 A 50 40 0 0 0 150 100 Z" fill="#94a3b8"/><ellipse cx="100" cy="100" rx="50" ry="15" fill="#fde047"/><path d="M 140 70 L 120 100" fill="none" stroke="#78350f" stroke-width="6" stroke-linecap="round"/><circle cx="90" cy="95" r="4" fill="#a16207"/><circle cx="110" cy="105" r="3" fill="#a16207"/><circle cx="80" cy="102" r="2" fill="#a16207"/></svg>`)}`,
  'to_wait': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><rect x="85" y="40" width="30" height="80" fill="#334155" rx="8"/><circle cx="100" cy="55" r="10" fill="#ef4444"/><circle cx="100" cy="80" r="10" fill="#fbbf24" opacity="0.3"/><circle cx="100" cy="105" r="10" fill="#22c55e" opacity="0.3"/><rect x="95" y="120" width="10" height="40" fill="#64748b"/><line x1="50" y1="160" x2="150" y2="160" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/></svg>`)}`,
  'eagle': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><path d="M 60 120 Q 100 60 140 90 Q 120 110 140 130 Q 100 140 60 120" fill="#451a03"/><circle cx="130" cy="100" r="15" fill="white"/><circle cx="135" cy="98" r="3" fill="black"/><path d="M 140 100 L 160 105 L 140 110 Z" fill="#fbbf24"/></svg>`)}`,
  'to_use': `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" stroke-width="4"/><rect x="70" y="80" width="60" height="40" fill="#fbbf24" rx="4"/><path d="M 50 60 L 80 90" fill="none" stroke="#64748b" stroke-width="8" stroke-linecap="round"/><path d="M 150 140 L 120 110" fill="none" stroke="#64748b" stroke-width="8" stroke-linecap="round"/><circle cx="100" cy="100" r="10" fill="#0f172a"/><line x1="80" y1="100" x2="120" y2="100" stroke="white" stroke-width="3"/></svg>`)}`,
};

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
  },
  {
    id: 6,
    title: "Lesson 6: What's the temperature today?",
    description: "S1-B03: Learn about degrees, day, night, and numbers.",
    vocabulary: [
      { id: 'l6_v1', chinese: '多少', pinyin: 'duō shǎo', english: 'how many', imageKeyword: 'how_many' },
      { id: 'l6_v2', chinese: '度', pinyin: 'dù', english: 'degree', imageKeyword: 'thermometer' },
      { id: 'l6_v3', chinese: '百', pinyin: 'bǎi', english: 'hundred', imageKeyword: 'number_100' },
      { id: 'l6_v4', chinese: '白天', pinyin: 'bái tiān', english: 'daytime', imageKeyword: 'daytime' },
      { id: 'l6_v5', chinese: '晚上', pinyin: 'wǎn shang', english: 'night', imageKeyword: 'nighttime' },
      { id: 'l6_v6', chinese: '零', pinyin: 'líng', english: 'zero', imageKeyword: 'number_0' },
      { id: 'l6_v7', chinese: '月', pinyin: 'yuè', english: 'moon', imageKeyword: 'moon' },
      { id: 'l6_v8', chinese: '雪', pinyin: 'xuě', english: 'snow', imageKeyword: 'snow' },
      { id: 'l6_v9', chinese: '姐', pinyin: 'jiě', english: 'elder sister', imageKeyword: 'elder_sister' },
      { id: 'l6_v10', chinese: '耳', pinyin: 'ěr', english: 'ear', imageKeyword: 'ear' }
    ],
    dialogues: [
      {
        id: 'l6_d1',
        lines: [
          { speaker: 'A', chinese: '今天白天多少度？', pinyin: 'Jīn tiān bái tiān duō shǎo dù?', english: 'What is the temperature during the day today?' },
          { speaker: 'B', chinese: '今天白天35度。', pinyin: 'Jīn tiān bái tiān 35 dù.', english: 'It is 35 degrees during the day today.' },
        ]
      },
      {
        id: 'l6_d2',
        lines: [
          { speaker: 'A', chinese: '今天晚上多少度？', pinyin: 'Jīn tiān wǎn shang duō shǎo dù?', english: 'What is the temperature tonight?' },
          { speaker: 'B', chinese: '今天晚上16度。', pinyin: 'Jīn tiān wǎn shang 16 dù.', english: 'It is 16 degrees tonight.' },
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Lesson 7: Weather & Days",
    description: "Learn about the weather yesterday and tomorrow, and words with -ng.",
    vocabulary: [
      { id: 'l7_v1', chinese: '雨', pinyin: 'yǔ', english: 'rain', imageKeyword: 'rain' },
      { id: 'l7_v2', chinese: '雪', pinyin: 'xuě', english: 'snow', imageKeyword: 'snow' },
      { id: 'l7_v3', chinese: '风', pinyin: 'fēng', english: 'wind', imageKeyword: 'wind' },
      { id: 'l7_v4', chinese: '大', pinyin: 'dà', english: 'big', imageKeyword: 'big' },
      { id: 'l7_v5', chinese: '小', pinyin: 'xiǎo', english: 'small', imageKeyword: 'small' },
      { id: 'l7_v6', chinese: '前天', pinyin: 'qián tiān', english: 'the day before yesterday', imageKeyword: 'day_before_yesterday' },
      { id: 'l7_v7', chinese: '后天', pinyin: 'hòu tiān', english: 'the day after tomorrow', imageKeyword: 'day_after_tomorrow' },
      { id: 'l7_v8', chinese: '汤', pinyin: 'tāng', english: 'soup', imageKeyword: 'soup' },
      { id: 'l7_v9', chinese: '等', pinyin: 'děng', english: 'to wait', imageKeyword: 'to_wait' },
      { id: 'l7_v10', chinese: '鹰', pinyin: 'yīng', english: 'eagle', imageKeyword: 'eagle' },
      { id: 'l7_v11', chinese: '用', pinyin: 'yòng', english: 'to use', imageKeyword: 'to_use' }
    ],
    dialogues: [
      {
        id: 'l7_d1',
        lines: [
          { speaker: 'A', chinese: '前天有雪吗？', pinyin: 'Qián tiān yǒu xuě ma?', english: 'Was there snow the day before yesterday?' },
          { speaker: 'B', chinese: '前天有雪。', pinyin: 'Qián tiān yǒu xuě.', english: 'There was snow the day before yesterday.' },
          { speaker: 'A', chinese: '明天有风吗？', pinyin: 'Míng tiān yǒu fēng ma?', english: 'Will there be wind tomorrow?' },
          { speaker: 'B', chinese: '明天没有风。', pinyin: 'Míng tiān méi yǒu fēng.', english: 'There will not be wind tomorrow.' }
        ]
      },
      {
        id: 'l7_d2',
        lines: [
          { speaker: 'A', chinese: '后天有小雨吗？', pinyin: 'Hòu tiān yǒu xiǎo yǔ ma?', english: 'Will there be light rain the day after tomorrow?' },
          { speaker: 'B', chinese: '后天有小雨。', pinyin: 'Hòu tiān yǒu xiǎo yǔ.', english: 'There will be light rain the day after tomorrow.' }
        ]
      }
    ]
  }
];
