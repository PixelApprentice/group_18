# SEKUR Platform API Documentation

---

## Authentication
- **Register:** `POST /users` (public)
- **Login:** `POST /auth/login` (public)
- **All other user/lesson/quiz management endpoints require a valid JWT in the `Authorization: Bearer <token>` header.**

---

## User Endpoints

| Method | Endpoint      | Description         | Auth Required | Valid Request Body | Example Successful Response |
|--------|--------------|--------------------|--------------|--------------------|----------------------------|
| POST   | /users       | Register a new user| No           | `{ "email": "user@example.com", "name": "User", "password": "StrongP@ssw0rd!" }` | `{ "id": 1, "email": "user@example.com", "name": "User", "createdAt": "..." }` |
| POST   | /auth/login  | Login, returns JWT | No           | `{ "email": "user@example.com", "password": "StrongP@ssw0rd!" }` | `{ "access_token": "jwt...", "user": { "id": 1, "email": "user@example.com", "name": "User", "createdAt": "..." } }` |
| GET    | /users       | Get all users      | Yes          | (none)             | `[ { "id": 1, "email": "...", "name": "...", "createdAt": "..." }, ... ]` |
| PATCH  | /users/:id   | Update user info   | Yes          | `{ "name": "New Name" }` | `{ "id": 1, "email": "...", "name": "New Name", "createdAt": "..." }` |
| DELETE | /users/:id   | Delete a user      | Yes          | (none)             | `{ "id": 1, "email": "...", "name": "...", "createdAt": "..." }` |

---

## Lesson Endpoints

| Method | Endpoint           | Description                                 | Auth Required | Valid Request Body | Example Successful Response |
|--------|--------------------|---------------------------------------------|--------------|--------------------|----------------------------|
| POST   | /lessons           | Create a new lesson (markdown file path)    | No           | `{ "title": "Lesson Title", "content": "lesson1.en.md" }` | `{ "id": 1, "title": "Lesson Title", "content": "lesson1.en.md" }` |
| GET    | /lessons           | Get all lessons                             | No           | (none)             | `[ { "id": 1, "title": "...", "content": "..." }, ... ]` |
| GET    | /lessons/:id       | Get a lesson by ID (returns markdown text)  | No           | (none)             | `{ "id": 1, "title": "...", "content": "# Markdown..." }` |
| PATCH  | /lessons/:id       | Update a lesson                             | No           | `{ "title": "New Title" }` | `{ "id": 1, "title": "New Title", "content": "..." }` |
| DELETE | /lessons/:id       | Delete a lesson                             | No           | (none)             | `{ "id": 1, "title": "...", "content": "..." }` |
| GET    | /lessons/:id/quiz  | Get the quiz for a lesson (from DB)         | No           | (none)             | See quiz response below    |

---

## Quiz Endpoints (Enhanced Database-Driven)

| Method | Endpoint         | Description                                 | Auth Required | Valid Request Body | Example Successful Response |
|--------|------------------|---------------------------------------------|--------------|--------------------|----------------------------|
| POST   | /quizzes         | Create a quiz with mixed question types     | No           | See detailed format below | `{ "id": 1, "lessonId": 2, "title": "Quiz Title", "questions": [...] }` |
| GET    | /quizzes/:id     | Get a quiz by quiz ID                       | No           | (none)             | See quiz response below    |
| PATCH  | /quizzes/:id     | Update a quiz (title, questions, answers)   | No           | `{ "title": "New Title", "questions": [...] }` | See above                  |
| DELETE | /quizzes/:id     | Delete a quiz                               | No           | (none)             | `{ "id": 1, "lessonId": 2, "title": "...", ... }` |
| POST   | /quizzes/:id/submit | Submit quiz answers and get evaluation     | No           | `{ "quizId": 1, "answers": [...] }` | See submission response below |
| GET    | /quizzes/:id/attempts | Get user's quiz attempts and scores        | No           | (none)             | `[ { "id": 1, "score": 8, "maxScore": 10, "completed": true, ... } ]` |

---

## Enhanced Quiz Creation Format

### Question Types Supported

1. **MULTIPLE_CHOICE**: Requires `answers` array with multiple options
2. **TRUE_FALSE**: Requires `correctAnswer` field (true/false)
3. **FILL_IN_BLANK**: Requires `correctAnswer` field (exact text)
4. **SHORT_ANSWER**: Requires `correctAnswer` field (exact text)

### Quiz Creation Request Format

