# SEKUR Labs (local run)

This folder contains four intentionally vulnerable labs used for learning: SQL Injection, Stored XSS, Broken Authentication, and IDOR.

Quick local run (recommended for students / instructors):

Linux/macOS (with Docker):

```bash
# from repository root
docker compose -f docker-compose.yml up --build nginx lab_sql_injection lab_xss_stored lab_broken_auth lab_idor
```

Windows (Docker Desktop):
- Either run the same command in PowerShell (ensure Docker Desktop is running).
- If using WSL2, run from inside WSL for best compatibility.

Labs-only compose (no Nest backend):

```bash
docker compose -f docker-compose.labs.yml up --build
```

Notes:
- Each lab is accessible at `http://localhost/lab/<name>/` when `nginx` is running.
- If you run the labs-only compose, it will start `nginx` and the four lab services without the main Nest app.
- For persistence between restarts, set `DB_FILE` environment variables in `docker-compose.labs.yml` and mount volumes.

Per-lab quick guide
- SQL Injection (`/lab/sql-injection/`): search for users. Hint: use <code>' OR '1'='1</code> to retrieve all users.
- Stored XSS (`/lab/xss-stored/`): post a comment that includes HTML. Hint: use <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code>.
- Broken Auth (`/lab/broken-auth/`): try sample account <code>victim/guessme</code>. The app stores plaintext passwords.
- IDOR (`/lab/idor/`): click note IDs to view them; ownership is not enforced.

Windows / WSL notes
- Docker Desktop: ensure it's running and WSL2 integration is enabled. Prefer running the project from inside WSL for best compatibility.
- Ports: make sure ports 80 and 3001-3004 are not in use by other applications (IIS, local dev servers, etc.).
- If nginx fails to start with host resolution errors, try `docker compose -f docker-compose.labs.yml up --build --remove-orphans`.

Persistence
- To persist lab SQLite files between restarts, use the optional compose overlay (see `docker-compose.labs.persist.yml`). It mounts per-lab volumes and sets `DB_FILE` for each service.

Additional cross-platform tips
- macOS: run the labs compose from the Terminal app. If you see permission issues with Docker, ensure Docker Desktop is installed and running.
- Linux: run the same docker compose command in a shell. If you run into permission issues, ensure your user can access the Docker daemon or use sudo.
- Windows: WSL2 is recommended. Start a WSL2 terminal and run the docker compose commands from there. If using PowerShell, ensure Docker Desktop is available and the WSL integration is enabled.

CI: hint smoke-tests (suggested)
- You can add a CI job that starts the labs-only compose and runs `scripts/smoke-test-hints.sh` to validate the labs. See `.github/workflows/labs-hints.yml` for an example that the project includes.

