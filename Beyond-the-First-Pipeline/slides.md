---
theme: default
title: "Beyond the First Pipeline: Scaling Data Pipelines Across Teams"
info: |
  From a handful of CDC pipelines to a self-service platform.
  How Debezium Platform helps standardise CDC adoption across teams
  and provides a consistent way to deploy, operate and observe pipelines at scale.
transition: slide-left
mdc: true
routerMode: hash
layout: cover
---

# <span class="whitespace-nowrap">Beyond the First Pipeline</span>
## Scaling Data Pipelines Across Teams


Vincenzo Santonastaso

---
layout: center
---

# About me

<div class="flex items-center justify-between gap-12 mt-4 px-16">
  <div class="text-left" style="max-width:none">
    <p class="font-bold text-xl text-gray-900 mb-3 whitespace-nowrap" style="max-width:none">Vincenzo Santonastaso</p>
    <p class="text-gray-700 leading-relaxed whitespace-nowrap" style="max-width:none">Senior Software Engineer @ IBM Java Runtimes & Integrations</p>
    <p class="text-gray-700 leading-relaxed whitespace-nowrap" style="max-width:none">Core maintainer of Debezium</p>
    <p class="text-gray-700 leading-relaxed whitespace-nowrap" style="max-width:none">Open source contributor</p>
  </div>
  <img src="./images/profile-little.jpg" alt="Vincenzo Santonastaso" class="w-44 h-44 rounded-full object-cover object-top shadow-xl ring-4 ring-white outline outline-1 outline-black/10" />
</div>

<div class="absolute bottom-10 left-12 right-12 border-t border-gray-200 pt-3 text-center text-xs opacity-55 italic">
The content of this presentation reflects my own opinions and does not represent the views of IBM.
</div>

---

# Agenda

<div class="flex flex-col mt-8 w-full max-w-xl mx-auto">
  <div class="agenda-row" style="--bar:#eab308;">Foundations</div>
  <div class="agenda-row" style="--bar:#ef4444;">The scaling problem</div>
  <div class="agenda-row" style="--bar:#22c55e;">Debezium Platform</div>
  <div class="agenda-row" style="--bar:#7c5cd8;">Demo</div>
  <div class="agenda-row" style="--bar:#5cd6d8;">Takeaways</div>
</div>


---

# Let's start from the foundations

<div class="flex justify-center mt-6">
  <img src="./images/foundations.png" alt="Building foundations under construction"
       class="rounded-xl shadow-2xl max-h-[22vh] w-auto object-cover ring-1 ring-black/10" />
</div>

<div v-click class="pills flex justify-center gap-4 mt-6 text-sm">
  <span class="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-semibold">Data pipelines</span>
  <span class="px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold">Change Data Capture</span>
  <span class="px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-semibold">Debezium</span>
</div>

<div class="flex-grow"></div>

---

# Data pipeline

**Ingest raw data from one or more sources, transform it, and load it where it's needed.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'18px','lineColor':'#94a3b8'},'flowchart':{'curve':'basis','padding':16},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  SRC[(Ingestion<br/>)]:::src --> T([Processing<br/>]):::t --> DST[(Storage<br/>)]:::dst
  classDef src fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef t fill:#f3e8ff1a,stroke:#a855f7,stroke-width:1px,color:#1f2937;
  classDef dst fill:#dcfce71a,stroke:#22c55e,stroke-width:1px,color:#1f2937;
