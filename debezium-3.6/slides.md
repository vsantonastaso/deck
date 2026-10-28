---
theme: default
title: Debezium 3.6 · New features and breaking changes
info: |
  What's new in Red Hat build of Debezium 3.6.3: breaking changes,
  GA features, Technology Preview, Developer Preview, deprecations and fixes.
transition: slide-left
mdc: true
routerMode: hash
layout: cover
---

# Debezium 3.6
## New features and breaking changes

Red Hat build of Debezium 3.6.3

Vincenzo Santonastaso

---

# Agenda

<div class="grid grid-cols-2 gap-x-12 text-left mt-4 max-w-full">
<div>

1. Breaking changes
2. Core
3. Db2 · Informix
4. JDBC sink
5. MariaDB / MySQL
6. Oracle

</div>
<div>

7. PostgreSQL
8. SQL Server
9. Promoted to GA
10. Technology Preview
11. Developer Preview
12. Deprecations · Known problems · Fixes

</div>
</div>

---

# Breaking changes at a glance

<div class="text-sm">

| Connector | Change | Action before upgrading |
|-----------|--------|-------------------------|
| MariaDB / MySQL | `snapshot.mode=never` removed | Pick a supported snapshot mode |
| MongoDB | Schema names for collections starting with digits | Check consumers and schema registry |
| Oracle | `redo_log_catalog` mining strategy deprecated | Plan move to `online_catalog` or `hybrid` |
| PostgreSQL | Enum values follow PostgreSQL-defined order | Check schema registry and consumers |
| SQL Server | Unchanged large columns emit a placeholder | Test consumers that expect `NULL` |

</div>

---

# Breaking changes: MariaDB / MySQL · MongoDB

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

### MariaDB / MySQL
**`snapshot.mode=never` no longer supported**

* Deprecated in Debezium 3.0, removed now
* The connector fails to start with a configuration error
* Replace it with a supported snapshot mode **before** upgrading

<span class="text-xs opacity-60">dbz#1832</span>

</div>
<div>

### MongoDB
**Schema names change for collections starting with digits**

* Applies when `field.name.adjustment.mode` is `avro` or `avro_unicode`
* Before: names like `10019_AutoState` could trigger Avro `SchemaParseException`
* Now each name segment is adjusted individually
* Review consumers and schema-registry entries using affected names

<span class="text-xs opacity-60">dbz#305</span>

</div>
</div>

---

# Breaking changes: Oracle

<div class="text-left mt-4 max-w-full text-sm">

**`redo_log_catalog` mining strategy deprecated**

* Deprecated in Debezium 3.6.3 and scheduled for removal in a future major release
* Existing deployments continue to work, but migration planning should start now
* Recommended alternatives: `online_catalog` or `hybrid`
* Review Oracle connector configurations and validate the target strategy before upgrading
* Future releases will remove support for `redo_log_catalog`

<span class="text-xs opacity-60">dbz#1693</span>

</div>

---

# Breaking changes: PostgreSQL · SQL Server

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

### PostgreSQL
**Enum values ordering**

* Enum values are returned in the order defined by PostgreSQL, not the internal storage order
* Emitted schemas can change order after upgrade
* Prevents Avro schema mismatches when connectors capture the same enum type on a shared topic
* Review schema registry definitions and downstream apps

<span class="text-xs opacity-60">dbz#1331</span>

</div>
<div>

### SQL Server
**Unavailable-value placeholders for large columns**

* Update events on `VARBINARY(MAX)`, `VARCHAR(MAX)`, `NVARCHAR(MAX)`
* Unchanged values now emit `unavailable.value.placeholder` instead of `NULL`
* Consumers can tell *explicit NULL* from *unchanged*
* Consistent with PostgreSQL TOAST and Oracle BLOB/CLOB handling

<span class="text-xs opacity-60">dbz#1164</span>

</div>
</div>

---
layout: center
---

# Core

## GA features available in all connectors

---

# Core: observability and validation

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Unchanged events skipped metric**
* New streaming metric `NumberOfUnchangedEventsSkipped`
* Counts events skipped when `skip.messages.without.change=true`

<span class="text-xs opacity-60">dbz#1026</span>

**Quantile metrics**
* Available across **all** connectors
* Currently report quantiles for **latency to the source** only

<span class="text-xs opacity-60">dbz#1417</span>

</div>
<div>

**Improved transformation validation**
* Invalid enum values in SMT configs are rejected at connector validation
* Before: errors only after tasks started

<span class="text-xs opacity-60">dbz#1382</span>

</div>
</div>

---

# Core: heartbeat and incremental snapshots

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Configurable heartbeat topic name**
* New property `topic.heartbeat.name`
* Multiple connectors can publish heartbeats to a **shared topic**
* No custom `TopicNamingStrategy` or `RegexRouter` needed
* Default stays `<topic.heartbeat.prefix>.<topic.prefix>`

