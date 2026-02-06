export enum ActivityType {
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
  imageKeyword: string; // For picsum or placeholder logic
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

export interface SubmissionRecord {
  type: 'writing' | 'speaking';
  itemId: string;
  input: string | Blob; // Typed text or Audio Blob
  score: number; // 0 or 1
  feedback: string;
}

export interface FeedbackResponse {
  isCorrect: boolean;
  message: string;
}