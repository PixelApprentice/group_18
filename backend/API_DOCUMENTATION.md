# SEKUR Platform API Documentation

---

## Root Endpoint

| Method | Endpoint | Description | Auth Required | Response |
|--------|----------|-------------|---------------|----------|
| GET | / | Welcome message and API status | No | `{ "message": "Welcome to SEKUR Platform API", "status": "running" }` |

---

## Authentication
- **Login:** `POST /auth/login` (public)
- **User Registration:** `POST /users` (public - for regular users only)
- **Admin Creation:** `POST /users/admin` (admin only - for creating admin users)
- **All other user/lesson/quiz management endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

### 🔐 How Admins Are Created
Since admin creation is restricted for security, the initial admin user is created through:
1. **Database Seeding** - Run `npm run seed` to create initial admin and user accounts
2. **Environment Variables** - Set `ADMIN_PASSWORD` and `USER_PASSWORD` in your `.env` file
3. **Admin Management** - Existing admins can create new admin users via `POST /users/admin`

---

## Quick Testing Guide (Flow-Ordered Tables)

### 1) Root Health Check
| Method | Endpoint | Description | Auth Required | Role Required | Example Response |
|--------|----------|-------------|---------------|---------------|------------------|
| GET | / | API status check | No | - | `{ "message": "Welcome to SEKUR Platform API", "status": "running" }` |

### 2) Onboarding and Auth
| Method | Endpoint | Description | Auth Required | Role Required | Valid Request |
|--------|----------|-------------|---------------|---------------|---------------|
| POST | /users | Register new user | No | None | `{ "email":"user@example.com","name":"User","password":"StrongP@ssw0rd!" }` |
| POST | /auth/login | Login to get JWT | No | None | `{ "email":"user@example.com","password":"StrongP@ssw0rd!" }` |
| POST | /users/admin | Create admin user | Yes (JWT) | ADMIN | `{ "email":"admin@example.com","name":"Admin","password":"StrongP@ssw0rd!" }` |

### 3) Public Content (No Auth)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /lessons | List lessons | No |
| GET | /lessons/:id | Get lesson (markdown) | No |
| GET | /lessons/:id/quiz | Get lesson's quiz | No |

### 4) Authenticated User Actions (JWT Any)
| Method | Endpoint | Description | Auth Required | Role Required | Valid Request |
|--------|----------|-------------|---------------|---------------|---------------|
| GET | /users/profile | Get own profile | Yes (JWT) | Any | - |
| PATCH | /users/profile | Update own profile | Yes (JWT) | Any | `{ "name":"New Name" }` |
| DELETE | /users/profile | Delete own account | Yes (JWT) | Any | - |
| GET | /progress | User's lesson progress | Yes (JWT) | Any | - |
| GET | /progress/:lessonId | Progress for lesson | Yes (JWT) | Any | - |
| POST | /progress/:lessonId/complete | Mark lesson completed | Yes (JWT) | Any | - |
| GET | /progress/stats/overview | Learning statistics | Yes (JWT) | Any | - |
| GET | /progress/quizzes | Quiz progress | Yes (JWT) | Any | - |
| GET | /progress/comprehensive | Lessons + quizzes overview | Yes (JWT) | Any | - |
| GET | /quizzes/:id | Get quiz by ID | Yes (JWT) | Any | - |
| POST | /quizzes/:id/submit | Submit quiz answers | Yes (JWT) | Any | `{ "quizId": 1, "answers": [...] }` |
| GET | /quizzes/:id/attempts | My quiz attempts | Yes (JWT) | Any | - |

