# CSRF — What's the Unwanted Helper? 🤖

Imagine you ask a trusted assistant (your browser) to run errands for you — paying bills, posting messages, or changing settings. Because you trust the assistant, it uses your keys (cookies) to act on your behalf.

Cross-Site Request Forgery (CSRF) is when an attacker tricks that assistant into performing an action you didn't intend — for example by placing a hidden form on a webpage you visit that submits to your bank.

Why this is sneaky for beginners:
- Your browser automatically sends cookies with requests. That means the attacker doesn't need your password — just your browser's cooperation.

Simple example (conceptual):
- You are logged in to example-bank.com. An attacker hosts a page that submits a hidden form to `example-bank.com/transfer` when you visit it. Your browser sends the cookie and the transfer happens.

Defenses you can use (friendly):
- See the shared Core Security Tips: `content/core_tips.en.md` for CSRF tokens, SameSite, and related actions.

Short exercise:
- Build a simple form that makes a POST request. Try making a second page that auto-submits a hidden form to that endpoint and observe how `SameSite` and tokens stop the attack.

Further reading and hands-on labs:
- OWASP CSRF: https://owasp.org/www-community/attacks/csrf
- PortSwigger labs: https://portswigger.net/web-security/csrf
- TryHackMe CSRF room for hands-on practice.

Remember: CSRF exploits trust in the browser — make your server verify where requests come from.

Progression — quick next steps

- Try one item from the shared Core Security Tips (`content/core_tips.en.md`) and then take this lesson's quiz. Practice in a local sandbox before using guided labs.
