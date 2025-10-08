# 🛡️ SEKUR Labs - Interactive Cybersecurity Training

Modern, beginner-friendly vulnerability labs designed for hands-on learning. Each lab simulates real-world security vulnerabilities in a safe, educational environment.

## 🎯 Available Labs

| Lab | Vulnerability | Difficulty | Description |
|-----|---------------|------------|-------------|
| **SQL Injection** | Database manipulation | Beginner | Learn how attackers bypass authentication and access unauthorized data |
| **Cross-Site Scripting (XSS)** | Script injection | Beginner | Understand how malicious scripts can be injected into web applications |
| **Broken Authentication** | Weak credentials | Beginner | Explore authentication bypass techniques and credential attacks |
| **IDOR** | Access control | Beginner | Discover how to access unauthorized resources through URL manipulation |

## 🚀 Quick Start Options

### Option 1: Modern Frontend (Recommended)
```bash
cd frontend/
npm install
npm run dev
# Visit http://localhost:3005
```

**Features:**
- ✅ Progress tracking
- ✅ Interactive tutorials  
- ✅ Beginner-friendly explanations
- ✅ Dark/light themes
- ✅ Mobile responsive

### Option 2: Backend Labs (Advanced)
```bash
# From repository root
docker compose -f docker-compose.labs.yml up --build
# Visit http://localhost/lab/<name>/
```

## 🌐 Production Deployment

### Frontend Hosting (Free Options)

**Vercel (Recommended):**
```bash
cd frontend/
npm run build
# Deploy to Vercel
```

**Netlify:**
```bash
cd frontend/
npm run build
# Deploy 'out' folder to Netlify
```

**GitHub Pages:**
```bash
cd frontend/
npm run build
# Upload 'out' directory
```

### Backend Services (Optional)
- **Railway:** Free tier for Node.js apps
- **Render:** Free tier with sleep mode
- **Heroku alternatives:** Multiple options available

## 📁 Project Structure

```
labs/
├── frontend/           # Modern Next.js UI (recommended)
│   ├── app/           # Lab pages and components
│   ├── components/    # Reusable UI components
│   ├── lib/          # Progress tracking utilities
│   └── public/       # Static assets
├── sql-injection/     # Backend SQL injection lab
├── xss-stored/       # Backend XSS lab  
├── broken-auth/      # Backend authentication lab
├── idor/             # Backend IDOR lab
└── DEPLOYMENT.md     # Complete hosting guide
```

## 🎓 Educational Features

- **Progress Tracking:** Completion status saved locally
- **Interactive Hints:** Progressive guidance system
- **Real-world Context:** Professional UI that doesn't look obviously educational
- **Success Feedback:** Clear indicators when vulnerabilities are exploited
- **Mobile Friendly:** Works on all devices

## 🔗 Integration with Main Platform

Add this to your main SEKUR website navigation:

```jsx
<Link href="https://labs.yourdomain.com" target="_blank">
  Practice Labs →
</Link>
```

## 🛠️ Development

**Frontend Development:**
```bash
cd frontend/
npm install
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Code linting
```

**Backend Development:**
```bash
# Individual lab services
cd sql-injection/
npm install
npm start        # Runs on port 3001

cd xss-stored/
npm start        # Runs on port 3002
# etc.
```

## 📊 Hosting Costs

- **Frontend:** FREE (Vercel/Netlify/GitHub Pages)
- **Backend:** FREE tier available (Railway/Render)
- **Custom Domain:** $10-15/year (optional)
- **Total:** $0-15/year

## 🔒 Security & Safety

- ✅ **Educational Only:** Clear warnings displayed
- ✅ **Simulated Vulnerabilities:** No real security risks
- ✅ **Safe Environment:** Contained within application
- ✅ **No Data Collection:** Privacy-focused design

## 📱 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS/Android)

## 🚀 Quick Deployment Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Test locally (`npm run dev`)
- [ ] Build for production (`npm run build`)
- [ ] Deploy to hosting platform
- [ ] Configure custom domain (optional)
- [ ] Add integration link to main site
- [ ] Test all labs functionality

**Estimated setup time:** 15-30 minutes  
**Maintenance required:** Zero (fully automated)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

