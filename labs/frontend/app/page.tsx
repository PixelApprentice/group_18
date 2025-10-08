"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Progress from '../components/progress'
import { LabProgress } from '../lib/progress'

function LabCard({ title, href, icon, labId }: { title: string; href: string; icon: string; labId: string }) {
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    setIsCompleted(LabProgress.isComplete(labId))
  }, [labId])

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/6 rounded flex items-center justify-center">{icon}</div>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-white/60">Beginner</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 sm:items-end">
          <div className="text-sm text-white/60">{isCompleted ? '1/1 completed ✅' : '0/1 completed'}</div>
          <Progress value={isCompleted ? 100 : 0} />
          <Link href={href} className="btn w-full sm:w-auto text-center">
            {isCompleted ? 'Review Lab' : 'Start Lab'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [userId, setUserId] = useState('')
  const [completedCount, setCompletedCount] = useState(0)
  const [showProgressManager, setShowProgressManager] = useState(false)

  useEffect(() => {
    setUserId(LabProgress.getUserId())
    setCompletedCount(LabProgress.getCompletedCount())
  }, [])

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      LabProgress.resetProgress()
      setCompletedCount(0)
      setShowProgressManager(false)
      // Refresh the page to update all components
      window.location.reload()
    }
  }

  const handleExportProgress = () => {
    const progress = LabProgress.exportProgress()
    if (progress) {
      const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sekur-labs-progress-${progress.userId}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
  <div>
      <section className="mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold">Interactive Cybersecurity Learning</h1>
          <p className="text-white/70 mt-2">Realistic labs that simulate vulnerabilities in professional applications.</p>
          
          {/* Progress Summary */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/60">
                Progress: <span className="text-cyanAccent font-semibold">{completedCount}/4 labs completed</span>
              </div>
              <div className="text-xs text-white/50">
                User: {userId.slice(0, 12)}...
              </div>
            </div>
            <button 
              onClick={() => setShowProgressManager(!showProgressManager)}
              className="text-xs text-white/60 hover:text-white"
            >
              Manage Progress
            </button>
          </div>

          {/* Progress Management Panel */}
          {showProgressManager && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="font-semibold mb-3">Progress Management</h3>
              <div className="space-y-3">
                <div className="text-sm text-white/70">
                  <strong>User ID:</strong> {userId}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={handleExportProgress}
                    className="btn text-sm"
                  >
                    Export Progress
                  </button>
                  <button 
                    onClick={handleResetProgress}
                    className="text-sm px-3 py-1 bg-warn/20 text-warn border border-warn/30 rounded hover:bg-warn/30"
                  >
                    Reset Progress
                  </button>
                </div>
                <div className="text-xs text-white/50">
                  Your progress is stored locally in your browser. Export to backup or share your achievements.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LabCard title="SQL Injection" href="/sql-injection" icon="🛡️" labId="sql-injection" />
        <LabCard title="Cross-Site Scripting" href="/xss" icon="💬" labId="xss" />
        <LabCard title="Broken Authentication" href="/broken-auth" icon="🔐" labId="broken-auth" />
        <LabCard title="Insecure Direct Object Reference" href="/idor" icon="📄" labId="idor" />
      </div>
        </section>
    </div>
  )
}
