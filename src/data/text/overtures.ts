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
    body: 'Envoys of {ruler_full} arrive from {capital} bearing a formal proposal of marriage between your houses. The match would knit {dynasty} to your own line and reshape the map for a generation.',
    grantTitle: 'Accept the match',
    denyTitle: 'Decline with courtesies',
  },

  [RivalAgenda.DominateTrade]: {
    title: '{neighbor} presses a trade concession',
    body: "{ruler}'s merchants press for preferential access to your markets. Granting it enriches both treasuries — and ties the prosperity of your throne to {neighbor_short}'s.",
    grantTitle: 'Grant the concession',
    denyTitle: 'Protect the home markets',
  },

  [RivalAgenda.RestoreTheOldBorders]: {
    title: '{ruler_full} demands the old lands',
    body: '{ruler_full} formally revives ancient claims from the throne in {capital}, demanding you cede the disputed territory. {dynasty} will not let the refusal pass quietly.',
    grantTitle: 'Negotiate a quiet concession',
    denyTitle: 'Reject the claim outright',
  },

  [RivalAgenda.DefensiveConsolidation]: {
    title: '{neighbor} seeks a non-aggression pact',
    body: "Envoys of {ruler_full} propose a formal non-aggression pact. Signing would calm {neighbor_short}'s border and free your hand elsewhere.",
    grantTitle: 'Sign the pact',
    denyTitle: 'Reserve your freedom',
  },

  // ReligiousHegemony and ConvertThePlayer share the same inline flavor —
  // see `buildInlineSpec` for the agenda-key fallthrough.
  [RivalAgenda.ReligiousHegemony]: {
    title: "{dynasty}'s clergy propose a religious accord",
    body: "Clergy under {ruler_full}'s patronage seek leave to establish missions across your realm. Their preachers walk a line between act of faith and act of influence.",
    grantTitle: 'Permit the missions',
    denyTitle: 'Refuse the presence',
  },
  [RivalAgenda.ConvertThePlayer]: {
    title: "{dynasty}'s clergy propose a religious accord",
    body: "Clergy under {ruler_full}'s patronage seek leave to establish missions across your realm. Their preachers walk a line between act of faith and act of influence.",
    grantTitle: 'Permit the missions',
    denyTitle: 'Refuse the presence',
  },
};