```

<div class="flex justify-center mt-2">
<div class="card card-after text-left text-sm max-w-xl">

### Three stages
- **Ingestion**: pull from DBs, APIs, SaaS, IoT, files
- **Processing**: clean, enrich, standardize to the target format
- **Storage**: database, data lake, warehouse / lakehouse

</div>
</div>

---

# Types of data pipelines

**Three main shapes, depending on how and when data moves.**

<div class="grid grid-cols-3 gap-5 text-left mt-3 max-w-full text-sm">
<div class="card">

### 🗂️ Batch processing
- Process data in **scheduled, periodic batches**
- Best for large volumes of **historical** or non-time-sensitive data
- The classic ETL world

</div>
<div class="card">

### ⚡ Streaming
- Process data **in real-time**, as it's generated
- Enables immediate analysis and decisions

</div>
<div class="card">

### 🔗 Data integration
- Bring **many sources** together into a single view
- Clean and transform raw data before storing it centrally
- Reconciles systems that use **different formats**

</div>
</div>

<div class="card text-xs opacity-70 mt-4">
 <strong>Lambda architecture/Streamhouse:</strong> combine batch + streaming to get the strengths of both.
</div>

---

# What are they used for?

**Data pipelines are the foundation under most data projects.**

<div class="grid grid-cols-3 gap-5 text-left mt-3 max-w-full text-sm">
<div class="card">

### 📊 Analytics & BI
Feed dashboards, reports and exploratory analysis with fresh data.

</div>
<div class="card">

### 🏬 Data integration
Merge many sources into a warehouse, lake or lakehouse.

</div>
<div class="card">

### 🤖 Machine learning
Supply and refresh features for training and inference.

</div>
<div class="card">

### 🚨 Fraud & real-time
Detect anomalies and react to events as they happen.

</div>
<div class="card">

### 🔎 Data observability
Track freshness, quality and lineage across systems.

</div>
<div class="card">

### ⚡ Operational sync
Keep caches, search indexes and services up to date.

</div>
</div>

---

# Change Data Capture

**Identify and record row-level changes (inserts, updates, deletes) as they happen.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'18px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':16},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  APP([Application]):::app -- "write" --> LOG
  subgraph DB["Database"]
    direction LR
    LOG[["Transaction log"]]:::log -. "apply" .-> TBL[(Tables)]:::db
  end
  LOG -- "read" --> CDC([CDC connector]):::dbz -- "emit" --> EV([Change events]):::ev
  style DB fill:#8b5cf614,stroke:#c4b5fd,stroke-width:1px;
  classDef app fill:#f1f5f91a,stroke:#64748b,stroke-width:1px,color:#1f2937;
  classDef db fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef log fill:#fef3c71a,stroke:#f59e0b,stroke-width:1px,color:#1f2937;
  classDef dbz fill:#cffafe1a,stroke:#06b6d4,stroke-width:1px,color:#1f2937;
  classDef ev fill:#dcfce71a,stroke:#22c55e,stroke-width:1px,color:#1f2937;
```

Capture **only what changed**, not a full reload, and stream it downstream in near real-time.

---

# Why CDC, not batch reloads?

<div class="grid grid-cols-2 gap-8 text-left mt-3 max-w-full text-sm">
<div class="card">

### 🐌 Batch / full-table ETL
- Re-scans **unchanged** data every run
- Latency tied to the next scheduled window
- Compute cost grows with table size

</div>
<div class="card">

### ⚡ Change Data Capture
- Transmits **only incremental changes**
- Closes the gap between change and availability
- Low impact: reads the log, not the tables
- Enables **zero-downtime migrations & replication**

</div>
</div>

<p class="text-xs opacity-60 mt-4 mb-1">A few of the many things that freshness powers:</p>

<div class="grid grid-cols-3 gap-4 text-left max-w-full text-xs">
<div class="card">

**📊 Real-time dashboards**
Show the current state, not last night's batch.

</div>
<div class="card">

**🎯 Recommendation engines**
React to what a user *just* did, stay relevant in the moment.

</div>
<div class="card">

**⚙️ Operational analytics**
Run the business live: fraud, inventory, alerting.

</div>
</div>

<p class="text-xs opacity-50 italic mt-2">… and many more</p>

---

# How CDC is implemented

**Three common methods: Debezium uses the log-based approach.**

<div class="text-sm">

