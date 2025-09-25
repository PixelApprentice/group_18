# Quick Tour: Common Web Vulnerabilities (Beginner Friendly)

This lesson gives a friendly map of common web vulnerabilities and practical, easy-to-understand defenses. Think of it as a checklist you can use to make small improvements that have big impact.

Key topics (short explanations):
- Cross-Site Scripting (XSS): Attacker injects script that runs in other users' browsers. Defend: escape output, use CSP.
- SQL Injection: Attacker injects SQL to read or change data. Defend: parameterized queries, least privilege.
- Cross-Site Request Forgery (CSRF): Attacker tricks a logged-in browser into making requests. Defend: anti-CSRF tokens, SameSite cookies.
- Broken Access Control (IDOR): Users can access data they shouldn't by changing URLs or IDs. Defend: enforce authorization on every request.
- Security Misconfiguration: Servers or services left with unsafe defaults. Defend: secure configs, remove unused services, keep software updated.

Small steps you can take today:
- See the shared Core Security Tips: `content/core_tips.en.md` for a short checklist of high-value actions.

Short exercise:
- Pick one of your apps or a simple demo and apply one improvement (e.g., add output escaping). Observe how it reduces risk.

Further reading:
- OWASP Top Ten summary: https://owasp.org/www-project-top-ten/
- PortSwigger labs for hands-on practice: https://portswigger.net/web-security

Remember: security is a set of small, continuous improvements — not a single switch you flip.

Progression — quick next steps

- Pick one core tip from `content/core_tips.en.md`, apply it to a small demo, and take the lesson quiz. When comfortable, try a short guided lab.
