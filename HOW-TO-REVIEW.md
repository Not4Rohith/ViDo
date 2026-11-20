# How to run and review ViDo

A short guide for reviewers. ViDo is a **local-first** task workspace: there is no
backend, no database, and no account requirement. Everything runs in the browser.

---

## 1. Prerequisites

| Requirement | Notes |
| :--- | :--- |
| **Node.js 18+** | Node 20 LTS recommended (`node -v`) |
| **npm** | Ships with Node |
| Java / Firebase | **Not required.** This branch removed the Firebase dependency. |

---

## 2. Run it locally

```bash
# clone the fork (or use the PR branch you were given)
git clone https://github.com/NAGASHREE1/ViDo-app.git
cd ViDo-app
git checkout feat/time-formats    # this PR; use feat/ui-redesign for the merged base

npm ci                            # reproducible install from package-lock.json
npm run dev                       # Vite prints the local URL
```

Open **http://localhost:5173**. If that port is busy, Vite picks the next free one
(5174, 5175, …) — use the URL it prints. Stop with `Ctrl+C`.

---

## 3. Review a pull request without cloning the fork

```bash
git clone https://github.com/vicharanashala/ViDo.git
cd ViDo
gh pr checkout 26        # GitHub CLI fetches the PR branch into your clone
npm ci && npm run dev
```

Without `gh`: `git fetch origin <branch> && git checkout <branch>`.

---

## 4. What to look at

Open `/app` and walk these routes:

| Route | Check |
| :--- | :--- |
| `/app` | Greeting, one small thing, momentum strip, today’s queue |
| `/app/today` | Due-today work, deadline work you can start now, earlier suggestions |
| `/app/upcoming` | Future work grouped by category |
| `/app/paths` and `/app/tasks/:id/path` | Steps, progress, path assistant |
| `/app/trail` | Momentum board (no points or streaks) |
| `/app/needs-attention` | Past tasks: bring one forward or leave it |
| `/app/completed`, `/app/archived` | Completion timing, restore |
| `/app/profile` | Prefix, name, email, phone, local sign-in state |
| `/style-lab` | Accent palettes and the task icon library |

**Time formats (this PR):** in quick add, type

- `Laundry at 8:30pm` → card shows `Today 8:30 PM`
- `Dentist at 8.30pm` → card shows `Today 8:30 PM`
- `Repair at 20:30` → card shows `Today 8:30 PM`

Compare with the merged build in `review-evidence/screenshots/time-formats-before-after.png`.

---

## 5. Verification

Run all three before approving:

```bash
npm run typecheck && npm test && npm run build
```

Expected on this branch: **130 tests across 35 suites**, clean build.

There is no CI on the upstream repo, so this local run **is** the review gate.

---

## 6. Things that surprise reviewers

- **Data lives in the browser.** Tasks are in `localStorage` under `vido.tasks.v1`.
  Clearing site data removes them; the seed data returns on the next load.
- **Different ports = different data.** `localhost:5173` and `localhost:5174` are
  different origins, so each instance keeps its own task list.
- **Dates are relative.** Seed tasks are generated around today, so every run looks current.
- **Custom images** are stored per browser and never uploaded.
- **Local prototypes.** Sign-in, sharing, and reminders are browser-local; no email or
  server delivery exists yet.

---

## 7. Reporting feedback

- **Code or behaviour:** comment on the pull request.
- **Design questions:** reply in the linked Discussion.
- **Bugs outside this PR:** open an issue upstream if you have write access, otherwise
  reply in the Discussion thread so it can be filed by a maintainer.

Screenshots and the route map live in [`review-evidence/`](./review-evidence/README.md).
