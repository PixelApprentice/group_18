"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Target, Award, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router, isMounted])

  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-12 w-12 text-primary" />
              <h1 className="text-5xl sm:text-6xl font-bold text-balance">SEKUR</h1>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance max-w-4xl mx-auto leading-tight">
              Master Cybersecurity Through <span className="text-primary">Progressive Learning</span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Build your security expertise with structured lessons, interactive quizzes, and hands-on challenges. Track
              your progress and earn achievements as you advance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Target className="h-8 w-8" />}
            title="Progressive Learning"
            description="Master concepts step-by-step. Complete lessons and pass quizzes to unlock new challenges."
          />
          <FeatureCard
            icon={<Lock className="h-8 w-8" />}
            title="Interactive Quizzes"
            description="Test your knowledge with multiple question types including multiple choice, true/false, and more."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Track Progress"
            description="Monitor your learning journey with detailed statistics and completion rates."
          />
          <FeatureCard
            icon={<Award className="h-8 w-8" />}
            title="Earn Achievements"
            description="Unlock badges and certificates as you complete lessons and ace quizzes."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Real-World Skills"
            description="Learn practical cybersecurity concepts applicable to real-world scenarios."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Community Learning"
            description="Join a community of learners and compete on the leaderboard."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-bold text-balance">Ready to Start Your Cybersecurity Journey?</h3>
          <p className="text-lg text-muted-foreground text-pretty">
            Join thousands of learners mastering cybersecurity fundamentals.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/register">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors">
      <div className="text-primary">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
