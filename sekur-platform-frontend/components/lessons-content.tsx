"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { lessonsApi, progressApi } from "@/lib/api"
import type { Lesson, Progress } from "@/lib/types"
import { BookOpen, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function LessonsContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadLessons()
    }
  }, [user])

  const loadLessons = async () => {
    try {
      const [lessonsData, progressData] = await Promise.all([lessonsApi.getAll(), progressApi.getAll()])
      setLessons(lessonsData)
      setProgress(progressData)
    } catch (error) {
      console.error("[SEKUR] Failed to load lessons:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const isLessonCompleted = (lessonId: number) => {
    return progress.some((p) => p.lessonId === lessonId && p.completed)
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">Cybersecurity Lessons</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Master cybersecurity concepts through structured lessons. Complete each lesson to unlock quizzes.
          </p>
        </div>

        {isLoadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lessons available</h3>
              <p className="text-muted-foreground">Check back later for new content.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id)
              return (
                <Card
                  key={lesson.id}
                  className="hover:border-primary/50 transition-colors flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{lesson.title}</CardTitle>
                        <CardDescription className="mt-2">Lesson {index + 1}</CardDescription>
                      </div>
                      {completed && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={completed ? "default" : "secondary"}>
                        {completed ? "Completed" : "Available"}
                      </Badge>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/lessons/${lesson.id}`}>
                        {completed ? "Review Lesson" : "Start Lesson"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
