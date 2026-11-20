# ViDo — Product Verification Evidence

**Date:** 19 November 2026  
**Status:** Build and verification complete

---

### Verification Results

| Check | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Type Check** | `npm run typecheck` | Passed | Strict TypeScript across all modules, zero errors |
| **Unit Tests** | `npm test` | Passed | 130/130 tests across 35 test suites |
| **Production Build** | `npm run build` | Passed | Clean production bundle in `dist/` |
| **Iconography Guard** | `src/test/noEmoji.test.ts` | Passed | No emoji or text glyphs in `src/` or `index.html`; UI uses SVG icons only |
| **Accessibility** | Focus indicators & Escape key | Passed | High-contrast focus rings, Escape dismiss, dialog semantics |

---

### Iconography

All UI symbols are SVG icons from `lucide-react`; no emoji characters or typographic
glyph substitutes (bullet, arrow, triangle) are used in application UI.

Task cards render their artwork as inline Lucide SVGs through
`src/features/workspace/doodles/doodleIcons.ts`. The Twemoji-style files in
`public/doodles/` are retained for attribution only and are no longer used by default.
See `screenshots/iconography-before-after.png` for a focused before/after.

| Was | Now | Where |
| :--- | :--- | :--- |
| Text bullet | `Dot` icon | Welcome card list, Home focus meta, Style Lab nav |
| Right arrow | `ArrowRight` icon | "Break into steps", "Inspect Task" |
| Up / down arrow | `ArrowUp` / `ArrowDown` icons | Momentum trail movement log |

A regression test (`src/test/noEmoji.test.ts`) scans `src/**/*.{ts,tsx,css}` and
`index.html` for emoji and replaced glyph codepoints, and fails with a `file:line`
list if any return.

---

### Key Product Areas

1. **Public Landing Page (`/`)** — product introduction, workspace preview, and audience cards.
2. **Themes & Accent Lab (`/style-lab`)** — accent palette switcher, component tokens, image library.
3. **Sign-in (`/auth`)** — local email + one-time-code prototype; no password stored, no backend.
4. **Workspace shell (`/app`)** — persistent navigation, top bar with search/filters, quick add, system clock.
5. **Home (`/app`)** — greeting, one small thing, momentum strip, today's queue, welcome card.
6. **Today (`/app/today`)** — due-today work, deadline work you can start now, suggestions from earlier.
7. **Upcoming (`/app/upcoming`)** — future work, grouped by category.
8. **Task paths (`/app/paths`)** — tasks with steps; path assistant drafts, user approves.
9. **Momentum trail (`/app/trail`)** — gentle progress board; no points or streaks.
10. **Past (`/app/needs-attention`)** — earlier tasks; bring forward or leave.
11. **Completed (`/app/completed`)** — finished work with completion timing.
12. **Archived (`/app/archived`)** — put away, restorable.
13. **Profile (`/app/profile`)** — prefix, name, email, phone, sign-in state.
14. **Task path detail (`/app/tasks/:taskId/path`)** — steps, progress, assistant.
15. **Modals** — New task, Task details, Focus mode, Help, Check-in tray.

### Routes

| Route | Purpose |
| :--- | :--- |
| `/` | Landing page |
| `/style-lab` | Theme and image lab |
| `/auth` | Local sign-in prototype |
| `/app` | Home |
| `/app/today` | Today queue |
| `/app/upcoming` | Upcoming |
| `/app/paths` | Task paths |
| `/app/trail` | Momentum trail |
| `/app/needs-attention` | Past |
| `/app/completed` | Completed |
| `/app/archived` | Archived |
| `/app/profile` | Profile |
| `/app/tasks/:taskId/path` | Task path detail |

---

### Screenshots

Before/after captures live in `review-evidence/screenshots/`:

- `before/` — upstream `main` preview workspace (dark demo dashboard).
- Root — this branch: all routes, five modals, and mobile home/today at 390×844.

---

### How to Run Locally

```bash
npm install
npm run dev
```

- Landing: `http://localhost:5173/`
- Themes: `http://localhost:5173/style-lab`
- Workspace: `http://localhost:5173/app`
