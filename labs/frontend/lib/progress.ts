// Simple localStorage-based progress tracking
export const LabProgress = {
  markComplete: (labId: string) => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('sekur-labs-completed') || '[]');
      if (!completed.includes(labId)) {
        completed.push(labId);
        localStorage.setItem('sekur-labs-completed', JSON.stringify(completed));
      }
    }
  },

  isComplete: (labId: string): boolean => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('sekur-labs-completed') || '[]');
      return completed.includes(labId);
    }
    return false;
  },

  getCompletedCount: (): number => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('sekur-labs-completed') || '[]');
      return completed.length;
    }
    return 0;
  },

  getTotalLabs: (): number => {
    return 4; // SQL, XSS, Broken Auth, IDOR
  }
};
