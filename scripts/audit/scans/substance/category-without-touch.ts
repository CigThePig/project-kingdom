// Substance scan §13.9 — a card whose category is X but whose choices'
// effects (and temp modifiers) never touch any of X's substantive fields.
// "Religion" cards that move only treasury/stability fall here; the trigger
// fires on faith but the response never engages with faith.
//
// Severity is MAJOR — these cards usually need recategorization or a real
// faith/etc. delta added to at least one choice.
//
// Phase 6 upgrade: when the IR carries runtime fingerprints for any choice,
// a runtime-observed touch on one of the category's paths (`treasury.*`,
// `faithCulture.*`, …) also counts as a substantive touch. This catches
// cards whose declared delta tables look empty but whose real direct-effect
// resolution mutates the category state.

import {
  CATEGORY_TOUCH_FIELDS,
  deltaTouchesCategory,
  runtimeTouchesCategory,
} from '../../category-map';
import type { AuditCard } from '../../ir';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'substance.category-without-touch';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const auditCardIndex = new Map<string, AuditCard>();
  for (const card of corpus.auditCards) auditCardIndex.set(card.id, card);

  for (const ev of corpus.eventById.values()) {
    if (corpus.familyByCardId.get(ev.id) === 'notification') continue;
    const fields = CATEGORY_TOUCH_FIELDS[ev.category];
    if (!fields || fields.size === 0) continue;

    const choices = corpus.effects.events[ev.id] ?? corpus.assessments.effects[ev.id];
    const tempBlock = corpus.tempModifiers[ev.id] ?? {};
    if (!choices) continue;

    const auditCard = auditCardIndex.get(ev.id);

    let anyDeclaredTouch = false;
    let anyRuntimeTouch = false;
    let anyFingerprintSeen = false;

    for (const c of ev.choices) {
      if (deltaTouchesCategory(choices[c.choiceId], ev.category)) {
        anyDeclaredTouch = true;
      }
      if (deltaTouchesCategory(tempBlock[c.choiceId]?.effectPerTurn, ev.category)) {
        anyDeclaredTouch = true;
      }
      const fp = auditCard?.choices.find((p) => p.choiceId === c.choiceId)?.runtimeFingerprint;
      if (fp) {
        anyFingerprintSeen = true;
        if (runtimeTouchesCategory(fp.touches, ev.category)) {
          anyRuntimeTouch = true;
        }
      }
      if (anyDeclaredTouch || anyRuntimeTouch) break;
    }

    if (!anyDeclaredTouch && !anyRuntimeTouch) {
      out.push({
        severity: 'MAJOR',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'CATEGORY_WITHOUT_TOUCH',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `${ev.id} is categorized as ${ev.category} but no choice touches any of: ${[...fields].join(', ')}.`,
        confidence: anyFingerprintSeen ? 'RUNTIME_GROUNDED' : 'HEURISTIC',
        details: { category: ev.category, expectedFields: [...fields] },
      });
    }
  }

  return out;
};
