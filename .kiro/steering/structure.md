# Project Structure

## Root Directory

```
├── .kiro/                  # Kiro IDE configuration and specs
├── src/                    # Source code
├── public/                 # Static assets
├── locales/                # Locale-specific files (en, zh)
├── note/                   # Documentation and implementation notes
├── node_modules/           # Dependencies
└── [config files]          # Various configuration files
```

## Source Directory (`src/`)

### App Router Structure (`src/app/`)

Next.js 14 App Router with internationalization:

```
src/app/
├── [locale]/               # Dynamic locale routing (en, zh)
│   ├── layout.tsx          # Root layout with AuthProvider, AiAssistantButton
│   ├── page.tsx            # Homepage entry (server component)
│   ├── HomePageClient.tsx  # Homepage client component
│   │
│   ├── about/              # About page
│   ├── ai-news/            # AI news section
│   ├── blog/               # Tech blog with timeline
│   │   ├── [slug]/         # Individual blog post
│   │   ├── create/         # Create new post
│   │   ├── edit/[slug]/    # Edit existing post
│   │   └── manage/         # Manage all posts
│   │
│   ├── game/               # Neon Claw game
│   │   ├── components/     # Game-specific components
│   │   ├── hooks/          # Game hooks (useHandTracking, useGameAudio)
│   │   ├── lib/            # Game logic (physics, state machine, audio)
│   │   ├── store/          # Zustand game state
│   │   ├── types/          # Game TypeScript types
│   │   └── assets/         # Game assets
│   │
│   ├── games/              # Games listing page
│   ├── laboratory/         # Experimental features
│   ├── projects/           # Project showcase
│   │   ├── cloud_chinese/
│   │   ├── reading_report/
│   │   ├── yimi_teacher/
│   │   ├── yimireading/
│   │   └── yueluo/
│   │
│   ├── skills/             # Skills page
│   └── test-*/             # Test pages
│
├── api/                    # API routes
│   ├── auth/               # Authentication endpoints
│   ├── blog/               # Blog CRUD operations
│   │   ├── posts/
│   │   ├── drafts/
│   │   ├── tags/
│   │   └── timeline/
│   ├── chat/               # AI chatbot endpoints
│   └── projects/           # Project data endpoints
│
└── globals.css             # Global styles
```

### Components (`src/components/`)

Organized by feature and type:

```
src/components/
├── 3d/                     # 3D scene components
│   ├── Scene3DManager.tsx  # Main 3D wrapper with error boundaries
│   ├── OptimizedScene3D.tsx
│   ├── LODComponent.tsx    # Level of Detail optimization
│   ├── Globe3D.tsx
│   ├── GalaxyVisualization.tsx
│   ├── PuzzleCard3D.tsx
│   └── __tests__/          # Component tests
│
├── adventure-map/          # Project showcase map
│   ├── AdventureMap.tsx
│   ├── ProjectIslandComponent.tsx
│   ├── AchievementSystem.tsx
│   └── InteractiveDemo.tsx
│
├── ai-news/                # AI news components
├── auth/                   # Authentication components
├── blog/                   # Blog-related components
│   ├── BlogEditor.tsx      # Rich text editor
│   ├── BlogPostCard.tsx
│   ├── BlogTimeline.tsx
│   ├── MarkdownPreview.tsx
│   ├── MermaidDiagram.tsx
│   └── CommentSection.tsx
│
├── home/                   # Homepage sections
│   ├── HeroSection.tsx
│   ├── IntroSection.tsx
│   ├── ProjectShowcase.tsx
│   └── SkillInterests.tsx
│
├── layout/                 # Layout components (Navigation, Footer)
├── ui/                     # Reusable UI components
│   ├── Galaxy.tsx
│   ├── TypewriterEffect.tsx
│   ├── SparkleButton.tsx
│   └── ProjectCard.tsx
│
├── AiAssistantButton.tsx   # Global AI chat button
├── AiChatDialog.tsx        # AI chat interface
├── LanguageSwitcher.tsx    # i18n language switcher
└── index.ts                # Component exports
```

