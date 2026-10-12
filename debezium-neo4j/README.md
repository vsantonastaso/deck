# Debezium ↔ Neo4j — Closing the CDC loop

Feedback session with the Neo4j team: bidirectional CDC between relational databases and Neo4j
via two Debezium SMTs.

- Deck: [`slides.md`](./slides.md)
- Source material:
  - Neo4j CUD Converter (relational → graph) — implemented SMT + docs in the Debezium repo
  - DDD-74 (graph → relational) — design document

## Run from the project root

```bash
npm install
npm run dev            # live server at http://localhost:3030
npm run export         # PDF -> exports/debezium-neo4j.pdf
npm run build          # static site -> dist/debezium-neo4j/
```

## Notes to fill in before presenting

- **Why Neo4j** slide: drop in the real community-poll numbers.
- **Thank you** slide: add links to the repo and DDD-74.
