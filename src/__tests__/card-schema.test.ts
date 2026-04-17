// Phase 4 — Card schema adapter coverage
//
// Verifies that every legacy card data shape produced by the bridge layer
// round-trips losslessly through its adapter into a unified `Card`
// envelope, and that the envelope's derived metadata (effort, rarity, tags)
// picks the right bucket for representative inputs.

import { describe, it, expect } from 'vitest';
import {
  crisisToCard,
  petitionToCard,
  notificationToCard,
  decreeToCard,
  negotiationToCard,
  assessmentToCard,
  overtureToCard,
  effortFromSlotCost,
  rarityFromSeverity,
  deriveTagsFromEventCategory,
  deriveTagsFromDecreeCategory,
} from '../engine/cards/adapters';
import type { Card } from '../engine/cards/types';
import {
  EventCategory,
  EventSeverity,
  DecreeCategory,
} from '../engine/types';
import type { EventDefinition } from '../engine/events/event-engine';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../bridge/petitionCardGenerator';
import type { DecreeCardData } from '../bridge/decreeCardGenerator';
import type { AssessmentPhaseData } from '../bridge/assessmentCardGenerator';
import type { NegotiationCard } from '../ui/types';

const VALID_EFFORTS = ['Light', 'Standard', 'Heavy', 'Crushing'] as const;
const VALID_RARITIES = ['Common', 'Uncommon', 'Rare', 'Defining'] as const;

// ------------------------------------------------------------
// Factories — minimal payloads shaped like real bridge output
// ------------------------------------------------------------

function makeCrisis(id = 'event_alpha'): CrisisPhaseData {
  return {
    crisisCard: {
      eventId: id,
      definitionId: id,
      title: 'A Crisis Erupts',
      body: 'The court faces an urgent matter.',
      effects: [{ label: 'SERIOUS', type: 'warning' }],
      context: [{ text: 'Regional unrest rising', tone: 'crisis' }],
    },
    responses: [
      { id: `${id}:r1`, choiceId: 'r1', title: 'Act', effects: [], signals: [], slotCost: 2, isFree: false },
      { id: `${id}:r2`, choiceId: 'r2', title: 'Wait', effects: [], signals: [], slotCost: 3, isFree: false },
    ],
  };
}

function makePetition(id = 'event_petition'): PetitionCardData {
  return {
    eventId: id,
    definitionId: id,
    title: 'A Petition Arrives',
    body: 'A lord requests your ear.',
    grantChoiceId: 'grant',
    denyChoiceId: 'deny',
    grantEffects: [{ label: 'LOYALTY +', type: 'positive' }],
    denyEffects: [{ label: 'LOYALTY -', type: 'negative' }],
    grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
    denySignals: [],
    allChoices: [],
    context: [{ text: 'Court mood calm', tone: 'info' }],
  };
}

function makeNotification(id = 'event_notice'): NotificationCardData {
  return {
    eventId: id,
    definitionId: id,
    title: 'News From Afar',
    body: 'Word reaches the court.',
    acknowledgeChoiceId: 'acknowledge',
  };
}

function makeDecree(): DecreeCardData {
  return {
    decreeId: 'decree_justice',
    title: 'Circuit of Justice',
    category: DecreeCategory.Civic,
    body: 'Send royal magistrates on circuit.',
    effects: [{ label: 'ORDER +', type: 'positive' }],
    slotCost: 2,
    isHighImpact: false,
    context: [],
  };
}

function makeHighImpactDecree(): DecreeCardData {
  return {
    ...makeDecree(),
    decreeId: 'decree_reform',
    title: 'Great Reform',
    isHighImpact: true,
    slotCost: 3,
  };
}

function makeNegotiation(): NegotiationCard {
  return {
    eventCard: {
      id: 'neg_treaty',
      title: 'Treaty Proposal',
      body: 'Terms laid on the table.',
      family: 'crisis',
      effects: [{ label: 'DIPLOMACY', type: 'neutral' }],
    },
    terms: [
      {
        id: 'term1',
        title: 'Non-Aggression',
        description: 'Three years of peace.',
        effects: {},
        effectHints: [{ label: 'PEACE +', type: 'positive' }],
        isToggled: true,
      },
      {
        id: 'term2',
        title: 'Trade Route',
        description: 'Shared grain route.',
        effects: {},
        effectHints: [{ label: 'TRADE +', type: 'positive' }],
        isToggled: false,
      },
    ],
    rejectEffects: {},
    rejectHints: [],
    contextLabel: 'Mid-season overture',
  };
}

