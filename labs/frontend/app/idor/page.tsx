"use client"
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SidebarTutorial from '../../components/sidebar-tutorial'
import { LabProgress } from '../../lib/progress'

function IDORContent() {
  const searchParams = useSearchParams()
  const [docId, setDocId] = useState('123')
  const [warning, setWarning] = useState<string | null>(null)
  const [idorSuccess, setIdorSuccess] = useState(false)

  useEffect(() => {
    const urlId = searchParams.get('id')
    if (urlId) {
      setDocId(urlId)
      viewDoc(urlId)
    }
  }, [searchParams])

  function viewDoc(id: string) {
    setDocId(id)
    
    // Update URL without page reload
    const newUrl = `${window.location.pathname}?id=${id}`
    window.history.pushState({}, '', newUrl)
    
    // Check for IDOR vulnerability exploitation
    if (id === '999' || id === '1000') {
      setWarning('🎉 IDOR vulnerability exploited! Lab completed - Accessed unauthorized document.')
      setIdorSuccess(true)
      LabProgress.markComplete('idor')
    } else if (id !== '123' && id !== '124') {
      setWarning('Document not found or access denied.')
      setIdorSuccess(false)
    } else {
      setWarning(null)
      setIdorSuccess(false)
    }
  }

  const handleDirectIdInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      viewDoc(target.value)
    }
  }

  const documents = [
    { id: '123', title: 'Employee Handbook', date: '2024-01-12' },
    { id: '124', title: 'Q1 Financials', date: '2024-03-22' },
    { id: '999', title: 'Secret Strategy', date: '2025-07-01' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
      <nav className="col-span-1 card">
        <div className="font-semibold">My Documents</div>
        <ul className="mt-2 text-sm text-white/60 space-y-2">
          {documents.map(d => (
            <li key={d.id} className="flex items-center justify-between">
              <span>{d.title}</span>
              <button onClick={() => viewDoc(d.id)} className="text-xs text-cyanAccent">View</button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="col-span-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Document Viewer</h2>
            <div className="text-sm text-white/60">URL: /idor?id={docId}</div>
          </div>
          
          <div className="mt-4">
            <div className="mb-3">
              <label className="block text-sm text-white/60 mb-2">Try different document IDs:</label>
              <input 
                className="w-full bg-transparent border p-2 rounded text-sm"
                placeholder="Enter document ID (try 999, 1000, etc.)"
                onKeyPress={handleDirectIdInput}
              />
              <div className="text-xs text-white/50 mt-1">Press Enter to load document</div>
            </div>
            
            {warning && (
              <div className={`p-3 rounded mb-3 ${idorSuccess ? 'bg-success/10 border border-success' : 'bg-warn/10 border border-warn'}`}>
                {warning}
              </div>
            )}
            
            <div className="bg-white/3 p-4 rounded">
              <h3 className="font-semibold mb-2">Document #{docId}</h3>
              {docId === '999' && (
                <div className="text-warn">
                  <strong>CONFIDENTIAL - CEO EYES ONLY</strong><br/>
                  Strategic acquisition plans for Q4 2025...<br/>
                  Budget: $50M allocated for hostile takeover...
                </div>
              )}
              {docId === '1000' && (
                <div className="text-warn">
                  <strong>HR CONFIDENTIAL</strong><br/>
                  Employee salary data and performance reviews...<br/>
                  Layoff plans for 2025...
                </div>
              )}
              {(docId === '123' || docId === '124') && (
                <div>Standard employee document content...</div>
              )}
              {docId !== '123' && docId !== '124' && docId !== '999' && docId !== '1000' && (
                <div className="text-white/60">Document not found or access denied.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="col-span-1">
        <SidebarTutorial title="IDOR" lab="idor" />
      </aside>
    </div>
  )
}

export default function IDORPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <IDORContent />
    </Suspense>
  )
}
