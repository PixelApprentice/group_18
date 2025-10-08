"use client"
import { useState } from 'react'
import SidebarTutorial from '../../components/sidebar-tutorial'

export default function BrokenAuthPage() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="card mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">Corporate / Internal App</div>
            <h2 className="text-xl font-semibold">Sign In</h2>
          </div>
          <div className="text-right text-sm text-white/60">ACME Corp</div>
        </div>

        {!loggedIn ? (
          <div className="card">
            <div className="mt-4">
              <input className="w-full bg-transparent border p-3 rounded mb-2" placeholder="Username" aria-label="Username" />
              <input className="w-full bg-transparent border p-3 rounded mb-2" placeholder="Password" type="password" aria-label="Password" />
              <div className="flex items-center justify-between text-sm text-white/60 mb-3 flex-wrap">
                <label className="mr-2"><input type="checkbox" /> Remember me</label>
                <a className="text-cyanAccent">Forgot password?</a>
              </div>
              <div className="mt-2">
                <button onClick={() => setLoggedIn(true)} className="btn">Sign In</button>
              </div>
              <div className="mt-3 text-sm text-white/60">Sample credentials: <span className="text-white">admin / password123</span></div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/6 flex items-center justify-center">A</div>
              <div>
                <div className="font-semibold">Admin User</div>
                <div className="text-sm text-white/60">admin@acme.example</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-white/60">Security warnings: weak password used — this account is vulnerable to credential stuffing (simulated).</div>
          </div>
        )}
      </div>

      <aside className="col-span-1">
        <SidebarTutorial title="Broken Authentication" lab="broken-auth" />
      </aside>
    </div>
  )
}
