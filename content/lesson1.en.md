# What's a Script Attack? (Cross‑Site Scripting — XSS) 🤔

Think of a website as a stage play. The actors are the page text, buttons, images and forms. The script is the set of instructions the actors follow.

A script attack (XSS) is like a mischievous audience member sneaking a fake cue-card into the script. When the website reads that cue-card, it runs unexpected instructions — for example showing a fake login, stealing a session cookie (a small secret that proves someone is logged in), or running code that performs actions on the user's behalf.

Why this matters for beginners:
- Most sites accept input from users (comments, names, search boxes). If that input is shown back to other users without cleaning it, an attacker can hide malicious code inside it.
- XSS doesn't break the server — it tricks other users' browsers.

Common attacker goals with XSS:
- Steal session cookies or tokens to impersonate users.
- Show fake forms to collect passwords or secrets (phishing).
- Perform actions as the user (like changing settings) while the user thinks they are doing nothing.

Three friendly XSS categories:
- Stored XSS: The malicious script is saved on the site (e.g., in a comment) and served to other users.
- Reflected XSS: The script is reflected by the server in a URL or search result and runs when a victim clicks a crafted link.
- DOM-based XSS: The page's JavaScript takes unsafe data from the page or URL and runs it directly.

Simple example (conceptual):
Imagine a comment box that simply prints whatever you type onto the page. If someone types:

```html
<script>alert('Got you')</script>
```

...and the site prints it without cleaning it, every visitor will see an alert box. Real attackers replace `alert()` with code that exfiltrates data.

How to defend (beginner-friendly):
- See the shared Core Security Tips: `content/core_tips.en.md` for common, high-value defenses (escape output, CSP, HttpOnly, SameSite, prepared statements, etc.).

Short exercise:
- Make a tiny HTML page that prints a user's name. Then try printing `<script>alert(1)</script>` and observe what happens. Update the page to escape `<` and `>` and observe the difference.

Further reading and practice:
- OWASP XSS Guide: https://owasp.org/www-community/attacks/xss/
- PortSwigger XSS labs: https://portswigger.net/web-security/cross-site-scripting

Keep the audience analogy in mind — prevent strangers from changing the script.

Progression — what to try next

Level 1 — Beginner
- Try: Build a tiny page that prints user-supplied text and submit a snippet like `<script>alert(1)</script>`.

Level 2 — Intermediate (gentle technical)
- Learn: How XSS can be used to steal session data and how `HttpOnly` cookies reduce risk. Try a small stored vs reflected example in a sandbox.

Level 3 — Advanced (fun)
- Try: Complete a short hands-on XSS lab (PortSwigger or TryHackMe) to practice detection and mitigation in a safe environment.
