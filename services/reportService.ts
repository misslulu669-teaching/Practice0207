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
  // This forces browsers (especially iOS Safari) to treat it as a download/file to save
  // rather than trying to display the JSON text string.
  return new File([jsonString], filename, { type: 'application/octet-stream' });
};

export const exportReportToJSON = async (report: SavedReport) => {
  const file = await getReportFile(report);
  const url = URL.createObjectURL(file);
  
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.href = url;
  downloadAnchorNode.download = file.name;
  
  // Required for Firefox and some mobile browsers
  document.body.appendChild(downloadAnchorNode);
  
  // Trigger click
  downloadAnchorNode.click();
  
  // CRITICAL FIX: Add a timeout before cleanup.
  // Mobile browsers can be slow to process the click event.
  // Revoking immediately can cause the download to fail on iOS.
  setTimeout(() => {
    if (document.body.contains(downloadAnchorNode)) {
        document.body.removeChild(downloadAnchorNode);
    }
    URL.revokeObjectURL(url);
  }, 500);
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