# Core Security Tips — Short Checklist

This short checklist contains the common, high-value actions referenced across the lessons. Use it as your quick reference.

- Escape or encode output when rendering user-provided text (prevents XSS).
- Use a Content-Security-Policy (CSP) header to limit where scripts and resources can be loaded from.
- Store cookies with `HttpOnly` when JavaScript should not read them.
- Use `SameSite` cookies and CSRF tokens for state-changing forms (prevent CSRF).
- Use parameterized queries / prepared statements or an ORM (avoid raw SQL) to prevent SQL injection.
- Run services over HTTPS only and enable HSTS where possible.
- Apply least privilege to database and service accounts.
- Keep dependencies up to date and run dependency scans.
- Enable basic logging and monitor for suspicious activity.
- Consider rate-limiting, input validation, and output encoding as defense-in-depth.

Further reading:
- OWASP Top Ten: https://owasp.org/www-project-top-ten/
- OWASP fundamentals: https://owasp.org
- PortSwigger labs: https://portswigger.net/web-security
