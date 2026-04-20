// Card Audit — shared corpus loader.
// Imports every authored pool/table exactly once and returns a frozen Corpus
// object with pre-built indexed views every scan can read for free.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { EventDefinition } from '../../src/engine/events/event-engine';
import { EventSeverity } from '../../src/engine/types';

import { EVENT_POOL, FOLLOW_UP_POOL } from '../../src/data/events/index';
import { EVENT_CHOICE_EFFECTS, EVENT_CHOICE_TEMPORARY_MODIFIERS } from '../../src/data/events/effects';
import { ASSESSMENT_POOL } from '../../src/data/events/assessments';
import { ASSESSMENT_EFFECTS } from '../../src/data/events/assessment-effects';
import { ASSESSMENT_TEXT } from '../../src/data/text/assessments';
import { NEGOTIATION_POOL } from '../../src/data/events/negotiations';
import { NEGOTIATION_EFFECTS } from '../../src/data/events/negotiation-effects';
import { NEGOTIATION_TEXT } from '../../src/data/text/negotiations';
import { OVERTURE_TEXT } from '../../src/data/text/overtures';
import { RivalAgenda } from '../../src/engine/types';

import { DECREE_POOL } from '../../src/data/decrees/index';
import { DECREE_EFFECTS } from '../../src/data/decrees/effects';
import { DECREE_EFFECT_REGISTRY } from '../../src/engine/resolution/apply-action-effects';

import { WORLD_EVENT_DEFINITIONS, WORLD_EVENT_CHOICE_EFFECTS } from '../../src/data/world-events/index';
import { WORLD_EVENT_TEXT } from '../../src/data/text/world-events';

import { HAND_CARDS } from '../../src/data/cards/hand-cards';

import { EVENT_TEXT } from '../../src/data/text/events';
import { EVENT_CHOICE_STYLE_TAGS } from '../../src/data/ruling-style/flavor-tags';
import { KINGDOM_FEATURE_REGISTRY } from '../../src/data/kingdom-features/index';

import type { Corpus, Family } from './types';

// ============================================================
// Public entrypoint
// ============================================================

export async function loadCorpus(): Promise<Corpus> {
  const filePathByCardId = await indexFilePaths();

  const corpus: Corpus = {
    events: { pool: EVENT_POOL, followUpPool: FOLLOW_UP_POOL },
    decrees: {
      pool: DECREE_POOL,
      effects: DECREE_EFFECTS,
      handlerKeys: new Set(DECREE_EFFECT_REGISTRY.keys()),
    },
    assessments: {
      pool: ASSESSMENT_POOL,
      effects: ASSESSMENT_EFFECTS,
      text: ASSESSMENT_TEXT,
    },
    negotiations: {
      pool: NEGOTIATION_POOL,
      effects: NEGOTIATION_EFFECTS,
      text: NEGOTIATION_TEXT,
    },
    overtures: {
      text: OVERTURE_TEXT,
      authoredAgendas: Object.keys(OVERTURE_TEXT) as RivalAgenda[],
    },
    worldEvents: {
      defs: WORLD_EVENT_DEFINITIONS,
      effects: WORLD_EVENT_CHOICE_EFFECTS,
      text: WORLD_EVENT_TEXT,
    },
    handCards: Object.values(HAND_CARDS),
    text: { events: EVENT_TEXT },
    effects: { events: EVENT_CHOICE_EFFECTS },
    styleTags: EVENT_CHOICE_STYLE_TAGS,
    tempModifiers: EVENT_CHOICE_TEMPORARY_MODIFIERS,
    featureRegistry: KINGDOM_FEATURE_REGISTRY,

    eventById: buildEventById(),
    familyByCardId: buildFamilyMap(),
    filePathByCardId,
    tagProducers: buildTagProducers(),
    tagReaders: buildTagReaders(),
  };

  return Object.freeze(corpus);
}

// ============================================================
// Indexing
// ============================================================

