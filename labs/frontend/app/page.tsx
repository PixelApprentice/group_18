import Link from 'next/link'
import Progress from '../components/progress'

function LabCard({ title, href, icon }: { title: string; href: string; icon: string }) {
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
          <div className="text-sm text-white/60">0/1 completed</div>
          <Progress value={0} />
          <Link href={href} className="btn w-full sm:w-auto text-center">Start Lab</Link>
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
        <LabCard title="SQL Injection" href="/sql-injection" icon="🛡️" />
        <LabCard title="Cross-Site Scripting" href="/xss" icon="💬" />
        <LabCard title="Broken Authentication" href="/broken-auth" icon="🔐" />
        <LabCard title="Insecure Direct Object Reference" href="/idor" icon="📄" />
      </div>
        </section>
    </div>
  )
}
