"use client"
import SidebarTutorial from '../../components/sidebar-tutorial'
import { useState } from 'react'
import Modal from '../../components/modal'

export default function SQLPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{type:'success'|'warning'|'info', message:string}|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [injectionSuccess, setInjectionSuccess] = useState(false)

  const sampleData = [
    { id: 1, username: 'alice', email: 'alice@example.com' },
    { id: 2, username: 'bob', email: 'bob@example.com' },
    { id: 3, username: 'carol', email: 'carol@example.com' }
  ]

  const adminData = [
    { id: 999, username: 'admin', email: 'admin@sekur.com' },
    { id: 1000, username: 'root', email: 'root@sekur.com' }
  ]

  async function onSearch(e?: any) {
    if (e) e.preventDefault()
    setLoading(true)
    setAlert(null)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    
    if (query.includes("' OR '") || query.toLowerCase().includes(' or ') || query.includes('1=1')) {
      setAlert({ type: 'warning', message: 'SQL injection successful! Unauthorized data exposed.' })
      setInjectionSuccess(true)
    } else if (query.trim()) {
      setAlert({ type: 'success', message: 'Search completed. Results filtered by your input.' })
      setInjectionSuccess(false)
    } else {
      setInjectionSuccess(false)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="card mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">Labs / SQL Injection</div>
            <h2 className="text-xl font-semibold">User Directory Search</h2>
          </div>
          <div>
            <button onClick={() => setShowModal(true)} className="text-sm text-white/60">Show vulnerable query</button>
          </div>
        </div>

        <form className="card" onSubmit={onSearch}>
          <div className="flex gap-3 items-center sm:items-stretch flex-wrap sm:flex-nowrap">
            <label className="sr-only">Search users</label>
            <input value={query} onChange={e => setQuery(e.target.value)} aria-label="Search users" className="flex-1 bg-transparent border border-white/6 p-3 rounded min-w-0" placeholder="Search users by name or email" />
            <div className="mt-2 sm:mt-0">
              <button aria-label="Search" className="btn" aria-busy={loading} disabled={loading}>
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </div>

          <div className="mt-4" aria-live="polite">
            {alert && (
              <div className={`p-3 rounded mb-3 ${alert.type==='warning' ? 'bg-warn/10 border border-warn' : 'bg-success/10 border border-success'}`}>
                {alert.message}
              </div>
            )}

{(query.trim() || injectionSuccess) && (
              <table className="w-full text-left text-sm">
                <thead className="text-white/60">
                  <tr><th>ID</th><th>Username</th><th>Email</th></tr>
                </thead>
                <tbody>
                  {injectionSuccess ? 
                    [...sampleData, ...adminData].map(u => (
                      <tr key={u.id} className="border-t border-white/6">
                        <td>{u.id}</td>
                        <td className={u.id >= 999 ? 'text-warn font-bold' : ''}>{u.username}</td>
                        <td className={u.id >= 999 ? 'text-warn font-bold' : ''}>{u.email}</td>
                      </tr>
                    )) :
                    sampleData.filter(u => 
                      u.username.toLowerCase().includes(query.toLowerCase()) || 
                      u.email.toLowerCase().includes(query.toLowerCase())
                    ).map(u => (
                      <tr key={u.id} className="border-t border-white/6">
                        <td>{u.id}</td><td>{u.username}</td><td>{u.email}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )}
          </div>
        </form>
      </div>

      <aside className="col-span-1">
        <SidebarTutorial title="SQL Injection" lab="sql-injection" />
      </aside>

      {showModal && (
        <Modal title="Vulnerable SQL Query" onClose={() => setShowModal(false)}>
          <pre className="bg-black/60 p-3 rounded text-sm overflow-auto">SELECT * FROM users WHERE name = '{'{user_input}'}';</pre>
          <div className="mt-2 text-sm text-white/60">This query concatenates user input directly into the SQL string, which is vulnerable to injection. Use parameterized queries to remediate.</div>
        </Modal>
      )}
    </div>
  )
}