function buildEventById(): Map<string, EventDefinition> {
  const out = new Map<string, EventDefinition>();
  for (const e of EVENT_POOL) out.set(e.id, e);
  for (const e of FOLLOW_UP_POOL) if (!out.has(e.id)) out.set(e.id, e);
  for (const e of ASSESSMENT_POOL) if (!out.has(e.id)) out.set(e.id, e);
  return out;
}

function buildFamilyMap(): Map<string, Family> {
  const out = new Map<string, Family>();

  for (const ev of EVENT_POOL) out.set(ev.id, classifyEvent(ev));
  for (const ev of FOLLOW_UP_POOL) {
    // Follow-up events behave like notifications when authored as `acknowledge`-only
    // and like their parent family otherwise. classifyEvent already handles both.
    if (!out.has(ev.id)) out.set(ev.id, classifyEvent(ev));
  }

  for (const a of ASSESSMENT_POOL) out.set(a.id, 'assessment');
  for (const n of NEGOTIATION_POOL) out.set(n.id, 'negotiation');
  for (const w of WORLD_EVENT_DEFINITIONS) out.set(w.id, 'world');
  for (const h of Object.values(HAND_CARDS)) out.set(h.id, 'hand');
  for (const d of DECREE_POOL) out.set(d.id, 'decree');

  return out;
}

/**
 * Classify a standard EventDefinition into one of:
 *   - 'notification' — read-only acknowledgement card (classification flag, or
 *     single `acknowledge` choice with isFree)
 *   - 'crisis'       — Severity Critical or Serious
 *   - 'petition'     — affectsClass !== null (interest-group framing)
 *   - 'overture'     — affectsNeighbor set
 *   - 'decree'       — never reached here (decrees come from DECREE_POOL)
 *   - 'unknown'      — fallback; any Notable / Informational without the above
 */
function classifyEvent(ev: EventDefinition): Family {
  if (ev.classification === 'notification') return 'notification';
  if (ev.choices.length === 1 && ev.choices[0]?.choiceId === 'acknowledge' && ev.choices[0]?.isFree) {
    return 'notification';
  }
  if (ev.severity === EventSeverity.Critical || ev.severity === EventSeverity.Serious) {
    return 'crisis';
  }
  if (ev.affectsClass !== null) return 'petition';
  if (ev.affectsNeighbor) return 'overture';
  return 'unknown';
}

/**
 * Tags produced by some choice anywhere in the corpus, with producer locations.
 *
 * Tag production model (matches engine/resolution/apply-action-effects.ts):
 *   - Every event choice produces `${eventId}:${choiceId}` on resolution.
 *   - Every decree enacted produces `decree:${decreeId}`.
 *   - Negotiation terms produce `${negotiationId}:${termId}` analogously.
 *   - World events do not produce consequence tags.
 *
 * The map's keys are the produced tag strings.
 */
function buildTagProducers(): Map<string, Array<{ kind: 'event' | 'decree'; id: string; choiceId?: string }>> {
  const out = new Map<string, Array<{ kind: 'event' | 'decree'; id: string; choiceId?: string }>>();
  const push = (tag: string, entry: { kind: 'event' | 'decree'; id: string; choiceId?: string }) => {
    const list = out.get(tag);
    if (list) list.push(entry);
    else out.set(tag, [entry]);
  };

  for (const ev of EVENT_POOL) {
    for (const c of ev.choices) push(`${ev.id}:${c.choiceId}`, { kind: 'event', id: ev.id, choiceId: c.choiceId });
  }
  for (const ev of FOLLOW_UP_POOL) {
    for (const c of ev.choices) push(`${ev.id}:${c.choiceId}`, { kind: 'event', id: ev.id, choiceId: c.choiceId });
  }
  for (const ev of ASSESSMENT_POOL) {
    for (const c of ev.choices) push(`${ev.id}:${c.choiceId}`, { kind: 'event', id: ev.id, choiceId: c.choiceId });
  }
  for (const n of NEGOTIATION_POOL) {
    for (const t of n.terms) push(`${n.id}:${t.termId}`, { kind: 'event', id: n.id, choiceId: t.termId });
    push(`${n.id}:${n.rejectChoiceId}`, { kind: 'event', id: n.id, choiceId: n.rejectChoiceId });
  }
  for (const d of DECREE_POOL) push(`decree:${d.id}`, { kind: 'decree', id: d.id });

  return out;
}

