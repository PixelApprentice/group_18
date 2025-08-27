# Understanding SQL Injection

SQL Injection (SQLi) is a technique where attackers insert malicious SQL statements into input fields, allowing them to access or manipulate your database.

## Example
```sql
SELECT * FROM users WHERE username = '$USER_INPUT';
```

**Prevention:** Use parameterized queries and ORM tools like Prisma.