### 5) Admin Actions (JWT ADMIN)
| Method | Endpoint | Description | Auth Required | Role Required | Valid Request |
|--------|----------|-------------|---------------|---------------|---------------|
| GET | /users | Get all users | Yes (JWT) | ADMIN | - |
| PATCH | /users/:id | Update any user | Yes (JWT) | ADMIN | `{ "name":"New Name", "role":"ADMIN" }` |
| DELETE | /users/:id | Delete any user | Yes (JWT) | ADMIN | - |
| POST | /lessons | Create lesson | Yes (JWT) | ADMIN | `{ "title":"Lesson","content":"lesson1.en.md" }` |
| PATCH | /lessons/:id | Update lesson | Yes (JWT) | ADMIN | `{ "title":"New Title" }` |
| DELETE | /lessons/:id | Delete lesson | Yes (JWT) | ADMIN | - |
| POST | /quizzes | Create quiz | Yes (JWT) | ADMIN | See format below |
| PATCH | /quizzes/:id | Update quiz | Yes (JWT) | ADMIN | See format below |
| DELETE | /quizzes/:id | Delete quiz | Yes (JWT) | ADMIN | - |

---

## User Endpoints

| Method | Endpoint      | Description         | Auth Required | Valid Request Body | Example Successful Response |
|--------|--------------|--------------------|--------------|--------------------|----------------------------|
| POST   | /auth/login  | Login, returns JWT | No           | `{ "email": "user@example.com", "password": "StrongP@ssw0rd!" }` | `{ "access_token": "jwt...", "user": { "id": 1, "email": "user@example.com", "name": "User", "role": "USER", "createdAt": "..." } }` |

### User Self-Management (Authenticated Users)
| Method | Endpoint      | Description         | Auth Required | Role Required | Valid Request Body | Example Successful Response |
|--------|--------------|--------------------|--------------|---------------|--------------------|----------------------------|
| GET    | /users/profile| Get own profile     | Yes          | Any           | (none)             | `{ "id": 1, "email": "...", "name": "...", "role": "USER", "createdAt": "..." }` |
| PATCH  | /users/profile| Update own profile  | Yes          | Any           | `{ "name": "New Name" }` | `{ "id": 1, "email": "...", "name": "New Name", "role": "USER", "createdAt": "..." }` |
| PATCH  | /users/profile/password | Change own password | Yes | Any | `{ "currentPassword": "OldP@ss123", "newPassword": "NewStr0ngP@ss!" }` | `{ "success": true }` |
| DELETE | /users/profile| Delete own account  | Yes          | Any           | (none)             | `{ "id": 1, "email": "...", "name": "...", "role": "USER", "createdAt": "..." }` |

### User Registration (Public)
| Method | Endpoint      | Description         | Auth Required | Role Required | Valid Request Body | Example Successful Response |
|--------|--------------|--------------------|--------------|---------------|--------------------|----------------------------|
| POST   | /users       | Register new user   | No           | None          | `{ "email": "user@example.com", "name": "User", "password": "StrongP@ssw0rd!" }` | `{ "id": 1, "email": "user@example.com", "name": "User", "role": "USER", "createdAt": "..." }` |

### User Management (Admin Only)
| Method | Endpoint      | Description         | Auth Required | Role Required | Valid Request Body | Example Successful Response |
|--------|--------------|--------------------|--------------|---------------|--------------------|----------------------------|
| POST   | /users/admin | Create admin user   | Yes          | ADMIN         | `{ "email": "admin@example.com", "name": "Admin", "password": "StrongP@ssw0rd!" }` | `{ "id": 2, "email": "admin@example.com", "name": "Admin", "role": "ADMIN", "createdAt": "..." }` |
| GET    | /users       | Get all users       | Yes          | ADMIN         | (none)             | `[ { "id": 1, "email": "...", "name": "...", "role": "USER", "createdAt": "..." }, ... ]` |
| PATCH  | /users/:id   | Update any user     | Yes          | ADMIN         | `{ "name": "New Name", "role": "ADMIN" }` | `{ "id": 1, "email": "...", "name": "...", "role": "ADMIN", "createdAt": "..." }` |
| DELETE | /users/:id   | Delete any user     | Yes          | ADMIN         | (none)             | `{ "id": 1, "email": "...", "name": "...", "role": "USER", "createdAt": "..." }` |

---

## Lesson Endpoints

