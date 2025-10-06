"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { progressApi } from "@/lib/api"
import type { Progress, QuizProgress, Stats } from "@/lib/types"
import { CheckCircle2, Circle, Trophy, TrendingUp } from "lucide-react"
import { Progress as ProgressBar } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ProgressContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [lessonProgress, setLessonProgress] = useState<Progress[]>([])
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadProgressData()
    }
  }, [user])

  const loadProgressData = async () => {
    try {
      const [statsData, lessonsData, quizzesData] = await Promise.all([
        progressApi.getStats(),
        progressApi.getAll(),
        progressApi.getQuizProgress(),
      ])
      setStats(statsData)
      setLessonProgress(lessonsData)
      setQuizProgress(quizzesData)
    } catch (error) {
      console.error("[SEKUR] Failed to load progress data:", error)
    } finally {
      setIsLoadingData(false)
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">Your Progress</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Track your learning journey and see how far you've come.
          </p>
        </div>

        {isLoadingData ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Overall Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.completionRate.toFixed(0)}%</div>
                    <ProgressBar value={stats.completionRate} className="mt-3 h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Quiz Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.averageScore.toFixed(0)}%</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stats.completedQuizzes} of {stats.totalQuizzes} quizzes completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Lessons Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats.completedLessons}/{stats.totalLessons}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Keep up the great work!</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Lesson Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lesson Progress
                </CardTitle>
                <CardDescription>Your completion status for each lesson</CardDescription>
              </CardHeader>
              <CardContent>
                {lessonProgress.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No lessons started yet. Start learning now!</p>
                ) : (
                  <div className="space-y-3">
                    {lessonProgress.map((progress) => (
                      <div key={progress.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          {progress.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="font-medium">{progress.lesson.title}</span>
                        </div>
                        <Badge variant={progress.completed ? "default" : "secondary"}>
                          {progress.completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quiz Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quiz Results
                </CardTitle>
                <CardDescription>Your performance on completed quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {quizProgress.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No quizzes completed yet. Complete lessons to unlock quizzes!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {quizProgress.map((quiz) => (
                      <div key={quiz.id} className="p-4 rounded-lg border space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{quiz.quizTitle}</h4>
                            <p className="text-sm text-muted-foreground">{quiz.lessonTitle}</p>
                          </div>
                          <Badge variant={quiz.passed ? "default" : "secondary"}>{quiz.percentage.toFixed(0)}%</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Score: {quiz.score}/{quiz.maxScore}
                            </span>
                            <span className="text-muted-foreground">{quiz.attempts} attempts</span>
                          </div>
                          <ProgressBar value={quiz.percentage} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
