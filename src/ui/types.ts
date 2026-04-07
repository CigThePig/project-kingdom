// UI-layer types for the card-based interface.
// These are presentation concerns — they do not belong in engine/types.ts.

export type CardFamily =
  | 'crisis'
  | 'response'
  | 'petition'
  | 'decree'
  | 'advisor'
  | 'legacy'
  | 'status'
  | 'season'
  | 'summary';

export type RoundPhase = 'seasonDawn' | 'crisis' | 'petition' | 'decree' | 'summary';

export interface PhaseDecisions {
  crisisResponse: string | null;
  petitionDecisions: { cardId: string; granted: boolean }[];
  selectedDecrees: string[];
}

export interface EffectHint {
  label: string;
  type: 'positive' | 'negative' | 'warning' | 'neutral';
}

export type ConfidenceLevel = 'low' | 'moderate' | 'high';

/** Maps a CardFamily to its CSS custom-property accent color. */
export function getAccentColor(family: CardFamily): string {
  switch (family) {
    case 'crisis':   return 'var(--color-accent-crisis)';
    case 'response': return 'var(--color-accent-response)';
    case 'petition': return 'var(--color-accent-petition)';
    case 'decree':   return 'var(--color-accent-decree)';
    case 'advisor':  return 'var(--color-accent-advisor)';
    case 'legacy':   return 'var(--color-accent-legacy)';
    case 'status':   return 'var(--color-accent-status)';
    case 'summary':  return 'var(--color-accent-response)';
    case 'season':   return 'var(--color-accent-status)';
  }
}

/** Family badge labels displayed in the card header. */
export function getFamilyLabel(family: CardFamily): string {
  switch (family) {
    case 'crisis':   return 'CRISIS';
    case 'response': return 'RESPONSE';
    case 'petition': return 'PETITION';
    case 'decree':   return 'DECREE';
    case 'advisor':  return 'ADVISOR';
    case 'legacy':   return 'LEGACY';
    case 'status':   return 'STATUS';
    case 'summary':  return 'SUMMARY';
    case 'season':   return 'SEASON';
  }
}
