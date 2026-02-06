export enum ActivityType {
  LESSON_SELECT = 'LESSON_SELECT', // New: Lesson Directory
  MENU = 'MENU',
  PINYIN = 'PINYIN',
  SPEAKING = 'SPEAKING',
  QUIZ = 'QUIZ',
  DIALOGUE = 'DIALOGUE',
  SUMMARY = 'SUMMARY'
}

export interface VocabularyItem {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  imageKeyword: string; 
}

export interface DialogueLine {
  speaker: 'A' | 'B';
  chinese: string;
  pinyin: string;
  english: string;
}

export interface DialogueGroup {
  id: string;
  lines: DialogueLine[];
}

// New: Lesson Structure
export interface Lesson {
  id: number;
  title: string;
  description: string;
  vocabulary: VocabularyItem[];
  dialogues: DialogueGroup[];
}

export interface SubmissionRecord {
  type: 'writing' | 'speaking' | 'quiz' | 'dialogue';
  itemId: string;
  input: string | Blob; 
  score: number; // 0 or 1 (or percentage)
  feedback: string;
}

export interface FeedbackResponse {
  isCorrect: boolean;
  message: string;
}

export interface LessonReport {
  lessonId: number;
  studentName: string;
  timestamp: string;
  totalScore: number;
  maxScore: number;
  details: string;
}