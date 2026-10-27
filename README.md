# Presentations

[Slidev](https://sli.dev) decks. Each talk lives in its own folder with a `slides.md`;
Mermaid diagrams render natively.

## Prerequisites

- **Node.js 18+** (if you don't have it: `brew install node`)
- Install dependencies once: `npm install`

## Run (live server)

```bash
npm run dev            # index of all decks at http://localhost:3000 
npm run dev:${deck-name}   # a single deck
```


## Share / publish

Export a file (send it):

```bash
npm run export
```

Build a static site (host the folder anywhere — GitHub Pages, Netlify, Vercel):

```bash
npm run build          # -> dist/${deck-name}/  (self-contained web app, Mermaid included)
```

> PDF/PPTX export uses `playwright-chromium` (already a devDependency). On first export it may
> download a headless browser: `npx playwright install chromium`.

## Add a new presentation

1. Create a new folder, e.g. `my-talk/`, with a `slides.md` inside.
2. Add scripts to `package.json` mirroring the `*:debezium-neo4j` ones, pointing at `my-talk/slides.md`.
3. For GitHub Pages: add a build step in `.github/workflows/pages.yml` and a link in `site/index.html`.
