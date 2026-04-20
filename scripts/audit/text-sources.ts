// Family-aware text resolver.
//
// The pre-overhaul scanner read almost everything through EVENT_TEXT. That was
// wrong for at least three families:
//   - assessments live in ASSESSMENT_TEXT (same shape, different table);
//   - negotiations live in NEGOTIATION_TEXT (different shape — terms +
//     rejectLabel, no `choices` record);
//   - overtures live in OVERTURE_TEXT keyed by RivalAgenda (not card id).
//
// `getTextEntryForFamily` returns a normalized envelope so downstream scans
// don't need to know which table a family actually reads from. It also
// classifies the source via `TextSourceKind` so engine.text-source-parity
// (M5) can assert the scan looked at the right place.

import type { NegotiationTextEntry } from '../../src/data/text/negotiations';
import type { OvertureTextEntry } from '../../src/data/text/overtures';
import type { EventTextEntry } from '../../src/data/text/events';
import type { RivalAgenda } from '../../src/engine/types';

import type { Corpus, Family } from './types';

export type TextSourceKind =
  | 'event-text'
  | 'assessment-text'
  | 'negotiation-text'
  | 'overture-text'
  | 'world-text'
  | 'inline-hand'
  | 'inline-decree'
  | 'none';

export interface NormalizedTextEntry {
  sourceKind: TextSourceKind;
  title: string | undefined;
  body: string | undefined;
  /**
   * For negotiations, keyed by termId (includes rejectChoiceId too).
   * For overtures, keyed by 'grant' / 'deny' (synthetic).
   * For events/world events, keyed by choiceId.
   * For hand cards and decrees, empty.
   */
  choiceLabels: Record<string, string>;
  /** Present only for negotiation terms — the long-form description text. */
  termDescriptions?: Record<string, string>;
  /** Raw entry for scans that need family-specific fields. */
  raw:
    | EventTextEntry
    | NegotiationTextEntry
    | OvertureTextEntry
    | { title: string; body: string; choices: Record<string, string> }
    | { title: string; body: string }
    | null;
}

/**
 * Resolve the text entry for a card id (or overture agenda key) in the given
 * family. Returns null only when no entry exists at all; callers should use
 * the returned `sourceKind` and `raw` to distinguish "no table for family"
 * from "table exists but row missing".
 */
export function getTextEntryForFamily(
  corpus: Corpus,
  family: Family,
  id: string,
): NormalizedTextEntry | null {
  switch (family) {
    case 'crisis':
    case 'petition':
    case 'notification':
    case 'unknown': {
      const entry = corpus.text.events[id];
      if (!entry) return null;
      return {
        sourceKind: 'event-text',
        title: entry.title,
        body: entry.body,
        choiceLabels: { ...(entry.choices ?? {}) },
        raw: entry,
      };
    }
    case 'assessment': {
      const entry = corpus.assessments.text[id];
      if (!entry) return null;
      return {
        sourceKind: 'assessment-text',
        title: entry.title,
        body: entry.body,
        choiceLabels: { ...(entry.choices ?? {}) },
        raw: entry,
      };
    }
    case 'negotiation': {
      const entry = corpus.negotiations.text[id];
      if (!entry) return null;
      const labels: Record<string, string> = {};
      const descriptions: Record<string, string> = {};
      for (const [termId, term] of Object.entries(entry.terms ?? {})) {
        labels[termId] = term.title;
        descriptions[termId] = term.description;
      }
      return {
        sourceKind: 'negotiation-text',
        title: entry.title,
        body: entry.body,
        choiceLabels: labels,
        termDescriptions: descriptions,
        raw: entry,
      };
    }
    case 'overture': {
      // The scanner's 'overture' family groups two runtime paths today:
      //   - pool events with affectsNeighbor (resolve through EVENT_TEXT);
      //   - generated overtures keyed by RivalAgenda (OVERTURE_TEXT).
      // Try agenda-keyed OVERTURE_TEXT first; fall back to EVENT_TEXT so the
      // pool-event case matches its actual runtime text source.
      const agendaEntry = corpus.overtures.text[id as RivalAgenda];
      if (agendaEntry) {
        return {
          sourceKind: 'overture-text',
          title: agendaEntry.title,
          body: agendaEntry.body,
          choiceLabels: { grant: agendaEntry.grantTitle, deny: agendaEntry.denyTitle },
          raw: agendaEntry,
        };
      }
      const eventEntry = corpus.text.events[id];
      if (!eventEntry) return null;
      return {
        sourceKind: 'event-text',
        title: eventEntry.title,
        body: eventEntry.body,
        choiceLabels: { ...(eventEntry.choices ?? {}) },
        raw: eventEntry,
      };
    }
    case 'world': {
      const entry = corpus.worldEvents.text[id];
      if (!entry) return null;
      return {
        sourceKind: 'world-text',
        title: entry.title,
        body: entry.body,
        choiceLabels: { ...(entry.choices ?? {}) },
        raw: entry,
      };
    }
    case 'hand': {
      const card = corpus.handCards.find((h) => h.id === id);
      if (!card) return null;
      return {
        sourceKind: 'inline-hand',
        title: card.title,
        body: card.body,
        choiceLabels: {},
        raw: { title: card.title, body: card.body },
      };
    }
    case 'decree': {
      const decree = corpus.decrees.pool.find((d) => d.id === id);
      if (!decree) return null;
      return {
        sourceKind: 'inline-decree',
        title: decree.title,
        body: decree.effectPreview,
        choiceLabels: {},
        raw: { title: decree.title, body: decree.effectPreview },
      };
    }
  }
}

/** Declared text source for a family — used by scans and engine parity checks. */
export function declaredTextSourceKind(family: Family): TextSourceKind {
  switch (family) {
    case 'crisis':
    case 'petition':
    case 'notification':
    case 'unknown':
      return 'event-text';
    case 'assessment':
      return 'assessment-text';
    case 'negotiation':
      return 'negotiation-text';
    case 'overture':
      return 'overture-text';
    case 'world':
      return 'world-text';
    case 'hand':
      return 'inline-hand';
    case 'decree':
      return 'inline-decree';
  }
}
