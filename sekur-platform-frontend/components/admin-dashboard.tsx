"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, FileQuestion } from "lucide-react"
import { adminApi, lessonsApi } from "@/lib/api"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    totalQuizzes: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, lessons] = await Promise.all([adminApi.getAllUsers(), lessonsApi.getAll()])

        setStats({
          totalUsers: users.length,
          totalLessons: lessons.length,
          totalQuizzes: 0, // We'll need to count quizzes from lessons
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Lessons",
      value: stats.totalLessons,
      icon: BookOpen,
      description: "Published lessons",
    },
    {
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      icon: FileQuestion,
      description: "Active quizzes",
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your SEKUR platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <a
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Manage Users</p>
              <p className="text-sm text-muted-foreground">View and manage user accounts</p>
            </div>
          </a>
          <a
            href="/admin/lessons"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Manage Lessons</p>
              <p className="text-sm text-muted-foreground">Create and edit lessons</p>
            </div>
          </a>
          <a
            href="/admin/quizzes"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <FileQuestion className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Manage Quizzes</p>
              <p className="text-sm text-muted-foreground">Create and edit quizzes</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
