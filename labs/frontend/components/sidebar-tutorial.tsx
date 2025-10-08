"use client"
import { useState } from 'react'

export default function SidebarTutorial({ title, lab }: { title: string, lab?: string }) {
  const [hintLevel, setHintLevel] = useState(0)
  
  const labData: Record<string, {
    payload: string;
    description: string;
    hints: string[];
    successCriteria: string;
  }> = {
    'sql-injection': {
      payload: "' OR '1'='1",
      description: "Learn how SQL injection vulnerabilities allow attackers to manipulate database queries and access unauthorized data.",
      hints: [
        "Try entering special characters like quotes (') in the search field.",
        "Use SQL operators like 'OR' to bypass authentication logic.",
        "Attempt to inject conditions that are always true, like '1'='1'."
      ],
      successCriteria: "You will know the lab is solved when the search returns admin/root user data that shouldn't be visible."
    },
    'xss': {
      payload: "<script>alert('XSS')</script>",
      description: "Understand how Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web applications.",
      hints: [
        "Try entering HTML tags in comment fields.",
        "Use script tags to execute JavaScript code.",
        "Test different XSS payloads to bypass filters."
      ],
      successCriteria: "Success when your script executes and displays an alert or modifies the page content."
    },
    'broken-auth': {
      payload: "admin / password123",
      description: "Explore authentication vulnerabilities that allow unauthorized access to user accounts.",
      hints: [
        "Try common username/password combinations.",
        "Look for default credentials or weak passwords.",
        "Test for session management flaws."
      ],
      successCriteria: "Successfully log in with credentials you shouldn't have access to."
    },
    'idor': {
      payload: "?id=999",
      description: "Learn about Insecure Direct Object References that expose unauthorized data through predictable URLs.",
      hints: [
        "Try changing ID parameters in the URL.",
        "Test sequential numbers to access other users' data.",
        "Look for patterns in object references."
      ],
      successCriteria: "Access notes or data belonging to other users by manipulating the ID parameter."
    }
  }

  const currentLab = lab && labData[lab] ? labData[lab] : null;

  async function copyPayload() {
    if (currentLab) {
      try { await navigator.clipboard.writeText(currentLab.payload); }
      catch (e) { /* ignore copy errors in server environments */ }
    }
  }

  return (
    <div className="card">
      <h3 className="font-semibold">{title} — What you'll learn</h3>
      <p className="text-sm text-white/60 mt-2">{currentLab?.description || 'Progressive hints, safe payloads, and success criteria.'}</p>

      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-white/60">Hints:</span>
          <div className="flex gap-1">
            {[1,2,3].map(i => (
              <button key={i} onClick={() => setHintLevel(i)} className={`px-2 py-1 text-xs rounded ${hintLevel===i? 'bg-cyanAccent text-black' : 'bg-white/3'}`}>L{i}</button>
            ))}
          </div>
        </div>

        <div className="p-2 bg-white/3 rounded mb-3">
          <div className="text-sm">
            {hintLevel === 0 
              ? 'Select a hint level to reveal guidance.' 
              : currentLab?.hints[hintLevel - 1] || 'No hint available for this level.'
            }
          </div>
        </div>

        {currentLab && (
          <div className="p-2 bg-white/3 rounded mb-3">
            <div className="flex items-start justify-between">
              <div className="font-mono text-sm">Try payload: {currentLab.payload}</div>
              <button onClick={copyPayload} className="btn text-sm">Copy</button>
            </div>
            <div className="text-xs text-white/60 mt-2">Use in lab-specific inputs to observe how the system responds. Safety: payloads are simulated or sanitized in the UI.</div>
          </div>
        )}

        <div className="p-2 bg-white/3 rounded">
          <div className="font-semibold">Success criteria</div>
          <div className="text-sm text-white/60 mt-1">{currentLab?.successCriteria || 'Complete the lab objectives to succeed.'}</div>
        </div>
      </div>
    </div>
  )
}
