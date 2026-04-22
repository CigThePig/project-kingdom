# Crown & Council — Standing Audit Questions

> The canonical 15 questions. Applied to every card touched in every phase of the Card Audit & Progression workstream. A card is green only when all 15 answer cleanly.
>
> **Anchors:** `docs/CARD_AUDIT_WORKSTREAM.md` (phase sequencing) · `docs/CARD_AUDIT_RULES.md` (verification rules, §14 calibration anchor) · `docs/SMART_CARD_ENGINE_SURFACE.md` (authoring tokens).
>
> The family rubrics in `CARD_AUDIT_RULES.md` §9 are overlays on this list, not replacements. Don't branch this checklist per family.

---

1. **Pattern fit.** Is this Pattern A (active decision), B (state-earned reveal), or C (pure flavor)? If C, why is it in a monthly decision slot?

2. **Family fit.** Is the card in the right family? A supplicant asking = petition, an urgent escalation = crisis, a royal declaration = decree, a two-party exchange = negotiation, a rival opening = overture, an intelligence product = assessment.

3. **Duplicate check.** Are there other versions of this card in other families covering the same trigger niche? (marriage decree vs marriage petition vs dynastic-alliance overture; tax petition vs emergency-levy decree; border crisis vs fortify-borders decree.)

4. **Wiring.** Text entry present? Effects entry present? Every `choiceId` has a label? Every `followUpEvents[].followUpDefinitionId` resolves? Every style-tag points at a real choice?

5. **Smart-card coverage.** If the engine binds `affectsRegionId` / `affectsClass` / `affectsNeighborId` / advisor seat / agent / bond, does the body name it at least once?

6. **Trigger coherence.** Does every specific-state phrase in the body (drought, restive march, empty treasury) have a matching `triggerConditions` entry that gates the card on that state?

7. **Choice distinctness.** Are the 2–4 choices structurally distinct (follow-up, feature, modifier, consequence tag that is read, style axis, pressure axis, scope) — not just sign/magnitude variants of the same surface fields?

8. **Substance (§2).** Does at least one choice leave a mark the simulation can query later? Defining/Critical tier must establish a feature, change a policy, or activate a storyline — temporary modifier alone is insufficient.

9. **Severity–magnitude coherence.** Does `|total_delta|` on the weightiest branch fit the severity tier (Informational 3–15, Notable 10–30, Serious 25–60, Critical 50+)?

10. **Category coherence.** Does a Military card touch military state? Religious → faith/heterodoxy? Economy → treasury/economy/merchants? Food → food/granaries?

11. **Promise ↔ delivery.** Does every concrete image in the body ("a lasting improvement," "generations will stand") have a mechanical backbone?

12. **Progression memory.** Does the card read the player's past? `{prior_decision_clause:*}`, ruling-style note, recent-causal tag, rival memory, resolved storyline, kingdom feature. Rare tier: expected. Common tier: where it fits.

13. **Follow-up shape.** Does at least one branch seed a follow-up commensurate with its tier? (Common → optional; Uncommon → ≥1 branch; Rare → ≥2 branches; Defining/Critical → every consequential branch.)

14. **Cost asymmetry.** Do the choices use different `slotCost` / `isFree` where the fiction allows — the cheap-now-expensive-later option, the free acknowledge, the paid aggressive play?

15. **Authoring self-test.** Would I author this card from scratch today if it didn't exist, given everything the current engine surfaces? If no → rebuild.

---

Run `npm run audit -- --include-minor --include-polish` to cross-reference findings against these questions. The §14 tax-dispute rewrite in `CARD_AUDIT_RULES.md` is the calibration anchor for every re-effect and rebuild; match its shape when in doubt about how deep to go.
