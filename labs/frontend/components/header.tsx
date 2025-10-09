"use client"
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Moon, Sun, Home, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-sm">
              S
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-semibold">SEKUR Labs</div>
              <div className="text-xs text-muted-foreground">Professional Attack Simulations</div>
            </div>
            <div className="sm:hidden">
              <div className="font-semibold">SEKUR Labs</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-4">
            {!isHomePage && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
            )}
            
            <Button variant="ghost" size="sm" asChild>
              <Link 
                href="https://portswigger.net/web-security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline">OWASP Top 10</span>
                <span className="sm:hidden">OWASP</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
