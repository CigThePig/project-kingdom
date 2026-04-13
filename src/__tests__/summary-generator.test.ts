import { describe, it, expect } from 'vitest';
import { generateMonthlySummaryData } from '../bridge/summaryGenerator';
import { InteractionType, SeasonMonth } from '../engine/types';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { NotificationCardData } from '../bridge/petitionCardGenerator';
import type { MonthDecision } from '../ui/types';

function makeCrisis(id: string, title: string): CrisisPhaseData {
  return {
    crisisCard: {
      eventId: id,
      definitionId: `def_${id}`,
      title,
      body: 'Test',
      effects: [],
    },
    responses: [
      { id: `${id}:choice_a`, choiceId: 'choice_a', title: 'Option A', effects: [{ label: 'Treasury +10', type: 'positive' as const }], slotCost: 1, isFree: false },
      { id: `${id}:choice_b`, choiceId: 'choice_b', title: 'Option B', effects: [{ label: 'Food -5', type: 'negative' as const }], slotCost: 0, isFree: true },
    ],
  };
}

function makeNotification(id: string): NotificationCardData {
  return {
    eventId: id,
    definitionId: `def_${id}`,
    title: `Notice ${id}`,
    body: 'Test notification',
    acknowledgeChoiceId: 'acknowledge',
  };
}

describe('generateMonthlySummaryData', () => {
  it('summarizes multiple crises independently', () => {
    const crisis1 = makeCrisis('c1', 'The Flood');
    const crisis2 = makeCrisis('c2', 'The Siege');

    const decisions: MonthDecision[] = [
      {
        cardId: 'c1',
        choiceId: 'c1:choice_a',
        interactionType: InteractionType.CrisisResponse,
        month: SeasonMonth.Early,
      },
      {
        cardId: 'c2',
        choiceId: 'c2:choice_b',
        interactionType: InteractionType.CrisisResponse,
        month: SeasonMonth.Mid,
      },
    ];

    const result = generateMonthlySummaryData(
      decisions, [], [crisis1, crisis2], [], null,
    );

    // Both crises should appear in narrative
    expect(result.narrative).toContain('The Flood');
    expect(result.narrative).toContain('Option A');
    expect(result.narrative).toContain('The Siege');
    expect(result.narrative).toContain('Option B');
  });

  it('handles single crisis (backward compatibility)', () => {
    const crisis = makeCrisis('c1', 'Plague');
    const decisions: MonthDecision[] = [{
      cardId: 'c1',
      choiceId: 'c1:choice_a',
      interactionType: InteractionType.CrisisResponse,
      month: SeasonMonth.Early,
    }];

    const result = generateMonthlySummaryData(
      decisions, [], [crisis], [], null,
    );

    expect(result.narrative).toContain('Plague');
    expect(result.narrative).toContain('Option A');
  });

  it('includes notification acknowledgments in narrative', () => {
    const notif = makeNotification('n1');
    const decisions: MonthDecision[] = [{
      cardId: 'n1',
      choiceId: 'acknowledge',
      interactionType: InteractionType.Notification,
      month: SeasonMonth.Late,
    }];

    const result = generateMonthlySummaryData(
      decisions, [], [], [], null, undefined, undefined, [notif],
    );

    expect(result.narrative).toContain('notice');
    expect(result.narrative).toContain('acknowledged');
  });

  it('handles empty decisions gracefully', () => {
    const result = generateMonthlySummaryData([], [], [], [], null);

    // With no decisions, the summary still includes decree and closing narratives
    expect(result.narrative).toContain('The kingdom endures');
  });
});
