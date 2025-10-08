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
  return (
  <div>
      <section className="mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold">Interactive Cybersecurity Learning</h1>
          <p className="text-white/70 mt-2">Realistic labs that simulate vulnerabilities in professional applications.</p>
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
