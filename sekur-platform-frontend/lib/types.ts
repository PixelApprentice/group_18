// Type definitions for API responses
export interface User {
  id: number
  email: string
  name: string
  role: "USER" | "ADMIN"
  createdAt: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface Lesson {
  id: number
  title: string
  content: string
}

export interface Answer {
  id: number
  questionId: number
  answer: string
  isCorrect: boolean
  letter: string
}

export interface Question {
  id: number
  quizId: number
  question: string
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK" | "SHORT_ANSWER"
  correctAnswer: string | null
  points: number
  answers: Answer[]
}

export interface Quiz {
  id: number
  lessonId: number
  title: string
  questions: Question[]
}

export interface QuizSubmission {
  attemptId: number
  score: number
  maxScore: number
  percentage: number
  results: Array<{
    questionId: number
    userAnswer: string
    isCorrect: boolean
    pointsEarned: number
    correctAnswer: string
  }>
  completedAt: string
}

export interface Progress {
  id: number
  userId: number
  lessonId: number
  completed: boolean
  lesson: {
    id: number
    title: string
  }
}

export interface Stats {
  totalLessons: number
  completedLessons: number
  completionRate: number
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
}

export interface QuizProgress {
  id: number
  quizId: number
  quizTitle: string
  lessonId: number
  lessonTitle: string
  score: number
  maxScore: number
  percentage: number
  completedAt: string
  passed: boolean
  attempts: number
}
