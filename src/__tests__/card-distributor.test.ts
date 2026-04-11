import { describe, it, expect } from 'vitest';
import { distributeCardsToMonths } from '../bridge/cardDistributor';
import { InteractionType } from '../engine/types';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { PetitionCardData } from '../bridge/petitionCardGenerator';

function makeCrisis(id: string): CrisisPhaseData {
  return {
    crisisCard: {
      eventId: id,
      definitionId: id,
      title: `Crisis ${id}`,
      body: 'Test crisis',
      effects: [],
    },
    responses: [],
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
});
