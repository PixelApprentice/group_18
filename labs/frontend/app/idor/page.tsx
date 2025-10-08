"use client"
import { useState } from 'react'
import SidebarTutorial from '../../components/sidebar-tutorial'

export default function IDORPage() {
  const [docId, setDocId] = useState('123')
  const [warning, setWarning] = useState<string | null>(null)

  function viewDoc(id: string) {
    setDocId(id)
    // Simulate unauthorized access when id is 999
    setWarning(id === '999' ? 'Access denied: you are not authorized to view this document.' : null)
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
          <div className="flex items-center justify-between"><h2 className="font-semibold">Document Viewer</h2>
            <div className="text-sm text-white/60">URL: /documents?id={docId}</div>
          </div>
          <div className="mt-4">
            {warning && <div className="p-3 rounded bg-warn/10 border border-warn mb-3">{warning}</div>}
            <div>Viewing document ID: {docId} — content placeholder</div>
          </div>
        </div>
      </div>

      <aside className="col-span-1">
        <SidebarTutorial title="IDOR" lab="idor" />
      </aside>
    </div>
  )
}