```json
{
  "lessonId": 1,
  "title": "Advanced Security Quiz",
  "questions": [
    {
      "text": "What prevents SQL injection?",
      "type": "MULTIPLE_CHOICE",
      "points": 3,
      "answers": [
        {"text": "Input validation", "isCorrect": false, "letter": "A"},
        {"text": "Parameterized queries", "isCorrect": true, "letter": "B"},
        {"text": "Output encoding", "isCorrect": false, "letter": "C"}
      ]
    },
    {
      "text": "HTTPS encrypts data in transit",
      "type": "TRUE_FALSE",
      "correctAnswer": "true",
      "points": 2
    },
    {
      "text": "The package manager for Node.js is _____",
      "type": "FILL_IN_BLANK",
      "correctAnswer": "npm",
      "points": 2
    },
    {
      "text": "Explain what XSS stands for",
      "type": "SHORT_ANSWER",
      "correctAnswer": "Cross-Site Scripting",
      "points": 3
    }
  ]
}
```

## Quiz Response Example

```json
{
  "id": 1,
  "lessonId": 2,
  "title": "Advanced Security Quiz",
  "questions": [
    {
      "id": 1,
      "quizId": 1,
      "question": "What prevents SQL injection?",
      "type": "MULTIPLE_CHOICE",
      "correctAnswer": null,
      "points": 3,
      "answers": [
        { "id": 1, "questionId": 1, "answer": "Input validation", "isCorrect": false, "letter": "A" },
        { "id": 2, "questionId": 1, "answer": "Parameterized queries", "isCorrect": true, "letter": "B" },
        { "id": 3, "questionId": 1, "answer": "Output encoding", "isCorrect": false, "letter": "C" }
      ]
    },
    {
      "id": 2,
      "quizId": 1,
      "question": "HTTPS encrypts data in transit",
      "type": "TRUE_FALSE",
      "correctAnswer": "true",
      "points": 2,
      "answers": []
    }
  ]
}
```

---

## Quiz Submission and Evaluation

### Submit Quiz Request Format

**POST** `/quizzes/:id/submit`

```json
{
  "quizId": 1,
  "answers": [
    {"questionId": 1, "userAnswer": "B"},
    {"questionId": 2, "userAnswer": "true"},
    {"questionId": 3, "userAnswer": "npm"},
    {"questionId": 4, "userAnswer": "Cross-Site Scripting"}
  ]
}
```

### Quiz Submission Response

```json
{
  "attemptId": 1,
  "score": 10,
  "maxScore": 10,
  "percentage": 100,
  "results": [
    {
      "questionId": 1,
      "userAnswer": "B",
      "isCorrect": true,
      "pointsEarned": 3,
      "correctAnswer": "Parameterized queries"
    },
    {
      "questionId": 2,
      "userAnswer": "true",
      "isCorrect": true,
      "pointsEarned": 2,
      "correctAnswer": "true"
    },
    {
      "questionId": 3,
      "userAnswer": "npm",
      "isCorrect": true,
      "pointsEarned": 2,
      "correctAnswer": "npm"
    },
    {
      "questionId": 4,
      "userAnswer": "Cross-Site Scripting",
      "isCorrect": true,
      "pointsEarned": 3,
      "correctAnswer": "Cross-Site Scripting"
    }
  ],
  "completedAt": "2025-08-20T18:30:00.000Z"
}
```

### Quiz Attempts Response

**GET** `/quizzes/:id/attempts`

```json
[
  {
    "id": 1,
    "userId": 1,
    "quizId": 1,
    "score": 10,
    "maxScore": 10,
    "completed": true,
    "startedAt": "2025-08-20T18:25:00.000Z",
    "completedAt": "2025-08-20T18:30:00.000Z",
    "answers": [
      {
        "id": 1,
        "attemptId": 1,
        "questionId": 1,
        "userAnswer": "B",
        "isCorrect": true,
        "pointsEarned": 3
      }
    ]
  }
]
```

---

## Key Concepts

- **Lessons:** Markdown files in `content/`, referenced by filename.
- **Quizzes:** Fully database-driven, linked to lessons by `lessonId`.
- **Question Types:** Support for multiple choice, true/false, fill-in-blank, and short answer.
- **Automatic Evaluation:** Real-time scoring and feedback when submitting answers.
- **Progress Tracking:** Store and retrieve quiz attempts with detailed results.
- **Answer Hiding:** Correct answers are only revealed after quiz submission.
- **Lesson-Quiz Relationship:** `/lessons/:id/quiz` fetches the quiz for a lesson.
- **Authentication:** JWT-based for user management endpoints.

