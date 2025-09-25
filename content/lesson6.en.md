# API Testing & Secure Endpoints (Beginner)

APIs are the back doors apps use to communicate. When testing APIs, think about both functionality and security.

Quick secure checklist for API testing:
- See `content/core_tips.en.md` for the shared checklist (authentication, logging, input validation, rate-limiting, etc.). Use those core tips as your starting point for APIs.

Practical exercises:
- Write a small script to create a lesson via the API and then attempt to access it as another user — ensure authorization blocks it.
- Test rate-limiting by sending many requests quickly and observe server behavior.

Tools to try:
- `curl` or `HTTPie` for quick API calls.
- Postman or Insomnia for interactive testing.

Remember: treating APIs as a public surface will help you design safer systems from the start.

Progression — what to try next

Level 1 — Beginner
- Use `curl` to make basic requests and inspect responses.

Level 2 — Intermediate
- Add authentication and test authorization by switching user accounts and verifying access rules.

Level 3 — Advanced (fun)
- Simulate burst traffic and learn about rate limiting, throttling, and circuit breakers to make your API resilient.
