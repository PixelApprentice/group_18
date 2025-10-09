import { AlertTriangle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="font-medium"> Educational Use Only</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="text-center">
            Simulated vulnerabilities for learning purposes. Do not test on production systems.
          </span>
        </div>
      </div>
    </footer>
  )
}
