// Phase A — Smart Text Substitution
// Table-driven coverage for the tokens wired up in smartText.ts. Each row
// exercises happy-path resolution and missing-context fallback so that
// authored templates can rely on documented behavior.

import { describe, it, expect } from 'vitest';
import { substituteSmartPlaceholders } from '../bridge/smartText';
import type { SmartTextContext } from '../bridge/smartText';
import { createDefaultScenario } from '../data/scenarios/default';
import {
  ConditionSeverity,
  ConditionType,
  CouncilSeat,
  EventCategory,
  PopulationClass,
  RegionalPosture,
  RivalCrisisType,
  Season,
  StorylineCategory,
  StorylineStatus,
  StyleAxis,
} from '../engine/types';
import type {
  ActiveStoryline,
  Bond,
  CausalChain,
  GameState,
  InterRivalAgreement,
  KingdomCondition,
  PersistentConsequence,
  RivalMemoryEntry,
} from '../engine/types';

function mutate(state: GameState, fn: (s: GameState) => void): GameState {
  fn(state);
  return state;
}

describe('substituteSmartPlaceholders', () => {
  it('returns text untouched when it has no placeholders', () => {
    const state = createDefaultScenario();
    expect(substituteSmartPlaceholders('plain text', state)).toBe('plain text');
  });

  it('leaves unknown tokens in place so drift is visible', () => {
    const state = createDefaultScenario();
    expect(substituteSmartPlaceholders('{not_a_token}', state)).toBe('{not_a_token}');
  });

  it('is a no-op on empty input', () => {
    const state = createDefaultScenario();
    expect(substituteSmartPlaceholders('', state)).toBe('');
  });

  // ----------------------------------------------------------------
  // §3.1 Identity — neighbor
  // ----------------------------------------------------------------

  describe('neighbor identity tokens', () => {
    it('resolves {neighbor} to displayName when neighborId is in context', () => {
      const state = createDefaultScenario();
      const nb = state.diplomacy.neighbors[0];
      const ctx: SmartTextContext = { neighborId: nb.id };
      const display = nb.displayName ?? nb.id;
      expect(substituteSmartPlaceholders('{neighbor}', state, ctx)).toBe(display);
    });

    it('preserves literal {neighbor} when context is missing (legacy behavior)', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{neighbor}', state)).toBe('{neighbor}');
    });

    it('strips common prefixes for {neighbor_short}', () => {
      const state = createDefaultScenario();
      const nb = state.diplomacy.neighbors[0];
      const ctx: SmartTextContext = { neighborId: nb.id };
      const result = substituteSmartPlaceholders('{neighbor_short}', state, ctx);
      expect(result).not.toMatch(/^Kingdom of /);
      expect(result).not.toMatch(/^Realm of /);
      expect(result).not.toMatch(/^The /);
    });

    it('falls back to "their realm" for {neighbor_short} when context is missing', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{neighbor_short}', state)).toBe('their realm');
    });

    it('resolves ruler tokens from neighbor state', () => {
      const state = createDefaultScenario();
      const nb = state.diplomacy.neighbors[0];
      const ctx: SmartTextContext = { neighborId: nb.id };
      expect(substituteSmartPlaceholders('{ruler}', state, ctx)).toBeTruthy();
      expect(substituteSmartPlaceholders('{ruler_full}', state, ctx)).toBeTruthy();
      expect(substituteSmartPlaceholders('{ruler_title}', state, ctx)).toBeTruthy();
    });

    it('falls back to "the ruler" when neighborId is missing', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{ruler}', state)).toBe('the ruler');
      expect(substituteSmartPlaceholders('{ruler_full}', state)).toBe('the ruler');
      expect(substituteSmartPlaceholders('{ruler_title}', state)).toBe('the ruler');
    });

    it('resolves {dynasty} and {capital}, falls back cleanly without context', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{dynasty}', state)).toBe('the royal house');
      expect(substituteSmartPlaceholders('{capital}', state)).toBe('the capital');
    });

    it('resolves {epithet} to empty string when no epithet is set', () => {
      const state = createDefaultScenario();
      const nb = state.diplomacy.neighbors[0];
      const ctx: SmartTextContext = { neighborId: nb.id };
      const result = substituteSmartPlaceholders('{epithet}', state, ctx);
      expect(typeof result).toBe('string');
    });
  });

  // ----------------------------------------------------------------
  // §3.1 Identity — region & settlement
  // ----------------------------------------------------------------

  describe('region & settlement tokens', () => {
    it('resolves {region} to the region display name', () => {
      const state = createDefaultScenario();
      const region = state.regions[0];
      const ctx: SmartTextContext = { regionId: region.id };
      const display = region.displayName ?? region.id;
      expect(substituteSmartPlaceholders('{region}', state, ctx)).toBe(display);
    });

    it('falls back to "the province" when regionId is missing', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{region}', state)).toBe('the province');
    });

    it('falls back to "the settlement" when settlementId is missing', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{settlement}', state)).toBe('the settlement');
    });
  });

  // ----------------------------------------------------------------
  // §3.1 Identity — council seats
  // ----------------------------------------------------------------

  describe('council seat tokens', () => {
    it('uses the appointed advisor name when present', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.council = s.council ?? { appointments: {}, pendingCandidates: [] };
        s.council.appointments = {
          ...s.council.appointments,
          [CouncilSeat.Chancellor]: {
            id: 'adv_1',
            name: 'Lord Bannerly',
            seat: CouncilSeat.Chancellor,
          } as never,
        };
      });
      expect(substituteSmartPlaceholders('{chancellor}', state)).toBe('Lord Bannerly');
    });

    it('falls back to "your <seat>" when the seat is empty', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{chancellor}', state)).toBe('your chancellor');
      expect(substituteSmartPlaceholders('{marshal}', state)).toBe('your marshal');
      expect(substituteSmartPlaceholders('{chamberlain}', state)).toBe('your chamberlain');
      expect(substituteSmartPlaceholders('{spymaster}', state)).toBe('your spymaster');
    });

    it('resolves the _or_fallback variants', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{chancellor_or_fallback}', state)).toBe('your chancellor');
      expect(substituteSmartPlaceholders('{marshal_or_fallback}', state)).toBe('your marshal');
    });
  });

  // ----------------------------------------------------------------
  // §3.1 Identity — active entities by title
  // ----------------------------------------------------------------

  describe('active entity title tokens', () => {
    it('falls back to generic phrase for {initiative_title} when none active', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{initiative_title}', state))
        .toBe('the long-term initiative');
    });

    it('falls back to generic phrase for {storyline_title} when none active', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{storyline_title}', state))
        .toBe('the unfolding matter');
    });

    it('falls back to generic phrase for {world_event_title} when none active', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{world_event_title}', state))
        .toBe('the region-wide event');
    });
  });

  // ----------------------------------------------------------------
  // §3.2 Situational — time
  // ----------------------------------------------------------------

  describe('time tokens', () => {
    it('resolves {season} to the current season', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{season}', state)).toBe(Season.Spring);
    });

    it('resolves {month_name} to the thematic month name', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{month_name}', state)).toBe('Early Thaw');
    });

    it('resolves {year} as an ordinal reign year', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{year}', state)).toBe('the 1st year of your reign');
    });
  });

  // ----------------------------------------------------------------
  // §3.2 Situational — economy
  // ----------------------------------------------------------------

  describe('economy tokens', () => {
    it('resolves {economic_phase} and lowercase variant', () => {
      const state = createDefaultScenario();
      const phase = substituteSmartPlaceholders('{economic_phase}', state);
      const phaseLc = substituteSmartPlaceholders('{economic_phase_lc}', state);
      expect(phase).toBeTruthy();
      expect(phaseLc).toBe(phase.toLowerCase());
    });

    it('emits an empty {inflation_note} for inflation below the threshold', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.economy.inflationRate = 0.02;
      });
      expect(substituteSmartPlaceholders('{inflation_note}', state)).toBe('');
    });

    it('emits a percentage {inflation_note} for high inflation', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.economy.inflationRate = 0.18;
      });
      expect(substituteSmartPlaceholders('{inflation_note}', state))
        .toBe('with inflation at 18%');
    });

    it('produces a non-empty treasury tier label', () => {
      const state = createDefaultScenario();
      const tier = substituteSmartPlaceholders('{treasury_tier}', state);
      expect(['Dire', 'Troubled', 'Stable', 'Prosperous', 'Flourishing']).toContain(tier);
    });

    it('produces a non-empty stores tier label', () => {
      const state = createDefaultScenario();
      const tier = substituteSmartPlaceholders('{stores_tier}', state);
      expect(['Dire', 'Troubled', 'Stable', 'Prosperous', 'Flourishing']).toContain(tier);
    });

    it('reports {intel_tier} from espionage network strength', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.espionage.networkStrength = 50;
      });
      expect(substituteSmartPlaceholders('{intel_tier}', state)).toBe('moderate');
    });

    it('reports "no intel" for a dormant espionage network', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.espionage.networkStrength = 0;
      });
      expect(substituteSmartPlaceholders('{intel_tier}', state)).toBe('no intel');
    });
  });

  // ----------------------------------------------------------------
  // §3.2 Situational — geography & posture
  // ----------------------------------------------------------------

  describe('geography & posture tokens', () => {
    it('resolves {terrain} from the region in context', () => {
      const state = createDefaultScenario();
      const region = state.regions[0];
      const ctx: SmartTextContext = { regionId: region.id };
      expect(substituteSmartPlaceholders('{terrain}', state, ctx)).toBeTruthy();
    });

    it('falls back to "the land" for {terrain} with no regionId', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{terrain}', state)).toBe('the land');
    });

    it('resolves {region_posture} from the region posture field', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.regions[0].posture = RegionalPosture.Garrison;
      });
      const ctx: SmartTextContext = { regionId: state.regions[0].id };
      expect(substituteSmartPlaceholders('{region_posture}', state, ctx)).toBe('Garrison');
    });

    it('falls back to "Autonomy" for {region_posture} with no regionId', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{region_posture}', state)).toBe('Autonomy');
    });

    it('resolves {diplomatic_posture} to a posture label', () => {
      const state = createDefaultScenario();
      const nb = state.diplomacy.neighbors[0];
      const ctx: SmartTextContext = { neighborId: nb.id };
      const result = substituteSmartPlaceholders('{diplomatic_posture}', state, ctx);
      expect(result).toBeTruthy();
    });

    it('falls back to "Neutral Standing" for {diplomatic_posture} with no neighborId', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{diplomatic_posture}', state))
        .toBe('Neutral Standing');
    });

    it('{posture} prefers region context when both are available', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.regions[0].posture = RegionalPosture.Extract;
      });
      const ctx: SmartTextContext = {
        regionId: state.regions[0].id,
        neighborId: state.diplomacy.neighbors[0].id,
      };
      expect(substituteSmartPlaceholders('{posture}', state, ctx)).toBe('Extract');
    });

    it('{posture} falls back to a neutral label with no context', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{posture}', state)).toBe('Neutral Standing');
    });
  });

  // ----------------------------------------------------------------
  // §3.2 Situational — faith & culture
  // ----------------------------------------------------------------

  describe('faith & culture tokens', () => {
    it('title-cases the faith tradition id', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.faithCulture.kingdomFaithTraditionId = 'sun_and_flame';
      });
      expect(substituteSmartPlaceholders('{faith_tradition}', state))
        .toBe('Sun And Flame');
    });

    it('title-cases the culture identity id', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.faithCulture.kingdomCultureIdentityId = 'highland-riverlands';
      });
      expect(substituteSmartPlaceholders('{culture_identity}', state))
        .toBe('Highland Riverlands');
    });
  });

  // ----------------------------------------------------------------
  // §3.5 Grammar helpers (gender-neutral defaults)
  // ----------------------------------------------------------------

  describe('grammar helper tokens', () => {
    it('resolves pronoun helpers to gender-neutral defaults', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{their/his/her}', state)).toBe('their');
      expect(substituteSmartPlaceholders('{They/He/She}', state)).toBe('They');
      expect(substituteSmartPlaceholders('{is/was}', state)).toBe('is');
    });
  });

  // ----------------------------------------------------------------
  // §3.2 Situational — military & region tiers (Phase C)
  // ----------------------------------------------------------------

  describe('military & region tier tokens (Phase C)', () => {
    it('resolves {morale_tier} across the banded range', () => {
      const cases: Array<[number, string]> = [
        [10, 'broken'],
        [30, 'shaken'],
        [50, 'steady'],
        [70, 'confident'],
        [90, 'ardent'],
      ];
      for (const [value, expected] of cases) {
        const state = mutate(createDefaultScenario(), (s) => {
          s.military.morale = value;
        });
        expect(substituteSmartPlaceholders('{morale_tier}', state)).toBe(expected);
      }
    });

    it('resolves {equipment_condition_tier} across the banded range', () => {
      const cases: Array<[number, string]> = [
        [10, 'ruined'],
        [30, 'worn'],
        [50, 'serviceable'],
        [70, 'sound'],
        [90, 'pristine'],
      ];
      for (const [value, expected] of cases) {
        const state = mutate(createDefaultScenario(), (s) => {
          s.military.equipmentCondition = value;
        });
        expect(substituteSmartPlaceholders('{equipment_condition_tier}', state))
          .toBe(expected);
      }
    });

    it('resolves {loyalty_tier} from the region in context', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.regions[0].loyalty = 10;
      });
      const ctx: SmartTextContext = { regionId: state.regions[0].id };
      expect(substituteSmartPlaceholders('{loyalty_tier}', state, ctx))
        .toBe('rebellious');
    });

    it('{loyalty_tier} falls back to "settled" with no region context', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{loyalty_tier}', state)).toBe('settled');
    });
  });

  // ----------------------------------------------------------------
  // §3.2 Situational — parameterised active conditions (Phase C)
  // ----------------------------------------------------------------

  describe('condition tokens (Phase C)', () => {
    function makeCondition(
      type: ConditionType,
      severity: ConditionSeverity,
      regionId: string | null,
    ): KingdomCondition {
      return {
        id: `cond_${type}_test`,
        type,
        severity,
        turnsActive: 1,
        turnsRemaining: null,
        systemEffects: [],
        regionId,
        canEscalate: false,
        escalatesTo: null,
      };
    }

    it('resolves {condition:Drought} to a severity + label phrase when active kingdom-wide', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.environment.activeConditions.push(
          makeCondition(ConditionType.Drought, ConditionSeverity.Severe, null),
        );
      });
      expect(substituteSmartPlaceholders('{condition:Drought}', state))
        .toBe('a severe Drought');
    });

    it('prefers a region-scoped condition match over kingdom-wide', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        const regionId = s.regions[0].id;
        s.regions[0].localConditions = [
          makeCondition(ConditionType.Blight, ConditionSeverity.Mild, regionId),
        ];
        s.environment.activeConditions.push(
          makeCondition(ConditionType.Blight, ConditionSeverity.Severe, null),
        );
      });
      const ctx: SmartTextContext = { regionId: state.regions[0].id };
      // Region match wins (mild) over kingdom-wide (severe).
      expect(substituteSmartPlaceholders('{condition:Blight}', state, ctx))
        .toBe('a mild Crop Blight');
    });

    it('returns empty string when no matching condition is active', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{condition:Plague}', state)).toBe('');
    });

    it('ignores an unknown condition arg gracefully', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{condition:NotAThing}', state)).toBe('');
    });

    it('lists active conditions in {condition_context}', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.environment.activeConditions.push(
          makeCondition(ConditionType.Drought, ConditionSeverity.Severe, null),
          makeCondition(ConditionType.Banditry, ConditionSeverity.Moderate, null),
        );
      });
      expect(substituteSmartPlaceholders('{condition_context}', state))
        .toBe('already gripped by Drought and Banditry');
    });

    it('{condition_context} is empty when nothing is active', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{condition_context}', state)).toBe('');
    });
  });

  // ----------------------------------------------------------------
  // §3.1 Identity — bonds (Phase C)
  // ----------------------------------------------------------------

  describe('bond tokens (Phase C)', () => {
    it('resolves {bond_kind} from a known bondId', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        const bond: Bond = {
          bondId: 'royal_marriage_t1_abc',
          kind: 'royal_marriage',
          turnStarted: 1,
          turnsRemaining: null,
          participants: [s.diplomacy.neighbors[0].id],
          breachPenalty: -10,
          spouseName: 'Lady Sarielle',
          dynastyId: 'house_marrowmoor',
          heirProduced: false,
        };
        s.diplomacy.bonds = [bond];
      });
      const ctx: SmartTextContext = { bondId: 'royal_marriage_t1_abc' };
      expect(substituteSmartPlaceholders('{bond_kind}', state, ctx))
        .toBe('royal marriage');
    });

    it('falls back to "bond" when no bondId context is supplied', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{bond_kind}', state)).toBe('bond');
    });
  });

  // ----------------------------------------------------------------
  // §3.4 Stakes — rival-scoped (Phase C)
  // ----------------------------------------------------------------

  describe('rival mood / crisis / economic-phase tokens (Phase C)', () => {
    it('resolves {rival_mood:id} across bands', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.diplomacy.neighbors[0].kingdomSimulation!.populationMood = 15;
      });
      const id = state.diplomacy.neighbors[0].id;
      expect(substituteSmartPlaceholders(`{rival_mood:${id}}`, state))
        .toBe('restive');
    });

    it('falls back to ctx.neighborId when rival_mood arg is absent', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.diplomacy.neighbors[0].kingdomSimulation!.populationMood = 85;
      });
      const ctx: SmartTextContext = { neighborId: state.diplomacy.neighbors[0].id };
      expect(substituteSmartPlaceholders('{rival_mood}', state, ctx))
        .toBe('jubilant');
    });

    it('returns "settled" when no neighbor context is available at all', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{rival_mood}', state)).toBe('settled');
    });

    it('resolves {rival_crisis:id} to a crisis clause when the neighbor is in crisis', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        const sim = s.diplomacy.neighbors[0].kingdomSimulation!;
        sim.isInCrisis = true;
        sim.crisisType = RivalCrisisType.Famine;
      });
      const id = state.diplomacy.neighbors[0].id;
      expect(substituteSmartPlaceholders(`{rival_crisis:${id}}`, state))
        .toBe('facing a grain failure of their own');
    });

    it('returns empty string when the rival is not in crisis', () => {
      const state = createDefaultScenario();
      const id = state.diplomacy.neighbors[0].id;
      expect(substituteSmartPlaceholders(`{rival_crisis:${id}}`, state)).toBe('');
    });

    it('resolves {rival_economic_phase_lc} across bands', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.diplomacy.neighbors[0].kingdomSimulation!.treasuryHealth = 90;
      });
      const id = state.diplomacy.neighbors[0].id;
      expect(substituteSmartPlaceholders(`{rival_economic_phase_lc:${id}}`, state))
        .toBe('boom');
    });

    it('{rival_economic_phase} title-cases the label', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.diplomacy.neighbors[0].kingdomSimulation!.treasuryHealth = 10;
      });
      const id = state.diplomacy.neighbors[0].id;
      expect(substituteSmartPlaceholders(`{rival_economic_phase:${id}}`, state))
        .toBe('Depression');
    });
  });

  // ----------------------------------------------------------------
  // §3.3 Memory tokens — Phase D
  // ----------------------------------------------------------------

  describe('Phase D — memory clause tokens', () => {
    // ---- prior_decision_clause ---------------------------------

    it('{prior_decision_clause} emits an empty string on a fresh scenario', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{prior_decision_clause:merchant}', state))
        .toBe('');
    });

    it('{prior_decision_clause:trade} resolves with a season count', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.turn.turnNumber = 10;
        const pc: PersistentConsequence = {
          sourceId: 'decree_market_charter',
          sourceType: 'event',
          choiceMade: 'enact',
          turnApplied: 7,
          tag: 'decree:trade_agreement',
        };
        s.persistentConsequences = [pc];
      });
      expect(substituteSmartPlaceholders('{prior_decision_clause:trade}', state))
        .toBe(' — echoes of a decision 3 seasons past');
    });

    it('{prior_decision_clause} renders "a season past" for a single-season delta', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.turn.turnNumber = 5;
        s.persistentConsequences = [{
          sourceId: 'evt_x',
          sourceType: 'event',
          choiceMade: 'c',
          turnApplied: 4,
          tag: 'evt_conscription_levy:offer',
        }];
      });
      expect(substituteSmartPlaceholders('{prior_decision_clause:conscription}', state))
        .toBe(' — echoes of a decision a season past');
    });

    it('{prior_decision_clause} ignores prefixes that do not match', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.persistentConsequences = [{
          sourceId: 'evt_x',
          sourceType: 'event',
          choiceMade: 'c',
          turnApplied: s.turn.turnNumber - 2,
          tag: 'decree:religious_reform',
        }];
      });
      expect(substituteSmartPlaceholders('{prior_decision_clause:trade}', state))
        .toBe('');
    });

    it('{prior_decision_clause} ignores consequences older than the age cap', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.turn.turnNumber = 30;
        s.persistentConsequences = [{
          sourceId: 'evt_x',
          sourceType: 'event',
          choiceMade: 'c',
          turnApplied: 1, // 29 turns ago, well past the 8-turn cap
          tag: 'decree:trade_agreement',
        }];
      });
      expect(substituteSmartPlaceholders('{prior_decision_clause:trade}', state))
        .toBe('');
    });

    // ---- neighbor_memory_clause --------------------------------

    it('{neighbor_memory_clause} is empty when no neighborId is supplied', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{neighbor_memory_clause}', state))
        .toBe('');
    });

    it('{neighbor_memory_clause} is empty when memory weights are below threshold', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        const entry: RivalMemoryEntry = {
          turnRecorded: s.turn.turnNumber - 1,
          type: 'breach',
          source: 'bond_breach:royal_marriage:reason',
          weight: 0.1,
          context: 'low-weight breach',
        };
        s.diplomacy.neighbors[0].memory = [entry];
      });
      const ctx: SmartTextContext = { neighborId: state.diplomacy.neighbors[0].id };
      expect(substituteSmartPlaceholders('{neighbor_memory_clause}', state, ctx))
        .toBe('');
    });

    it('{neighbor_memory_clause} renders a sentence for a strong breach memory', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.diplomacy.neighbors[0].memory = [{
          turnRecorded: s.turn.turnNumber - 2,
          type: 'breach',
          source: 'bond_breach:royal_marriage:succession_dispute',
          weight: 0.7,
          context: 'marriage broken',
        }];
      });
      const nb = state.diplomacy.neighbors[0];
      const ctx: SmartTextContext = { neighborId: nb.id };
      const out = substituteSmartPlaceholders('{neighbor_memory_clause}', state, ctx);
      expect(out).toMatch(/has not forgotten the broken marriage pact\.$/);
      // Subject should be the short form, not "Kingdom of …"
      expect(out).not.toContain('Kingdom of');
    });

    it('{neighbor_memory_clause} prefers a higher-weight entry over a lower-weight one', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.diplomacy.neighbors[0].memory = [
          {
            turnRecorded: s.turn.turnNumber - 1,
            type: 'favor',
            source: 'overture_granted',
            weight: 0.9,
            context: 'favor',
          },
          {
            turnRecorded: s.turn.turnNumber - 1,
            type: 'breach',
            source: 'bond_breach:vassalage:revolt',
            weight: 0.5,
            context: 'breach',
          },
        ];
      });
      const ctx: SmartTextContext = { neighborId: state.diplomacy.neighbors[0].id };
      const out = substituteSmartPlaceholders('{neighbor_memory_clause}', state, ctx);
      expect(out).toContain('still remembers your kindness');
    });

    // ---- ruling_style_note -------------------------------------

    it('{ruling_style_note} is empty on a freshly-started reign', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{ruling_style_note}', state)).toBe('');
    });

    it('{ruling_style_note} surfaces the dominant positive axis as Martial reign', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.rulingStyle.axes[StyleAxis.Military] = 25;
      });
      expect(substituteSmartPlaceholders('{ruling_style_note}', state))
        .toBe(' as befits your Martial reign');
    });

    it('{ruling_style_note} surfaces the dominant negative axis as Pacifist reign', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.rulingStyle.axes[StyleAxis.Military] = -22;
      });
      expect(substituteSmartPlaceholders('{ruling_style_note}', state))
        .toBe(' as befits your Pacifist reign');
    });

    it('{ruling_style_note} stays empty when the axis lean is below the threshold', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.rulingStyle.axes[StyleAxis.Faith] = 18;
      });
      expect(substituteSmartPlaceholders('{ruling_style_note}', state)).toBe('');
    });

    // ---- recent_causal -----------------------------------------

    function makeChain(
      rootSystem: string,
      rootDesc: string,
      effectSystem: string,
      effectDesc: string,
      magnitude: number,
      turn: number,
    ): CausalChain {
      return {
        id: `chain_t${turn}_${rootDesc}`,
        rootCause: { system: rootSystem, description: rootDesc, numericDelta: null },
        finalEffect: { system: effectSystem, description: effectDesc, numericDelta: -magnitude },
        intermediateSteps: [],
        totalMagnitude: magnitude,
        turnRecorded: turn,
      };
    }

    it('{recent_causal} is empty when the ledger has no chains', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{recent_causal}', state)).toBe('');
    });

    it('{recent_causal} renders a humanized clause for a known chain', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.causalLedger.recentChains = [
          makeChain('environment', 'condition_food_penalty', 'food', 'production_decreased', 20, 4),
        ];
      });
      const out = substituteSmartPlaceholders('{recent_causal}', state);
      expect(out.startsWith(' — ')).toBe(true);
      expect(out).toContain('blight');
      expect(out).toContain('reduced harvests');
    });

    it('{recent_causal} declines to emit when chain descriptions cannot be humanized', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.causalLedger.recentChains = [
          makeChain('xxx', 'unknown_root', 'yyy', 'unknown_effect', 50, 4),
        ];
      });
      expect(substituteSmartPlaceholders('{recent_causal}', state)).toBe('');
    });

    // ---- inter_rival_note --------------------------------------

    it('{inter_rival_note} is empty when no neighborId is in context', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{inter_rival_note}', state)).toBe('');
    });

    it('{inter_rival_note} surfaces a recent trade pact between two rivals', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        const [a, b] = s.diplomacy.neighbors;
        const lo = a.id < b.id ? a.id : b.id;
        const hi = a.id < b.id ? b.id : a.id;
        const ag: InterRivalAgreement = {
          id: `${lo}_${hi}_trade_pact_t1`,
          kind: 'trade_pact',
          a: lo,
          b: hi,
          turnStarted: 1,
          sharedTargetId: null,
        };
        s.diplomacy.interRivalAgreements = [ag];
      });
      const target = state.diplomacy.neighbors[0];
      const other = state.diplomacy.neighbors[1];
      const ctx: SmartTextContext = { neighborId: target.id };
      const out = substituteSmartPlaceholders('{inter_rival_note}', state, ctx);
      const otherShort = (other.displayName ?? other.id)
        .replace(/^Kingdom of /, '')
        .replace(/^Realm of /, '')
        .replace(/^Crown of /, '')
        .replace(/^Free Cities of /, '')
        .replace(/^The /, '')
        .replace(/ Dominion$/, '')
        .replace(/ Confederation$/, '')
        .replace(/ Marches$/, '');
      expect(out).toContain('fresh from signing a trade pact with');
      expect(out).toContain(otherShort);
    });

    it('{inter_rival_note} renders alliances and wars distinctly', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        const [a, b] = s.diplomacy.neighbors;
        const lo = a.id < b.id ? a.id : b.id;
        const hi = a.id < b.id ? b.id : a.id;
        s.diplomacy.interRivalAgreements = [
          { id: `${lo}_${hi}_alliance_t2`, kind: 'alliance', a: lo, b: hi, turnStarted: 2, sharedTargetId: 'player' },
        ];
      });
      const ctx: SmartTextContext = { neighborId: state.diplomacy.neighbors[0].id };
      expect(substituteSmartPlaceholders('{inter_rival_note}', state, ctx))
        .toContain('bound in alliance with');
    });

    // ---- watching_faction --------------------------------------

    it('{watching_faction} is empty when no class is under pressure', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{watching_faction}', state)).toBe('');
    });

    it('{watching_faction} surfaces a class with low satisfaction', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.population[PopulationClass.Merchants].satisfaction = 22;
        s.population[PopulationClass.Merchants].satisfactionDeltaLastTurn = 0;
      });
      expect(substituteSmartPlaceholders('{watching_faction}', state))
        .toBe(' — the merchants watch closely');
    });

    it('{watching_faction} prefers an explicit ctx.classId over scanning', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.population[PopulationClass.Clergy].satisfaction = 20;
      });
      const ctx: SmartTextContext = { classId: PopulationClass.Nobility };
      expect(substituteSmartPlaceholders('{watching_faction}', state, ctx))
        .toBe(' — the nobles watch closely');
    });

    // ---- storyline_arc_note ------------------------------------

    it('{storyline_arc_note} is empty when no storyline is active', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{storyline_arc_note}', state)).toBe('');
    });

    it('{storyline_arc_note} renders the active storyline title', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        const sl: ActiveStoryline = {
          id: 'sl_active_1',
          definitionId: 'sl_exp_council_of_lords',
          category: StorylineCategory.Political,
          status: StorylineStatus.Active,
          currentBranchId: 'bp_council_lords_opening',
          decisionHistory: [],
          turnActivated: 1,
          turnsUntilNextBranchPoint: 3,
        };
        s.activeStorylines = [sl];
      });
      expect(substituteSmartPlaceholders('{storyline_arc_note}', state))
        .toBe(' — a beat in the unfolding The Council of Lords');
    });

    // ---- recent_causal — category biasing ----------------------

    it('{recent_causal} biases its pick toward ctx.eventCategory when supplied', () => {
      const state = mutate(createDefaultScenario(), (s) => {
        s.causalLedger.recentChains = [
          // Higher magnitude in food, but not category-aligned to Diplomacy.
          makeChain('food', 'production_decreased', 'food', 'reserves_changed', 50, 4),
          // Lower magnitude, but category-aligned to Diplomacy.
          makeChain('diplomacy', 'condition_trade_penalty', 'treasury', 'trade_income_reduced', 10, 4),
        ];
      });
      const ctx: SmartTextContext = { eventCategory: EventCategory.Diplomacy };
      const out = substituteSmartPlaceholders('{recent_causal}', state, ctx);
      // Either chain has humanizable nodes, but the diplomacy-biased chain
      // surfaces "trade routes" / "trade revenues weakened".
      expect(out).toContain('trade');
    });

    // ---- composability — empty clauses do not break templates ----

    it('empty memory clauses degrade silently inside a longer template', () => {
      const state = createDefaultScenario();
      const tpl = 'Body text.{ruling_style_note}{recent_causal}';
      expect(substituteSmartPlaceholders(tpl, state)).toBe('Body text.');
    });

    // ---- {agent:id} — resolver landed in Phase E (Agent Burn Extraction) --

    it('{agent:id} resolves to the agent codename when the id matches', () => {
      const state = createDefaultScenario();
      state.espionage!.agents = [
        {
          id: 'agent_abc',
          codename: 'Shrike',
          specialization: 'Court' as never,
          coverSettlementId: 'settlement_x',
          reliability: 50,
          burnRisk: 10,
          status: 'Active' as never,
          recruitedTurn: 1,
        },
      ];
      expect(substituteSmartPlaceholders('{agent:agent_abc}', state)).toBe('Shrike');
    });

    it('{agent:id} falls back to "the agent" when no agent matches', () => {
      const state = createDefaultScenario();
      expect(substituteSmartPlaceholders('{agent:missing_id}', state)).toBe('the agent');
    });
  });

  // ----------------------------------------------------------------
  // Regression — byte-equality for {neighbor}-only corpus text
  // ----------------------------------------------------------------

  describe('legacy {neighbor}-only substitution regression', () => {
    it('produces identical output to direct regex replacement when only {neighbor} is used', () => {
      const state = createDefaultScenario();
      const nb = state.diplomacy.neighbors[0];
      const ctx: SmartTextContext = { neighborId: nb.id };
      const sample =
        'The envoys of {neighbor} arrive at court. {neighbor}\'s banners fly above the road.';
      const display = nb.displayName ?? nb.id;
      const expected = sample.replace(/\{neighbor\}/g, display);
      expect(substituteSmartPlaceholders(sample, state, ctx)).toBe(expected);
    });
  });

  // ----------------------------------------------------------------
  // Multiple tokens in one string
  // ----------------------------------------------------------------

  describe('multi-token substitution', () => {
    it('resolves several tokens in a single pass', () => {
      const state = createDefaultScenario();
      const out = substituteSmartPlaceholders(
        'In the {month_name}, {season} lies on the land.',
        state,
      );
      expect(out).toBe('In the Early Thaw, Spring lies on the land.');
    });
  });
});

