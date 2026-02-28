import React, { useState } from 'react';
import { Lesson, VocabularyItem, DialogueGroup, DialogueLine } from '../types';
import { LESSONS, PLACEHOLDER_IMAGES } from '../lessonData';

const LessonBuilder: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [images, setImages] = useState<Record<string, string>>(PLACEHOLDER_IMAGES);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);

  // --- Actions ---

  const addNewLesson = () => {
    const newId = lessons.length > 0 ? Math.max(...lessons.map(l => l.id)) + 1 : 1;
    const newLesson: Lesson = {
      id: newId,
      title: `Lesson ${newId}: New Topic`,
      description: "Description of the lesson...",
      vocabulary: [],
      dialogues: []
    };
    setLessons([...lessons, newLesson]);
    setActiveLessonId(newId);
  };

  const updateLesson = (id: number, field: keyof Lesson, value: any) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const deleteLesson = (id: number) => {
    if (confirm("Delete this lesson?")) {
      setLessons(lessons.filter(l => l.id !== id));
      if (activeLessonId === id) setActiveLessonId(null);
    }
  };

  // --- Vocab Actions ---

  const addVocab = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const newVocab: VocabularyItem = {
      id: `l${lessonId}_v${lesson.vocabulary.length + 1}_${Date.now()}`,
      chinese: '你好',
      pinyin: 'nǐ hǎo',
      english: 'Hello',
      imageKeyword: 'placeholder'
    };
    
    const updatedLesson = { ...lesson, vocabulary: [...lesson.vocabulary, newVocab] };
    setLessons(lessons.map(l => l.id === lessonId ? updatedLesson : l));
  };

  const updateVocab = (lessonId: number, vocabId: string, field: keyof VocabularyItem, value: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const updatedVocab = lesson.vocabulary.map(v => v.id === vocabId ? { ...v, [field]: value } : v);
    setLessons(lessons.map(l => l.id === lessonId ? { ...lesson, vocabulary: updatedVocab } : l));
  };

  const deleteVocab = (lessonId: number, vocabId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    setLessons(lessons.map(l => l.id === lessonId ? { ...lesson, vocabulary: lesson.vocabulary.filter(v => v.id !== vocabId) } : l));
  };

  // --- Dialogue Actions ---

  const addDialogue = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const newDialogue: DialogueGroup = {
        id: `l${lessonId}_d${lesson.dialogues.length + 1}_${Date.now()}`,
        lines: [
            { speaker: 'A', chinese: '你好', pinyin: 'Nǐ hǎo', english: 'Hello' },
            { speaker: 'B', chinese: '你好', pinyin: 'Nǐ hǎo', english: 'Hello' }
        ]
    };
    
    setLessons(lessons.map(l => l.id === lessonId ? { ...lesson, dialogues: [...lesson.dialogues, newDialogue] } : l));
  };

  const updateDialogueLine = (lessonId: number, dialogueId: string, lineIndex: number, field: keyof DialogueLine, value: string) => {
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return;

      const updatedDialogues = lesson.dialogues.map(d => {
          if (d.id !== dialogueId) return d;
          const newLines = [...d.lines];
          newLines[lineIndex] = { ...newLines[lineIndex], [field]: value };
          return { ...d, lines: newLines };
      });

      setLessons(lessons.map(l => l.id === lessonId ? { ...lesson, dialogues: updatedDialogues } : l));
  };

  const deleteDialogue = (lessonId: number, dialogueId: string) => {
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return;
      setLessons(lessons.map(l => l.id === lessonId ? { ...lesson, dialogues: lesson.dialogues.filter(d => d.id !== dialogueId) } : l));
  };

  // --- Code Generation ---

  const generateCode = () => {
    const jsonLessons = JSON.stringify(lessons, null, 2);
    // We need to reconstruct the TS file string
    // We will just dump the JSON into the variable declaration
    return `import { Lesson } from './types';

export const PLACEHOLDER_IMAGES: Record<string, string> = ${JSON.stringify(images, null, 2)};

// Using standard Unicode Pinyin with spaces between syllables for card display
export const LESSONS: Lesson[] = ${jsonLessons};
`;
  };

  // --- Render ---

  if (showCode) {
      return (
          <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">📤 Export Configuration</h2>
                  <button onClick={() => setShowCode(false)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">Back to Editor</button>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Instructions:</h3>
                  <ol className="list-decimal list-inside text-blue-700 space-y-1">
                      <li>Copy the code below.</li>
                      <li>Open the file <code>lessonData.ts</code> in your project editor.</li>
                      <li>Paste the code to replace the entire file content.</li>
                      <li>Your app will update with the new lessons!</li>
                  </ol>
              </div>
              <textarea 
                className="flex-1 w-full font-mono text-sm p-4 bg-gray-800 text-green-400 rounded-xl"
                readOnly
                value={generateCode()}
              />
          </div>
      );
  }

  const activeLesson = lessons.find(l => l.id === activeLessonId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
         <div>
            <h2 className="text-3xl font-bold text-gray-800">🛠️ Lesson Builder</h2>
            <p className="text-gray-500">Create new content for your students</p>
         </div>
         <button 
            onClick={() => setShowCode(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md btn-press flex items-center gap-2"
         >
            <span>💾</span> Generate Code
         </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Sidebar: Lesson List */}
          <div className="w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 border-r">
              {lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                        activeLessonId === lesson.id 
                        ? 'bg-blue-50 border-blue-400 shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-blue-200'
                    }`}
                  >
                      <div className="font-bold text-gray-700 truncate">{lesson.title}</div>
                      <div className="text-xs text-gray-400 truncate">{lesson.description}</div>
                  </button>
              ))}
              <button 
                onClick={addNewLesson}
                className="p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                  + Add New Lesson
              </button>
          </div>

          {/* Main Area: Editor */}
          <div className="flex-1 overflow-y-auto pr-2">
              {activeLesson ? (
                  <div className="space-y-8">
                      {/* Meta */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider">Lesson Details</h3>
                              <button onClick={() => deleteLesson(activeLesson.id)} className="text-red-400 hover:text-red-600 text-sm font-bold">Delete Lesson</button>
                          </div>
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                  <input 
                                    value={activeLesson.title}
                                    onChange={(e) => updateLesson(activeLesson.id, 'title', e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-blue-400 outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                  <input 
                                    value={activeLesson.description}
                                    onChange={(e) => updateLesson(activeLesson.id, 'description', e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-blue-400 outline-none"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Vocab */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-bold text-blue-500 uppercase tracking-wider">Vocabulary ({activeLesson.vocabulary.length})</h3>
                              <button onClick={() => addVocab(activeLesson.id)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold text-sm">+ Add Word</button>
                          </div>
                          
                          <div className="space-y-4">
                              {activeLesson.vocabulary.map((vocab, idx) => (
                                  <div key={vocab.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl">
                                      <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 shrink-0">{idx + 1}</div>
                                      <div className="flex-1 grid grid-cols-2 gap-2">
                                          <input 
                                            placeholder="Chinese (e.g. 你好)"
                                            value={vocab.chinese}
                                            onChange={(e) => updateVocab(activeLesson.id, vocab.id, 'chinese', e.target.value)}
                                            className="border border-gray-300 rounded p-2 text-sm"
                                          />
                                          <input 
                                            placeholder="Pinyin (e.g. nǐ hǎo)"
                                            value={vocab.pinyin}
                                            onChange={(e) => updateVocab(activeLesson.id, vocab.id, 'pinyin', e.target.value)}
                                            className="border border-gray-300 rounded p-2 text-sm"
                                          />
                                          <input 
                                            placeholder="English"
                                            value={vocab.english}
                                            onChange={(e) => updateVocab(activeLesson.id, vocab.id, 'english', e.target.value)}
                                            className="border border-gray-300 rounded p-2 text-sm"
                                          />
                                          <input 
                                            placeholder="Image Keyword"
                                            value={vocab.imageKeyword}
                                            onChange={(e) => updateVocab(activeLesson.id, vocab.id, 'imageKeyword', e.target.value)}
                                            className="border border-gray-300 rounded p-2 text-sm"
                                          />
                                      </div>
                                      <button onClick={() => deleteVocab(activeLesson.id, vocab.id)} className="text-gray-400 hover:text-red-500">🗑️</button>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Dialogues */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-bold text-green-500 uppercase tracking-wider">Dialogues ({activeLesson.dialogues.length})</h3>
                              <button onClick={() => addDialogue(activeLesson.id)} className="bg-green-100 text-green-600 px-3 py-1 rounded-lg font-bold text-sm">+ Add Dialogue</button>
                          </div>
                          
                          <div className="space-y-6">
                              {activeLesson.dialogues.map((dialogue, dIdx) => (
                                  <div key={dialogue.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                      <div className="flex justify-between mb-2">
                                          <span className="font-bold text-gray-500 text-sm">Dialogue {dIdx + 1}</span>
                                          <button onClick={() => deleteDialogue(activeLesson.id, dialogue.id)} className="text-red-400 text-xs">Remove</button>
                                      </div>
                                      <div className="space-y-2">
                                          {dialogue.lines.map((line, lIdx) => (
                                              <div key={lIdx} className="flex gap-2">
                                                  <div className="w-8 font-bold text-gray-400 pt-2">{line.speaker}:</div>
                                                  <div className="flex-1 space-y-1">
                                                      <input 
                                                        value={line.chinese}
                                                        onChange={(e) => updateDialogueLine(activeLesson.id, dialogue.id, lIdx, 'chinese', e.target.value)}
                                                        className="w-full border border-gray-300 rounded p-1 text-sm"
                                                        placeholder="Chinese"
                                                      />
                                                      <input 
                                                        value={line.pinyin}
                                                        onChange={(e) => updateDialogueLine(activeLesson.id, dialogue.id, lIdx, 'pinyin', e.target.value)}
                                                        className="w-full border border-gray-300 rounded p-1 text-sm"
                                                        placeholder="Pinyin"
                                                      />
                                                      <input 
                                                        value={line.english}
                                                        onChange={(e) => updateDialogueLine(activeLesson.id, dialogue.id, lIdx, 'english', e.target.value)}
                                                        className="w-full border border-gray-300 rounded p-1 text-sm"
                                                        placeholder="English"
                                                      />
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="text-6xl mb-4">👈</div>
                      <p>Select a lesson to edit or create a new one.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default LessonBuilder;
