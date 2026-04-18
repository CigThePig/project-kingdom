// Phase 11 — Inter-Kingdom Diplomacy world-pulse templates.
// Category: WorldPulseCategory.NeighborActivity. Templates receive display
// names already resolved via nameResolver; they render verbatim from here.

export interface InterRivalPulseTemplate {
  /** Stable key used as sourceId. */
  key: string;
  /** 'alliance_formed' | 'war_declared_rival' | 'trade_pact_signed' | 'border_skirmish' */
  kind: 'alliance' | 'war' | 'trade_pact' | 'border_skirmish';
  /** Renderer: receives the two resolved neighbor display names. */
  render: (a: string, b: string) => string;
}

export const INTER_RIVAL_ALLIANCE_LINES: InterRivalPulseTemplate[] = [
  {
    key: 'alliance_formed_1',
    kind: 'alliance',
    render: (a, b) => `${a} and ${b} have sealed a formal alliance.`,
  },
  {
    key: 'alliance_formed_2',
    kind: 'alliance',
    render: (a, b) => `Envoys confirm a mutual defense pact between ${a} and ${b}.`,
  },
];

export const INTER_RIVAL_WAR_LINES: InterRivalPulseTemplate[] = [
  {
    key: 'war_declared_rival_1',
    kind: 'war',
    render: (a, b) => `${a} has declared war on ${b}.`,
  },
  {
    key: 'war_declared_rival_2',
    kind: 'war',
    render: (a, b) => `Heralds ride from ${a} to ${b} — their banners are red.`,
  },
];

export const INTER_RIVAL_TRADE_LINES: InterRivalPulseTemplate[] = [
  {
    key: 'trade_pact_signed_1',
    kind: 'trade_pact',
    render: (a, b) => `${a} and ${b} have signed a trade pact.`,
  },
  {
    key: 'trade_pact_signed_2',
    kind: 'trade_pact',
    render: (a, b) => `Merchant caravans now run freely between ${a} and ${b}.`,
  },
];

export const INTER_RIVAL_SKIRMISH_LINES: InterRivalPulseTemplate[] = [
  {
    key: 'border_skirmish_1',
    kind: 'border_skirmish',
    render: (a, b) => `Border skirmishes reported between ${a} and ${b}.`,
  },
  {
    key: 'border_skirmish_2',
    kind: 'border_skirmish',
    render: (a, b) => `Raiders cross the contested frontier of ${a} and ${b}.`,
  },
];
