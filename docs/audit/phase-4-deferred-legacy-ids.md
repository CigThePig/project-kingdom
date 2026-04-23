# Deferred — Legacy Neighbor IDs in Trigger Conditions

Phase 4a swapped all `empire_south` / `rival_north` usages inside
`diplomacyDeltas` effect rows to the live scenario IDs
(`neighbor_arenthal`, `neighbor_valdris`). **Trigger-condition usages of
the same dead IDs were left untouched** because swapping them changes
which cards can fire in the default scenario — a gameplay-behavior
change, not a text/audit fix. This file is the explicit punch-list so
those sites don't get lost.

## Why the triggers matter

Each of the cards below has a `neighbor_relationship_below` or
`neighbor_relationship_above` trigger condition keyed to a neighbor ID
that does **not** exist in `createDefaultScenario()`
(`src/data/scenarios/default.ts` — only `neighbor_arenthal` and
`neighbor_valdris` are authored). The default relationship-lookup helper
returns `undefined` for missing neighbors; the trigger gates on
`score < threshold` or `score > threshold`, both of which are false
against `undefined`. Net result: **the card never fires in the default
scenario.** Phase 4a's effect swaps made the deltas correct when the
card *does* fire, but these cards won't fire until the triggers are
fixed too.

## Sites to fix (5 trigger conditions across 4 cards)

| File:Line | Card ID | Current trigger | Suggested swap |
|---|---|---|---|
| `src/data/events/index.ts:2645` | `evt_border_incursion_root` | `neighbor_relationship_below { neighborId: 'rival_north', threshold: 30 }` | `neighborId: 'neighbor_valdris'` |
| `src/data/events/index.ts:2840` | `evt_foreign_ambassador_root` | `neighbor_relationship_below { neighborId: 'empire_south', threshold: 50 }` | `neighborId: 'neighbor_arenthal'` |
| `src/data/events/index.ts:2861` | `evt_foreign_ambassador_root` → follow-up gate on `evt_ambassador_trade_embargo` | `neighbor_relationship_below { neighborId: 'empire_south', threshold: 20 }` | `neighborId: 'neighbor_arenthal'` |
| `src/data/events/expansion/culture-events.ts:227` | `evt_exp_cul_exchange_opportunity` | `neighbor_relationship_above { neighborId: 'empire_south', threshold: 40 }` | `neighborId: 'neighbor_arenthal'` |
| `src/data/events/expansion/culture-events.ts:409` | `evt_exp_cul_identity_crisis` | `neighbor_relationship_below { neighborId: 'rival_north', threshold: 25 }` | `neighborId: 'neighbor_valdris'` |

Swap-mapping matches the Phase 4a effects-file convention:
`empire_south` → `neighbor_arenthal`, `rival_north` → `neighbor_valdris`.

## Why Phase 4a did not fix these

Phase 4a's scope was strictly `PROMISE_NOT_DELIVERED` retirement. The
trigger-condition swaps have two properties Phase 4a didn't want to
assume authorization for:

1. **Gameplay behavior change.** These five cards are currently
   effectively dead code. Swapping the IDs activates them in every
   default-scenario run — which is probably desired (they were authored
   to fire), but a Phase 4a commit is not the right place to
   unilaterally un-retire five cards.
2. **Potential surfacing of cascaded issues.** Several of these cards
   have their own follow-ups and storyline hooks. Activating them could
   surface new audit findings (follow-up IDs that never resolve, chain
   steps that assume prior state) that Phase 4a's scope doesn't cover.

## Suggested follow-up

Treat this as a small standalone pass, separate from the Phase 4b
`SCOPE_MISMATCH` work:

1. Apply the 5 trigger swaps above.
2. Run `npm run audit -- --include-minor --include-polish` and confirm
   no new MAJOR findings surface. Expected: some new `TAG_NEVER_READ` or
   `PROMISE_NOT_DELIVERED` hits on now-reachable cards; address per
   Phase 3/4a patterns.
3. Playtest: start a default-scenario run, wait until turn ≥ 6 with
   `neighbor_valdris.relationshipScore < 30` → confirm
   `evt_border_incursion_root` fires. Similar spot-check for the other
   four.
4. Add the five swaps to the `LOAD_SAVE` migration list in
   `src/context/game-context.tsx` only if the trigger semantics
   affect save-compat; plain trigger-ID swaps typically don't.

## Related

- Phase 4a close report: `docs/audit/phase-4-findings-closed.md`
- Phase 4a commit: `audit: phase 4a — PROMISE_NOT_DELIVERED wave 2 (151 retired)`
- Effect-file swaps completed in Phase 4a:
  - `src/data/events/effects.ts` (21 swaps)
  - `src/data/events/expansion/culture-effects.ts` (4 swaps)
  - `src/data/events/expansion/wave-2/crises-political.ts` (3 swaps)
  - `src/data/events/expansion/petitions-wave-2/petitions-civic.ts`
    (2 `__NEIGHBOR__` → `neighbor_arenthal` swaps)
