export enum ActivityType {
  LESSON_SELECT = 'LESSON_SELECT',
  MENU = 'MENU',
  PINYIN = 'PINYIN',
  SPEAKING = 'SPEAKING',
  QUIZ = 'QUIZ',
  DIALOGUE = 'DIALOGUE',
  SUMMARY = 'SUMMARY',
  MODULE_SUCCESS = 'MODULE_SUCCESS',
  TEACHER_REVIEW = 'TEACHER_REVIEW',
  TEACHER_PORTAL = 'TEACHER_PORTAL'
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
  score: number;
  feedback: string;
}

export interface SavedReport {
  id: string;
  lessonId: number;
  studentName: string;
  timestamp: number;
  // We keep the detailed data for stats, but the main content is now the video
  submissionsCount: number;
  totalScore: number;
  videoId?: string; // ID referencing the video in IndexedDB
  submissions: SubmissionRecord[];
}

// Teacher Portal Types
export interface HomeworkEntry {
  id: string;
  studentName: string;
  lessonTitle: string;
  timestamp: number;
  score: number;
  videoId: string;
}

export interface FeedbackResponse {
  isCorrect: boolean;
  message: string;
}