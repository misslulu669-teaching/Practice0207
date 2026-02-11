import { SavedReport, SubmissionRecord } from '../types';
import { blobToBase64 } from './geminiService';
import { LESSONS } from '../constants';

// --- IndexedDB Configuration ---
const DB_NAME = 'PandaClassDB';
const DB_VERSION = 2; // Incremented version
const STORE_REPORTS = 'homework_reports';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_REPORTS)) {
        db.createObjectStore(STORE_REPORTS, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Save a full student report including Audio Blobs to IndexedDB
 */
export const saveHomeworkReport = async (
  lessonId: number,
  studentName: string,
  submissions: SubmissionRecord[]
): Promise<SavedReport | null> => {
  try {
    const db = await openDB();
    
    // Calculate score
    const totalScore = submissions.reduce((acc, curr) => acc + (curr.score * 10), 0);

    const report: SavedReport = {
      id: crypto.randomUUID(),
      lessonId,
      studentName,
      timestamp: Date.now(),
      submissionsCount: submissions.length,
      totalScore,
      submissions: submissions // This array contains Blobs, which IndexedDB handles natively
    };

    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_REPORTS, 'readwrite');
      const store = tx.objectStore(STORE_REPORTS);
      const req = store.add(report);
      
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });

    return report;
  } catch (e) {
    console.error("Save failed", e);
    return null;
  }
};

/**
 * Get all homework reports
 */
export const getAllHomeworkReports = async (): Promise<SavedReport[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_REPORTS, 'readonly');
      const store = tx.objectStore(STORE_REPORTS);
      const req = store.getAll();
      
      req.onsuccess = () => {
        // Sort by newest first
        const results = req.result as SavedReport[];
        results.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return [];
  }
};

/**
 * Delete a report - Fixed to await transaction completion
 */
export const deleteReport = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_REPORTS, 'readwrite');
      const store = tx.objectStore(STORE_REPORTS);
      store.delete(id);
      
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
  });
};

/**
 * Clear all reports - Fixed to await transaction completion
 */
export const clearAllReports = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_REPORTS, 'readwrite');
        const store = tx.objectStore(STORE_REPORTS);
        store.clear();

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

// --- IMPORT / EXPORT UTILITIES ---

// Helper: Convert Base64 back to Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  try {
      const byteCharacters = atob(base64);
      const byteArrays = [];
    
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
    
      return new Blob(byteArrays, { type: mimeType });
  } catch (e) {
      console.error("Base64 decoding failed", e);
      return new Blob([], { type: mimeType });
  }
};

// Helper to prepare report for transport (convert Blobs to Base64)
const prepareReportForTransport = async (report: SavedReport) => {
    const serializableSubmissions = await Promise.all(report.submissions.map(async (sub) => {
        if (sub.input instanceof Blob) {
          const base64 = await blobToBase64(sub.input);
          return {
            ...sub,
            input: {
              type: 'blob',
              mimeType: sub.input.type,
              data: base64
            }
          };
        }
        return sub;
      }));
    
      return {
        ...report,
        submissions: serializableSubmissions
      };
};

// Helper to parse report from transport (Base64 back to Blobs)
const parseReportFromTransport = (json: any): SavedReport => {
    const submissions = json.submissions.map((sub: any) => {
        if (sub.input && typeof sub.input === 'object' && sub.input.type === 'blob') {
          return {
            ...sub,
            input: base64ToBlob(sub.input.data, sub.input.mimeType)
          };
        }
        return sub;
     });

     return {
       ...json,
       submissions
     };
};

// New Helper: Generate a File object for sharing
export const getReportFile = async (report: SavedReport): Promise<File> => {
  const exportData = await prepareReportForTransport(report);
  const jsonString = JSON.stringify(exportData);
  
  // Format filename with precise timestamp for clarity
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  const filename = `panda_homework_${report.studentName}_${dateStr}_${timeStr}.json`;
  
  // CRITICAL FIX: Use application/octet-stream.
  return new File([jsonString], filename, { type: 'application/octet-stream' });
};