### Internationalization (`src/i18n/`)

```
src/i18n/
├── config.ts               # Locale configuration (en, zh)
├── dictionaries/           # Translation files
│   ├── en.json
│   └── zh.json
├── get-dictionary.ts       # Dictionary loader
└── index.ts
```

### Other Source Directories

```
src/
├── assets/                 # Images, videos, fonts
│   ├── astronaunt/
│   ├── planet/
│   ├── projects/
│   └── resume.txt
│
├── data/                   # Static data
│   ├── projects.i18n.ts
│   └── skillPlanets.i18n.ts
│
├── hooks/                  # Custom React hooks
│   ├── useClickOutside.ts
│   ├── useFocusTrap.ts
│   ├── useLocale.ts
│   ├── useScene3D.ts
│   └── useSocket.ts
│
├── lib/                    # Utilities and services
│   ├── api-service.ts
│   ├── auth-context.tsx
│   ├── auth-middleware.ts
│   ├── fonts.ts
│   ├── performance.ts
│   └── socket.ts
│
├── services/               # Business logic services
│   ├── particleService.ts
│   └── skillService.ts
│
├── store/                  # Zustand stores
│   ├── adventure-map.ts
│   └── index.ts
│
├── types/                  # TypeScript type definitions
│   ├── 3d.ts
│   ├── adventure-map.ts
│   ├── auth.ts
│   └── blog.ts
│
└── middleware.ts           # Next.js middleware (i18n routing)
```

## Public Directory (`public/`)

```
public/
├── audio/                  # Audio files
│   └── game/               # Game sound effects
├── game/                   # Game assets
│   └── assets/imgs/
├── favicon.ico
└── [image files]
```

## Key Conventions

### File Naming

- **Components**: PascalCase (e.g., `BlogEditor.tsx`, `Scene3DManager.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `useScene3D.ts`, `api-service.ts`)
- **Pages**: lowercase with hyphens (e.g., `ai-news/`, `test-i18n/`)
- **Client Components**: Suffix with `Client` (e.g., `HomePageClient.tsx`)

### Component Organization

- **Server Components**: Default in `app/[locale]/` (no "use client")
- **Client Components**: Explicitly marked with `"use client"` directive
- **Page Structure**: `page.tsx` (server) → `*PageClient.tsx` (client)

### Import Aliases

- Use `@/*` for absolute imports from `src/`
- Example: `import { Scene3DManager } from '@/components/3d'`

### Code Organization

- **Feature-based**: Group related components by feature (blog/, game/, 3d/)
- **Shared components**: Place in `components/ui/` or `components/`
- **Game logic**: Isolated in `app/[locale]/game/` with own structure
- **Tests**: Co-located in `__tests__/` directories

### Internationalization Pattern

1. Middleware detects locale from URL, cookie, or Accept-Language header
2. Routes are prefixed with locale: `/en/blog`, `/zh/blog`
3. Server components load dictionaries via `getDictionary(locale)`
4. Client components receive translations as props or use `useLocale()` hook

### State Management

- **Local state**: React useState/useReducer
- **Global state**: Zustand stores in `src/store/`
- **Game state**: Dedicated Zustand store in `game/store/gameStore.ts`
- **Auth state**: React Context in `lib/auth-context.tsx`

### 3D Component Pattern

All 3D components should:
1. Be wrapped in `Scene3DManager` for error handling
2. Use `OptimizedScene3D` for performance
3. Implement LOD when appropriate
4. Include fallback UI for WebGL failures
5. Use React.memo for expensive renders

### API Route Pattern

- Server-side API routes in `app/api/`
- RESTful naming conventions
- Dynamic routes use `[id]` or `[slug]`
- Communicate with backend via `NEXT_PUBLIC_BACKEND_URL`
