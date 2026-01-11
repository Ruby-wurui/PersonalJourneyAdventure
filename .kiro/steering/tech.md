# Tech Stack

## Frontend Framework

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **pnpm** as package manager

## 3D Graphics & Game Engine

- **React Three Fiber** (@react-three/fiber) - React renderer for Three.js
- **Three.js** - Core 3D library
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/cannon** - Physics engine integration
- **@react-three/postprocessing** - Post-processing effects
- **cannon-es** - Physics simulation
- **OGL** - Lightweight WebGL library

## UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **@tailwindcss/typography** - Typography plugin
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## State Management

- **Zustand** - Lightweight state management
- **React Context** - For auth and global state

## Internationalization (i18n)

- **Custom i18n solution** with middleware
- Supported locales: `en`, `zh`
- Dictionary-based translations in `src/i18n/dictionaries/`
- Locale routing via `[locale]` dynamic segments

## AI & Computer Vision

- **@google/generative-ai** - Google Gemini AI integration
- **@openrouter/sdk** - OpenRouter API client
- **@mediapipe/hands** - Hand tracking for gesture controls

## Code & Content

- **@monaco-editor/react** - Code editor component
- **react-markdown** - Markdown rendering
- **remark-gfm** - GitHub Flavored Markdown
- **mermaid** - Diagram rendering
- **nomnoml** - UML diagram rendering

## Data Visualization

- **D3.js** - Data visualization library

## Audio

- **Howler.js** - Audio library for game sounds

## Real-time Communication

- **Socket.IO Client** - WebSocket connections

## Development Tools

- **TypeScript** - Type safety
- **ESLint** - Linting
- **Vitest** - Testing framework
- **@vitest/coverage-v8** - Code coverage
- **fast-check** - Property-based testing
- **code-inspector-plugin** - Development debugging tool

## Build & Deployment

- **PM2** - Process manager for production
- **env-cmd** - Environment variable management

## Common Commands

### Development
```bash
pnpm dev                    # Start development server (port 3000)
pnpm inspect-dev            # Start dev with code inspector enabled
```

### Building
```bash
pnpm build:prod             # Build for production using .env.production
pnpm type-check             # Run TypeScript type checking
pnpm lint                   # Run ESLint
```

### Testing
```bash
pnpm test                   # Run tests once
pnpm test:watch             # Run tests in watch mode
pnpm test:coverage          # Run tests with coverage report
```

### Production (PM2)
```bash
pnpm pm2:start              # Start production server with PM2
pnpm pm2:stop               # Stop PM2 process
pnpm pm2:restart            # Restart PM2 process
pnpm pm2:delete             # Delete PM2 process
pnpm pm2:logs               # View PM2 logs
pnpm pm2:monit              # Monitor PM2 processes
```

## Configuration Files

- **next.config.js** - Next.js configuration
  - TypeScript and ESLint errors ignored during build
  - Font optimization disabled
  - WebSocket externals configured
  - Code inspector plugin (dev only, opt-in)

- **tsconfig.json** - TypeScript configuration
  - Path alias: `@/*` maps to `./src/*`
  - Target: ES5 with DOM libraries
  - Strict mode enabled

- **tailwind.config.js** - Tailwind CSS configuration
  - Custom Morandi color palette
  - Custom animations (particle-float, typewriter, portal-spin, shake, pulse-glow, float-up)
  - Typography plugin enabled

- **ecosystem.config.js** - PM2 configuration for production deployment

## Environment Variables

Required environment variables (see `.env.example`, `.env.local`, `.env.production`):
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` - WebSocket server URL
- AI API keys for chatbot functionality

## Browser Support

- Modern browsers with WebGL support
- Automatic fallback to 2D mode when WebGL unavailable
- Mobile-optimized with reduced quality settings

## Performance Considerations

- 3D scenes use automatic LOD (Level of Detail) optimization
- Performance monitoring in development mode
- Adaptive quality based on device capabilities
- React.memo optimization for expensive components
- WebWorker for hand tracking to prevent main thread blocking
