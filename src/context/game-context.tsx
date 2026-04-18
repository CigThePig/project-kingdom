// Phase 7 — React context + useReducer for game state management.
// Blueprint Reference: TECHNICAL.md — State Management; ux-blueprint.md — §10 Save/Load

import { createContext, useReducer, useMemo, type ReactNode } from 'react';

import {
  ActionType,
  type ActiveEvent,
  type FailureCondition,
  type GameState,
  type IntelligenceReport,
  NeighborDisposition,
  type NeighborState,
  type QueuedAction,
  type SaveFile,
  type TurnHistoryEntry,
  type CouncilSeat,
} from '../engine/types';
import { createInitialRivalState } from '../engine/systems/rival-simulation';
import { selectInitialAgenda } from '../engine/systems/rival-agendas';
import { finalizeGeography } from '../engine/systems/geography';
import { synthesizeGeographyFromScenario } from '../engine/systems/geography-migrations';
import { createInitialEnvironmentState } from '../engine/systems/environment';
import { createInitialCourtHand } from '../engine/systems/court-hand';
import {
  createCouncilState,
  instantiateCandidateById,
  appointAdvisor,
  dismissAdvisor,
} from '../engine/systems/advisors';
import { applyMechanicalEffectDelta } from '../engine/events/apply-event-effects';
import { seededRandom } from '../data/text/name-generation';
import type { ChronicleEntry, MonthDecision } from '../ui/types';
import {
  generateChronicleEntries,
  toChronicleEntry,
  pruneChronicle,
  getChronicleCapacity,
} from '../bridge/chronicleLogger';
import {
  validateActionAddition,
  deductActionCost,
} from '../engine/resolution/action-budget';
import type { TurnResolutionResult } from '../engine/resolution/turn-resolution';
import { createDefaultScenario } from '../data/scenarios/default';
import { createFracturedInheritanceScenario } from '../data/scenarios/fractured-inheritance';
import { createMerchantsGambitScenario } from '../data/scenarios/merchants-gambit';
import { createFrozenMarchScenario } from '../data/scenarios/frozen-march';
import { createFaithfulKingdomScenario } from '../data/scenarios/faithful-kingdom';
import { generateRunSeed } from '../data/text/name-generation';

// ============================================================
// Context State
// ============================================================

export interface GameContextState {
  gameState: GameState;
  turnHistory: TurnHistoryEntry[];
  eventHistory: ActiveEvent[];
  intelligenceReports: IntelligenceReport[];
  chronicle: ChronicleEntry[];
  lastTurnResult: TurnResolutionResult | null;
  isMidTurn: boolean;
  lastSavedAt: number | null;
  isGameOver: boolean;
  gameOverConditions: FailureCondition[];
  recentlyOfferedDecreeIds: string[];
}

// ============================================================
// Actions
// ============================================================

export type GameAction =
  | { type: 'INIT_NEW_GAME'; scenarioId?: string }
  | { type: 'LOAD_SAVE'; save: SaveFile }
  | { type: 'QUEUE_ACTION'; action: QueuedAction }
  | { type: 'REMOVE_ACTION'; actionId: string }
  | { type: 'TURN_RESOLVED'; result: TurnResolutionResult; decisions: MonthDecision[] }
  | { type: 'SAVE_COMPLETED'; savedAt: number }
  | { type: 'UPDATE_GAME_STATE'; updater: (state: GameState) => GameState }
  | { type: 'DECREES_OFFERED'; decreeIds: string[] }
  | { type: 'APPOINT_CANDIDATE_FROM_OPPORTUNITY'; templateId: string }
  | { type: 'DISMISS_ADVISOR'; seat: CouncilSeat };

// ============================================================
// Context Value
// ============================================================

export interface GameContextValue {
  state: GameContextState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextValue | null>(null);

// ============================================================
// Initial State
// ============================================================

export function createScenarioState(scenarioId?: string): GameState {
  switch (scenarioId) {
    case 'fractured_inheritance':
      return createFracturedInheritanceScenario();
    case 'merchants_gambit':
      return createMerchantsGambitScenario();
    case 'frozen_march':
      return createFrozenMarchScenario();
    case 'faithful_kingdom':
      return createFaithfulKingdomScenario();
    default:
      return createDefaultScenario();
  }
}

export function createInitialState(scenarioId?: string): GameContextState {
  return {
    gameState: createScenarioState(scenarioId),
    turnHistory: [],
    eventHistory: [],
    intelligenceReports: [],
    chronicle: [],
    lastTurnResult: null,
    isMidTurn: false,
    lastSavedAt: null,
    isGameOver: false,
    gameOverConditions: [],
    recentlyOfferedDecreeIds: [],
  };
}

// ============================================================
// Reducer
// ============================================================

export function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'INIT_NEW_GAME': {
      return createInitialState(action.scenarioId);
    }

