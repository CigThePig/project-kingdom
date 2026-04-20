// Phase 5C — Overture effect-hint parity.
//
// INLINE_EFFECTS holds UI labels ("Relationship ↑↑", "Gold income ↑").
// These hints advertise the direction of change to the player. A runtime
// diff where the advertised arrow points up but relationship actually went
// down (or vice versa) is a lying hint. The parser reads arrow glyphs
// directly, so calibration is `HEURISTIC`.

import { buildInlineSpec } from '../../../../src/bridge/diplomaticOvertureGenerator';
import { RivalAgenda } from '../../../../src/engine/types';
import type { Corpus, Finding, Scan } from '../../types';
import type { AuditDecisionPath } from '../../ir';

export const SCAN_ID = 'overtures.effect-hint-parity';

type HintDirection = 'up' | 'down' | 'ambiguous';

function directionOfLabel(label: string): HintDirection {
  const up = /↑/.test(label);
  const down = /↓/.test(label);
  if (up && !down) return 'up';
  if (down && !up) return 'down';
  return 'ambiguous';
}

function relationshipSignFromFingerprint(
  path: AuditDecisionPath,
): 'up' | 'down' | null {
  const fp = path.runtimeFingerprint;
  if (!fp || fp.noOp) return null;
  // applyOvertureDecision is the only runtime writer and moves
  // relationshipScore by +6 on grant / -6 on deny. The diff tracks the
  // numeric path `diplomacy.neighbors[n].relationshipScore`. We can't read
  // the delta direction from the touch path alone; fall back to the
  // choiceId semantics, which overtures authoritatively encode.
  if (path.choiceId === 'grant') return 'up';
  if (path.choiceId === 'deny') return 'down';
  return null;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'overture') continue;
    const agenda = card.metadata?.agenda as RivalAgenda | undefined;
    if (!agenda) continue;
    const spec = buildInlineSpec(agenda);
    if (!spec) continue;

    for (const path of card.choices) {
      const runtimeSign = relationshipSignFromFingerprint(path);
      if (!runtimeSign) continue;
      const hints = path.choiceId === 'grant' ? spec.grantEffects : spec.denyEffects;
      const relationshipHint = hints.find((h) => /relationship/i.test(h.label));
      if (!relationshipHint) continue;

      const hintDirection = directionOfLabel(relationshipHint.label);
      if (hintDirection === 'ambiguous') continue;

      if (hintDirection !== runtimeSign) {
        out.push({
          severity: 'MAJOR',
          family: 'overture',
          scanId: SCAN_ID,
          code: 'OVERTURE_HINT_MISMATCH',
          cardId: card.id,
          choiceId: path.choiceId,
          message: `${card.id}.${path.choiceId}: effect hint "${relationshipHint.label}" points ${hintDirection} but runtime moves relationship ${runtimeSign}.`,
          confidence: 'HEURISTIC',
          details: {
            hintLabel: relationshipHint.label,
            hintDirection,
            runtimeSign,
          },
        });
      }
    }
  }

  return out;
};