| Method | How it works | Trade-off |
|--------|--------------|-----------|
| **Query-based** | Polls by timestamp / version column | Simple, works on legacy, but can miss deletes and is costly at scale |
| **Trigger-based** | DB triggers write changes to shadow tables | Precise, custom logic, but adds write overhead |
| **Log-based**  | Reads the transaction log (binlog, WAL, redo) | Minimal source impact, captures every change in real-time, but needs log access |


</div>

<div class="mt-4 mx-auto w-fit px-4 py-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-sm font-medium">💡 Log-based CDC gives real-time capture of <strong>every</strong> operation with the least load on the database.</div>

---

# Debezium

**The de-facto open-source standard for CDC** <br/>
It streams real-time changes from databases into event-driven systems by monitoring database transaction logs

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'20px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':16},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  DB[(Source)]:::db --> DBZ([Debezium]):::dbz --> X([Destination]):::sink
  classDef db fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef dbz fill:#cffafe1a,stroke:#06b6d4,stroke-width:1px,color:#1f2937;
  classDef sink fill:#f1f5f91a,stroke:#64748b,stroke-width:1px,color:#1f2937;
```

---

# Why Debezium


<div class="grid grid-cols-2 gap-8 text-left mt-2 max-w-full text-sm">
<div class="card">

### Log-based & complete
- Reads the transaction log: **minimum load** on the source
- Captures inserts, updates & deletes **in commit order**, with before/after state
- **No application changes** required

</div>
<div class="card">

### Reliable by design
- Offsets recorded durably: a restart **resumes where it left off**
- Consumers can go down for maintenance **without missing events**
- **At-least-once delivery** is the floor, not the aspiration

</div>
<div class="card">

### Broad & unified
- Compatible with MySQL, PostgreSQL, Oracle, SQL Server, MongoDB, Db2, Cassandra, ……
- Same envelope, same semantics: **learn once, reuse everywhere**

</div>
<div class="card">

### Open & flexible
- open source community, active development, and a growing ecosystem
- Run it on Kafka Connect, Debezium Server, a K8s operator, or embedded

</div>
</div>

---

# The Debezium ecosystem

**A wide range of solutions to address CDC in different contexts.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'14px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':12,'nodeSpacing':30,'rankSpacing':150},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.ai { --s: #ec4899; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node.dbz :is(rect,path,polygon,circle,ellipse):not(.label *) { stroke-width: 2px !important; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .node.dbz .nodeLabel, .node.dbz .nodeLabel p { font-weight: 700 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart TB
  DBZ([Debezium]):::dbz
  DBZ ---- SC([Source connectors]):::src
  DBZ ---- CLI([CLI]):::src
  DBZ ---- SMT([SMT]):::log
  DBZ ---- AI([Debezium AI]):::ai
  DBZ ---- DEP([Deployment]):::t
  DBZ ---- ENG[Debezium Engine]:::run
  DBZ ---- SRV[Debezium Server]:::run
  DBZ ---- QRK[Quarkus extensions]:::run
  AI ---- PY[PyDebeziumAI]:::ai
  DEP ---- OP[Debezium Operator]:::plt
  DEP ---- PLT[Debezium Platform]:::plt
  classDef dbz fill:#cffafe33,stroke:#06b6d4,stroke-width:2px,color:#1f2937;
  classDef src fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef t fill:#f3e8ff1a,stroke:#a855f7,stroke-width:1px,color:#1f2937;
  classDef run fill:#dcfce71a,stroke:#22c55e,stroke-width:1px,color:#1f2937;
  classDef log fill:#fef3c71a,stroke:#f59e0b,stroke-width:1px,color:#1f2937;
  classDef ai fill:#fce7f31a,stroke:#ec4899,stroke-width:1px,color:#1f2937;
  classDef plt fill:#cffafe1a,stroke:#06b6d4,stroke-width:1px,color:#1f2937;
```

---

# Ways to run Debezium

**The same connectors, three operational models.**

