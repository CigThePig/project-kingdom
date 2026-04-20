---
family: negotiation
totalCards: 12
status: pending
lastScan: 2026-04-20T21:31:36.218Z
---

# Negotiation — Audit findings

The auto-generated block below is rewritten on every `npm run audit:seed`.
The `outcome` and `notes` columns are preserved across reruns when the cardId
matches; edit them freely. To exclude a card from regeneration, leave the row
in place but write an outcome — the seeder will keep your edits.

<!-- AUTO-GENERATED:START -->

**Coverage**

| Coverage area | Status |
|---|---|
| text integrity | covered (100%) |
| effect table coverage | covered (100%) |
| runtime diff | covered (100%) |
| pressure parity | not covered (0%) |
| consequence parity | not covered (0%) |
| generated-family audit | not covered (0%) |
| AST semantic analysis | not covered (0%) |
| preview parity | covered (100%) |

| cardId | choiceId | severity | confidence | scanId | message | outcome | notes |
|---|---|---|---|---|---|---|---|
| neg_resource_blockade | payment_tribute | MAJOR | HEURISTIC | text.promise-delivery | neg_resource_blockade: body references "granaries/food" but runtime diff shows no matching touch (touches: treasury.balance, population.Commoners.satisfaction, diplomacy.neighbors[0].relationshipScore, diplomacy.neighbors[0].attitudePosture, diplomacy.bonds). |  |  |
| neg_resource_blockade | trade_concessions | MAJOR | HEURISTIC | text.promise-delivery | neg_resource_blockade: body references "granaries/food" but runtime diff shows no matching touch (touches: treasury.balance, population.Merchants.satisfaction, diplomacy.neighbors[0].relationshipScore, diplomacy.bonds). |  |  |
| neg_resource_blockade | military_passage_rights | MAJOR | HEURISTIC | text.promise-delivery | neg_resource_blockade: body references "granaries/food" but runtime diff shows no matching touch (touches: military.readiness, diplomacy.neighbors[0].relationshipScore, espionage.networkStrength). |  |  |
| neg_resource_blockade | hostage_exchange | MAJOR | HEURISTIC | text.promise-delivery | neg_resource_blockade: body references "granaries/food" but runtime diff shows no matching touch (touches: population.Nobility.satisfaction, stability.value, diplomacy.neighbors[0].relationshipScore, diplomacy.neighbors[0].attitudePosture, diplomacy.bonds). |  |  |

<!-- AUTO-GENERATED:END -->
