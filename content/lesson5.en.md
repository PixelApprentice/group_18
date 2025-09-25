# Hands-On Practice: Safe Sandbox & Simple Challenges 🧪

This lesson is a safe sandbox designed for you to practice simple security ideas without fear. Use sample pages and local code — do not run intentionally vulnerable apps on public servers.

What you can try:
- Build a tiny comment box and try an XSS payload like `<script>alert(1)</script>`. Then fix it by escaping output.
- Create a simple login simulation and experiment with SQLi inputs on a local, disposable database to understand how raw queries fail.
- Practice adding CSRF tokens to a form and validating them on the server.

Safety reminder:
- Always run these exercises locally or in an isolated VM/container. Never test attacks against systems you do not own or have permission to test.

Quick checklist for the sandbox:
- See `content/core_tips.en.md` for shared tips (escape output, logging, using throwaway data, and more). Keep sandbox practices local and disposable.

Exercise idea:
- Create a small HTML + Node or simple static HTML with a toy backend that demonstrates XSS, then fix it.

Progression — quick next steps

- Apply one fix from `content/core_tips.en.md` in your sandbox, then take the lesson quiz. Use logs to verify your detection if you add monitoring.