<div class="grid grid-cols-3 gap-5 text-left mt-4 max-w-full text-sm">
<div class="card">

### 🔌 Kafka Connect
- Runs connectors on a **Kafka Connect** cluster
- Streams change events to **Kafka topics**
- The classic, battle-tested setup

</div>
<div class="card">

### 📦 Debezium Server
- Lightweight **standalone** runtime, no Kafka Connect
- Sends events straight to a sink (Kinesis, Pulsar, Redis, HTTP, …)
- Great when you **don't want Kafka**

</div>
<div class="card">

### 🚀 Debezium Platform
- **Self-service** experience on top of Debezium Server
- Build, deploy & operate pipelines from one place
- Operator-managed on Kubernetes
- Built for **scale across teams**

</div>
</div>

---

# One pipeline, a lot to know

**Shipping a single pipeline means understanding the whole stack.**

<div class="grid grid-cols-3 gap-4 text-left mt-4 max-w-full text-sm">
<div class="card">

### 🔄 CDC concepts
Snapshots, offsets, schema changes, delivery guarantees

</div>
<div class="card">

### 🛢️ Database setup
WAL / binlog, replication slots, users & privileges

</div>
<div class="card">

### 🧩 Debezium
Connectors, SMTs, converters, serialization

</div>
<div class="card">

### ⚙️ Connector config
Dozens of properties to choose and tune correctly

</div>
<div class="card">

### 🚀 Deployment
Kafka Connect/Server/Kubernetes, scaling, infrastructure

</div>
<div class="card">

### 📈 Operations
Monitoring, failures, restarts, upgrades.

</div>
</div>

<div class="text-sm opacity-80 mt-4">Expecting <strong>every team</strong> to master all of this just to move their data doesn't scale.</div>

---

# Delegate it to the platform team

**Don't spread this expertise everywhere but centralize it.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'16px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':14},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  T1([Team A]):::team --> P
  T2([Team B]):::team --> P
  T3([Team C]):::team --> P
  P(["Platform team<br/>owns CDC · DB · Debezium · connectors · ops"]):::pipe
  classDef team fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef pipe fill:#cffafe1a,stroke:#06b6d4,stroke-width:2px,color:#1f2937;
```

Teams just ask for a pipeline and the platform team handles the hard parts. **Sensible… at first.**

---

# The problem is no longer CDC

**It's everything *around* every new pipeline.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'16px','lineColor':'#d93025'},'flowchart':{'curve':'basis','padding':14},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  T1([Team A]):::team --> P
  T2([Team B]):::team --> P
  T3([Team C]):::team --> P
  T4([Team D]):::team --> P
  P{{"Platform team<br/>(bottleneck)"}}:::bottle
  P --> W["review configs · deploy connectors<br/>troubleshoot · monitor · tickets"]:::work
  classDef team fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef bottle fill:#fee2e21a,stroke:#ef4444,stroke-width:1px,color:#1f2937;
  classDef work fill:#fef3c71a,stroke:#f59e0b,stroke-width:1px,color:#1f2937;
```

Every pipeline flows through one team, and that team becomes the bottleneck.

---

# Debezium Platform: an abstraction

**Reusable building blocks instead of raw connector configs.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'18px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':16},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  S[(Source)]:::src --> P
  TR([Transform]):::t --> P
  D[(Destination)]:::dst --> P
  P(["Pipeline"]):::pipe
  classDef src fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef t fill:#f3e8ff1a,stroke:#a855f7,stroke-width:1px,color:#1f2937;
  classDef dst fill:#dcfce71a,stroke:#22c55e,stroke-width:1px,color:#1f2937;
  classDef pipe fill:#cffafe1a,stroke:#06b6d4,stroke-width:1px,color:#1f2937;
