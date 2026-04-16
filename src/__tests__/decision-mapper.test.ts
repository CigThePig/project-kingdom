import { describe, it, expect } from 'vitest';
import { mapMonthDecisionsToActions } from '../bridge/decisionMapper';
import { ActionType, InteractionType, SeasonMonth } from '../engine/types';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../bridge/petitionCardGenerator';
import type { MonthDecision } from '../ui/types';

function makeCrisis(id: string): CrisisPhaseData {
  return {
    crisisCard: {
      eventId: id,
      definitionId: `def_${id}`,
      title: `Crisis ${id}`,
      body: 'Test',
      effects: [],
    },
    responses: [
      { id: `${id}:choice_a`, choiceId: 'choice_a', title: 'A', effects: [], signals: [], slotCost: 1, isFree: false },
      { id: `${id}:choice_b`, choiceId: 'choice_b', title: 'B', effects: [], signals: [], slotCost: 0, isFree: true },
    ],
  };
}

function makePetition(id: string): PetitionCardData {
  return {
    eventId: id,
    definitionId: `def_${id}`,
    title: `Petition ${id}`,
    body: 'Test',
    grantChoiceId: 'grant',
    denyChoiceId: 'deny',
    grantEffects: [],
    denyEffects: [],
    grantSignals: [],
    denySignals: [],
    allChoices: [],
  };
}

function makeNotification(id: string): NotificationCardData {
  return {
    eventId: id,
    definitionId: `def_${id}`,
    title: `Notice ${id}`,
    body: 'Test',
    acknowledgeChoiceId: 'acknowledge',
  };
}

describe('mapMonthDecisionsToActions', () => {
  it('maps notification decision to QueuedAction', () => {
    const notif = makeNotification('n1');
    const decisions: MonthDecision[] = [{
      cardId: 'n1',
      choiceId: 'acknowledge',
      interactionType: InteractionType.Notification,
      month: SeasonMonth.Early,
    }];

    const actions = mapMonthDecisionsToActions(decisions, [], [], [], null, [], [notif]);

    expect(actions.length).toBe(1);
    expect(actions[0].type).toBe(ActionType.CrisisResponse);
    expect(actions[0].actionDefinitionId).toBe('def_n1');
    expect(actions[0].parameters.choiceId).toBe('acknowledge');
    expect(actions[0].isFree).toBe(true);
    expect(actions[0].slotCost).toBe(0);
  });

  it('maps multiple crisis decisions against correct source data', () => {
    const crisis1 = makeCrisis('c1');
    const crisis2 = makeCrisis('c2');
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

    const actions = mapMonthDecisionsToActions(decisions, [], [crisis1, crisis2], [], null, []);

    expect(actions.length).toBe(2);

    // First crisis maps to crisis1 data
    expect(actions[0].actionDefinitionId).toBe('def_c1');
    expect(actions[0].parameters.choiceId).toBe('choice_a');
    expect(actions[0].slotCost).toBe(1);

    // Second crisis maps to crisis2 data
    expect(actions[1].actionDefinitionId).toBe('def_c2');
    expect(actions[1].parameters.choiceId).toBe('choice_b');
    expect(actions[1].slotCost).toBe(0);
  });

  it('handles mixed decisions (crisis + petition + notification)', () => {
    const crisis = makeCrisis('c1');
    const petition = makePetition('p1');
    const notif = makeNotification('n1');
    const decisions: MonthDecision[] = [
      {
        cardId: 'c1',
        choiceId: 'c1:choice_a',
        interactionType: InteractionType.CrisisResponse,
        month: SeasonMonth.Early,
      },
      {
        cardId: 'p1',
        choiceId: 'grant',
        interactionType: InteractionType.Petition,
        month: SeasonMonth.Mid,
      },
      {
        cardId: 'n1',
        choiceId: 'acknowledge',
        interactionType: InteractionType.Notification,
        month: SeasonMonth.Late,
      },
    ];

    const actions = mapMonthDecisionsToActions(
      decisions, [], [crisis], [petition], null, [], [notif],
    );

    expect(actions.length).toBe(3);
    expect(actions[0].actionDefinitionId).toBe('def_c1');
    expect(actions[1].actionDefinitionId).toBe('def_p1');
    expect(actions[2].actionDefinitionId).toBe('def_n1');
  });

  it('maps storyline crisis decision with storylineId and branchPointId', () => {
    const storylineCrisis: CrisisPhaseData = {
      crisisCard: {
        eventId: 'storyline:sl_001',
        definitionId: 'def_plague_arc',
        title: 'The Spreading Plague',
        body: 'Test',
        effects: [{ label: 'STORYLINE', type: 'warning' }],
        storylineId: 'sl_001',
        branchPointId: 'branch_mid',
      },
      responses: [
        { id: 'storyline:sl_001:quarantine', choiceId: 'quarantine', title: 'Quarantine', effects: [], signals: [], slotCost: 0, isFree: true },
        { id: 'storyline:sl_001:ignore', choiceId: 'ignore', title: 'Ignore', effects: [], signals: [], slotCost: 0, isFree: true },
      ],
    };
    const decisions: MonthDecision[] = [{
      cardId: 'storyline:sl_001',
      choiceId: 'storyline:sl_001:quarantine',
      interactionType: InteractionType.CrisisResponse,
      month: SeasonMonth.Early,
    }];

    const actions = mapMonthDecisionsToActions(decisions, [], [storylineCrisis], [], null, []);

    expect(actions.length).toBe(1);
    expect(actions[0].parameters.storylineId).toBe('sl_001');
    expect(actions[0].parameters.branchPointId).toBe('branch_mid');
    expect(actions[0].parameters.choiceId).toBe('quarantine');
    expect(actions[0].parameters).not.toHaveProperty('eventId');
    expect(actions[0].actionDefinitionId).toBe('def_plague_arc');
    expect(actions[0].isFree).toBe(true);
  });

  it('falls back to decision fields when crisis data is not found', () => {
    const decisions: MonthDecision[] = [{
      cardId: 'unknown',
      choiceId: 'choice_x',
      interactionType: InteractionType.CrisisResponse,
      month: SeasonMonth.Early,
    }];

    const actions = mapMonthDecisionsToActions(decisions, [], [], [], null, []);

    expect(actions.length).toBe(1);
    expect(actions[0].actionDefinitionId).toBe('unknown');
    expect(actions[0].parameters.choiceId).toBe('choice_x');
  });
});