| Method | Endpoint           | Description                                 | Auth Required | Role Required | Valid Request Body | Example Successful Response |
|--------|--------------------|---------------------------------------------|--------------|---------------|--------------------|----------------------------|
| POST   | /lessons           | Create a new lesson (markdown file path)    | Yes          | ADMIN         | `{ "title": "Lesson Title", "content": "lesson1.en.md" }` | `{ "id": 1, "title": "Lesson Title", "content": "lesson1.en.md" }` |
| GET    | /lessons           | Get all lessons                             | No           | -             | (none)             | `[ { "id": 1, "title": "...", "content": "..." }, ... ]` |
| GET    | /lessons/:id       | Get a lesson by ID (returns markdown text)  | No           | -             | (none)             | `{ "id": 1, "title": "...", "content": "# Markdown..." }` |
| PATCH  | /lessons/:id       | Update a lesson                             | Yes          | ADMIN         | `{ "title": "New Title" }` | `{ "id": 1, "title": "New Title", "content": "..." }` |
| DELETE | /lessons/:id       | Delete a lesson                             | Yes          | ADMIN         | (none)             | `{ "id": 1, "title": "...", "content": "..." }` |
| GET    | /lessons/:id/quiz  | Get the quiz for a lesson (from DB)         | No           | -             | (none)             | See quiz response below    |

---

## Quiz Endpoints (Enhanced Database-Driven)

| Method | Endpoint         | Description                                 | Auth Required | Role Required | Valid Request Body | Example Successful Response |
|--------|------------------|---------------------------------------------|--------------|---------------|--------------------|----------------------------|
| POST   | /quizzes         | Create a quiz with mixed question types     | Yes          | ADMIN         | See detailed format below | `{ "id": 1, "lessonId": 2, "title": "Quiz Title", "questions": [...] }` |
| GET    | /quizzes/:id     | Get a quiz by quiz ID                       | Yes          | Any           | (none)             | See quiz response below    |
| PATCH  | /quizzes/:id     | Update a quiz (title, questions, answers)   | Yes          | ADMIN         | `{ "title": "New Title", "questions": [...] }` | See above                  |
| DELETE | /quizzes/:id     | Delete a quiz                               | Yes          | ADMIN         | (none)             | `{ "id": 1, "lessonId": 2, "title": "...", ... }` |
| POST   | /quizzes/:id/submit | Submit quiz answers and get evaluation     | Yes          | Any           | `{ "quizId": 1, "answers": [...] }` | See submission response below |
| GET    | /quizzes/:id/attempts | Get user's quiz attempts and scores        | Yes          | Any           | (none)             | `[ { "id": 1, "score": 8, "maxScore": 10, "completed": true, ... } ]` |

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

## Progress Endpoints

