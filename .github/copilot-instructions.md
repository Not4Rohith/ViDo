# GitHub Copilot Instructions for ViDo

When working in this repository:
1. Always read and follow `AGENTS.md` and `FOLDER_STRUCTURE.md`.
2. Keep code modular:
   - UI primitives: `src/components/ui/` (exported via `index.ts`).
   - Domain features: `src/features/<feature-name>/`.
   - Data & filtering logic: `src/data/`.
3. Use CSS variables defined in `src/index.css` for all colors and themes.
4. Maintain test coverage: every feature and component must have tests.
5. Verify changes with `npm run typecheck`, `npm test`, and `npm run build`.
6. Use Lucide SVG icons for all UI symbols; never add emoji or typographic glyph characters.
7. Keep the app local-first: tasks live in `localStorage` under `vido.tasks.v1`; auth, sharing, and reminders are browser-local prototypes.
8. NEVER run `git push`: The user tests and finalizes changes manually before anything is pushed.
