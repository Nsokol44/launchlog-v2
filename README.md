# 🚀 LaunchSwipe (Next.js)

> Tinder for startups — now with full SSR, Google indexing, and Open Graph cards.

---

## What's new vs the Vite version

| Feature | Vite (v2) | Next.js (v3) |
|---------|-----------|--------------|
| Google indexing | ❌ SPA, poor crawling | ✅ Full SSR per page |
| Startup profile SEO | ❌ | ✅ Title, description, keywords |
| Open Graph images | ❌ | ✅ Auto-generated per startup |
| Sitemap | ❌ | ✅ Auto-generated at /sitemap.xml |
| Robots.txt | ❌ | ✅ |
| JSON-LD structured data | ❌ | ✅ |
| Social share previews | ❌ | ✅ Rich cards on Twitter/LinkedIn |

---

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Note: Next.js uses port **3000** by default, not 5173.

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add the three environment variables when prompted. Vercel auto-detects Next.js — no extra config needed.

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages (server components)
│   ├── layout.js                 # Root layout — metadata, fonts, providers
│   ├── page.js                   # Home / discover (server fetches startups)
│   ├── startup/[id]/page.js      # Startup profile — SSR + SEO metadata
│   ├── list/page.js              # List a startup
│   ├── saved/page.js             # Saved startups
│   ├── dashboard/page.js         # Founder dashboard
│   ├── api/og/route.js           # Open Graph image generation (Edge)
│   ├── sitemap.js                # Auto sitemap
│   └── robots.js                 # Robots.txt
├── components/                   # Client components ('use client')
│   ├── AuthProvider.jsx          # Auth context
│   ├── Navbar.jsx
│   ├── AuthModal.jsx
│   ├── SwipeCard.jsx
│   ├── CommunityModal.jsx
│   ├── FeedbackModal.jsx
│   ├── ShareModal.jsx
│   ├── DigestSignup.jsx
│   ├── DiscoverClient.jsx        # Interactive swipe feed
│   ├── StartupProfileClient.jsx  # Startup profile interactions
│   ├── ListClient.jsx            # Founder onboarding form
│   ├── SavedClient.jsx           # Saved startups list
│   └── DashboardClient.jsx       # Founder analytics
└── lib/
    ├── supabase-server.js        # Supabase client for server components
    ├── supabase-browser.js       # Supabase client for client components
    └── constants.js
```

---

## How SSR works in this app

Each page in `src/app/` is a **Server Component** by default. It fetches data directly from Supabase on the server before sending HTML to the browser. Google sees fully-rendered content.

Interactive parts (swiping, modals, auth) are split into **Client Components** (marked `'use client'`) that hydrate in the browser after the initial load.

```
Server (Google sees this)          Browser (user interacts here)
─────────────────────────          ──────────────────────────────
page.js fetches startups    →      DiscoverClient handles swiping
startup/[id]/page.js        →      StartupProfileClient handles support/save/share
```

---

## SEO — what Google indexes per startup

When a startup is approved and live, its profile page at `/startup/:id` includes:

- `<title>` — Startup name + tagline
- `<meta description>` — Product description + supporter count + city
- `<meta keywords>` — Name, category, city
- Open Graph image — Auto-generated branded card (1200×630)
- JSON-LD structured data — Organization schema
- Canonical URL
- Listed in sitemap.xml

This means a founder Googling their own startup name should find their LaunchSwipe page in results.
