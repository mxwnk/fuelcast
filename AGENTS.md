# FuelCast - Agent Instructions

## Project Overview

FuelCast is a client-side endurance sports fueling calculator for triathlon, cycling, and running. It computes hourly carbohydrate breakdown, gel/drink cadence, DIY bottle recipes, and shopping lists based on user inputs. All state is URL-serializable for sharing. No backend.

## Tech Stack

- **Language:** TypeScript 6.0 (strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`)
- **UI:** React 19 (function components, no class components)
- **Build:** Vite 8 with `@vitejs/plugin-react`
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config` file)
- **Icons:** lucide-react
- **Linter:** OxLint (not ESLint)
- **Tests:** Vitest
- **PWA:** vite-plugin-pwa (Workbox, auto-update)
- **Deployment:** GitHub Pages at `/fuelcast/`

No router, no state management library, no CSS-in-JS, no component library.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` (runs `tsc -b && vite build`) |
| Lint | `npm run lint` |
| Test | `npm test` |
| Preview | `npm run preview` |

## Project Structure

```
src/
├── components/          # React components (PascalCase.tsx)
│   └── results/         # Result display components
├── hooks/               # Custom hooks (useCamelCase.ts)
├── lib/                 # Pure logic, types, constants, i18n (camelCase.ts)
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles, Tailwind theme, CSS custom properties
```

- **No barrel files** -- always use direct imports
- **Tests co-located** with source as `*.test.ts` in `src/lib/`
- **No path aliases** -- use relative imports (`../lib/fueling`)

## Code Conventions

### Components

- Named exports for all components (`export function ComponentName`)
- Props defined via `interface ComponentNameProps` above the component
- No `React.FC` -- plain function signatures with destructured props
- Local helper components in the same file when tightly coupled
- Conditional classes via template literals with ternaries (no `clsx`)

### State Management

- Local `useState` in `App`, passed down via props (no context for state)
- Patch pattern: `patch(partial)` merges into state with spread operator
- Derived data via `useMemo` calling pure computation functions
- State hooks return plain objects, not arrays
- All state is URL-serializable

### Types

- `import type { ... }` for type-only imports (enforced by `verbatimModuleSyntax`)
- String literal unions for enums: `type Sport = 'triathlon' | 'cycling' | 'running'`
- `PascalCase` for types/interfaces, `UPPER_SNAKE_CASE` for constants
- No `any` types -- use `unknown` and narrow

### Styling

- Tailwind utility-first with semantic color tokens: `text-ink`, `bg-surface`, `border-line`, `text-accent`
- Dark mode via `.dark` class on `<html>` (custom variant, not media query)
- CSS custom properties define the design system in `src/index.css`
- Custom utility classes: `.head`, `.data`, `.tick-label`, `.fc-slider`, `.fc-num`
- Fonts: Archivo Variable (display), JetBrains Mono Variable (data)

### i18n

- Two languages: `en` and `de`
- Inline dictionary in `src/lib/i18n.tsx`
- `useI18n()` hook provides `t(key, params?)` function
- All user-facing strings must be in the dictionary
- Source code (variables, comments, function names) is always in English

### Testing

- Pure function tests only (no component/DOM tests)
- `describe`/`it`/`expect` from Vitest
- Descriptive test names explaining expected behavior
- Factory functions for base input objects
- `toBeCloseTo` for floating-point comparisons

## Import Order

1. External packages (`react`, `lucide-react`)
2. Internal library modules (`../lib/fueling`, `../lib/i18n`)
3. Internal components (`./Section`, `./Slider`)

Type imports separate from value imports:
```typescript
import type { LegInput, PlanConfig } from '../lib/fueling'
import { computePlan, DEFAULT_CONFIG } from '../lib/fueling'
```

## Git Conventions

- Conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`, `copy`
- Scope examples: `gear`, `auth`, `api`, `cart`
- English commit messages, concise subject line