/**
 * Tags read by triggers (`consequence_tag_present` / `consequence_tag_absent`)
 * across the entire corpus — events and decrees.
 */
function buildTagReaders(): Map<string, Array<{ where: 'event-trigger' | 'decree-trigger'; id: string }>> {
  const out = new Map<string, Array<{ where: 'event-trigger' | 'decree-trigger'; id: string }>>();
  const push = (tag: string, entry: { where: 'event-trigger' | 'decree-trigger'; id: string }) => {
    const list = out.get(tag);
    if (list) list.push(entry);
    else out.set(tag, [entry]);
  };

  for (const ev of EVENT_POOL) collectEventTagReads(ev, (tag) => push(tag, { where: 'event-trigger', id: ev.id }));
  for (const ev of FOLLOW_UP_POOL) collectEventTagReads(ev, (tag) => push(tag, { where: 'event-trigger', id: ev.id }));
  for (const ev of ASSESSMENT_POOL) collectEventTagReads(ev, (tag) => push(tag, { where: 'event-trigger', id: ev.id }));

  for (const d of DECREE_POOL) {
    for (const cond of d.statePrerequisites ?? []) {
      if (cond.type === 'consequence_tag_present' && cond.consequenceTag) {
        push(cond.consequenceTag, { where: 'decree-trigger', id: d.id });
      }
    }
  }

  return out;
}

function collectEventTagReads(ev: EventDefinition, push: (tag: string) => void): void {
  const visit = (cond: import('../../src/engine/events/event-engine').EventTriggerCondition): void => {
    if ((cond.type === 'consequence_tag_present' || cond.type === 'consequence_tag_absent') && cond.consequenceTag) {
      push(cond.consequenceTag);
    }
    if (cond.type === 'any_of' && cond.conditions) {
      for (const sub of cond.conditions) visit(sub);
    }
  };
  for (const c of ev.triggerConditions) visit(c);
  for (const fu of ev.followUpEvents ?? []) {
    for (const sc of fu.stateConditions ?? []) visit(sc);
  }
}

// ============================================================
// File-path indexing — best-effort one-shot directory walk.
// ============================================================

async function indexFilePaths(): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  // We treat the project root as the parent of scripts/.
  const here = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(here, '..', '..');
  const dataRoot = path.join(projectRoot, 'src', 'data');

  // Match three id literal patterns:
  //   id: 'evt_xxx'
  //   id: 'decree_xxx'
  //   id: 'we_xxx'
  //   id: 'assess_xxx'
  //   id: 'neg_xxx'
  //   id: 'hand_xxx'
  //   featureId: 'feature_xxx' (skipped; not a card)
  // and also bare entry keys like:
  //   evt_xxx: { ... }   (text/effect tables)
  // For the file-path index we prefer the "id: '...'" form to avoid double
  // counting; text/effect tables don't have authoritative file paths anyway.
  const idLiteralRe = /\bid:\s*['"]([a-z][a-z0-9_]*)['"]/g;

  await walk(dataRoot, async (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    const rel = path.relative(projectRoot, filePath);
    const buf = await fs.readFile(filePath, 'utf8');
    let m: RegExpExecArray | null;
    idLiteralRe.lastIndex = 0;
    while ((m = idLiteralRe.exec(buf)) !== null) {
      const id = m[1];
      // First-writer-wins so the definition file beats the text/effect table.
      if (!out.has(id)) out.set(id, rel);
    }
  });

  return out;
}

async function walk(root: string, visit: (filePath: string) => Promise<void>): Promise<void> {
  let entries: import('node:fs').Dirent[];
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      await walk(full, visit);
    } else if (entry.isFile()) {
      await visit(full);
    }
  }
}
