import { SavedReport, SubmissionRecord } from '../types';

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
): Promise<boolean> => {
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

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_REPORTS, 'readwrite');
      const store = tx.objectStore(STORE_REPORTS);
      const req = store.add(report);
      
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error("Save failed", e);
    return false;
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