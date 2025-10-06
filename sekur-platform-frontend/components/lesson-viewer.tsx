"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { lessonsApi, progressApi } from "@/lib/api"
import type { Lesson, Progress } from "@/lib/types"
import { ArrowLeft, CheckCircle2, BookOpen, FileQuestion } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LessonViewer({ lessonId }: { lessonId: number }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadLesson()
    }
  }, [user, lessonId])

  const loadLesson = async () => {
    try {
      const [lessonData, progressData] = await Promise.all([
        lessonsApi.getById(lessonId),
        progressApi.getByLesson(lessonId).catch(() => null),
      ])
      setLesson(lessonData)
      setProgress(progressData)
    } catch (error: any) {
      console.error("[SEKUR] Failed to load lesson:", error)
      setError(error.message || "Failed to load lesson")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleCompleteLesson = async () => {
    setIsCompleting(true)
    try {
      await progressApi.completeLesson(lessonId)
      toast({
        title: "Lesson completed!",
        description: "You can now take the quiz for this lesson.",
      })
      // Reload progress
      const progressData = await progressApi.getByLesson(lessonId)
      setProgress(progressData)
    } catch (error: any) {
      console.error("[SEKUR] Failed to complete lesson:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to mark lesson as complete",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/lessons">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">
              {isLoadingData ? "Loading..." : lesson?.title}
            </h1>
          </div>
          {progress?.completed && <CheckCircle2 className="h-6 w-6 text-green-500" />}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingData ? (
          <Card>
            <CardContent className="py-12">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ) : lesson ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              {!progress?.completed && (
                <Button onClick={handleCompleteLesson} disabled={isCompleting} className="flex-1">
                  {isCompleting ? "Marking as complete..." : "Mark as Complete"}
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button asChild variant={progress?.completed ? "default" : "outline"} className="flex-1">
                <Link href={`/lessons/${lessonId}/quiz`}>
                  {progress?.completed ? "Take Quiz" : "View Quiz"}
                  <FileQuestion className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