// --- HTML REPORT GENERATOR ---
export const generateHTMLReport = async (report: SavedReport): Promise<File> => {
    const lesson = LESSONS.find(l => l.id === report.lessonId);
    const title = lesson?.title || "Unknown Lesson";
    const dateStr = new Date(report.timestamp).toLocaleString();
    
    // We reuse this to get the base64 strings for audio
    const transportData = await prepareReportForTransport(report);

    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report: ${report.studentName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Fredoka', sans-serif; background-color: #f0f9ff; background-image: radial-gradient(#bae6fd 2px, transparent 2px); background-size: 32px 32px; }
    </style>
</head>
<body class="p-4 sm:p-8 min-h-screen">
    <div class="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl border-4 border-white p-6 sm:p-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-gray-100 pb-6 mb-8 gap-4">
            <div class="flex items-center gap-4">
                <div class="text-4xl bg-yellow-100 p-3 rounded-full">🐼</div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Homework Report</h1>
                    <p class="text-blue-500 font-bold text-lg">${report.studentName}</p>
                </div>
            </div>
            <div class="text-left sm:text-right">
                <div class="font-bold text-gray-700">${title}</div>
                <div class="text-gray-400 text-sm">${dateStr}</div>
                <div class="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
                    Score: ${report.totalScore}
                </div>
            </div>
        </div>

        <!-- Submissions -->
        <div class="space-y-6">
`;

    transportData.submissions.forEach((sub: any) => {
        // Find Vocabulary context
        let promptText = "Unknown Item";
        const vocab = lesson?.vocabulary.find(v => v.id === sub.itemId);
        
        if (vocab) {
            promptText = `${vocab.chinese} (${vocab.pinyin})`;
        } else if (lesson?.dialogues) {
            // Check dialogues
            const d = lesson.dialogues.find(d => sub.itemId.startsWith(d.id));
            if (d) promptText = "Dialogue Roleplay";
        }

        if (sub.type === 'writing') {
            const isCorrect = sub.score > 0;
            htmlContent += `
            <div class="bg-blue-50 rounded-2xl p-5 border-l-8 ${isCorrect ? 'border-green-400' : 'border-red-400'}">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-blue-500 uppercase tracking-widest">✍️ Spelling</span>
                    <span class="text-2xl">${isCorrect ? '✅' : '❌'}</span>
                </div>
                <div class="font-bold text-gray-700 text-lg mb-1">${promptText}</div>
                <div class="text-gray-500">
                    Student wrote: <span class="font-bold font-mono ${isCorrect ? 'text-green-600' : 'text-red-500'} text-xl">${sub.input}</span>
                </div>
            </div>`;
        } 
        else if (sub.type === 'speaking' || sub.type === 'dialogue') {
            // EMBED AUDIO HERE
            // sub.input.data is the base64 string
            const audioSrc = `data:${sub.input.mimeType};base64,${sub.input.data}`;
            const typeLabel = sub.type === 'dialogue' ? '💬 Dialogue' : '🎤 Speaking';
            
            htmlContent += `
            <div class="bg-green-50 rounded-2xl p-5 border-l-8 border-green-400">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-green-600 uppercase tracking-widest">${typeLabel}</span>
                    <span class="text-2xl">🔊</span>
                </div>
                <div class="font-bold text-gray-700 text-lg mb-3">${promptText}</div>
                
                <!-- Native Audio Player with Base64 Source -->
                <audio controls src="${audioSrc}" class="w-full h-10 rounded-full"></audio>
            </div>`;
        }
        else if (sub.type === 'quiz') {
            const isCorrect = sub.score > 0;
            htmlContent += `
            <div class="bg-purple-50 rounded-2xl p-5 border-l-8 ${isCorrect ? 'border-purple-400' : 'border-red-400'}">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold text-purple-500 uppercase tracking-widest">🧩 Quiz</span>
                    <span class="text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}">${isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
                <div class="font-bold text-gray-700">${promptText}</div>
            </div>`;
        }
    });

    htmlContent += `
        </div>
        <div class="mt-10 pt-6 border-t-2 border-gray-100 text-center">
            <p class="text-gray-400 font-bold text-sm">Generated by Little Panda Class 🐼</p>
        </div>
    </div>
</body>
</html>`;

    // Create File
    const filename = `Report_${report.studentName}_${dateStr.split(',')[0].replace(/\//g, '-')}.html`;
    return new File([htmlContent], filename, { type: 'text/html' });
};

export const exportReportToJSON = async (report: SavedReport) => {
  const file = await getReportFile(report);
  downloadFile(file);
};

export const exportReportToHTML = async (report: SavedReport) => {
    const file = await generateHTMLReport(report);
    downloadFile(file);
};

// Helper to trigger download
const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.href = url;
  downloadAnchorNode.download = file.name;
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  
  setTimeout(() => {
    if (document.body.contains(downloadAnchorNode)) {
        document.body.removeChild(downloadAnchorNode);
    }
    URL.revokeObjectURL(url);
  }, 1000); // 1s delay for mobile
};

export const importReportFromJSON = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Validate basic structure
        if (!json.id || !json.submissions) {
            console.warn("Invalid JSON structure");
            resolve(false);
            return;
        }

        const report = parseReportFromTransport(json);

        // Save to DB
        const db = await openDB();
        const tx = db.transaction(STORE_REPORTS, 'readwrite');
        const store = tx.objectStore(STORE_REPORTS);
        store.put(report); 
        
        resolve(true);
      } catch (e) {
        console.error("Import failed", e);
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
};