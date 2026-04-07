import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import type { PhaseDecisions } from '../types';
import type { SummaryData } from '../../bridge/summaryGenerator';

interface SummaryPhaseProps {
  decisions: PhaseDecisions;
  onComplete: () => void;
  summaryData?: SummaryData;
}

export function SummaryPhase({ decisions, onComplete, summaryData }: SummaryPhaseProps) {
  const petitionsGranted = decisions.petitionDecisions.filter((d) => d.granted).length;
  const petitionsDenied = decisions.petitionDecisions.filter((d) => !d.granted).length;
  const decreeCount = decisions.selectedDecrees.length;

  const narrative = summaryData?.narrative ?? [
    decisions.crisisResponse
      ? 'The court addressed the crisis decisively.'
      : 'The crisis passed without royal intervention.',
    petitionsGranted > 0 || petitionsDenied > 0
      ? `You heard ${petitionsGranted + petitionsDenied} petition${petitionsGranted + petitionsDenied !== 1 ? 's' : ''}, granting ${petitionsGranted} and denying ${petitionsDenied}.`
      : 'No petitions were brought before the throne.',
    decreeCount > 0
      ? `${decreeCount} royal decree${decreeCount !== 1 ? 's were' : ' was'} issued from the council chamber.`
      : 'The council adjourned without issuing decrees.',
    'The kingdom endures. Your decisions ripple outward.',
  ].join(' ');

  const effects = summaryData?.effectPreview ?? [
    { label: 'Turn Complete', type: 'neutral' as const },
    ...(decreeCount > 0
      ? [{ label: `${decreeCount} Decree${decreeCount !== 1 ? 's' : ''}` as string, type: 'positive' as const }]
      : []),
    ...(petitionsGranted > 0
      ? [{ label: `${petitionsGranted} Granted` as string, type: 'positive' as const }]
      : []),
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'slideUp 400ms ease both',
      }}
    >
      <Card family="summary">
        <CardTitle>Court Summary</CardTitle>
        <CardBody>{narrative}</CardBody>
        <EffectStrip effects={effects} />

        <div
          onClick={onComplete}
          style={{
            marginTop: 16,
            padding: '12px 0',
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-accent-response)',
            cursor: 'pointer',
          }}
        >
          NEXT ROUND
        </div>
      </Card>
    </div>
  );
}