```

Define a **source**, a **destination**, a **transform** once, then compose them into **pipelines**.

---

# A self-service experience

**The platform team sets guardrails; data engineers move on their own.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'17px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':16},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  DE([Data engineers]):::user == "create & manage<br/>pipelines" ==> PLT
  PLT["Debezium Platform"]:::plt
  PLT -- "deploy · operate<br/>monitor · observe" --> RUN[(Running pipelines)]:::run
  PT([Platform team]):::team -. "guardrails &<br/>building blocks" .-> PLT
  classDef user fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef plt fill:#cffafe1a,stroke:#06b6d4,stroke-width:1px,color:#1f2937;
  classDef run fill:#dcfce71a,stroke:#22c55e,stroke-width:1px,color:#1f2937;
  classDef team fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
```

Engineers self-serve, and the platform does the heavy lifting.

---

# Lifecycle & observability in one place

**Create, deploy, watch health, and troubleshoot: all from the same console.**

<div class="grid grid-cols-2 gap-8 text-left mt-2 max-w-full text-sm">
<div class="card">

### Managed lifecycle
- Create and edit pipelines in the UI or with the CLI
- The platform deploys and runs the connectors
- Start, stop, and update without touching infrastructure

</div>
<div class="card">

### Built-in observability
- Health and status for every pipeline
- Metrics and signals surfaced per team
- One place to spot and troubleshoot issues

</div>
</div>

---

# Demo: one database, three teams

**One PostgreSQL `inventory` DB: three self-service pipelines, three needs.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'15px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':14, 'nodeSpacing':80,'rankSpacing':120},'themeCSS':'svg { max-width: 100% !important; width: 100% !important; } @keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  DB[(PostgreSQL<br/>inventory)]:::src --> PL
  PL(["Debezium Platform"]):::plt
  PL --> A([Analytics<br/> Warehouse DB]):::dst
  PL --> B([Integration<br/>Webhook]):::dst
  PL --> C([Cache<br/>Redis]):::dst
  classDef src fill:#e0f2fe1a,stroke:#0ea5e9,stroke-width:1px,color:#1f2937;
  classDef plt fill:#cffafe1a,stroke:#06b6d4,stroke-width:1px,color:#1f2937;
  classDef dst fill:#dcfce71a,stroke:#22c55e,stroke-width:1px,color:#1f2937;
```

---

# Demo: under the hood

**The platform owns deploy, operate and observe: one Debezium Server per pipeline, no Kafka.**

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Inter, Helvetica, Arial','fontSize':'14px','lineColor':'#9aa0a6'},'flowchart':{'curve':'basis','padding':12},'themeCSS':'@keyframes dbzflow { to { stroke-dashoffset: -7; } } .edgePaths path, .flowchart-link { stroke-dasharray: 1.5 5.5 !important; stroke-linecap: round; stroke-width: 1.5px !important; animation: dbzflow 0.6s linear infinite; } .node.src, .node.db, .node.team, .node.user { --s: #0ea5e9; } .node.t { --s: #a855f7; } .node.dst, .node.ev, .node.run { --s: #22c55e; } .node.app, .node.sink, .node.free, .node.ops { --s: #64748b; } .node.log, .node.need, .node.work, .node.obs { --s: #f59e0b; } .node.dbz, .node.plt, .node.pipe { --s: #06b6d4; } .node.bottle { --s: #ef4444; } .node rect { rx: 10px; ry: 10px; } .node :is(rect,path,polygon,circle,ellipse):not(.label *) { filter: drop-shadow(0 0 2.5px var(--s, #06b6d4)); } .node .label, .node .label * { filter: none !important; text-shadow: none !important; } .nodeLabel, .nodeLabel p { font-weight: 400 !important; text-shadow: none !important; color: #1f2937 !important; } .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #fafafa !important; color: #475569 !important; }'}}%%
flowchart LR
  UI["Stage UI"]:::plt --> CO
  CO(["Conductor<br/>control plane · REST API"]):::plt --> OP
  OP(["Operator"]):::plt == "deploys 1 pod<br/>per pipeline" ==> DS["Debezium Server<br/>× 3 (native consumers)"]:::run
  DS -. "metrics" .-> OBS["OTel → Prometheus"]:::obs
  OBS -. "panels" .-> CO
  classDef plt fill:#cffafe1a,stroke:#06b6d4,stroke-width:1px,color:#1f2937;
  classDef run fill:#dcfce71a,stroke:#22c55e,stroke-width:1px,color:#1f2937;
  classDef obs fill:#fef3c71a,stroke:#f59e0b,stroke-width:1px,color:#1f2937;
```

