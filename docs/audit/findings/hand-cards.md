---
family: hand
totalCards: 40
status: pending
lastScan: 2026-04-22T16:53:08.807Z
---

# Hand — Audit findings

The auto-generated block below is rewritten on every `npm run audit:seed`.
The `outcome` and `notes` columns are preserved across reruns when the cardId
matches; edit them freely. To exclude a card from regeneration, leave the row
in place but write an outcome — the seeder will keep your edits.

<!-- AUTO-GENERATED:START -->

**Coverage**

| Coverage area | Status |
|---|---|
| text integrity | covered (100%) |
| effect table coverage | not covered (0%) |
| runtime diff | covered (100%) |
| pressure parity | not covered (0%) |
| consequence parity | not covered (0%) |
| generated-family audit | not covered (0%) |
| AST semantic analysis | covered (100%) |
| preview parity | not covered (0%) |

| cardId | choiceId | severity | confidence | scanId | message | outcome | notes |
|---|---|---|---|---|---|---|---|
| hand_spymasters_whisper | play | MINOR | HEURISTIC | hand.choice-fallback-risk | hand_spymasters_whisper: apply falls through to neighbors[0] when the player hasn't picked a rival — the target choice is effectively cosmetic when any rival exists. |  |  |
| hand_diplomatic_courier | play | MINOR | HEURISTIC | hand.choice-fallback-risk | hand_diplomatic_courier: apply falls through to neighbors[0] when the player hasn't picked a rival — the target choice is effectively cosmetic when any rival exists. |  |  |

<!-- AUTO-GENERATED:END -->
