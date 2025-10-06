"use client"

import dynamic from "next/dynamic"
import { Suspense, use } from "react"

const QuizStandalone = dynamic(() => import("@/components/quiz-standalone").then(mod => ({ default: mod.QuizStandalone })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
})

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <QuizStandalone lessonId={Number.parseInt(resolvedParams.id)} />
    </Suspense>
  )
}
