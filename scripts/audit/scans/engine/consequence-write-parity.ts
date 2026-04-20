// Engine parity — `persistentConsequences` write sites vs the scanner's
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
// failure). This scan walks the M3 AST writer/reader index — no regex —
// so it stays stable across refactors of the surrounding engine code.

import { getWriterReaderIndex } from '../../ast/runtime-writer-reader-index';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'engine.consequence-write-parity';

const APPLY_EFFECTS_PATH = 'src/engine/resolution/apply-action-effects.ts';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const index = getWriterReaderIndex();
  const sites = index.consequenceWriteSites.filter(
    (s) => s.filePath === APPLY_EFFECTS_PATH,
  );

  const out: Finding[] = [];

  if (sites.length < 3) {
    out.push({
      severity: 'MAJOR',
      family: 'unknown',
      scanId: SCAN_ID,
      code: 'CONSEQUENCE_WRITE_SITE_COUNT_REGRESSED',
      cardId: 'apply-action-effects:persistentConsequences',
      filePath: APPLY_EFFECTS_PATH,
      message: `Expected at least 3 persistentConsequences assignment sites in apply-action-effects.ts but found ${sites.length} — scanner's tag-producer model assumes three write shapes (decree, event-choice, storyline).`,
      confidence: 'ENGINE_MISMATCH',
      details: { foundSites: sites.map((s) => `${s.filePath}:${s.line}`) },
    });
  }

  // Detect the 3 write-shape templates directly from the snippets each
  // WriteSite carries. The tsquery selector matches the PropertyAssignment,
  // so `snippet` contains the `persistentConsequences: [...]` expression
  // text — enough to distinguish `decree:`, 2-part, and 3-part tag forms.
  const siteTexts = sites.map((s) => s.snippet);
  const hasDecree = siteTexts.some((t) => /`decree:\$\{/.test(t));
  const hasEvent = siteTexts.some((t) => /`\$\{[^}]+\}:\$\{[^}]+\}`/.test(t));
  const hasStoryline = siteTexts.some(
    (t) => /`\$\{[^}]+\}:\$\{[^}]+\}:\$\{[^}]+\}`/.test(t),
  );

  if (!hasDecree) {
    out.push({
      severity: 'MAJOR',
      family: 'decree',
      scanId: SCAN_ID,
      code: 'CONSEQUENCE_WRITE_SITE_MISSING',
      cardId: 'apply-action-effects:decree',
      filePath: APPLY_EFFECTS_PATH,
      message: 'Expected a `decree:<id>` persistentConsequences assignment in apply-action-effects.ts but none was found — the scanner\'s tag-producer model is out of sync with the engine.',
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
      filePath: APPLY_EFFECTS_PATH,
      message: 'Expected a `<eventId>:<choiceId>` persistentConsequences assignment in apply-action-effects.ts but none was found — the scanner\'s tag-producer model is out of sync with the engine.',
      confidence: 'ENGINE_MISMATCH',
    });
  }
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
