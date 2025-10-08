"use client"
import { useEffect, useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState<'dark'|'light'>('dark')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sekurlabs:theme') : null
    if (saved === 'light' || saved === 'dark') setTheme(saved)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('sekurlabs:theme', theme) } catch (e) {}
  }, [theme])

  return (
    <header className="w-full border-b border-white/6">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyanAccent rounded-md flex items-center justify-center text-black font-bold">S</div>
          <div>
            <div className="text-xl font-semibold">SEKUR Labs</div>
            <div className="text-xs text-white/60">Professional Attack Simulations</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <a href="/" className="text-white/80 hover:text-white">Labs</a>
          <a href="https://portswigger.net/web-security" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white/80">OWASP Top 10</a>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="btn">{theme === 'dark' ? 'Light' : 'Dark'} Mode</button>
        </nav>
      </div>
    </header>
  )
}
