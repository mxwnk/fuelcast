# FuelCast ⚡

A fueling calculator for endurance sports — triathlon, cycling and running.
Dial in your race duration, hourly carb target and glucose:fructose ratio, and
get a complete race-day fueling plan: hourly sugar breakdown, product
suggestions, a DIY bottle-mix recipe and a minute-by-minute intake timeline.

Fully client-side, stateless, deployable as a static site.

FuelCast is deliberately simple: no account, no subscription, no AI coach,
no data storage — a race plan in 30 seconds, entirely on your device.

## Features

**Simple mode (default)** — three inputs and you're done:

- **Sport selection** — Triathlon / Cycling / Running
- **Race presets** — one tap fills typical durations (Sprint/Olympic/70.3/
  Ironman, Fondo, Marathon, …)
- **Race duration** — 30 min to 12 h, 15-min steps (slider + numeric input)
- **Carb target** — 30–120 g/h with 60 / 90 / 120 g presets

**Advanced options (opt-in)** for athletes who want to dial it in:
- **Triathlon mode** — per-discipline planning: swim duration (no intake),
  separate duration + carb targets for bike and run, per-leg results,
  recipes and timeline
- **Glucose:fructose ratio** — 2:1, 1:0.8, 1:1 presets or a custom ratio
- **Fuel source switch** — gels + drink mix, gels only (plain water bottle,
  no powder needed), or 100% DIY bottle mix (with a concentration warning
  for very strong mixes)
- **Hydration & sodium** — cool/mild/hot conditions scale fluid (500–1000
  ml/h) and sodium (400–900 mg/h); the DIY recipe shows exact salt grams
- **Your gear** — configurable gel size (25/30/40 g) and bottle size
  (500/750/950 ml); all counts, recipes and timelines adapt

**Output & sharing:**
- **Results** — per-hour glucose/fructose split, race totals, shop-bought
  product combo (gels + drink mix) and a DIY maltodextrin/fructose recipe
- **Race timeline** — repeating hourly intake pattern plus a full-race strip
- **Export** — download the plan as a PNG or copy a shareable URL
  (all state lives in query params: `?s=cycling&d=240&c=90&r=1:0.8`)
- **Dark / light mode** — follows the system preference, manual toggle persists
- **English & German** — language switcher in the header, defaults to the
  browser language; the language is part of the URL (`/en/…`, `/de/…`)
- **Routing** — every page has its own URL (`/de/science`, `/en/imprint`)
  via react-router; deep links work on GitHub Pages through a 404.html
  fallback
- **PWA** — installable to the home screen and fully offline-capable
  (all assets precached via service worker)

## Tech stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `html-to-image` for PNG export, `lucide-react` icons
- Self-hosted fonts: Archivo Variable (width axis) + JetBrains Mono Variable

## Development

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally (service worker active)
npm run icons     # regenerate PWA icons from the bolt mark
```

## Deployment

`npm run build` produces a static `dist/` folder — host it anywhere
(Netlify, Vercel, GitHub Pages, S3, …). No server or environment
configuration required.

## Assumptions baked into the plan

- 1 gel ≈ 25 g carbs, 1 bottle = 750 ml, maltodextrin counts as glucose
- Glucose absorption is capped around 60 g/h — the app warns when a plan
  exceeds it and suggests shifting toward a 1:0.8 ratio
- FuelCast is a planning aid, not medical or nutritional advice — always
  rehearse race fueling in training
