import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';

interface TitleScreenProps {
  hasSave: boolean;
  savedTurn?: number;
  onStartGame: (scenarioId: string) => void;
  onContinue: () => void;
}

export function TitleScreen({ hasSave, savedTurn, onStartGame, onContinue }: TitleScreenProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        padding: '0 16px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'slideUp 400ms ease both',
      }}
    >
      {/* Title card */}
      <Card family="season">
        <CardTitle>Crown & Council</CardTitle>
        <CardBody>
          A kingdom management card game. Every decision shapes your realm — choose wisely, rule boldly.
        </CardBody>
      </Card>

      {/* Continue card */}
      {hasSave && (
        <Card family="advisor" onClick={onContinue}>
          <CardTitle>Continue Your Reign</CardTitle>
          <CardBody>
            Your kingdom awaits. Resume from where you left off.
          </CardBody>
          <EffectStrip effects={[
            { label: savedTurn ? `Turn ${savedTurn}` : 'Saved', type: 'neutral' },
          ]} />
        </Card>
      )}

      {/* Begin new game */}
      <Card family="decree" onClick={() => onStartGame('new_crown')}>
        <CardTitle>Begin New Reign</CardTitle>
        <CardBody>
          Start a new kingdom from the beginning. Shape your realm through the decisions you make.
        </CardBody>
      </Card>
    </div>
  );
}
