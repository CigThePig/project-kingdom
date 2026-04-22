// Substance scan §5.1 — choice distinctness. Two choices are meaningfully
// distinct only if they differ on at least one of: follow-up, feature tag,
// temp modifier, style axis, pressure axis, scope of impact, structural
// marker kind. §5.1 mandates ≥2 axes of differentiation between choices on
// the same card when choices.length >= 3.
//
// Complements `substance.choice-clones` (exact mechanical signature match):
//   - choice-clones is the tight check — any two choices with identical
//     (fields × style × temp-mod × follow-up) signatures.
//   - choice-distinctness is the loose check — any *pair* that agrees on ≥5
//     of 6 axes. Fires on cards where the three branches are nominally
//     distinct but substantively one-dimensional (sign-flip on treasury
//     only; same follow-up on every branch; etc.).
//
// Confidence: DETERMINISTIC — all signals are adapter/table shape, no text
// inference. MAJOR severity because a card with undifferentiated choices is
// a decision slot that isn't making a decision (§5.1 "fails differentiation").

import { nonzeroFieldsOf } from '../../category-map';
import type { MechanicalEffectDelta } from '../../../../src/engine/types';
import type { Corpus, Family, Finding, Scan } from '../../types';

export const SCAN_ID = 'substance.choice-distinctness';

const FAMILIES: ReadonlySet<Family> = new Set<Family>([
  'crisis',
  'petition',
  'notification',
  'unknown',
]);

/** Six axes authored-choice distinctness is measured on, per §5.1. */
interface ChoiceSignature {
  choiceId: string;
  followUp: string;        // follow-up definition IDs joined; empty when none
  hasFeature: boolean;     // KINGDOM_FEATURE_REGISTRY entry keyed on this choice
  tempMod: string;         // serialized temp-modifier effect keys; empty when none
  styleAxes: string;       // sorted style-axis keys; empty when none
  scope: string;           // sorted scope segments from the effect delta
  category: string;        // sorted nonzero effect-field kinds (kingdom/region/class/diplomacy)
}

const FIELD_SCOPE: Record<string, 'kingdom' | 'class' | 'region' | 'neighbor'> = {
  treasuryDelta: 'kingdom',
  foodDelta: 'kingdom',
  stabilityDelta: 'kingdom',
  faithDelta: 'kingdom',
  heterodoxyDelta: 'kingdom',
  culturalCohesionDelta: 'kingdom',
  militaryReadinessDelta: 'kingdom',
  militaryMoraleDelta: 'kingdom',
  militaryEquipmentDelta: 'kingdom',
  militaryForceSizeDelta: 'kingdom',
  espionageNetworkDelta: 'kingdom',
  nobilitySatDelta: 'class',
  clergySatDelta: 'class',
  merchantSatDelta: 'class',
  commonerSatDelta: 'class',
  militaryCasteSatDelta: 'class',
  diplomacyDeltas: 'neighbor',
  regionDevelopmentDelta: 'region',
  regionConditionDelta: 'region',
};

function signatureFor(
  corpus: Corpus,
  eventId: string,
  choiceId: string,
  followUps: readonly string[],
): ChoiceSignature {
  const delta = corpus.effects.events[eventId]?.[choiceId] as MechanicalEffectDelta | undefined;
  const nonzero = nonzeroFieldsOf(delta);
  const scopes = new Set<string>();
  for (const f of nonzero) {
    const s = FIELD_SCOPE[f as keyof typeof FIELD_SCOPE];
    if (s) scopes.add(s);
  }
  const styleAxes = corpus.styleTags[eventId]?.[choiceId] ?? {};
  const tempMod = corpus.tempModifiers[eventId]?.[choiceId];
  const tempModKeys = tempMod
    ? Object.keys(tempMod.effectPerTurn ?? {}).sort().join('|')
    : '';
  const featureKey = `event:${eventId}:${choiceId}`;
  const hasFeature = Object.prototype.hasOwnProperty.call(
    corpus.featureRegistry,
    featureKey,
  );

  return {
    choiceId,
    followUp: [...followUps].sort().join('|'),
    hasFeature,
    tempMod: tempModKeys,
    styleAxes: Object.keys(styleAxes).sort().join('|'),
    scope: [...scopes].sort().join('|'),
    category: nonzero.slice().sort().join('|'),
  };
}

function agreementCount(a: ChoiceSignature, b: ChoiceSignature): number {
  let n = 0;
  if (a.followUp === b.followUp) n++;
  if (a.hasFeature === b.hasFeature) n++;
  if (a.tempMod === b.tempMod) n++;
  if (a.styleAxes === b.styleAxes) n++;
  if (a.scope === b.scope) n++;
  if (a.category === b.category) n++;
  return n;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (!FAMILIES.has(card.family)) continue;
    if (card.choices.length < 3) continue;

    const sigs = card.choices.map((c) =>
      signatureFor(corpus, card.id, c.choiceId, c.followUps),
    );

    const undifferentiatedPairs: Array<[string, string, number]> = [];
    for (let i = 0; i < sigs.length; i++) {
      for (let j = i + 1; j < sigs.length; j++) {
        const n = agreementCount(sigs[i], sigs[j]);
        // §5.1 — must differ on ≥2 axes. Differ on 0 or 1 → same on ≥5 of 6.
        if (n >= 5) {
          undifferentiatedPairs.push([sigs[i].choiceId, sigs[j].choiceId, n]);
        }
      }
    }

    if (undifferentiatedPairs.length === 0) continue;

    out.push({
      severity: 'MAJOR',
      family: card.family,
      scanId: SCAN_ID,
      code: 'CHOICES_NOT_DISTINCT',
      cardId: card.id,
      filePath: card.filePath,
      message: `${card.id}: choice pair(s) ${undifferentiatedPairs
        .map(([a, b]) => `${a}↔${b}`)
        .join(', ')} differ on <2 of 6 distinctness axes (follow-up, feature, temp-mod, style, scope, effect category). §5.1 requires ≥2.`,
      confidence: 'DETERMINISTIC',
      details: {
        pairs: undifferentiatedPairs.map(([a, b, n]) => ({
          a,
          b,
          agreementCount: n,
        })),
      },
    });
  }

  return out;
};
