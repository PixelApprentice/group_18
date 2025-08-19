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

## Quiz Endpoints (Database-Driven)

| Method | Endpoint         | Description                                 | Auth Required | Valid Request Body | Example Successful Response |
|--------|------------------|---------------------------------------------|--------------|--------------------|----------------------------|
| POST   | /quizzes         | Create a quiz for a lesson                  | No           | `{ "lessonId": 2, "title": "Quiz Title", "questions": [ { "text": "Q?", "answers": [ { "text": "A", "isCorrect": true } ] } ] }` | `{ "id": 1, "lessonId": 2, "title": "Quiz Title", "questions": [ { "id": 1, "quizId": 1, "question": "Q?", "answers": [ { "id": 1, "questionId": 1, "answer": "A", "isCorrect": true } ] } ] }` |
| GET    | /quizzes/:id     | Get a quiz by quiz ID                       | No           | (none)             | See above                  |
| PATCH  | /quizzes/:id     | Update a quiz (title, questions, answers)   | No           | `{ "title": "New Title", "questions": [ ... ] }` | See above                  |
| DELETE | /quizzes/:id     | Delete a quiz                               | No           | (none)             | `{ "id": 1, "lessonId": 2, "title": "...", ... }` |

---

## Quiz Response Example

```json
{
  "id": 1,
  "lessonId": 2,
  "title": "Quiz Title",
  "questions": [
    {
      "id": 1,
      "quizId": 1,
      "question": "What is XSS?",
      "answers": [
        { "id": 1, "questionId": 1, "answer": "Cross-Site Scripting", "isCorrect": true },
        { "id": 2, "questionId": 1, "answer": "Extra Secure Sockets", "isCorrect": false }
      ]
    }
  ]
}
```

---

## Key Concepts

- **Lessons:** Markdown files in `content/`, referenced by filename.
- **Quizzes:** Fully database-driven, linked to lessons by `lessonId`.
- **Lesson-Quiz Relationship:** `/lessons/:id/quiz` fetches the quiz for a lesson.
- **Authentication:** JWT-based for user management endpoints.

