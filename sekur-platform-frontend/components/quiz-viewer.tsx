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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function QuizViewer({ lessonId }: { lessonId: number }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submission, setSubmission] = useState<QuizSubmission | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router, isMounted])

  useEffect(() => {
    if (isMounted && user) {
      loadQuiz()
    }
  }, [user, lessonId, isMounted])

  const loadQuiz = async () => {
    try {
      const quizData = await lessonsApi.getQuiz(lessonId)
      setQuiz(quizData)
    } catch (error: any) {
      console.error("[SEKUR] Failed to load quiz:", error)
      setError(error.message || "Failed to load quiz")
    } finally {
      setIsLoadingData(false)
    }
  }

  const getAnswerValue = (questionId: number): string => {
    return answers[questionId] || ""
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer || "",
    }))
  }

  const handleSubmit = async () => {
    if (!quiz) return

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter((q) => !answers[q.id])
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
      console.error("[SEKUR] Failed to submit quiz:", error)
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

  if (!isMounted || isLoading || !user) {
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
            <Link href={`/lessons/${lessonId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">
              {isLoadingData ? "Loading..." : quiz?.title}
            </h1>
          </div>
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
        ) : quiz ? (
          <>
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
                      <CardDescription>{question.points} points</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {question.type === "MULTIPLE_CHOICE" && (
                        <RadioGroup
                          value={getAnswerValue(question.id)}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                          <div className="space-y-3">
                            {question.answers.map((answer) => (
                              <div
                                key={answer.id}
                                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                              >
                                <RadioGroupItem value={answer.letter} id={`q${question.id}-${answer.letter}`} />
                                <Label htmlFor={`q${question.id}-${answer.letter}`} className="flex-1 cursor-pointer">
                                  <span className="font-medium mr-2">{answer.letter}.</span>
                                  {answer.answer}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}

                      {question.type === "TRUE_FALSE" && (
                        <RadioGroup
                          value={getAnswerValue(question.id)}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                              <RadioGroupItem value="true" id={`q${question.id}-true`} />
                              <Label htmlFor={`q${question.id}-true`} className="flex-1 cursor-pointer">
                                True
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                              <RadioGroupItem value="false" id={`q${question.id}-false`} />
                              <Label htmlFor={`q${question.id}-false`} className="flex-1 cursor-pointer">
                                False
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      )}

                      {(question.type === "FILL_IN_BLANK" || question.type === "SHORT_ANSWER") && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Type your answer here..."
                            value={getAnswerValue(question.id)}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
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
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