| Method | Endpoint | Description | Auth Required | Role Required | Valid Request | Example Successful Response |
|--------|----------|-------------|---------------|---------------|---------------|------------------------------|
| **GET** | `/progress` | Get user's progress across all lessons | Yes (JWT Bearer Token) | Any | `Authorization: Bearer <jwt_token>` | ```json<br/>[<br/>  {<br/>    "id": 1,<br/>    "userId": 1,<br/>    "lessonId": 1,<br/>    "completed": true,<br/>    "lesson": {<br/>      "id": 1,<br/>      "title": "Introduction to Cross-Site Scripting (XSS)"<br/>    }<br/>  },<br/>  {<br/>    "id": 2,<br/>    "userId": 1,<br/>    "lessonId": 2,<br/>    "completed": false,<br/>    "lesson": {<br/>      "id": 2,<br/>      "title": "SQL Injection Fundamentals"<br/>    }<br/>  }<br/>]``` |
| **GET** | `/progress/:lessonId` | Get progress for specific lesson | Yes (JWT Bearer Token) | Any | `Authorization: Bearer <jwt_token>` | ```json<br/>{<br/>  "id": 1,<br/>  "userId": 1,<br/>  "lessonId": 1,<br/>  "completed": true,<br/>  "lesson": {<br/>    "id": 1,<br/>    "title": "Introduction to Cross-Site Scripting (XSS)"<br/>  }<br/>}``` |
| **POST** | `/progress/:lessonId/complete` | Mark lesson as completed | Yes (JWT Bearer Token) | Any | `Authorization: Bearer <jwt_token>` | ```json<br/>{<br/>  "id": 1,<br/>  "userId": 1,<br/>  "lessonId": 1,<br/>  "completed": true<br/>}``` |
| **GET** | `/progress/stats/overview` | Get user learning statistics | Yes (JWT Bearer Token) | Any | `Authorization: Bearer <jwt_token>` | ```json<br/>{<br/>  "totalLessons": 7,<br/>  "completedLessons": 3,<br/>  "completionRate": 42.86,<br/>  "totalQuizzes": 7,<br/>  "completedQuizzes": 2,<br/>  "averageScore": 85.5<br/>}``` |
| **GET** | `/progress/quizzes` | Get quiz progress for user | Yes (JWT Bearer Token) | Any | `Authorization: Bearer <jwt_token>` | ```json<br/>[<br/>  {<br/>    "id": 5,<br/>    "quizId": 1,<br/>    "quizTitle": "API Test Quiz",<br/>    "lessonId": 7,<br/>    "lessonTitle": "API Testing Lesson",<br/>    "score": 2,<br/>    "maxScore": 2,<br/>    "percentage": 100,<br/>    "completedAt": "2025-08-22T12:42:22.309Z",<br/>    "passed": true,<br/>    "attempts": 4<br/>  }<br/>]``` |
| **GET** | `/progress/comprehensive` | Get comprehensive progress overview | Yes (JWT Bearer Token) | Any | `Authorization: Bearer <jwt_token>` | ```json<br/>{<br/>  "lessons": [<br/>    {<br/>      "id": 2,<br/>      "userId": 3,<br/>      "lessonId": 2,<br/>      "completed": true,<br/>      "lesson": {<br/>        "id": 2,<br/>        "title": "Understanding SQL Injection"<br/>        }<br/>      }<br/>  ],<br/>  "quizzes": [<br/>    {<br/>      "id": 5,<br/>      "quizId": 1,<br/>      "quizTitle": "API Test Quiz",<br/>      "lessonId": 7,<br/>      "lessonTitle": "API Testing Lesson",<br/>      "score": 2,<br/>      "maxScore": 2,<br/>      "percentage": 100,<br/>      "completedAt": "2025-08-22T12:42:22.309Z",<br/>      "passed": true,<br/>      "attempts": 4<br/>    }<br/>  ],<br/>  "summary": {<br/>    "totalLessons": 3,<br/>    "completedLessons": 3,<br/>    "totalQuizzes": 1,<br/>    "passedQuizzes": 1,<br/>    "overallCompletion": 100<br/>  }<br/>}``` |

---
### Get User Progress Across All Lessons

**GET** `/progress`

**Auth Required:** Yes (JWT Bearer Token)

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "lessonId": 1,
    "completed": true,
    "lesson": {
      "id": 1,
      "title": "Introduction to Cross-Site Scripting (XSS)"
    }
  },
  {
    "id": 2,
    "userId": 1,
    "lessonId": 2,
    "completed": false,
    "lesson": {
      "id": 2,
      "title": "SQL Injection Fundamentals"
    }
  }
]
```

### Get Progress for Specific Lesson

**GET** `/progress/:lessonId`

**Auth Required:** Yes (JWT Bearer Token)

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "lessonId": 1,
  "completed": true,
  "lesson": {
    "id": 1,
    "title": "Introduction to Cross-Site Scripting (XSS)"
  }
}
```

### Mark Lesson as Completed

**POST** `/progress/:lessonId/complete`

