# SEKUR Labs Frontend

Modern Next.js frontend for interactive cybersecurity vulnerability labs.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) to access the labs.

## Available Labs

1. **SQL Injection** - Database query manipulation attacks
2. **Cross-Site Scripting (XSS)** - Script injection vulnerabilities  
3. **Broken Authentication** - Authentication bypass techniques
4. **Insecure Direct Object Reference (IDOR)** - Unauthorized resource access

## Features

- **Progress Tracking** - Completion status saved locally
- **Interactive Tutorials** - Lab-specific hints and guidance
- **Realistic UI** - Professional appearance, not obviously educational
- **Beginner Friendly** - Clear explanations for non-technical users
- **Dark/Light Themes** - Modern responsive design
- **Success Feedback** - Clear completion indicators

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Option 2: Netlify
```bash
npm run build
# Deploy to Netlify (uses netlify.toml config)
```

### Option 3: Static Hosting
```bash
npm run build
# Serve the 'out' directory on any static host
```

## Integration with Main SEKUR Platform

Add this link to your main SEKUR website:
```html
<a href="https://your-labs-domain.com" target="_blank">
  Practice Labs →
</a>
```

## Tech Stack

- Next.js 15 with React 19
- TypeScript
- TailwindCSS v3
- Modern UI components
- Static export ready

## Project Structure

```
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components  
├── lib/                # Utilities and progress tracking
├── public/             # Static assets
└── styles/             # Global styles
```

## Configuration

- `next.config.mjs` - Next.js configuration with static export
- `tailwind.config.mjs` - TailwindCSS styling configuration
- `vercel.json` - Vercel deployment settings
- `netlify.toml` - Netlify deployment settings (minimal)

Design system:
- Color scheme: background #1a1a1a, cyan accents #00d4ff, warnings #ef4444, success #22c55e
- Typography: Inter / system sans, multiple weights
- Components: cards, buttons with subtle borders, accessible inputs

Run locally:
1. cd labs/lab-front-end
2. npm install
3. npm run dev

Deployment (independent):
- This front-end is designed to deploy independently from the other SEKUR content. It only communicates with the lab backends under `labs/` via HTTP. On public hosting you should configure the backend endpoints as environment variables.
- Recommended free hosts: Vercel (next.js native), Netlify (static export), or GitHub Pages (for exported static site). Vercel provides the smoothest experience for Next.js app router.

Vercel quick start:
1. Create a repo or use this repo and push changes.
2. On Vercel, create a new project and point it to this folder (`labs/lab-front-end`) or set the root directory to that path.
3. Provide environment variables if you need to point to local lab backends (e.g., REACT_APP_LABS_API_URL).
4. Deploy — Vercel will detect Next.js and build automatically.

Folder layout recommendations (inside `labs/`):
- labs/
	- frontend/ (or lab-front-end/)  <-- this project (deploy independently)
	- sql-injection/                 <-- backend lab service
	- xss-stored/                    <-- backend lab service
	- broken-auth/                   <-- backend lab service
	- idor/                          <-- backend lab service

Tips for deployment and independent operation:
- Use environment variables to point frontend to the correct lab backend URLs. This lets the front-end be hosted anywhere while the backend labs run locally or on another host.
- If you want to provide a single downloadable package, include a shell script that starts required backend lab containers and the frontend (e.g., docker-compose that references each lab service).
- Keep the front-end folder self-contained (package.json, README, build scripts) so Vercel/Netlify can deploy it by selecting that directory as the project root.

Security and safety:
- The labs are intentionally vulnerable. Do not point the UI at production systems. Include the warning banner (present in the footer) and require users to confirm they understand the simulated nature before starting labs.

