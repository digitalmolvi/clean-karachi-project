Clean Karachi — Web Frontend

A community-driven web app for reporting city cleanliness issues, tracking resolution, and mobilizing neighborhood support — built on Next.js 14 + TypeScript + Tailwind + shadcn/ui.

Monorepo hint: This is the frontend at web/ (your API lives in api/).

Backend: FastAPI MVP (Civic Complaints API) → uvicorn app:app --reload --port 8000

Live docs: Swagger at http://127.0.0.1:8000/docs

✨ Features

Report Issues: Location-based reporting (GPS pin; photos UI ready)

Track in Real Time: Status changes from new → in_progress → resolved

Community Support: Upvote complaints to increase priority

Area Coverage: City/constituency context (NA/PS codes in API)

Responsive: Mobile-first, accessible UI with shadcn/ui

📁 Project Structure
web/
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # Landing page (Clean Karachi)
│   └── globals.css         # Tailwind base styles
├── components/
│   ├── navbar.tsx          # Top navigation
│   └── ui/                 # shadcn/ui primitives (button, card, etc.)
├── public/                 # Static assets
│   └── (images, icons...)
├── styles/
│   └── (optional extra styles)
├── lib/                    # (helpers: fetchers, constants)
├── hooks/                  # (custom hooks)
├── components.json         # shadcn config
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json

🧰 Prerequisites

Node.js ≥ 18

pnpm (recommended) — or npm/yarn if you prefer

Tailwind/shadcn already set up (see components.json, postcss.config.mjs)

🚀 Quick Start

From repo root:

cd web
pnpm install        # or: npm install / yarn install
pnpm dev            # starts Next.js on http://localhost:3000


Open: http://localhost:3000

If the API is running locally at http://127.0.0.1:8000, the UI can call it directly (see “Backend Integration” below).

🏗️ Scripts
pnpm dev       # start dev server (Next.js)
pnpm build     # production build
pnpm start     # run built app (uses .next)
pnpm lint      # lint with next lint/eslint

⚙️ Environment

Create web/.env.local:

NEXT_PUBLIC_APP_URL=http://localhost:3000
# If you proxy or call the FastAPI backend directly:
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000


Use in code:

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

🔌 Backend Integration (FastAPI)

API endpoints you’ll likely call from the UI:

POST /seed/example — seed demo reps

POST /complaints — create a complaint { title, description, lat, lng, address }

GET /complaints — list complaints (latest first)

POST /complaints/:id/vote — { voter_id, value: 1 | -1 }

PATCH /complaints/:id/status — { status: "in_progress" | "resolved" | ... }

GET /complaints/:id/summary — totals + attached reps

Fetch helper example (drop in lib/api.ts):

export async function createComplaint(payload: {
  title: string; description?: string; lat: number; lng: number; address?: string;
}) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const res = await fetch(`${base}/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to create complaint: ${res.status}`);
  return res.json();
}

🎨 Customization
Colors & Theme

Tailwind palette is defined in your Tailwind setup (check globals.css and Tailwind config). To adjust brand colors, update your Tailwind theme (e.g., in tailwind.config if present) and component tokens.

UI Components

Use shadcn/ui primitives in components/ui/. Add more with:

pnpm dlx shadcn-ui@latest add button card input badge progress

Content

Hero, Features, Stats, Stories: edit in app/page.tsx

Navbar links & branding: components/navbar.tsx

Metadata/SEO: app/layout.tsx

🧪 Local Tips

Start the API first for full flows:

# repo root → API project
cd ../api
uvicorn app:app --reload --port 8000


In a second terminal:

cd ../web
pnpm dev

📦 Build & Deploy
Vercel (recommended)

Push to GitHub

Import repo in Vercel

Framework: Next.js
Build: pnpm build
Start: (managed by Vercel)

Set Environment Variables (NEXT_PUBLIC_API_BASE) in Vercel dashboard.

Self-host
pnpm build
pnpm start   # serves .next on PORT=3000

🔧 Common Issues
Problem	Why	Fix
404s on API calls	Backend not running	Start FastAPI on 127.0.0.1:8000
CORS error in browser	Backend CORS off	Ensure FastAPI has CORSMiddleware(allow_origins=["*"]) (MVP)
TypeScript type errors	Strict types	Run pnpm lint and fix reported TS issues
Styles not applying	Tailwind not loaded	Confirm globals.css is imported in app/layout.tsx
Images not loading	Wrong path	Put assets under public/ and reference /file.png
🌱 Roadmap (Frontend)

Map picker (Leaflet/MapLibre) for precise location

Photo upload & preview on report form

Realtime updates (SSE/WebSocket) for status/votes

Constituency overlays for NA/PS visualization

Filter/sort: status, area, most-voted, newest

🤝 Contributing

PRs welcome. See repo-root CONTRIBUTING.md and CODE_OF_CONDUCT.md.

📄 License

MIT — see repo-root LICENSE.