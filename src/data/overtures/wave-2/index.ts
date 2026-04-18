// Phase 7 — Wave-2 Diplomatic Overtures.
//
// Adds 10 new overture specs across rival agendas previously uncovered by the
// inline switch in `diplomaticOvertureGenerator.buildSpec`, plus alternate
// flavors for several of the original six. The generator picks deterministically
// from the union of inline + wave-2 candidates, widening the variety of
// rival-initiated propositions surfaced to the player.

import { RivalAgenda } from '../../../engine/types';
import type { OvertureSpec } from '../../../bridge/diplomaticOvertureGenerator';

export interface Wave2Overture {
  agenda: RivalAgenda;
  build: (neighborName: string) => OvertureSpec;
}

export const WAVE_2_OVERTURES: readonly Wave2Overture[] = [
  // ============================================================
  // Agendas previously without overture coverage (6)
  // ============================================================
  {
    agenda: RivalAgenda.BleedTheRivals,
    build: (n) => ({
      title: `${n} demands tribute`,
      body: `${n}'s envoy arrives with a list of grievances and a demand for restitution in gold. Refusal will be heard at every court in the region.`,
      grantTitle: 'Pay the tribute',
      grantEffects: [
        { label: 'Treasury ↓↓', type: 'negative' },
        { label: 'Relationship ↑', type: 'positive' },
      ],
      grantSignals: [{ label: 'AUTHORITY ↓', tone: 'consequence' }],
      denyTitle: 'Refuse the demand',
      denyEffects: [{ label: 'Relationship ↓↓', type: 'negative' }],
      denySignals: [{ label: 'BORDER TENSION ↑', tone: 'consequence' }],
    }),
  },
  {
    agenda: RivalAgenda.SubjugateAVassal,
    build: (n) => ({
      title: `${n} presses vassalage terms`,
      body: `${n} formally invites you to swear fealty in exchange for protection and a share of their tariffs. Acceptance binds your foreign policy to theirs.`,
      grantTitle: 'Accept the terms',
      grantEffects: [
        { label: 'Relationship ↑↑', type: 'positive' },
        { label: 'Authority ↓', type: 'warning' },
      ],
      grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
      denyTitle: 'Reject the offer',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: 'AUTHORITY ↑', tone: 'consequence' }],
    }),
  },
  {
    agenda: RivalAgenda.SackASettlement,
    build: (n) => ({
      title: `${n} threatens a border raid`,
      body: `Scouts report ${n}'s warbands massing along the frontier. Their envoy hints that a discreet payment would redirect them elsewhere.`,
      grantTitle: 'Pay the warbands off',
      grantEffects: [
        { label: 'Treasury ↓', type: 'negative' },
        { label: 'Relationship ↑', type: 'positive' },
      ],
      grantSignals: [{ label: 'STABILITY ↑', tone: 'consequence' }],
      denyTitle: 'Stand the border',
      denyEffects: [
        { label: 'Relationship ↓', type: 'negative' },
        { label: 'Stability ↓', type: 'negative' },
      ],
      denySignals: [{ label: 'BORDER TENSION ↑', tone: 'consequence' }],
    }),
  },
  {
    agenda: RivalAgenda.IsolationistRetreat,
    build: (n) => ({
      title: `${n} seeks a closed-borders pact`,
      body: `${n}'s envoys propose a mutual closing of the border to merchants and missionaries — a quiet seclusion both crowns can blame on the other.`,
      grantTitle: 'Sign the seclusion pact',
      grantEffects: [
        { label: 'Relationship ↑', type: 'positive' },
        { label: 'Trade income ↓', type: 'warning' },
      ],
      grantSignals: [{ label: '+ISOLATIONIST', tone: 'style' }],
      denyTitle: 'Keep the borders open',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: '+OPEN', tone: 'style' }],
    }),
  },
  {
    agenda: RivalAgenda.EconomicRecovery,
    build: (n) => ({
      title: `${n} requests a grain credit`,
      body: `Famine grips ${n}. Their envoy asks for a sale of grain on credit, to be repaid when their harvest recovers.`,
      grantTitle: 'Extend the credit',
      grantEffects: [
        { label: 'Food ↓', type: 'negative' },
        { label: 'Relationship ↑↑', type: 'positive' },
      ],
      grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
      denyTitle: 'Refuse the request',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
    }),
  },
  {
    agenda: RivalAgenda.ProveDominance,
    build: (n) => ({
      title: `${n} challenges your court to a tournament`,
      body: `${n} proposes a grand tournament between your champions. The winning crown takes the bards, the banners, and the bragging rights.`,
      grantTitle: 'Send your champions',
      grantEffects: [
        { label: 'Treasury ↓', type: 'negative' },
        { label: 'Relationship ↑', type: 'positive' },
      ],
      grantSignals: [{ label: '+CULTURAL', tone: 'style' }],
      denyTitle: 'Decline the contest',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: 'AUTHORITY ↓', tone: 'consequence' }],
    }),
  },

  // ============================================================
  // Alternate flavors for inline-covered agendas (4)
  // ============================================================
  {
    agenda: RivalAgenda.DynasticAlliance,
    build: (n) => ({
      title: `${n} proposes a hostage exchange`,
      body: `${n}'s court suggests a quieter assurance than a marriage: each crown sends a young heir to be raised at the other's court.`,
      grantTitle: 'Exchange the wards',
      grantEffects: [{ label: 'Relationship ↑', type: 'positive' }],
      grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
      denyTitle: 'Decline the exchange',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
    }),
  },
  {
    agenda: RivalAgenda.DominateTrade,
    build: (n) => ({
      title: `${n} proposes a guild monopoly`,
      body: `${n}'s great houses propose a joint monopoly on a key trade good — vast profits, but the lesser merchants of both realms will suffer.`,
      grantTitle: 'Sign the monopoly',
      grantEffects: [
        { label: 'Treasury ↑↑', type: 'positive' },
        { label: 'Merchants ↓', type: 'negative' },
      ],
      grantSignals: [{ label: '+COMMERCIAL', tone: 'style' }],
      denyTitle: 'Protect the small merchants',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: 'MERCHANTS ↑', tone: 'consequence' }],
    }),
  },
  {
    agenda: RivalAgenda.ReligiousHegemony,
    build: (n) => ({
      title: `${n} requests pilgrimage rights`,
      body: `${n}'s clergy ask the right to lead pilgrim caravans through your territory. The faithful will spend; the heterodox will whisper.`,
      grantTitle: 'Grant the pilgrimage',
      grantEffects: [
        { label: 'Treasury ↑', type: 'positive' },
        { label: 'Heterodoxy ↑', type: 'warning' },
      ],
      grantSignals: [{ label: '+FAITH', tone: 'style' }],
      denyTitle: 'Refuse the caravans',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
    }),
  },
  {
    agenda: RivalAgenda.DefensiveConsolidation,
    build: (n) => ({
      title: `${n} proposes a joint border survey`,
      body: `${n}'s envoys propose a joint commission to map and mark the contested border once and for all. A small thing, but it would settle generations of quiet disputes.`,
      grantTitle: 'Send the surveyors',
      grantEffects: [
        { label: 'Relationship ↑', type: 'positive' },
        { label: 'Stability ↑', type: 'positive' },
      ],
      grantSignals: [{ label: '+DIPLOMATIC', tone: 'style' }],
      denyTitle: 'Refuse the commission',
      denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
      denySignals: [{ label: 'AUTHORITY ↑', tone: 'consequence' }],
    }),
  },
];
