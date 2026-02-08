import { SavedReport, SubmissionRecord } from '../types';
import { blobToBase64 } from './geminiService';

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
 * Get all homework summaries for the list
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
 * Delete a report
 */
export const deleteReport = async (id: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_REPORTS, 'readwrite');
  tx.objectStore(STORE_REPORTS).delete(id);
};

export const clearAllReports = async (): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(STORE_REPORTS, 'readwrite');
    tx.objectStore(STORE_REPORTS).clear();
};

// --- IMPORT / EXPORT UTILITIES ---

// Helper: Convert Base64 back to Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
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
};

export const exportReportToJSON = async (report: SavedReport) => {
  // Deep copy and transform Blobs to Base64 strings for JSON storage
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

  const exportData = {
    ...report,
    submissions: serializableSubmissions
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `panda_homework_${report.studentName}_${Date.now()}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const importReportFromJSON = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Transform Base64 objects back to Blobs
        const submissions = json.submissions.map((sub: any) => {
           if (sub.input && typeof sub.input === 'object' && sub.input.type === 'blob') {
             return {
               ...sub,
               input: base64ToBlob(sub.input.data, sub.input.mimeType)
             };
           }
           return sub;
        });

        const report: SavedReport = {
          ...json,
          submissions
        };

        // Save to DB
        const db = await openDB();
        const tx = db.transaction(STORE_REPORTS, 'readwrite');
        const store = tx.objectStore(STORE_REPORTS);
        // Force a new ID to avoid collisions if imported multiple times, or keep original?
        // Let's keep original ID to dedupe if needed, but here we just put()
        store.put(report); 
        
        resolve(true);
      } catch (e) {
        console.error("Import failed", e);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};