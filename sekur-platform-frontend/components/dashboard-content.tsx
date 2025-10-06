"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { progressApi } from "@/lib/api"
import type { Stats } from "@/lib/types"
import { BookOpen, Trophy, Target, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export function DashboardContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      const data = await progressApi.getStats()
      setStats(data)
    } catch (error) {
      console.error("[SEKUR] Failed to load stats:", error)
    } finally {
      setIsLoadingStats(false)
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
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Continue your cybersecurity learning journey. Track your progress and master new skills.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Lessons Completed"
              value={`${stats.completedLessons}/${stats.totalLessons}`}
              description={`${stats.completionRate.toFixed(0)}% complete`}
            />
            <StatCard
              icon={<Target className="h-5 w-5" />}
              title="Quizzes Passed"
              value={`${stats.completedQuizzes}/${stats.totalQuizzes}`}
              description={`${stats.totalQuizzes > 0 ? ((stats.completedQuizzes / stats.totalQuizzes) * 100).toFixed(0) : 0}% complete`}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Average Score"
              value={`${stats.averageScore.toFixed(0)}%`}
              description="Across all quizzes"
            />
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              title="Total Points"
              value={Math.round(stats.averageScore * stats.completedQuizzes).toString()}
              description="Points earned"
            />
          </div>
        ) : null}

        {/* Progress Overview */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your overall completion across all lessons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lesson Completion</span>
                  <span className="font-medium">{stats.completionRate.toFixed(0)}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quiz Success Rate</span>
                  <span className="font-medium">
                    {stats.totalQuizzes > 0 ? ((stats.completedQuizzes / stats.totalQuizzes) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <Progress
                  value={stats.totalQuizzes > 0 ? (stats.completedQuizzes / stats.totalQuizzes) * 100 : 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Browse available lessons and start learning</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/lessons">
                  View Lessons <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>View detailed statistics and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/progress">
                  View Progress <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
