# Binary Code — Código Binário

A monorepo for the **Código Binário** platform — an AI-powered diagnostic system that helps businesses identify operational problems and propose technology solutions.

## Architecture

```
binary-code/
├── apps/
│   ├── web/          → Next.js frontend (Vercel)
│   └── api/          → Fastify API backend (Render)
├── packages/
│   └── shared/       → Shared TypeScript models
├── turbo.json        → Turborepo pipeline
├── pnpm-workspace.yaml
└── package.json
```

**Frontend** (`apps/web`): Next.js 14 + Tailwind CSS with a "Terminal Noir" design system. Deployed on **Vercel**.

**Backend** (`apps/api`): Fastify + TypeScript API (codename "Hermes"). Multi-provider AI orchestration (Anthropic, OpenAI, Gemini, Groq). Deployed on **Render**.

**Database**: Supabase (Postgres) with full-text search and Row Level Security.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS 3 |
| Backend | Fastify 5, TypeScript, esbuild |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude, OpenAI GPT, Google Gemini, Groq Llama |
| Monorepo | pnpm workspaces, Turborepo |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 11+

### Install

```bash
pnpm install
```

### Development

```bash
# Start both frontend and backend
pnpm dev

# Start only frontend (port 3000)
pnpm --filter=@binary-code/web dev

# Start only backend (port 3001)
pnpm --filter=@binary-code/api dev
```

### Environment Variables

**Frontend** (`apps/web/.env.local`):
```
NEXT_PUBLIC_API_BASE=         # Leave empty for dev (uses proxy), set to Render URL in prod
```

**Backend** (`apps/api/.env.local`):
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=            # At least one AI provider key required
OPENAI_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
PRIMARY_PROVIDER=anthropic
CORS_ORIGINS=http://localhost:3000
```

### Database Setup

Run the migration SQL files in Supabase SQL Editor:
1. `apps/api/migrations/001_init.sql` — Core tables (projects, decisions, tasks, etc.)
2. `apps/api/migrations/002_discovery.sql` — Discovery pipeline tables

## Deployment

### Vercel (Frontend)

1. Connect GitHub repo to Vercel
2. **Root Directory**: `apps/web`
3. **Framework**: Next.js (auto-detected)
4. **Environment Variables**: Set `NEXT_PUBLIC_API_BASE` to your Render API URL

### Render (Backend)

1. Connect GitHub repo to Render
2. **Root Directory**: `apps/api`
3. **Build Command**: `cd ../.. && pnpm install --filter=@binary-code/api... && cd apps/api && pnpm build`
4. **Start Command**: `pnpm start`
5. Set environment variables in Render dashboard (Supabase keys, AI provider keys, CORS_ORIGINS)

### Database

Run both SQL migration files in the Supabase dashboard before first deploy.

## License

Private — MendeOliv
