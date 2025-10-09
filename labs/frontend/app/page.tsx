"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Shield, MessageSquare, Lock, FileText, Download, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LabProgress } from '../lib/progress'

interface LabCardProps {
  title: string
  href: string
  icon: React.ReactNode
  labId: string
  description: string
}

function LabCard({ title, href, icon, labId, description }: LabCardProps) {
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    setIsCompleted(LabProgress.isComplete(labId))
  }, [labId])

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">{title}</CardTitle>
            <CardDescription className="text-xs">Beginner Level</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
              {isCompleted ? 'Complete' : '0/1 tasks'}
            </span>
          </div>
          <Progress value={isCompleted ? 100 : 0} className="h-2" />
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild className="w-full" variant={isCompleted ? "outline" : "default"}>
          <Link href={href}>
            {isCompleted ? 'Review Lab' : 'Start Lab'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
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

  const labs = [
    {
      title: "SQL Injection",
      href: "/sql-injection",
      icon: <Shield className="w-5 h-5" />,
      labId: "sql-injection",
      description: "Learn how SQL injection attacks work and how to prevent them in web applications."
    },
    {
      title: "Cross-Site Scripting",
      href: "/xss",
      icon: <MessageSquare className="w-5 h-5" />,
      labId: "xss",
      description: "Understand XSS vulnerabilities and implement proper input validation and output encoding."
    },
    {
      title: "Broken Authentication",
      href: "/broken-auth",
      icon: <Lock className="w-5 h-5" />,
      labId: "broken-auth",
      description: "Explore authentication flaws and learn secure session management practices."
    },
    {
      title: "Insecure Direct Object Reference",
      href: "/idor",
      icon: <FileText className="w-5 h-5" />,
      labId: "idor",
      description: "Discover IDOR vulnerabilities and implement proper access controls."
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Interactive Cybersecurity Learning
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Realistic labs that simulate vulnerabilities in professional applications. 
          Learn by doing with hands-on security challenges.
        </p>
      </section>

      {/* Progress Summary */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">Your Progress</CardTitle>
              <CardDescription>
                <span className="font-semibold text-primary">{completedCount}/4</span> labs completed
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="text-xs text-muted-foreground self-start sm:self-center">
                ID: {userId.slice(0, 12)}...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProgressManager(!showProgressManager)}
              >
                Manage Progress
              </Button>
            </div>
          </div>
        </CardHeader>

        {showProgressManager && (
          <CardContent className="border-t">
            <div className="space-y-4 pt-4">
              <div>
                <h3 className="font-semibold mb-2">Progress Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your progress is stored locally in your browser. Export to backup or share your achievements.
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">User ID</p>
                <p className="text-xs text-muted-foreground font-mono break-all">{userId}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportProgress}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Progress
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleResetProgress}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Progress
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Labs Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Available Labs</h2>
          <p className="text-muted-foreground">Choose a lab to start your cybersecurity journey</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {labs.map((lab) => (
            <LabCard key={lab.labId} {...lab} />
          ))}
        </div>
      </section>
    </div>
  )
}
