# Presentations

[Slidev](https://sli.dev) decks. Each talk lives in its own folder with a `slides.md`;
Mermaid diagrams render natively.

## Presentations

| Talk | Folder | Description |
|------|--------|-------------|
| Debezium ↔ Neo4j — Closing the CDC loop | [`debezium-neo4j/`](./debezium-neo4j/) | Bidirectional CDC between relational DBs and Neo4j (feedback session with the Neo4j team) |

## Prerequisites

- **Node.js 18+** (if you don't have it: `brew install node`)
- Install dependencies once: `npm install`

## Run (live server)

```bash
npm run dev            # opens the Debezium ↔ Neo4j deck at http://localhost:3030
```

Live reload on save. Press `?` in the browser for keyboard shortcuts; `o` for the slide overview.

## Share / publish

Export a file (send it):

```bash
npm run export         # -> exports/debezium-neo4j.pdf
```

Build a static site (host the folder anywhere — GitHub Pages, Netlify, Vercel):

```bash
npm run build          # -> dist/debezium-neo4j/  (self-contained web app, Mermaid included)
```

> PDF/PPTX export uses `playwright-chromium` (already a devDependency). On first export it may
> download a headless browser: `npx playwright install chromium`.

## Add a new presentation

1. Create a new folder, e.g. `my-talk/`, with a `slides.md` inside.
2. Add scripts to `package.json` mirroring the `*:debezium-neo4j` ones, pointing at `my-talk/slides.md`.
3. Add a row to the table above.
4. For GitHub Pages: add a build step in `.github/workflows/pages.yml` and a link in `site/index.html`.
