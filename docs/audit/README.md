# Card Audit — Workflow Guide

This directory holds the artifacts produced and consumed by the Card Audit
defined in `docs/CARD_AUDIT_RULES.md`. The scanner code lives under
`scripts/audit/`. None of these artifacts are required at runtime — they
exist so the manual audit's mechanical work is already done before a
human reviewer opens the door.

## Quickstart

```bash
# Scan everything; write audit-output/{findings,heatmap,inventory}.{md,json}.
npm run audit

# Same, but populate / refresh docs/audit/findings/*.md and migration-list.md.
npm run audit:seed

# Just the corpus census (counts, distributions, top-files).
npm run audit:inventory

# Per-family slices.
npm run audit:decrees
npm run audit:crises
npm run audit:petitions
npm run audit:assessments
npm run audit:negotiations
npm run audit:overtures
npm run audit:notifications
npm run audit:hand

# Opt-in attainability heuristic — slower; high false-positive rate.
npm run audit:reach
```

The default invocation only emits **CRITICAL** and **MAJOR** findings —
the §8 "don't cry wolf" rule. Pass `--include-minor` and/or
`--include-polish` to see the full surface.

## Layout

- `findings/` — per-family findings tables, partially auto-generated. Each
  file's `outcome` and `notes` columns are preserved across reruns; the
  scanner only rewrites the rows inside the
  `<!-- AUTO-GENERATED:START --> ... END -->` block.
- `migration-list.md` — single-choice cards that should relocate from the
  monthly pool to seasonal channels (§10).
- `rebuild-queue.md` — empty scaffold. Rebuild is a contextual judgment
  (§7), not a mechanical output. Auditors fill this during the manual pass.

## Scanner output

`audit-output/` is gitignored. Each run produces:

- `findings.json` — full detail (every severity, every field).
- `findings.md` — grouped by family → severity → file.
- `heatmap.md` — rows = source files, columns = scan categories.
- `inventory.{json,md}` — corpus census.

## CI policy

The default invocation exits 0. Add `--fail-on=critical` (or higher) when
you want CI to gate on the scanner. Authors are expected to run
`npm run audit` locally before opening a card-content PR.
