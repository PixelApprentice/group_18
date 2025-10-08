// User identification and progress tracking
const getUserId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  let userId = localStorage.getItem('sekur-labs-user-id');
  if (!userId) {
    // Generate unique user ID based on browser fingerprint
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    userId = 'user_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
    localStorage.setItem('sekur-labs-user-id', userId);
  }
  
  return userId;
};

const getStorageKey = (key: string): string => {
  return `sekur-labs-${getUserId()}-${key}`;
};

export const LabProgress = {
  markComplete: (labId: string) => {
    if (typeof window !== 'undefined') {
      const storageKey = getStorageKey('completed');
      const completed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!completed.includes(labId)) {
        completed.push(labId);
        localStorage.setItem(storageKey, JSON.stringify(completed));
        
        // Also store completion timestamp
        const timestampKey = getStorageKey(`completed-${labId}`);
        localStorage.setItem(timestampKey, new Date().toISOString());
      }
    }
  },

  isComplete: (labId: string): boolean => {
    if (typeof window !== 'undefined') {
      const storageKey = getStorageKey('completed');
      const completed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return completed.includes(labId);
    }
    return false;
  },

  getCompletedCount: (): number => {
    if (typeof window !== 'undefined') {
      const storageKey = getStorageKey('completed');
      const completed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return completed.length;
    }
    return 0;
  },

  getTotalLabs: (): number => {
    return 4; // SQL, XSS, Broken Auth, IDOR
  },

  getUserId: (): string => {
    return getUserId();
  },

  getCompletionDate: (labId: string): string | null => {
    if (typeof window !== 'undefined') {
      const timestampKey = getStorageKey(`completed-${labId}`);
      return localStorage.getItem(timestampKey);
    }
    return null;
  },

  resetProgress: () => {
    if (typeof window !== 'undefined') {
      const userId = getUserId();
      const keys = Object.keys(localStorage).filter(key => key.includes(`sekur-labs-${userId}`));
      keys.forEach(key => localStorage.removeItem(key));
    }
  },

  exportProgress: () => {
    if (typeof window !== 'undefined') {
      const userId = getUserId();
      const progress = {
        userId,
        completed: JSON.parse(localStorage.getItem(getStorageKey('completed')) || '[]'),
        timestamps: {} as Record<string, string>
      };
      
      // Get completion timestamps
      const labs = ['sql-injection', 'xss', 'broken-auth', 'idor'];
      labs.forEach(lab => {
        const date = LabProgress.getCompletionDate(lab);
        if (date) progress.timestamps[lab] = date;
      });
      
      return progress;
    }
    return null;
  }
};