<span class="text-xs opacity-60">dbz#1709</span>

</div>
<div>

**Better recovery from incremental snapshot init failures**
* Before: invalid parameters (e.g. wrong surrogate key column) could leave metadata in offsets, and stop-snapshot signals could not clear it
* Now: invalid metadata is not persisted and the state is reliably cleared

<span class="text-xs opacity-60">dbz#1533</span>

</div>
</div>

---

# Connectors specific features

## GA features available in connectors

---

# Db2 · Informix

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

### Db2
**Max timespan for change query**
* New `streaming.query.timespan.seconds`
* Limits the time range of each streaming query to avoid termination on busy databases with resource limits
* Default `0` = no limit; `120` is a typical starting value; `1` not supported

<span class="text-xs opacity-60">dbz#1466</span>

</div>
<div>

### Informix
* **Empty transaction metadata events omitted** by default. Set `cdc.return.empty.transactions=true` for the old behavior (dbz#1587)
* **JDBC driver v15**: supports Informix 12, 14 and 15 (dbz#1622)
* **Unsupported `BYTE` / `TEXT` columns** are replaced with `unavailable.value.placeholder`, no need to exclude them (dbz#1766)

</div>
</div>

---

# JDBC sink: PostgreSQL UNNEST

**Write many rows with a single SQL statement**

* Enable with `dialect.postgres.unnest.insert.enabled`
* Improves insert and upsert throughput

<div class="text-sm">

**Limitations**
* Updates and deletes still use the standard batching
* PostgreSQL limit of 65,535 parameters per statement
* All rows in a batch must share the same schema

</div>

<span class="text-xs opacity-60">dbz#1525</span>

---

# MariaDB / MySQL

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Zero-date values no longer cause failures**
* Values such as `0000-07-15` used to raise an invalid date/time exception in the binlog client and block subsequent events
* Now processed without error and emitted as `null` by default
* Optional replacement values:
  * `zero.date.fallback.value`
  * `zero.date.fallback.value.date`
  * `zero.date.fallback.value.datetime`
  * `zero.date.fallback.value.timestamp`
* Type-specific value wins over the generic one
* Before: `NOT NULL` columns were coerced to `1970-01-01`

<span class="text-xs opacity-60">dbz#1499 · dbz#1912</span>

</div>
<div>

**GTID tags support (MySQL)**
* Supports tagged GTIDs introduced in **MySQL 8.3**
* Format `<serverID>:<tag>:<TxID>`

<span class="text-xs opacity-60">dbz#1200</span>

</div>
</div>

---

# Oracle: performance and memory

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Incremental snapshots with ROWID**
* Chunks identified by `ROWID` instead of primary key indexes
* Faster on very large tables, especially with composite PKs

<span class="text-xs opacity-60">dbz#1108</span>

**Memory footprint reduced**
* Much lower overhead for buffered transactions, noticeable with large transactions
* `log.mining.buffer.track.rs_id=false` to save more (if `source.rs_id` is not needed)

<span class="text-xs opacity-60">dbz#1425</span>

**Deferred transaction creation until first DML**
* Only transactions with DML are tracked
* `user_name` and `client_id` still preserved

<span class="text-xs opacity-60">dbz#2046</span>

</div>
<div>

**Optional removal of non-critical LogMiner columns**
* Exclude `CLIENT_ID`, `USERNAME`, `COMMIT_TIMESTAMP`, `START_TIMESTAMP`
* Better query performance, lower memory

<span class="text-xs opacity-60">dbz#1663</span>

**LogMiner mining window improvements**
* Window selected by **log file count and size**, not SCN ranges
* New `log.mining.log.count.min` and `log.mining.log.count.growth.max` (`hybrid`, `online_catalog`)
* **Upgrade:** remove `log.mining.batch.size.*`, `log.mining.sleep.time.*`, `log.mining.scn.gap.detection.*`, they are no longer recognized
<span class="text-xs opacity-60">dbz#1713</span>

</div>
</div>

---

# Oracle: resilience and compatibility

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Dynamic archive destination support**
* `archive.destination.name` accepts a **comma-separated list**
* Logs from all destinations are merged and deduplicated by redo thread and sequence number; first listed wins
* Primary → standby failover can resume streaming **without a snapshot**, if no archive log data was lost

<span class="text-xs opacity-60">dbz#1246</span>

**Oracle 26ai compatibility**
* Tested against Oracle 23.26.0.0, fully runtime compatible
* Not supported: `BOOLEAN`, Property Graphs, `Vector`

<span class="text-xs opacity-60">dbz#1649</span>

</div>
<div>

**PRIVATE redo threads in Oracle RAC**
* Archived logs for threads not in the current `RedoThreadState` are ignored
* Less archive log processing, fewer lookup failures

<span class="text-xs opacity-60">dbz#2049</span>

<div class="mt-3 p-3 border border-red-700 rounded">

**Warning:** reusing a redo thread after it changes from `PUBLIC` to `PRIVATE` is not supported. If it is marked `PRIVATE` before all its changes are processed, the remaining changes are skipped → **data loss**.

</div>

</div>
</div>

---

# PostgreSQL: LSN flush strategy

**`lsn.flush.mode` replaces `flush.lsn.source`** *(now GA)*

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

* `connector` *(default)*
* `manual`
* `connector_and_driver`
  * Keep-alive thread flushes the LSN, reflecting all WAL activity (`CHECKPOINT`, `VACUUM`, `pg_switch_wal()`)
  * Prevents WAL growth on low-activity databases

</div>
<div>

**`offset.mismatch.strategy`** *(also GA)*
* Handles the case where `connector_and_driver` moves the replication slot ahead of the stored offset
* Together: robust recovery from LSN desynchronization between the Kafka Connect offset and the replication slot

<span class="text-xs opacity-60">DBZ-9641 · DBZ-9688</span>

</div>
</div>

---

# SQL Server

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Improved transaction metadata handling**
* Completed transactions detected via `dm_cdc_log_scan_sessions`
* Faster delivery of transaction `END` markers
* Automatic with `provide.transaction.metadata`
* Not applied to Always On read-only replicas

<span class="text-xs opacity-60">dbz#1604</span>

</div>
<div>

**Set-based LSN-to-timestamp resolution**
* `LEFT JOIN` on `cdc.lsn_time_mapping` instead of row-by-row function calls
* Much faster on high-volume tables
* Only for `FUNCTION` data query mode; same output as before

<span class="text-xs opacity-60">dbz#1915</span>

</div>
</div>

---

# Promoted to General Availability

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

### Informix source connector
* Row-level changes via the Informix Change Data Capture API
* Compatible with Informix 12, 14, or 15 · driver v15.0.1.1
* **Licensing:** JDBC driver is **not** bundled, you must add it; the Change Stream client is **no longer needed** with JDBC driver v15

### Custom converters
* Create your own when default type conversions are not enough

</div>
<div>

### MongoDB: arbitrary start position
* `capture.start.op.time` defines where streaming starts
* Rebuild downstream state without a new snapshot; choose a point **before** the failure
* *DBZ-9240*

### OpenLineage integration
* Track how data moves across systems and transformations
* Now also for **JDBC and MongoDB sink connectors**
* *DBZ-9110 · DBZ-9469*

</div>
</div>

---
layout: center
---

# Technology Preview

## Early access · not for production

---

# TP: chunk-based multithreaded snapshots

**Parallel initial snapshots for SQL-based connectors**

* Tables are split in chunks processed by multiple worker threads
* Db2, Informix, MariaDB, MySQL, Oracle, PostgreSQL, SQL Server

<div class="text-sm">

| Property | Purpose |
|----------|---------|
| `snapshot.max.threads` | Number of threads. `> 1` enables chunk-based processing |
| `snapshot.max.threads.multiplier` | Chunk allocation for snapshot threads |
| `snapshot.max.threads.multiplier.<table>` | Per-table override |
| `legacy.snapshot.max.threads` | Restore legacy table-per-thread behavior |

</div>

<span class="text-xs opacity-60">dbz#1220</span>

---

# TP: MariaDB / MySQL recovery

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Binlog offset repositioning through signals**
* Signal type `set-binlog-position`
* Payload: GTID set, **or** binlog file name and position
* Change the position without touching the offset topic
* For crash recovery

<span class="text-xs opacity-60">dbz#1156</span>

</div>
<div>

**Graceful GTID recovery**
* New `gtid.ignore.on.recovery`
* If GTIDs are purged or stale, fall back to the stored binlog file and position
* Stale GTID cleared from offset; GTID tracking resumes when streaming restarts

<span class="text-xs opacity-60">dbz#1385</span>

</div>
</div>

---

# TP: Oracle · SQL Server

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Oracle downstream mining using XStream**
* Capture from a downstream Oracle database that receives redo logs from the primary
* No LogMiner access needed on the primary → lower load
* Requires XStream as capture mechanism

<span class="text-xs opacity-60">dbz#1868</span>

</div>
<div>

**SQL Server multi-task signaling**
* Ad hoc incremental or blocking snapshots across tasks in multi-database deployments
* One signal table per captured database:

```properties
signal.data.collection=db1.dbo.debezium_signal,db2.dbo.debezium_signal
```

* With a single table, a warning is logged and signaling works only for that database

<span class="text-xs opacity-60">DBZ-7243</span>

</div>
</div>

---

# TP: remaining preview features

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Debezium Server**
* Promoted from Developer Preview in 3.4.3
* Streams change events directly to a Kafka or Redis sink
* No dependency on Kafka Connect

**Oracle logical standby**
* Promoted from Developer Preview
* `log.mining.read.only=true` disables the flush table
* Standalone and RAC

</div>
<div>

**MongoDB sink connector** *(DBZ-8339)*
* Ingests raw Debezium events, no flattening SMT
* Bundled with the MongoDB source connector
* Mandatory: `connection.string`, `sink.database`, `topics`

**Oracle XML types** · **CloudEvents converter**
* `XMLType` support
* CloudEvents-compliant records in JSON or Avro

</div>
</div>

---
layout: center
---

# Developer Preview

## Not supported · may change or be removed

---

# Developer Preview

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

**Docling SMT** *(new)*
* `FieldToDocling` sends a field (inline content or URL) to a Docling Serve instance
* Normalizes PDF, DOCX, PPTX, HTML, spreadsheets
* `input.source`: `text` or `link`
* `output.format`: `text` (default), `markdown`, `html`
* Targets AI / RAG pipelines

<span class="text-xs opacity-60">DBZ-9713 · dbz#1442</span>

</div>
<div>

**AI embeddings SMT**
* Text → numeric embeddings
* Hugging Face · Ollama · ONNX MiniLM · Voyage AI

**Quarkus outbox extension**
* Outbox pattern for Quarkus apps, works with the Outbox Event router SMT

**MySQL parallel schema snapshots**
* Parallel snapshot and schema events for many tables

</div>
</div>

<div class="text-xs opacity-60 mt-2">Requires <strong>Java 21+</strong> — for the AI features (Docling, embeddings) and several other components, not only the Docling SMT.</div>

---

# Deprecations

<div class="text-sm">

| Feature | Status | What to do |
|---------|--------|------------|
| Oracle `redo_log_catalog` mining strategy | Deprecated, still available | Move to `online_catalog` or `hybrid` (dbz#1693) |
| PostgreSQL `flush.lsn.source` | Deprecated in 3.4.3, to be removed | Use `lsn.flush.mode` (DBZ-9641) |
| MySQL `snapshot.mode=never` | **Removed** | Use a remaining valid snapshot mode (dbz#1832) |

</div>

---

# Known problems and limitations

<div class="text-left mt-2 text-sm opacity-80">All in the JDBC sink, with <code>primary.key.mode=record_header</code></div>

<div class="grid grid-cols-2 gap-6 text-left mt-4 max-w-full text-sm">
<div class="p-4 border border-gray-500/40 rounded h-full">

**`primary.key.fields` has no effect**

* All headers on the record become primary key columns, regardless of what `primary.key.fields` lists

<span class="text-xs opacity-60">dbz#2795</span>

</div>
<div class="p-4 border border-gray-500/40 rounded h-full">

**Nested `Struct` headers can fail writes**

* The nested `Struct` maps to a type not eligible as a primary key: JSON, HSTORE/JSONB, or max-length `VARCHAR`
* **Workaround:** flatten or rewrite the header with a custom transformation before the sink

<span class="text-xs opacity-60">dbz#2796</span>

</div>
</div>

---

# Fixed issues

<div class="grid grid-cols-2 gap-8 text-left mt-4 max-w-full text-sm">
<div>

### Oracle
* Clearer diagnostics for missing archive logs (dbz#1532)
* `STORE IN` DDL with quoted segment name now parsed (dbz#2005)
* Mining session growth bounded under sustained load (dbz#2326)
* `CREATE INDEX … ONLINE` now parsed (dbz#2484)
* XStream metrics available through JMX (dbz#2602)
* `ORA-02002` during failover is retried (dbz#2625)

</div>
<div>

### SQL Server
* No unwarranted full snapshot with `when_needed` (dbz#1942)
* CDC "ambiguous column name" errors fixed (dbz#2511)
* No `IllegalStateException` after empty agent health-check (dbz#2551)

### MariaDB / MySQL
* Transient communication errors are retried again (regression from 3.1). You can remove the `custom.retriable.exception` workaround (dbz#2611)

### Informix
* Regular heartbeat intervals (dbz#2575)

</div>
</div>

---

# Thank you

**Debezium 3.6**

- 📘 Red Hat build of Debezium 3.6.3 [release notes](https://content-stage.docs.redhat.com/en/documentation/red_hat_build_of_debezium/3.6.3/html-single/release_notes_for_red_hat_build_of_debezium_3.6.3/index)
- 🛠️ Debezium: [debezium/debezium](https://github.com/debezium/debezium)
- 📝 Design documents: [debezium/design-documents](https://github.com/debezium/design-documents)
