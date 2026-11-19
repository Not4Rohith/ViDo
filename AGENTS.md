# AGENTS.md — Instructions for AI Coding Agents & LLMs

> **MANDATORY INSTRUCTION FOR ALL AI MODELS & AGENTS:**
> If you are an AI assistant (Google Antigravity, Cursor, Claude Code, GitHub Copilot, Windsurf, Aider, OpenAI Codex, or similar) operating in this repository, you **MUST** read and adhere to this file and [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) before writing, modifying, or creating any files.

---

## 1. Required Reading Order

Before proposing changes, creating files, or editing code, read these documents in order:

1. **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** — Architectural layout and file placement rules.
2. **[context.md](./context.md)** — Product direction, constraints, and task model.
3. **[README.md](./README.md)** — Public overview, routes, and setup.
4. **[review-evidence/README.md](./review-evidence/README.md)** — Current verification evidence and route map.
5. **[MILESTONES.md](./MILESTONES.md)** — Historical roadmap; do not treat it as current scope.

---

## 2. Strict File Placement Invariants

You must strictly maintain the directory structure documented in `FOLDER_STRUCTURE.md`:

- **UI Primitives**: Place generic, domain-agnostic components (Buttons, Cards, Badges, Inputs, Modals) in `src/components/ui/` and export them in `src/components/ui/index.ts`. Never import domain models (`Task`, `Checkpoint`, `User`) into `src/components/ui/`.
- **Feature Code**: Group product functionality into feature slices under `src/features/<feature-name>/`:
  - `src/features/landing/` — Public marketing page (`/`).
  - `src/features/workspace/` — Working task workspace (`/app`).
  - `src/features/style-lab/` — Theme and palette lab (`/style-lab`).
- **Data & Pure Logic**: Place data models, types, sample fixtures, and pure filtering/calculation functions in `src/data/`.
- **Tests**: Colocate tests alongside the files they verify (e.g., `TaskRow.tsx` -> `TaskRow.test.tsx` or `src/features/workspace/WorkspaceViewsAndModals.test.tsx`).
- **Never create loose folders in the project root**: Root is strictly for configuration files and top-level documentation markdown.
- **Never dump ad-hoc files in `src/`**: Only `App.tsx`, `main.tsx`, `index.css`, and `vite-env.d.ts` belong directly in `src/`.

---

## 3. Product Presentation Rules

- **Product, Not a School Project**: ViDo is presented as a high-end, distraction-free product. **Never** include references to "Milestone 1", "Milestone 2", "Student Project", "Homework", or "Review Gates" in any user-facing UI text.
- **Workspace Route**: The working app is hosted at `/app/*` with subroutes (`/app/today`, `/app/upcoming`, `/app/paths`, `/app/trail`, `/app/profile`, `/app/needs-attention`, `/app/completed`, `/app/archived`, `/app/tasks/:taskId/path`). Legacy `/preview/*` and `/workspace/*` links redirect to `/app/*`.
- **No Demo Framing**: There is no demo banner, "Demo User", preview badge, or fixed benchmark date. The workspace is a real local-first app.
- **Local-First Identity**: Tasks are stored in `localStorage` under `vido.tasks.v1`. No account is required.
- **Real Dates**: Views are calculated from the current date. Seed data is generated relative to today by `createSeedTasks()`.
- **Progress Is Real**: Tasks carry `progress` (0–100) and a checkpoint timeline. The pace-vs-deadline signal is part of the product, not decoration.
- **Gentle Language**: Standard view names are primary, grouped as Main, Plan, and History. Warm copy belongs in page content. Avoid pressure counts, red progress bars, and accountability language.
- **Iconography**: Use SVG icons from `lucide-react` for every symbol. No emoji characters and no typographic glyph substitutes (bullet, arrow, triangle) in UI. A regression test guards this.

---

## 4. Design & Styling Conventions

- **Tailwind CSS v4**: Use utility classes with CSS custom properties.
- **Theme Variables**: Always use the defined CSS variables rather than hardcoded hex colors:
  - `var(--accent)` & `var(--accent-soft)` for primary accents.
  - `var(--surface)` for card and component backgrounds.
  - `var(--canvas)` for main page background.
  - `var(--ink)`, `var(--muted)`, and `var(--faint)` for text hierarchy.
  - `var(--line)` for borders and dividers.
- **Desktop-First & Light Theme First**: Maintain clean, generous whitespace, sharp borders, and high contrast.
- **Boards, not tables**: Task and step collections use a disciplined two-column card grid.

---

## 5. Verification Commands (Mandatory Before Ending Turns)

Before concluding any task or turn, every agent **MUST** run and pass all three verification checks:

```bash
# 1. Typecheck: Must exit with 0 errors
npm run typecheck

# 2. Test Suite: All tests must pass (never disable or delete failing tests)
npm test

# 3. Production Build: Must compile cleanly without errors
npm run build
```

---

## 6. Common Agent Traps to Avoid

1. ❌ **Do not bypass `FOLDER_STRUCTURE.md`** by creating temporary or duplicate utility folders.
2. ❌ **Do not remove or weaken existing tests** to make a command pass.
3. ❌ **Do not commit secrets, environment variables, or build folders** (`.env`, `dist/`, `node_modules/`).
4. ❌ **Do not push code to remote repositories (`git push`)** unless the user explicitly requests a push.
5. ❌ **Do not hardcode Windows backslashes** in markdown links; always format file links with forward slashes.
6. ❌ **Do not remove task titles in favour of image-only labels.** Images are anchors, not the only meaning.
7. ❌ **Do not add unlicensed images.** Every asset needs a known license and a credit entry.
8. ❌ **Do not reintroduce emoji glyphs.** Use Lucide icons and keep `src/test/noEmoji.test.ts` passing.
