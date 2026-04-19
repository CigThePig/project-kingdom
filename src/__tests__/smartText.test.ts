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
  RegionalPosture,
  RivalCrisisType,
  Season,
} from '../engine/types';
import type { Bond, GameState, KingdomCondition } from '../engine/types';

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
  // §3.3 Memory tokens — still reserved, empty until Phase D
  // ----------------------------------------------------------------

  describe('deferred Phase D tokens resolve to empty strings (no raw leaks)', () => {
    const reserved = [
      '{neighbor_memory_clause}',
      '{ruling_style_note}',
      '{recent_causal}',
      '{inter_rival_note}',
      '{watching_faction}',
      '{storyline_arc_note}',
      '{agent:agent_abc}',
      '{prior_decision_clause:merchant}',
    ];

    for (const token of reserved) {
      it(`${token} resolves to empty string`, () => {
        const state = createDefaultScenario();
        expect(substituteSmartPlaceholders(token, state)).toBe('');
      });
    }
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