**Auth Required:** Yes (JWT Bearer Token)

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "lessonId": 1,
  "completed": true
}
```

### Get User Learning Statistics

**GET** `/progress/stats/overview`

**Auth Required:** Yes (JWT Bearer Token)

**Response:**
```json
{
  "totalLessons": 7,
  "completedLessons": 3,
  "completionRate": 42.86,
  "totalQuizzes": 7,
  "completedQuizzes": 2,
  "averageScore": 85.5
}
```

### Get Quiz Progress for User

**GET** `/progress/quizzes`

**Auth Required:** Yes (JWT Bearer Token)

**Response:**
```json
[
  {
    "id": 5,
    "quizId": 1,
    "quizTitle": "API Test Quiz",
    "lessonId": 7,
    "lessonTitle": "API Testing Lesson",
    "score": 2,
    "maxScore": 2,
    "percentage": 100,
    "completedAt": "2025-08-22T12:42:22.309Z",
    "passed": true,
    "attempts": 4
  }
]
```

### Get Comprehensive Progress (Lessons + Quizzes)

**GET** `/progress/comprehensive`

**Auth Required:** Yes (JWT Bearer Token)

**Response:**
```json
{
  "lessons": [
    {
      "id": 2,
      "userId": 3,
      "lessonId": 2,
      "completed": true,
      "lesson": {
        "id": 2,
        "title": "Understanding SQL Injection"
      }
    }
  ],
  "quizzes": [
    {
      "id": 5,
      "quizId": 1,
      "quizTitle": "API Test Quiz",
      "lessonId": 7,
      "lessonTitle": "API Testing Lesson",
      "score": 2,
      "maxScore": 2,
      "percentage": 100,
      "completedAt": "2025-08-22T12:42:22.309Z",
      "passed": true,
      "attempts": 4
    }
  ],
  "summary": {
    "totalLessons": 3,
    "completedLessons": 3,
    "totalQuizzes": 1,
    "passedQuizzes": 1,
    "overallCompletion": 100
  }
}
```


## Complete Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Root** |
| GET | / | Welcome message and API status | No |
| **Authentication** |
| POST | /auth/login | Login, returns JWT | No |
| **Users** |
| POST | /users | Register new user (Public) | No |
| POST | /users/admin | Create admin user (Admin only) | Yes |
| GET | /users | Get all users (Admin only) | Yes |
| PATCH | /users/:id | Update any user (Admin only) | Yes |
| DELETE | /users/:id | Delete any user (Admin only) | Yes |
| GET | /users/profile | Get own profile | Yes |
| PATCH | /users/profile | Update own profile | Yes |
| DELETE | /users/profile | Delete own account | Yes |
| **Lessons** |
| POST | /lessons | Create a new lesson (Admin only) | Yes |
| GET | /lessons | Get all lessons | No |
| GET | /lessons/:id | Get a lesson by ID | No |
| PATCH | /lessons/:id | Update a lesson (Admin only) | Yes |
| DELETE | /lessons/:id | Delete a lesson (Admin only) | Yes |
| GET | /lessons/:id/quiz | Get the quiz for a lesson | No |
| **Quizzes** |
| POST | /quizzes | Create a quiz (Admin only) | Yes |
| GET | /quizzes/:id | Get a quiz by ID | Yes |
| PATCH | /quizzes/:id | Update a quiz (Admin only) | Yes |
| DELETE | /quizzes/:id | Delete a quiz (Admin only) | Yes |
| POST | /quizzes/:id/submit | Submit quiz answers | Yes |
| GET | /quizzes/:id/attempts | Get user's quiz attempts | Yes |
| **Progress** |
| GET | /progress | Get user's progress across all lessons | Yes |
| GET | /progress/:lessonId | Get progress for specific lesson | Yes |
| POST | /progress/:lessonId/complete | Mark lesson as completed | Yes |
| GET | /progress/stats/overview | Get user learning statistics | Yes |
| GET | /progress/quizzes | Get quiz progress for user | Yes |
| GET | /progress/comprehensive | Get comprehensive progress | Yes |

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
- **User Progress:** Track lesson completion and quiz performance across the learning journey.

