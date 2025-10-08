"use client"
import SidebarTutorial from '../../components/sidebar-tutorial'
import { useState } from 'react'

function Comment({ avatar, user, time, children }: any) {
  return (
    <div className="card flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center">{avatar}</div>
      <div>
        <div className="text-sm font-semibold">{user} <span className="text-xs text-white/60">· {time}</span></div>
        <div className="mt-1 text-sm">{children}</div>
      </div>
    </div>
  )
}

export default function XSSPage() {
  const [comments, setComments] = useState([
    { id: 1, user: 'eve', time: '2h', text: 'Hello world!' },
    { id: 2, user: 'mallory', time: '1d', text: 'Nice post!' }
  ])
  const [alert, setAlert] = useState<string| null>(null)

  function postComment(text: string) {
    // Simulate detection of script-like content
    if (text.includes('<script') || text.includes('javascript:')) {
      setAlert('XSS-like content detected (simulated). Review payload in tutorial.');
    }
    setComments(c => [{ id: Date.now(), user: 'you', time: 'now', text }, ...c])
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="card mb-4">
          <h2 className="text-xl font-semibold">Community Forum</h2>
        </div>

        <div className="card">
          <form onSubmit={(e) => { e.preventDefault(); const t = (e.target as any).comment.value; postComment(t); (e.target as any).reset(); }} aria-label="Post comment">
            <div className="mb-3">
              <textarea name="comment" className="w-full p-3 bg-transparent border rounded" placeholder="Share your thoughts... (rich editor placeholder)" rows={4}></textarea>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-white/60">You can test payloads from the tutorial.</div>
              <div>
                <button className="btn">Post Comment</button>
              </div>
            </div>
          </form>

          <div className="mt-4" aria-live="polite">
            {alert && <div className="p-3 rounded mb-3 bg-warn/10 border border-warn">{alert}</div>}
            <div className="space-y-3">
              {comments.map(c => (
                <Comment key={c.id} avatar={c.user[0]} user={c.user} time={c.time}>{c.text}</Comment>
              ))}
            </div>
          </div>

          <div className="mt-4 card">
            <div className="font-semibold">Developer Tools Mockup</div>
            <div className="mt-2 text-sm text-white/60">(Placeholder) Shows injected script output and DOM changes when XSS is triggered.</div>
          </div>
        </div>
      </div>

      <aside className="col-span-1">
        <SidebarTutorial title="XSS" lab="xss" />
      </aside>
    </div>
  )
}