// ----------------------------------------------------------------
// Phase B — Integration: real authored bodies render through
// substituteSmartPlaceholders with no raw `{...}` tokens left behind.
// ----------------------------------------------------------------

describe('Phase B — authored text resolves end-to-end', () => {
  it('resolves identity tokens in EXPANSION_DIPLOMACY_TEXT bodies', async () => {
    const { EXPANSION_DIPLOMACY_TEXT } = await import(
      '../data/text/expansion/diplomacy-text'
    );
    const state = createDefaultScenario();
    const nb = state.diplomacy.neighbors[0];
    const ctx: SmartTextContext = { neighborId: nb.id };
    const entry = EXPANSION_DIPLOMACY_TEXT.evt_exp_dip_foreign_emissary_arrives;
    const body = substituteSmartPlaceholders(entry.body, state, ctx);
    // Resolved kingdom + capital should appear; no raw placeholders left.
    expect(body).toContain(nb.capitalName ?? '');
    expect(body).not.toMatch(/\{[a-z_]+\}/);
  });

  it('resolves OVERTURE_TEXT bodies for inline-covered agendas', async () => {
    const { OVERTURE_TEXT } = await import('../data/text/overtures');
    const { RivalAgenda } = await import('../engine/types');
    const state = createDefaultScenario();
    const nb = state.diplomacy.neighbors[0];
    const ctx: SmartTextContext = { neighborId: nb.id };
    const entry = OVERTURE_TEXT[RivalAgenda.DynasticAlliance];
    expect(entry).toBeDefined();
    const title = substituteSmartPlaceholders(entry!.title, state, ctx);
    const body = substituteSmartPlaceholders(entry!.body, state, ctx);
    expect(title).not.toMatch(/\{[a-z_]+\}/);
    expect(body).not.toMatch(/\{[a-z_]+\}/);
    // Resolved capital + dynasty should appear in the marriage proposal body.
    expect(body).toContain(nb.capitalName ?? '');
    expect(body).toContain(nb.dynastyName ?? '');
  });

  it('resolves seat tokens in petition wave-2 text without context', async () => {
    const { EXPANSION_WAVE_2_PETITIONS_MILITARY_TEXT } = await import(
      '../data/text/expansion/wave-2-text/petitions-military'
    );
    const state = createDefaultScenario();
    // Appoint a Marshal so the seat token resolves to a real name.
    const marshalName = 'Marshal Vellis';
    state.council = state.council ?? { appointments: {}, pendingCandidates: [] } as never;
    state.council!.appointments = state.council!.appointments ?? ({} as never);
    state.council!.appointments[CouncilSeat.Marshal] = {
      seat: CouncilSeat.Marshal,
      name: marshalName,
      personality: 'Cautious',
      loyalty: 50,
      flaws: [],
      patronClass: null,
      background: 'test',
      appointedOnTurn: 1,
    } as never;
    const entry = EXPANSION_WAVE_2_PETITIONS_MILITARY_TEXT.faction_req_w2_border_captains_garrison;
    const body = substituteSmartPlaceholders(entry.body, state);
    expect(body).toContain(marshalName);
    expect(body).not.toMatch(/\{[a-z_]+\}/);
  });

  it('resolves region token in region-text bodies', async () => {
    const { EXPANSION_REGION_TEXT } = await import(
      '../data/text/expansion/region-text'
    );
    const state = createDefaultScenario();
    const region = state.regions[0];
    const ctx: SmartTextContext = { regionId: region.id };
    const entry = EXPANSION_REGION_TEXT.evt_exp_reg_autonomy_dispute;
    const body = substituteSmartPlaceholders(entry.body, state, ctx);
    expect(body).toContain(region.displayName ?? region.id);
    expect(body).not.toMatch(/\{[a-z_]+\}/);
  });

  it('resolves both ruler and capital tokens in neighbor-actions', async () => {
    const { NEIGHBOR_ACTION_TEXT } = await import('../data/text/neighbor-actions');
    const { NeighborActionType } = await import('../engine/types');
    const state = createDefaultScenario();
    const nb = state.diplomacy.neighbors[0];
    const ctx: SmartTextContext = { neighborId: nb.id };
    const entry = NEIGHBOR_ACTION_TEXT[NeighborActionType.WarDeclaration];
    const body = substituteSmartPlaceholders(entry.body, state, ctx);
    expect(body).toContain(nb.rulerName ?? '');
    expect(body).toContain(nb.capitalName ?? '');
    expect(body).not.toMatch(/\{[a-z_]+\}/);
  });
});