    case 'LOAD_SAVE': {
      const { save } = action;
      // Migrate saves that predate the temporary modifiers system.
      const migratedRunSeed = save.gameState.runSeed ?? generateRunSeed();
      const migratedGameState: GameState = {
        ...save.gameState,
        // Phase 1 — pre-Phase-1 saves have no runSeed. Per-neighbor name fields
        // are optional; nameResolver falls back to NEIGHBOR_LABELS automatically
        // so old saves render consistent hand-authored names.
        runSeed: migratedRunSeed,
        activeTemporaryModifiers: save.gameState.activeTemporaryModifiers ?? [],
        pendingFollowUps: save.gameState.pendingFollowUps ?? [],
        narrativePacing: save.gameState.narrativePacing ?? {
          recentCategoryTurns: {},
          recentSeverityCount: { Informational: 0, Notable: 0, Serious: 0, Critical: 0 },
          dominantClassFavor: null,
          classChoiceHistory: { Nobility: 0, Clergy: 0, Merchants: 0, Commoners: 0, MilitaryCaste: 0 },
        },
        // Pre-expansion saves may lack these fields; turn-resolution reads
        // both unconditionally, so missing values crash the first turn.
        environment: save.gameState.environment ?? createInitialEnvironmentState(),
        activeKingdomFeatures: save.gameState.activeKingdomFeatures ?? [],
        // Phase 5 — pre-v4 saves have no courtHand; back-fill an empty hand.
        courtHand: save.gameState.courtHand ?? createInitialCourtHand(),
        // Phase 6 — pre-v5 saves have no discoveredCombos; start empty so the
        // codex silhouettes every combo until it first fires.
        discoveredCombos: save.gameState.discoveredCombos ?? [],
        pendingComboKeysThisTurn: save.gameState.pendingComboKeysThisTurn ?? [],
        // Phase 8 — pre-Phase-8 saves have no council; start with empty seats.
        council: save.gameState.council ?? createCouncilState(),
        activeEvents: (save.gameState.activeEvents ?? []).map((e: ActiveEvent) => ({
          ...e,
          outcomeQuality: e.outcomeQuality ?? null,
          isFollowUp: e.isFollowUp ?? false,
          followUpSourceId: e.followUpSourceId ?? null,
        })),
        // Phase C audit fix — back-fill consecutive low-trade counter so
        // TradeDisruption emergence works correctly after load.
        economy: {
          ...save.gameState.economy,
          consecutiveLowTradeTurns: save.gameState.economy?.consecutiveLowTradeTurns ?? 0,
        },
        // Migrate saves that predate the pending proposals system, and
        // Phase 2 — saves without kingdomSimulation get a default rival state
        // seeded from the (possibly newly-generated) runSeed + neighbor id.
        diplomacy: {
          ...save.gameState.diplomacy,
          neighbors: (save.gameState.diplomacy?.neighbors ?? []).map(
            (n: Partial<NeighborState> & { id: string }) => ({
              ...(n as NeighborState),
              pendingProposals: n.pendingProposals ?? [],
              recentActionHistory: n.recentActionHistory ?? [],
              kingdomSimulation:
                n.kingdomSimulation ??
                createInitialRivalState(
                  `${migratedRunSeed}_${n.id}_sim`,
                  n.disposition ?? NeighborDisposition.Cautious,
                ),
            }),
          ),
        },
      };

      // Phase 2.5 — back-fill `geography` for pre-Phase-2.5 saves by replaying
      // the scenario factory's graph. Then run finalizeGeography to populate
      // indexes, procgen region/settlement names, and borderRegion flags.
      const geography = migratedGameState.geography
        ?? synthesizeGeographyFromScenario(migratedGameState.scenarioId, migratedGameState);
      const stateWithGeography = finalizeGeography({ ...migratedGameState, geography });

      // Phase 3 — agendas depend on finalized geography (claims, adjacency),
      // so agenda selection runs in a second pass after finalizeGeography.
      const finalNeighbors = stateWithGeography.diplomacy.neighbors.map((n) => {
        if (n.agenda && n.memory) return n;
        const rng = seededRandom(`${migratedRunSeed}_${n.id}_agenda`);
        return {
          ...n,
          agenda: n.agenda ?? selectInitialAgenda(n, stateWithGeography, rng),
          memory: n.memory ?? [],
        };
      });
      const gameState: GameState = {
        ...stateWithGeography,
        diplomacy: { ...stateWithGeography.diplomacy, neighbors: finalNeighbors },
      };
      return {
        gameState,
        turnHistory: save.turnHistory,
        eventHistory: save.eventHistory,
        intelligenceReports: save.intelligenceReports,
        chronicle: (save.chronicle as ChronicleEntry[] | undefined) ?? [],
        lastTurnResult: null,
        isMidTurn: save.isMidTurn,
        lastSavedAt: save.savedAt,
        isGameOver: false,
        gameOverConditions: [],
        recentlyOfferedDecreeIds: save.recentlyOfferedDecreeIds ?? [],
      };
    }