function makeAssessment(): AssessmentPhaseData {
  return {
    crisisData: {
      crisisCard: {
        eventId: 'assess_ironvale',
        definitionId: 'assess_ironvale',
        title: 'Spymaster Reports',
        body: 'A scroll marked with three wax seals.',
        effects: [],
      },
      responses: [
        { id: 'assess_ironvale:r1', choiceId: 'r1', title: 'Act', effects: [], signals: [], slotCost: 1, isFree: false },
      ],
    },
    confidenceLevel: 'moderate',
    resolvedNeighborId: 'neighbor_valdris',
  };
}

function makeEventDef(
  overrides: Partial<EventDefinition> = {},
): EventDefinition {
  return {
    id: 'event_alpha',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [],
    weight: 1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    ...overrides,
  } as EventDefinition;
}

// ------------------------------------------------------------
// Shared envelope assertions
// ------------------------------------------------------------

function assertEnvelopeShape(card: Card) {
  expect(typeof card.id).toBe('string');
  expect(card.id.length).toBeGreaterThan(0);
  expect(typeof card.title).toBe('string');
  expect(VALID_EFFORTS).toContain(card.effortCost);
  expect(VALID_RARITIES).toContain(card.rarity);
  expect(Array.isArray(card.tags)).toBe(true);
  expect(Array.isArray(card.prerequisites)).toBe(true);
  expect(card.prerequisites).toHaveLength(0);
  expect(card.comboKeys).toEqual([]);
  expect(card.hand).toBe('instant');
  expect(Array.isArray(card.effects)).toBe(true);
  expect(Array.isArray(card.context)).toBe(true);
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

describe('card schema — derivation helpers', () => {
  it('maps slot cost to effort tier', () => {
    expect(effortFromSlotCost(0)).toBe('Light');
    expect(effortFromSlotCost(1)).toBe('Light');
    expect(effortFromSlotCost(2)).toBe('Standard');
    expect(effortFromSlotCost(3)).toBe('Heavy');
    expect(effortFromSlotCost(4)).toBe('Crushing');
    expect(effortFromSlotCost(10)).toBe('Crushing');
  });

  it('maps severity to rarity', () => {
    expect(rarityFromSeverity(EventSeverity.Critical)).toBe('Rare');
    expect(rarityFromSeverity(EventSeverity.Serious)).toBe('Common');
    expect(rarityFromSeverity(EventSeverity.Notable)).toBe('Common');
    expect(rarityFromSeverity(undefined)).toBe('Common');
  });

  it('maps event categories to tags', () => {
    expect(deriveTagsFromEventCategory(EventCategory.Military)).toContain('military');
    expect(deriveTagsFromEventCategory(EventCategory.Religion)).toContain('religious');
    expect(deriveTagsFromEventCategory(EventCategory.Knowledge)).toContain('knowledge');
    expect(deriveTagsFromEventCategory(undefined)).toEqual([]);
  });

  it('maps decree categories to tags', () => {
    expect(deriveTagsFromDecreeCategory(DecreeCategory.Civic))
      .toEqual(expect.arrayContaining(['civic', 'administrative']));
    expect(deriveTagsFromDecreeCategory(DecreeCategory.Military))
      .toContain('military');
  });
});

// ------------------------------------------------------------
// Adapter round-trips
// ------------------------------------------------------------

describe('crisisToCard', () => {
  it('produces a valid crisis envelope with preserved payload', () => {
    const data = makeCrisis();
    const def = makeEventDef({ category: EventCategory.PublicOrder, severity: EventSeverity.Critical });
    const card = crisisToCard(data, def);

    expect(card.family).toBe('crisis');
    assertEnvelopeShape(card);
    expect(card.id).toBe(data.crisisCard.eventId);
    expect(card.title).toBe(data.crisisCard.title);
    expect(card.body).toBe(data.crisisCard.body);
    expect(card.slotCost).toBe(3); // max response slotCost
    expect(card.effortCost).toBe('Heavy');
    expect(card.rarity).toBe('Rare');
    expect(card.tags).toContain('public_order');
    expect(card.effects).toEqual(data.crisisCard.effects);
    expect(card.context).toEqual(data.crisisCard.context);
    expect(card.payload).toBe(data);
  });

  it('handles crises with no responses', () => {
    const data: CrisisPhaseData = { crisisCard: makeCrisis().crisisCard, responses: [] };
    const card = crisisToCard(data);
    expect(card.slotCost).toBe(0);
    expect(card.effortCost).toBe('Light');
  });
});

describe('petitionToCard', () => {
  it('produces a valid petition envelope with administrative tag', () => {
    const data = makePetition();
    const card = petitionToCard(data);

    expect(card.family).toBe('petition');
    assertEnvelopeShape(card);
    expect(card.id).toBe(data.eventId);
    expect(card.tags).toContain('administrative');
    expect(card.effects).toEqual(data.grantEffects);
    expect(card.signals).toEqual(data.grantSignals);
    expect(card.context).toEqual(data.context);
    expect(card.payload).toBe(data);
  });

  it('derives slot cost from the matching grant choice when def is provided', () => {
    const data = makePetition();
    const def = makeEventDef({
      id: data.eventId,
      category: EventCategory.ClassConflict,
      choices: [
        { choiceId: 'grant', slotCost: 2, isFree: false },
        { choiceId: 'deny', slotCost: 1, isFree: false },
      ],
    });
    const card = petitionToCard(data, def);
    expect(card.slotCost).toBe(2);
    expect(card.tags).toEqual(expect.arrayContaining(['class_conflict', 'administrative']));
  });
});

describe('notificationToCard', () => {
  it('produces a zero-cost notification envelope', () => {
    const data = makeNotification();
    const card = notificationToCard(data);

    expect(card.family).toBe('notification');
    assertEnvelopeShape(card);
    expect(card.slotCost).toBe(0);
    expect(card.effortCost).toBe('Light');
    expect(card.rarity).toBe('Common');
    expect(card.effects).toEqual([]);
    expect(card.payload).toBe(data);
  });
});

describe('decreeToCard', () => {
  it('produces a decree envelope with category-derived tags', () => {
    const data = makeDecree();
    const card = decreeToCard(data);

    expect(card.family).toBe('decree');
    assertEnvelopeShape(card);
    expect(card.id).toBe(data.decreeId);
    expect(card.slotCost).toBe(data.slotCost);
    expect(card.effortCost).toBe('Standard');
    expect(card.rarity).toBe('Common');
    expect(card.tags).toEqual(expect.arrayContaining(['civic', 'administrative']));
    expect(card.effects).toEqual(data.effects);
    expect(card.payload).toBe(data);
  });

  it('marks high-impact decrees as Rare', () => {
    const card = decreeToCard(makeHighImpactDecree());
    expect(card.rarity).toBe('Rare');
  });
});

describe('negotiationToCard', () => {
  it('produces a diplomatic envelope whose cost tracks term count', () => {
    const data = makeNegotiation();
    const card = negotiationToCard(data);

    expect(card.family).toBe('negotiation');
    assertEnvelopeShape(card);
    expect(card.id).toBe(data.eventCard.id);
    expect(card.title).toBe(data.eventCard.title);
    expect(card.slotCost).toBe(data.terms.length);
    expect(card.rarity).toBe('Uncommon');
    expect(card.tags).toContain('diplomatic');
    // Term-level hints surface as the envelope's effects
    expect(card.effects.map((e) => e.label)).toEqual(
      expect.arrayContaining(['PEACE +', 'TRADE +']),
    );
    expect(card.payload).toBe(data);
  });

  it('clamps slot cost to at least 1 when the term list is empty', () => {
    const data: NegotiationCard = { ...makeNegotiation(), terms: [] };
    const card = negotiationToCard(data);
    expect(card.slotCost).toBe(1);
  });
});

describe('assessmentToCard', () => {
  it('produces an assessment envelope tagged with espionage', () => {
    const data = makeAssessment();
    const card = assessmentToCard(data);

    expect(card.family).toBe('assessment');
    assertEnvelopeShape(card);
    expect(card.id).toBe(data.crisisData.crisisCard.eventId);
    expect(card.tags).toContain('espionage');
    expect(card.slotCost).toBe(1);
    expect(card.payload).toBe(data);
  });
});

describe('overtureToCard', () => {
  it('produces a diplomatic overture envelope', () => {
    const data = makePetition('overture_valdris');
    const card = overtureToCard(data);

    expect(card.family).toBe('overture');
    assertEnvelopeShape(card);
    expect(card.rarity).toBe('Uncommon');
    expect(card.slotCost).toBe(1);
    expect(card.tags).toContain('diplomatic');
    expect(card.payload).toBe(data);
  });
});
