// API configuration and helper functions
const API_BASE_URL = "http://localhost:3000"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(response.status, error.message || "An error occurred")
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },
  register: async (email: string, name: string, password: string) => {
    return fetchApi("/users", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    })
  },
  getProfile: async () => {
    return fetchApi("/users/profile")
  },
  updateProfile: async (data: { name?: string }) => {
    return fetchApi("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    return fetchApi("/users/profile/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },
}

// Lessons API
export const lessonsApi = {
  getAll: async () => {
    return fetchApi("/lessons")
  },
  getById: async (id: number) => {
    return fetchApi(`/lessons/${id}`)
  },
  getQuiz: async (lessonId: number) => {
    return fetchApi(`/lessons/${lessonId}/quiz`)
  },
}

// Quiz API
export const quizApi = {
  getById: async (id: number) => {
    return fetchApi(`/quizzes/${id}`)
  },
  submit: async (quizId: number, answers: Array<{ questionId: number; userAnswer: string }>) => {
    return fetchApi(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ quizId, answers }),
    })
  },
  getAttempts: async (quizId: number) => {
    return fetchApi(`/quizzes/${quizId}/attempts`)
  },
}

// Progress API
export const progressApi = {
  getAll: async () => {
    return fetchApi("/progress")
  },
  getByLesson: async (lessonId: number) => {
    return fetchApi(`/progress/${lessonId}`)
  },
  completeLesson: async (lessonId: number) => {
    return fetchApi(`/progress/${lessonId}/complete`, {
      method: "POST",
    })
  },
  getStats: async () => {
    return fetchApi("/progress/stats/overview")
  },
  getQuizProgress: async () => {
    return fetchApi("/progress/quizzes")
  },
  getComprehensive: async () => {
    return fetchApi("/progress/comprehensive")
  },
}

// Admin API
export const adminApi = {
  // User management
  getAllUsers: async () => {
    return fetchApi("/users")
  },
  createAdmin: async (email: string, name: string, password: string) => {
    return fetchApi("/users/admin", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    })
  },
  updateUser: async (id: number, data: { name?: string; role?: "USER" | "ADMIN" }) => {
    return fetchApi(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
  deleteUser: async (id: number) => {
    return fetchApi(`/users/${id}`, {
      method: "DELETE",
    })
  },

  // Lesson management
  createLesson: async (title: string, content: string) => {
    return fetchApi("/lessons", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    })
  },
  updateLesson: async (id: number, data: { title?: string; content?: string }) => {
    return fetchApi(`/lessons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
  deleteLesson: async (id: number) => {
    return fetchApi(`/lessons/${id}`, {
      method: "DELETE",
    })
  },

  // Quiz management
  createQuiz: async (data: {
    lessonId: number
    title: string
    questions: Array<{
      text: string
      type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK" | "SHORT_ANSWER"
      points: number
      correctAnswer?: string
      answers?: Array<{ text: string; isCorrect: boolean; letter: string }>
    }>
  }) => {
    return fetchApi("/quizzes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  updateQuiz: async (
    id: number,
    data: {
      title?: string
      questions?: Array<{
        text: string
        type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK" | "SHORT_ANSWER"
        points: number
        correctAnswer?: string
        answers?: Array<{ text: string; isCorrect: boolean; letter: string }>
      }>
    },
  ) => {
    return fetchApi(`/quizzes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
  deleteQuiz: async (id: number) => {
    return fetchApi(`/quizzes/${id}`, {
      method: "DELETE",
    })
  },
}