    case 'QUEUE_ACTION': {
      const { action: queuedAction } = action;
      const budget = state.gameState.actionBudget;

      const error = validateActionAddition(queuedAction, budget);
      if (error !== null) {
        // Validation failed — return state unchanged.
        // The hook surfaces the error synchronously before dispatching,
        // so this branch is a safety net.
        return state;
      }

      const newBudget = deductActionCost(budget, queuedAction);
      return {
        ...state,
        gameState: {
          ...state.gameState,
          actionBudget: newBudget,
        },
        isMidTurn: true,
      };
    }

    case 'REMOVE_ACTION': {
      const { actionId } = action;
      const budget = state.gameState.actionBudget;
      const removedAction = budget.queuedActions.find((a) => a.id === actionId);

      if (!removedAction) {
        return state;
      }

      const remaining = budget.queuedActions.filter((a) => a.id !== actionId);

      // Recalculate slots from scratch to avoid drift.
      const policyActions = remaining.filter(
        (a) => a.type === ActionType.PolicyChange,
      );
      const slotActions = remaining.filter((a) => !a.isFree && a.type !== ActionType.PolicyChange);
      const slotsUsed = slotActions.reduce((sum, a) => sum + a.slotCost, 0);

      return {
        ...state,
        gameState: {
          ...state.gameState,
          actionBudget: {
            ...budget,
            slotsUsed,
            slotsRemaining: budget.slotsTotal - slotsUsed,
            policyChangesUsedThisTurn: policyActions.length,
            queuedActions: remaining,
          },
        },
        isMidTurn: remaining.length > 0,
      };
    }

    case 'TURN_RESOLVED': {
      const { result } = action;

      // Move resolved events into event history. The engine captures these
      // during resolution before chain advancement drops them.
      const newlyResolved = result.resolvedEvents;

      const hasFailure = result.triggeredFailureConditions.length > 0;

      // Generate chronicle entries for this season
      const failureWarningConditions = result.failureWarnings.map((w) => w.condition);
      const newChronicleLogEntries = generateChronicleEntries(
        state.gameState,
        result.nextState,
        action.decisions,
        newlyResolved,
        result.newlyUnlockedMilestones,
        failureWarningConditions,
        result.completedConstructionIds,
      );
      const newChronicleEntries = newChronicleLogEntries.map(toChronicleEntry);
      const capacity = getChronicleCapacity(result.nextState.turn.turnNumber);
      const updatedChronicle = pruneChronicle(
        [...state.chronicle, ...newChronicleEntries],
        capacity,
      );

      return {
        ...state,
        gameState: result.nextState,
        turnHistory: [...state.turnHistory, result.historyEntry],
        eventHistory: [...state.eventHistory, ...newlyResolved],
        intelligenceReports: [...state.intelligenceReports, ...result.generatedReports],
        chronicle: updatedChronicle,
        lastTurnResult: result,
        isMidTurn: false,
        lastSavedAt: state.lastSavedAt,
        isGameOver: hasFailure,
        gameOverConditions: hasFailure ? result.triggeredFailureConditions : [],
      };
    }

    case 'DECREES_OFFERED': {
      return {
        ...state,
        recentlyOfferedDecreeIds: action.decreeIds,
      };
    }

    case 'SAVE_COMPLETED': {
      return {
        ...state,
        lastSavedAt: action.savedAt,
      };
    }

    case 'UPDATE_GAME_STATE': {
      return {
        ...state,
        gameState: action.updater(state.gameState),
      };
    }

    case 'APPOINT_CANDIDATE_FROM_OPPORTUNITY': {
      const { templateId } = action;
      const runSeed = state.gameState.runSeed ?? 'default';
      const turnNumber = state.gameState.turn.turnNumber;
      const advisor = instantiateCandidateById(templateId, runSeed, turnNumber);
      if (!advisor) return state;
      const council = state.gameState.council ?? createCouncilState();
      // Auto-appoint if the seat is vacant; otherwise hold as pending candidate.
      const seatOccupied = council.appointments[advisor.seat] !== undefined;
      const nextCouncil = seatOccupied
        ? {
            ...council,
            pendingCandidates: [...council.pendingCandidates, advisor],
          }
        : appointAdvisor(council, advisor);
      return {
        ...state,
        gameState: { ...state.gameState, council: nextCouncil },
      };
    }

    case 'DISMISS_ADVISOR': {
      const council = state.gameState.council;
      if (!council) return state;
      const { council: nextCouncil, penalty } = dismissAdvisor(council, action.seat);
      if (!nextCouncil) return state;
      const nextGameState = applyMechanicalEffectDelta(
        { ...state.gameState, council: nextCouncil },
        penalty,
        null,
      );
      return { ...state, gameState: nextGameState };
    }

    default:
      return state;
  }
}

// ============================================================
// Provider Component
// ============================================================

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const value = useMemo<GameContextValue>(
    () => ({ state, dispatch }),
    [state, dispatch],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
