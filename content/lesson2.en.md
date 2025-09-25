# The Sneaky Master Key: SQL Injection 🔑

Think of a website's database as a locked vault. To open it, the website uses special keys — SQL commands. SQL injection is a trick where an attacker gives a fake key (input) that becomes part of the command and lets them open the vault or read everything inside.

Beginner-friendly example:
When you log in, the website might run a statement like:

```sql
SELECT * FROM users WHERE username = '$USER_INPUT';
```

If the site simply substitutes the user's text into the command, someone could type:

```sql
' OR 1=1; --
```

When combined, the command becomes:

```sql
SELECT * FROM users WHERE username = '' OR 1=1; --';
```

Because `OR 1=1` is always true, the database may return all users and the `--` makes the database ignore the rest (like the password check). The attacker can bypass authentication or read data they shouldn't see.

Why this is easy to miss:
- Developers sometimes concatenate user input directly into queries.
- Databases expect commands — so if user text becomes part of a command, it can change meaning.

How to defend (practical steps):
- See the shared Core Security Tips: `content/core_tips.en.md` for parameterized queries, least privilege, and other practical steps.

Short exercise:
- Try a simple app that uses user input in a query. Replace a raw query with a parameterized one and observe how the attack input no longer works.

Further reading and hands-on labs:
- PortSwigger SQL Injection guide and labs: https://portswigger.net/web-security/sql-injection
- OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection

Keep the vault analogy in mind: never let users hand you a key that becomes part of the lock code.

Progression — quick next steps

- Try one item from the shared Core Security Tips (`content/core_tips.en.md`) and then take the short quiz for this lesson. When you're ready, try a guided lab for hands-on practice.


