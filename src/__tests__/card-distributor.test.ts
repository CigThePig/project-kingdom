import { describe, it, expect } from 'vitest';
import { distributeCardsToMonths } from '../bridge/cardDistributor';
import { InteractionType } from '../engine/types';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../bridge/petitionCardGenerator';
import type { AssessmentPhaseData } from '../bridge/assessmentCardGenerator';
import type { NegotiationCard } from '../ui/types';

function makeCrisis(id: string): CrisisPhaseData {
  return {
    crisisCard: {
      eventId: id,
      definitionId: id,
      title: `Crisis ${id}`,
      body: 'Test crisis',
      effects: [],
    },
    responses: [
      { id: `${id}:r1`, choiceId: 'r1', title: 'Response 1', effects: [], slotCost: 1, isFree: false },
    ],
  };
}

function makePetition(id: string): PetitionCardData {
  return {
    eventId: id,
    definitionId: id,
    title: `Petition ${id}`,
    body: 'Test petition',
    grantChoiceId: 'grant',
    denyChoiceId: 'deny',
    grantEffects: [],
    denyEffects: [],
    allChoices: [],
  };
}

function makeNotification(id: string): NotificationCardData {
  return {
    eventId: id,
    definitionId: id,
    title: `Notice ${id}`,
    body: 'Test notification',
    acknowledgeChoiceId: 'acknowledge',
  };
}

function makeNegotiation(): NegotiationCard {
  return {
    eventCard: { id: 'neg1', title: 'Negotiation', body: '', family: 'crisis', effects: [] },
    terms: [],
    rejectEffects: {},
    rejectHints: [],
    contextLabel: 'Test',
  };
}

function makeAssessment(): AssessmentPhaseData {
  return {
    crisisData: {
      crisisCard: { eventId: 'assess1', definitionId: 'assess1', title: 'Assessment', body: '', effects: [] },
      responses: [],
    },
    confidenceLevel: 'moderate',
    resolvedNeighborId: 'n1',
  };
}

describe('distributeCardsToMonths', () => {
  it('places primary crisis in month 1', () => {
    const crisis = makeCrisis('c1');
    const result = distributeCardsToMonths(crisis, [], null, null);

    expect(result.month1.interactionType).toBe(InteractionType.CrisisResponse);
    expect(result.month1.crisisData).toBe(crisis);
  });

  it('distributes petitions when no other content exists', () => {
    const petitions = [makePetition('p1'), makePetition('p2')];
    const result = distributeCardsToMonths(null, petitions, null, null);

    // At least one month should have petition interaction
    const petitionMonths = [result.month1, result.month2, result.month3]
      .filter(m => m.interactionType === InteractionType.Petition);
    expect(petitionMonths.length).toBeGreaterThan(0);

    // All petitions should be assigned somewhere
    const totalAssigned = [result.month1, result.month2, result.month3]
      .reduce((sum, m) => sum + m.petitionCards.length, 0);
    expect(totalAssigned).toBe(2);
  });

  it('handles empty season gracefully', () => {
    const result = distributeCardsToMonths(null, [], null, null);

    expect(result.month1.interactionType).toBeNull();
    expect(result.month2.interactionType).toBeNull();
    expect(result.month3.interactionType).toBeNull();
  });

  it('places additional crises in available months', () => {
    const crisis = makeCrisis('c1');
    const additional = [makeCrisis('c2')];
    const result = distributeCardsToMonths(crisis, [], null, null, additional);

    // c1 in month 1, c2 should be placed in month 2 or 3
    expect(result.month1.crisisData?.crisisCard.eventId).toBe('c1');
    const otherCrisis = result.month2.crisisData ?? result.month3.crisisData;
    expect(otherCrisis?.crisisCard.eventId).toBe('c2');
  });

  // ---- Track B: Crisis overflow ----

  it('never silently drops extra crises when all months occupied', () => {
    const crisis = makeCrisis('c1');
    const negotiation = makeNegotiation();
    const assessment = makeAssessment();
    // c1 in month 1, negotiation in month 2, assessment in month 3
    // Additional crisis c2 has no free month
    const additional = [makeCrisis('c2')];
    const result = distributeCardsToMonths(crisis, [], negotiation, assessment, additional);

    // c2 must appear as an additionalCrisis somewhere, never dropped
    const allAdditional = [
      ...result.month1.additionalCrises,
      ...result.month2.additionalCrises,
      ...result.month3.additionalCrises,
    ];
    expect(allAdditional.length).toBe(1);
    expect(allAdditional[0].crisisCard.eventId).toBe('c2');
  });

  it('places extra crisis as additionalCrisis on non-crisis month when possible', () => {
    const crisis = makeCrisis('c1');
    const negotiation = makeNegotiation();
    // Month 1: crisis, Month 2: negotiation, Month 3: free → c2 goes to month 3 primary
    // But if month 3 is also full, c3 becomes additionalCrisis
    const additional = [makeCrisis('c2'), makeCrisis('c3')];
    const result = distributeCardsToMonths(crisis, [], negotiation, null, additional);

    // c2 placed in month 3 as primary (it's free)
    expect(result.month3.crisisData?.crisisCard.eventId).toBe('c2');
    // c3 has no free month → attached as additionalCrisis, preferring non-crisis month
    const allAdditional = [
      ...result.month1.additionalCrises,
      ...result.month2.additionalCrises,
      ...result.month3.additionalCrises,
    ];
    expect(allAdditional.length).toBe(1);
    expect(allAdditional[0].crisisCard.eventId).toBe('c3');
  });

  // ---- Track B: Petition stacking ----

  it('attaches petitions to crisis months when no petition month available', () => {
    const crisis = makeCrisis('c1');
    const negotiation = makeNegotiation();
    const assessment = makeAssessment();
    const petitions = [makePetition('p1')];
    // All months occupied by non-petition interactions
    const result = distributeCardsToMonths(crisis, petitions, negotiation, assessment);

    // Petitions must not be dropped — they attach as stacked content
    const totalPetitions = [result.month1, result.month2, result.month3]
      .reduce((sum, m) => sum + m.petitionCards.length, 0);
    expect(totalPetitions).toBe(1);
  });

  // ---- Track B: Notification distribution ----

  it('distributes notifications across months', () => {
    const notifications = [makeNotification('n1'), makeNotification('n2')];
    const result = distributeCardsToMonths(null, [], null, null, [], notifications);

    const totalNotifs = [result.month1, result.month2, result.month3]
      .reduce((sum, m) => sum + m.notificationCards.length, 0);
    expect(totalNotifs).toBe(2);
  });

  it('handles empty notification array gracefully', () => {
    const result = distributeCardsToMonths(null, [], null, null, [], []);

    expect(result.month1.notificationCards.length).toBe(0);
    expect(result.month2.notificationCards.length).toBe(0);
    expect(result.month3.notificationCards.length).toBe(0);
  });

  it('distributes notifications to busy months when no quiet months exist', () => {
    const crisis = makeCrisis('c1');
    const negotiation = makeNegotiation();
    const assessment = makeAssessment();
    const notifications = [makeNotification('n1')];
    const result = distributeCardsToMonths(crisis, [], negotiation, assessment, [], notifications);

    const totalNotifs = [result.month1, result.month2, result.month3]
      .reduce((sum, m) => sum + m.notificationCards.length, 0);
    expect(totalNotifs).toBe(1);
  });
});
