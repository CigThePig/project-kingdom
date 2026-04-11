import { useState } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { SCENARIO_METADATA } from '../../data/scenarios/metadata';
import type { ScenarioMetadata } from '../../data/scenarios/metadata';

interface TitleScreenProps {
  hasSave: boolean;
  savedTurn?: number;
  onStartGame: (scenarioId: string) => void;
  onContinue: () => void;
}

export function TitleScreen({ hasSave, savedTurn, onStartGame, onContinue }: TitleScreenProps) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioMetadata | null>(null);

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

      {/* Section label */}
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary)',
          paddingTop: 4,
        }}
      >
        {hasSave ? 'OR BEGIN NEW REIGN' : 'CHOOSE YOUR SCENARIO'}
      </div>

      {/* Scenario cards */}
      {SCENARIO_METADATA.map((scenario) => {
        const isSelected = selectedScenario?.id === scenario.id;
        return (
          <Card
            key={scenario.id}
            family="decree"
            onClick={() => setSelectedScenario(isSelected ? null : scenario)}
            style={isSelected ? {
              borderColor: 'var(--color-accent-decree)',
              boxShadow: 'var(--shadow-card-hover)',
            } : undefined}
          >
            <CardTitle>{scenario.title}</CardTitle>
            <CardBody>
              <div style={{ marginBottom: 4, fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                {scenario.tagline}
              </div>
              {isSelected && (
                <div style={{ marginTop: 6, animation: 'slideUp 200ms ease both' }}>
                  {scenario.body}
                </div>
              )}
            </CardBody>
            <EffectStrip effects={scenario.highlights} />

            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartGame(scenario.id);
                }}
                style={{
                  marginTop: 12,
                  padding: '10px 0',
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: 'var(--color-accent-decree)',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid var(--color-accent-decree)',
                  borderRadius: 8,
                }}
              >
                BEGIN THIS SCENARIO
              </button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
