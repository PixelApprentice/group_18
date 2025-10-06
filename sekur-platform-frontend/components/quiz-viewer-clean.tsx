"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { lessonsApi, quizApi } from "@/lib/api"
import type { Quiz, QuizSubmission } from "@/lib/types"
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export function QuizViewerClean({ lessonId }: { lessonId: number }) {
  const { user } = useAuth()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submission, setSubmission] = useState<QuizSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/login")
      return
    }
    if (isMounted && user) {
      loadQuiz()
    }
  }, [user, lessonId, router, isMounted])

  const loadQuiz = async () => {
    try {
      setIsLoading(true)
      const quizData = await lessonsApi.getQuiz(lessonId)
      setQuiz(quizData)
    } catch (error: any) {
      console.error("Failed to load quiz:", error)
      setError(error.message || "Failed to load quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async () => {
    if (!quiz) return

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter((q) => !answers[q.id.toString()])
    if (unansweredQuestions.length > 0) {
      setError("Please answer all questions before submitting")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, userAnswer]) => ({
        questionId: Number.parseInt(questionId),
        userAnswer,
      }))

      const result = await quizApi.submit(quiz.id, formattedAnswers)
      setSubmission(result)
    } catch (error: any) {
      console.error("Failed to submit quiz:", error)
      setError(error.message || "Failed to submit quiz")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmission(null)
    setError("")
  }

  if (!isMounted || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Quiz not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/lessons/${lessonId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">
              {quiz.title}
            </h1>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {submission ? (
          // Show results
          <div className="space-y-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    Quiz Results
                  </CardTitle>
                  <Badge
                    variant={submission.percentage >= 70 ? "default" : "destructive"}
                    className="text-lg px-4 py-1"
                  >
                    {submission.percentage.toFixed(0)}%
                  </Badge>
                </div>
                <CardDescription>
                  You scored {submission.score} out of {submission.maxScore} points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">Status:</span>
                    <span className={submission.percentage >= 70 ? "text-green-500" : "text-destructive"}>
                      {submission.percentage >= 70 ? "Passed" : "Failed"}
                    </span>
                  </div>
                  {submission.percentage < 70 && (
                    <p className="text-sm text-muted-foreground">
                      You need at least 70% to pass. Review the lesson and try again!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Show detailed results */}
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const result = submission.results.find((r) => r.questionId === question.id)
                if (!result) return null

                return (
                  <Card
                    key={question.id}
                    className={result.isCorrect ? "border-green-500/50" : "border-destructive/50"}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-base font-medium leading-relaxed">
                          {index + 1}. {question.question}
                        </CardTitle>
                        {result.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Your answer:</span>
                          <Badge variant={result.isCorrect ? "default" : "destructive"}>{result.userAnswer}</Badge>
                        </div>
                        {!result.isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Correct answer:</span>
                            <Badge variant="outline">{result.correctAnswer}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Points: {result.pointsEarned}/{question.points}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleRetake} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
              <Button asChild className="flex-1">
                <Link href="/lessons">Back to Lessons</Link>
              </Button>
            </div>
          </div>
        ) : (
          // Show quiz questions
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>
                  Answer all questions to the best of your ability. You need at least 70% to pass.
                </CardDescription>
              </CardHeader>
            </Card>

            {quiz.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base font-medium leading-relaxed">
                    {index + 1}. {question.question}
                  </CardTitle>
                  <CardDescription>
                    {question.points} points
                    {answers[question.id.toString()] && (
                      <span className="ml-2 text-primary">
                        • Selected: "{answers[question.id.toString()]}"
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {question.type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-3">
                      {question.answers.map((answer) => {
                        const isSelected = answers[question.id.toString()] === answer.letter
                        return (
                          <button
                            key={answer.id}
                            type="button"
                            onClick={() => handleAnswerChange(question.id.toString(), answer.letter)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <span className="font-medium">{answer.letter}.</span>
                              <span>{answer.answer}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <div className="space-y-3">
                      {[
                        { value: "true", label: "True" },
                        { value: "false", label: "False" }
                      ].map((option) => {
                        const isSelected = answers[question.id.toString()] === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleAnswerChange(question.id.toString(), option.value)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <span className="font-medium">{option.label}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {(question.type === "FILL_IN_BLANK" || question.type === "SHORT_ANSWER") && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={answers[question.id.toString()] || ""}
                        onChange={(e) => handleAnswerChange(question.id.toString(), e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {question.type === "SHORT_ANSWER" && (
                        <p className="text-xs text-muted-foreground">
                          Provide a concise answer. Spelling and capitalization matter.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
