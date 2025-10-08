# SEKUR Labs Deployment Guide

## 🎯 Deployment Strategy

The SEKUR Labs are designed to be hosted **independently** from the main SEKUR platform, allowing for:
- Separate scaling and maintenance
- Independent updates and features
- Cost-effective hosting on free tiers
- Easy integration via simple links

## 🚀 Frontend Deployment (Recommended: Vercel)

### Option 1: Vercel (Best for Next.js)
1. **Push to GitHub** (resolve auth issues first)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `labs/frontend` folder as root directory
   - Deploy automatically

3. **Custom Domain (Optional):**
   ```
   labs.sekur.com → Vercel deployment
   ```

### Option 2: Netlify (Static Export)
1. **Build static version:**
   ```bash
   cd labs/frontend
   npm run build
   ```
2. **Deploy to Netlify:**
   - Drag the `out` folder to Netlify
   - Or connect GitHub repo with build command: `npm run build`

### Option 3: GitHub Pages (Free)
1. **Enable static export** (already configured)
2. **Build and deploy:**
   ```bash
   npm run build
   # Upload 'out' directory to GitHub Pages
   ```

## 🔗 Integration with Main SEKUR Platform

Add this navigation link to your main SEKUR website:

```jsx
// In your main SEKUR platform navigation
<nav>
  <Link href="/dashboard">Dashboard</Link>
  <Link href="/lessons">Lessons</Link>
  <Link href="https://labs.sekur.com" target="_blank" rel="noopener">
    Practice Labs →
  </Link>
</nav>
```

Or as a prominent call-to-action:

```jsx
<section className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg">
  <h2 className="text-2xl font-bold text-white mb-4">
    Ready to Practice?
  </h2>
  <p className="text-white/90 mb-6">
    Test your skills with hands-on vulnerability labs
  </p>
  <Button asChild>
    <Link href="https://labs.sekur.com" target="_blank">
      Launch Practice Labs →
    </Link>
  </Button>
</section>
```

## 📊 Expected Costs

### Frontend Hosting (Free Tier Sufficient)
- **Vercel:** Free for personal/educational use
- **Netlify:** Free tier: 100GB bandwidth/month
- **GitHub Pages:** Completely free for public repos

### Backend Labs (Optional - Currently Client-Side)
If you want to deploy the Node.js backend services:
- **Railway:** Free tier available
- **Render:** Free tier with sleep mode
- **Heroku alternatives:** Multiple free options

## 🔧 Environment Configuration

Create these environment variables for production:

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SITE_URL=https://labs.sekur.com
NEXT_PUBLIC_MAIN_SITE_URL=https://sekur.com

# Backend (if deployed)
FRONTEND_URL=https://labs.sekur.com
CORS_ORIGIN=https://labs.sekur.com
```

## 🎨 Branding Integration

The labs inherit your SEKUR branding:
- **Colors:** Matches your cyan accent (#00d4ff)
- **Typography:** Uses Inter font family
- **Logo:** Update in `components/header.tsx`
- **Footer:** Customize in `components/footer.tsx`

## 📈 Analytics & Monitoring

Add analytics to track lab usage:

```jsx
// In app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🔒 Security Considerations

- **Educational Use Only:** Clear warnings displayed
- **No Real Vulnerabilities:** All exploits are simulated
- **CORS Protection:** Configure for your domains only
- **Rate Limiting:** Consider adding for production

## 📱 Mobile Optimization

The labs are fully responsive and work on:
- ✅ Desktop browsers
- ✅ Tablets (iPad, Android)  
- ✅ Mobile phones (iOS, Android)
- ✅ Progressive Web App capable

## 🚀 Go Live Checklist

- [ ] Frontend deployed to Vercel/Netlify
- [ ] Custom domain configured (optional)
- [ ] Integration link added to main SEKUR site
- [ ] Analytics configured
- [ ] Mobile testing completed
- [ ] Educational disclaimers verified
- [ ] Progress tracking working
- [ ] All 4 labs functional

## 📞 Support & Maintenance

The labs are designed to be **zero-maintenance** once deployed:
- No database required (uses localStorage)
- No server-side processing needed
- Automatic HTTPS via hosting platform
- CDN distribution included

**Estimated setup time:** 15-30 minutes
**Monthly maintenance:** 0 hours (fully automated)