---

<div class="h-14"></div>

# Key takeaways

<div class="flex flex-col gap-3 text-left mt-4 max-w-4xl mx-auto text-sm">
<div class="card">

### 🏗️ Pipelines & CDC are the basics
Whenever data matters to a project, it has to move reliably and in real time. Data pipelines, powered by change data capture, are the foundation every data initiative is built on.

</div>
<div class="card">

### 🏆 Debezium leads CDC
Debezium is the reference for CDC: one solution that fits every context, many databases, many sinks, and multiple deployment models for any infrastructure and need.

</div>
<div class="card">

### 🚀 Self-service is the key to scale
A self-service platform experience lets teams build and run their own pipelines by removing the platform-engineering bottleneck and letting CDC scale across the whole organisation.

</div>
</div>

---
layout: center
---

# Thank you

**Beyond the First Pipeline**

<div class="grid grid-cols-2 gap-10 mt-10 max-w-4xl mx-auto text-left text-sm">

<div>
<div class="opacity-60 mb-3 uppercase tracking-wide text-xs">Let's connect</div>
<div class="flex flex-col items-start gap-2.5">
  <a href="https://vsantona.me/" target="_blank" class="flex items-center gap-3 no-underline !border-none text-gray-700 hover:text-gray-900 transition"><span class="i-carbon-link inline-block w-5 h-5"></span> vsantona.me</a>
  <a href="https://github.com/vsantonastaso" target="_blank" class="flex items-center gap-3 no-underline !border-none text-gray-700 hover:text-gray-900 transition"><span class="i-carbon-logo-github inline-block w-5 h-5"></span> github.com/vsantonastaso</a>
  <a href="https://www.linkedin.com/in/vincenzo-santonastaso-549945b1/" target="_blank" class="flex items-center gap-3 no-underline !border-none text-gray-700 hover:text-gray-900 transition"><span class="i-carbon-logo-linkedin inline-block w-5 h-5"></span> linkedin.com/in/vincenzo-santonastaso</a>
  <a href="https://discordapp.com/users/1507397497671123004" target="_blank" class="flex items-center gap-3 no-underline !border-none text-gray-700 hover:text-gray-900 transition"><span class="i-carbon-logo-discord inline-block w-5 h-5"></span> @vsantonastaso</a>
  <a href="mailto:vsantonastaso.dev@gmail.com" class="flex items-center gap-3 no-underline !border-none text-gray-700 hover:text-gray-900 transition"><span class="i-carbon-email inline-block w-5 h-5"></span> vsantonastaso.dev@gmail.com</a>
</div>
</div>

<div>
<div class="opacity-60 mb-3 uppercase tracking-wide text-xs">Resources</div>
<div class="flex flex-col items-start gap-2.5">
  <a href="https://debezium.io" target="_blank" class="flex items-center gap-3 no-underline !border-none text-gray-700 hover:text-gray-900 transition"><span class="i-carbon-earth inline-block w-5 h-5"></span> debezium.io</a>
  <a href="https://github.com/vsantonastaso/debezium-platform-demo" target="_blank" class="flex items-center gap-3 no-underline !border-none text-gray-700 hover:text-gray-900 transition"><span class="i-carbon-logo-github inline-block w-5 h-5"></span> github.com/vsantonastaso/debezium-platform-demo</a>
</div>
</div>

</div>
