// ============================================================
// Diplomatic Overture Display Text
// ============================================================
// Holds the title/body/choice strings for the inline overture flavors
// produced by `bridge/diplomaticOvertureGenerator.buildInlineSpec`.
// Strings carry smart-card placeholders (`{ruler_full}`, `{capital}`,
// `{neighbor}`, …) and are resolved through `substituteSmartPlaceholders`
// at generation time. Effects/signals stay in code; only flavor text lives
// here so authoring stays in one place alongside other authored text.

import { RivalAgenda } from '../../engine/types';

export interface OvertureTextEntry {
  title: string;
  body: string;
  grantTitle: string;
  denyTitle: string;
}

export const OVERTURE_TEXT: Partial<Record<RivalAgenda, OvertureTextEntry>> = {
  [RivalAgenda.DynasticAlliance]: {
    title: '{ruler_full} proposes a dynastic union',
    body: 'Envoys of {ruler_full} arrive from {capital} bearing a formal proposal: {spouse_name} of {dynasty} to be wedded to your own line. The match would reshape the map for a generation.{neighbor_memory_clause}',
    grantTitle: 'Accept the match',
    denyTitle: 'Decline with courtesies',
  },

  [RivalAgenda.DominateTrade]: {
    title: '{neighbor} presses a trade concession',
    body: "{ruler}'s merchants press for preferential access to your markets. Granting it enriches both treasuries — and ties the prosperity of your throne to {neighbor_short}'s.{prior_decision_clause:trade}{inter_rival_note}",
    grantTitle: 'Grant the concession',
    denyTitle: 'Protect the home markets',
  },

  [RivalAgenda.RestoreTheOldBorders]: {
    title: '{ruler_full} demands the old lands',
    body: '{ruler_full} formally revives ancient claims from the throne in {capital}, demanding you cede {region}. {dynasty} will not let the refusal pass quietly.{neighbor_memory_clause}{ruling_style_note}',
    grantTitle: 'Cede {region}',
    denyTitle: 'Reject the claim outright',
  },

  [RivalAgenda.DefensiveConsolidation]: {
    title: '{neighbor} seeks a non-aggression pact',
    body: "Envoys of {ruler_full} propose a formal non-aggression pact. Signing would calm {neighbor_short}'s border and free your hand elsewhere.{prior_decision_clause:treaty}{inter_rival_note}",
    grantTitle: 'Sign the pact',
    denyTitle: 'Reserve your freedom',
  },

  // ReligiousHegemony and ConvertThePlayer share the same inline flavor —
  // see `buildInlineSpec` for the agenda-key fallthrough.
  [RivalAgenda.ReligiousHegemony]: {
    title: "{dynasty}'s clergy propose a religious accord",
    body: "Clergy under {ruler_full}'s patronage seek leave to establish missions across your realm. Their preachers walk a line between act of faith and act of influence.{prior_decision_clause:religion}{ruling_style_note}",
    grantTitle: 'Permit the missions',
    denyTitle: 'Refuse the presence',
  },
  [RivalAgenda.ConvertThePlayer]: {
    title: "{dynasty}'s clergy propose a religious accord",
    body: "Clergy under {ruler_full}'s patronage seek leave to establish missions across your realm. Their preachers walk a line between act of faith and act of influence.{prior_decision_clause:religion}{ruling_style_note}",
    grantTitle: 'Permit the missions',
    denyTitle: 'Refuse the presence',
  },

  // Phase 7 additions — agendas the rival simulation can adopt but that
  // previously had no overture text, so the player never saw the choice
  // surface.

  [RivalAgenda.BleedTheRivals]: {
    title: '{ruler_full} seeks your blessing to wound a shared rival',
    body: 'Envoys from {capital} come with a quiet proposition: {ruler} intends to strike at a neighbour you both find troublesome, and asks that your banners remain down while {dynasty} settles old scores.{inter_rival_note}{neighbor_memory_clause}',
    grantTitle: 'Stand aside and let it happen',
    denyTitle: 'Warn the target',
  },

  [RivalAgenda.EconomicRecovery]: {
    title: "{ruler_full} appeals for trade relief",
    body: "Hard seasons have thinned {neighbor_short}'s coffers. {ruler} asks — without pleading — for a temporary easing of tariffs and a pass on border tolls while {dynasty} rebuilds.{prior_decision_clause:trade}{inter_rival_note}",
    grantTitle: 'Ease the tolls',
    denyTitle: 'Hold the levies',
  },

  [RivalAgenda.IsolationistRetreat]: {
    title: '{ruler_full} formally withdraws from court life',
    body: "Heralds announce that {ruler_full} is closing {capital}'s gates to foreign envoys, cancelling summits, and recalling {dynasty}'s ambassadors. They ask only that your court respect the quiet.{neighbor_memory_clause}",
    grantTitle: 'Respect the withdrawal',
    denyTitle: 'Press for continued contact',
  },

  [RivalAgenda.ProveDominance]: {
    title: "{ruler_full} calls for a trial of arms",
    body: "{ruler_full} sends a herald to propose a formal contest of champions — a symbolic exchange to settle who stands taller between your houses. A refusal is itself an answer; acceptance binds you to honour the result.{ruling_style_note}{neighbor_memory_clause}",
    grantTitle: 'Accept the trial',
    denyTitle: 'Decline the spectacle',
  },

  [RivalAgenda.SackASettlement]: {
    title: "{ruler_full}'s host gathers on a third border",
    body: "Outriders carry word that {dynasty}'s captains are massing to sack a settlement beyond your shared frontier. {ruler}'s envoy wants your silence — a promise that no relief column of yours will ride for the town while the raid unfolds.{inter_rival_note}",
    grantTitle: 'Look the other way',
    denyTitle: 'Pledge to intervene',
  },

  [RivalAgenda.SubjugateAVassal]: {
    title: "{ruler_full} asks your hand off a lesser court",
    body: "{ruler} means to bring a smaller neighbouring court under {dynasty}'s thumb, and asks that your own envoys stay home while the vassalage is concluded. A quiet consent is all that's required.{inter_rival_note}{neighbor_memory_clause}",
    grantTitle: 'Consent and step back',
    denyTitle: 'Stand with the smaller court',
  },
};
