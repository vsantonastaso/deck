// Starts every deck's Slidev dev server and serves an index page listing them all.
// Usage: npm run dev   (index at http://localhost:3000)
import { spawn, exec } from 'node:child_process'
import { createServer } from 'node:http'

const INDEX_PORT = 3000
const decks = [
  { dir: 'debezium-neo4j', title: 'Debezium ↔ Neo4j: Closing the CDC loop', desc: 'Bidirectional CDC between relational DBs and Neo4j', port: 3030 },
  { dir: 'debezium-3.6', title: 'Debezium 3.6: New features and breaking changes', desc: "What's new in Red Hat build of Debezium 3.6.3", port: 3031 },
  { dir: 'Beyond-the-First-Pipeline', title: 'Beyond the First Pipeline: Scaling Data Pipelines Across Teams', desc: 'CDC as a self-service platform with Debezium Platform', port: 3032 },
]

const children = decks.map((d) =>
  spawn('npx', ['slidev', `${d.dir}/slides.md`, '--port', String(d.port)], { stdio: 'inherit' }),
)

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Presentations</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 4rem auto; padding: 0 1rem; color: #222; }
  ul { list-style: none; padding: 0; }
  li { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 1rem; }
  a { display: block; padding: 1rem 1.25rem; text-decoration: none; color: inherit; }
  a:hover { background: #f5f5f5; border-radius: 8px; }
  strong { display: block; font-size: 1.1rem; color: #0a58ca; }
  span { color: #555; font-size: .95rem; }
</style></head><body>
<h1>Presentations <small style="font-size:.5em;color:#888">(dev)</small></h1>
<ul>
${decks.map((d) => `<li><a href="http://localhost:${d.port}/"><strong>${d.title}</strong><span>${d.desc}</span></a></li>`).join('\n')}
</ul></body></html>`

const server = createServer((_, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(html)
}).listen(INDEX_PORT, () => {
  const url = `http://localhost:${INDEX_PORT}/`
  console.log(`\nIndex: ${url}`)
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open'
  exec(`${opener} ${url}`)
})

const shutdown = () => {
  server.close()
  children.forEach((c) => c.kill())
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
