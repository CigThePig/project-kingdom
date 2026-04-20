// Engine parity §M1 — `persistentConsequences` write sites vs the scanner's
// tag producer model (`corpus.tagProducers`).
//
// The engine writes to `persistentConsequences` at three sites in
// `src/engine/resolution/apply-action-effects.ts`:
//
//   1. decree resolution       — tag: `decree:<decreeId>`
//   2. event choice resolution — tag: `<eventId>:<choiceId>`
//   3. storyline branch        — tag: `<storylineId>:<branchPointId>:<choiceId>`
//
// `corpus.tagProducers` only models (1) and (2) — the 3-part storyline tag
// shape isn't registered at all, so tag-reader scans can't tell when a
// trigger reads `consequence_tag_present` for a storyline outcome.
//
// We flag that gap as ENGINE_MISMATCH (scanner-model failure, not content
// failure). M5 (§5b) promotes this to the AST writer/reader index and adds
// a reader-writer roundtrip.

import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'engine.consequence-write-parity';

const APPLY_EFFECTS_SRC = path.resolve(
  process.cwd(),
  'src',
  'engine',
  'resolution',
  'apply-action-effects.ts',
);

// Detect the 3 known write sites via their `tag:` template-literal shapes.
// Using these specific patterns instead of a generic `persistentConsequences:`
// match keeps the scan stable against unrelated refactors of the surrounding
// code.
const DECREE_TAG_RE = /tag:\s*`decree:\$\{[^}]+\}`/;
const EVENT_TAG_RE = /tag:\s*`\$\{[^}]+\}:\$\{[^}]+\}`/;
const STORYLINE_TAG_RE = /tag:\s*`\$\{[^}]+\}:\$\{[^}]+\}:\$\{[^}]+\}`/;

export const scan: Scan = (corpus: Corpus): Finding[] => {
  let source: string;
  try {
    source = readFileSync(APPLY_EFFECTS_SRC, 'utf8');
  } catch {
    return [];
  }

  const out: Finding[] = [];

  const hasDecree = DECREE_TAG_RE.test(source);
  const hasEvent = EVENT_TAG_RE.test(source);
  const hasStoryline = STORYLINE_TAG_RE.test(source);

  if (!hasDecree) {
    out.push({
      severity: 'MAJOR',
      family: 'decree',
      scanId: SCAN_ID,
      code: 'CONSEQUENCE_WRITE_SITE_MISSING',
      cardId: 'apply-action-effects:decree',
      filePath: 'src/engine/resolution/apply-action-effects.ts',
      message: 'Expected a `decree:<id>` persistentConsequences write site in apply-action-effects.ts but none was found — the scanner\'s tag-producer model is out of sync with the engine.',
      confidence: 'ENGINE_MISMATCH',
    });
  }
  if (!hasEvent) {
    out.push({
      severity: 'MAJOR',
      family: 'unknown',
      scanId: SCAN_ID,
      code: 'CONSEQUENCE_WRITE_SITE_MISSING',
      cardId: 'apply-action-effects:event-choice',
      filePath: 'src/engine/resolution/apply-action-effects.ts',
      message: 'Expected a `<eventId>:<choiceId>` persistentConsequences write site in apply-action-effects.ts but none was found — the scanner\'s tag-producer model is out of sync with the engine.',
      confidence: 'ENGINE_MISMATCH',
    });
  }

  // Storyline 3-part tag shape: the engine writes it, but buildTagProducers()
  // in corpus.ts doesn't model it. That's a scanner gap, not a content gap.
  if (hasStoryline) {
    const hasThreePart = [...corpus.tagProducers.keys()].some(
      (tag) => tag.split(':').length === 3,
    );
    if (!hasThreePart) {
      out.push({
        severity: 'MAJOR',
        family: 'unknown',
        scanId: SCAN_ID,
        code: 'STORYLINE_TAG_UNMODELED',
        cardId: 'apply-action-effects:storyline-branch',
        filePath: 'scripts/audit/corpus.ts',
        message: 'apply-action-effects.ts writes storyline consequences with a 3-part tag `<storylineId>:<branchPointId>:<choiceId>`, but the scanner\'s tag-producer model only captures 1- and 2-part tags. Tag-reader scans against storyline consequences will produce false negatives.',
        confidence: 'ENGINE_MISMATCH',
      });
    }
  }

  return out;
};
