"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { adminApi, lessonsApi } from "@/lib/api"
import type { Lesson } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK" | "SHORT_ANSWER"

interface QuestionForm {
  text: string
  type: QuestionType
  points: number
  correctAnswer?: string
  answers?: Array<{ text: string; isCorrect: boolean; letter: string }>
}

export function QuizzesManagement() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newQuiz, setNewQuiz] = useState({
    lessonId: 0,
    title: "",
    questions: [] as QuestionForm[],
  })

  const fetchLessons = async () => {
    try {
      const data = await lessonsApi.getAll()
      setLessons(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch lessons",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          text: "",
          type: "MULTIPLE_CHOICE",
          points: 1,
          answers: [
            { text: "", isCorrect: false, letter: "A" },
            { text: "", isCorrect: false, letter: "B" },
          ],
        },
      ],
    })
  }

  const removeQuestion = (index: number) => {
    setNewQuiz({
      ...newQuiz,
      questions: newQuiz.questions.filter((_, i) => i !== index),
    })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...newQuiz.questions]
    updated[index] = { ...updated[index], [field]: value }

    // Reset answers when type changes
    if (field === "type") {
      if (value === "MULTIPLE_CHOICE") {
        updated[index].answers = [
          { text: "", isCorrect: false, letter: "A" },
          { text: "", isCorrect: false, letter: "B" },
        ]
        delete updated[index].correctAnswer
      } else {
        updated[index].correctAnswer = ""
        delete updated[index].answers
      }
    }

    setNewQuiz({ ...newQuiz, questions: updated })
  }

  const addAnswer = (questionIndex: number) => {
    const updated = [...newQuiz.questions]
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const nextLetter = letters[updated[questionIndex].answers?.length || 0]
    updated[questionIndex].answers = [
      ...(updated[questionIndex].answers || []),
      { text: "", isCorrect: false, letter: nextLetter },
    ]
    setNewQuiz({ ...newQuiz, questions: updated })
  }

  const updateAnswer = (questionIndex: number, answerIndex: number, field: string, value: any) => {
    const updated = [...newQuiz.questions]
    if (updated[questionIndex].answers) {
      updated[questionIndex].answers![answerIndex] = {
        ...updated[questionIndex].answers![answerIndex],
        [field]: value,
      }
    }
    setNewQuiz({ ...newQuiz, questions: updated })
  }

  const handleCreateQuiz = async () => {
    try {
      await adminApi.createQuiz(newQuiz)
      toast({
        title: "Success",
        description: "Quiz created successfully",
      })
      setIsCreateDialogOpen(false)
      setNewQuiz({ lessonId: 0, title: "", questions: [] })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create quiz",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes Management</h1>
          <p className="text-muted-foreground">Create and manage quizzes for lessons</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
              <DialogDescription>Add a new quiz for a lesson</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-lesson">Lesson</Label>
                  <Select
                    value={newQuiz.lessonId.toString()}
                    onValueChange={(value) => setNewQuiz({ ...newQuiz, lessonId: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id.toString()}>
                          {lesson.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input
                    id="quiz-title"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="Quiz Title"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Questions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>

                {newQuiz.questions.map((question, qIndex) => (
                  <Card key={qIndex}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Input
                          value={question.text}
                          onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                          placeholder="Enter question text"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => updateQuestion(qIndex, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                              <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                              <SelectItem value="FILL_IN_BLANK">Fill in Blank</SelectItem>
                              <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Points</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(qIndex, "points", Number.parseInt(e.target.value))}
                            min="1"
                          />
                        </div>
                      </div>

                      {question.type === "MULTIPLE_CHOICE" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Answers</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => addAnswer(qIndex)}>
                              <Plus className="mr-2 h-3 w-3" />
                              Add Answer
                            </Button>
                          </div>
                          {question.answers?.map((answer, aIndex) => (
                            <div key={aIndex} className="flex gap-2 items-center">
                              <Input
                                value={answer.text}
                                onChange={(e) => updateAnswer(qIndex, aIndex, "text", e.target.value)}
                                placeholder={`Answer ${answer.letter}`}
                              />
                              <label className="flex items-center gap-2 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={answer.isCorrect}
                                  onChange={(e) => updateAnswer(qIndex, aIndex, "isCorrect", e.target.checked)}
                                  className="rounded"
                                />
                                <span className="text-sm">Correct</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      {(question.type === "TRUE_FALSE" ||
                        question.type === "FILL_IN_BLANK" ||
                        question.type === "SHORT_ANSWER") && (
                        <div className="space-y-2">
                          <Label>Correct Answer</Label>
                          {question.type === "TRUE_FALSE" ? (
                            <Select
                              value={question.correctAnswer}
                              onValueChange={(value) => updateQuestion(qIndex, "correctAnswer", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={question.correctAnswer || ""}
                              onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
                              placeholder="Enter correct answer"
                            />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuiz}>Create Quiz</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Quizzes</CardTitle>
          <CardDescription>View quizzes by checking lessons</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Quizzes are linked to lessons. View them through the lesson viewer or by accessing /lessons/[id]/quiz
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
