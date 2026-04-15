# Simulation Expansion — Crown & Council

## Purpose
This document defines six new simulation layers and one legibility system that transform Crown & Council from a flat-formula engine into an emergent, interconnected kingdom simulation. Each expansion is additive to the existing 11-phase pipeline, surfaces through the card system, and creates second-order consequences that make the world feel alive.

## Design Philosophy

**The player should never think "a number went down." They should think "my kingdom is starving because I conscripted the farmers to fight a war I started because my spy gave me bad intelligence."**

The current engine has breadth — 11 systems, 5 classes, diplomacy, espionage, faith, knowledge, regions. But every system is a one-step formula: input → output, with no compounding, no feedback loops, and no emergent conditions. The simulation *calculates* but it doesn't *breathe*.

These expansions add three things the engine currently lacks:
1. **Feedback loops** — System A's output feeds System B's input, which circles back to affect System A. The player sees cascading consequences, not isolated deltas.
2. **Emergent conditions** — Named states (Drought, Plague, Banditry, Boom, Migration Wave) that arise from system thresholds and modify multiple systems simultaneously. The player reads *conditions*, not numbers.
3. **Temporal dynamics** — Things that grow, decay, accumulate, and resolve over multiple turns. The simulation has memory and momentum.

### Constraints
- **Engine is sacred.** New phases slot into the existing pipeline as sub-phases (e.g., Phase 4b). No reordering of existing phases.
- **Everything is a card.** New simulation outputs surface through crisis cards, petition cards, advisor briefings, effect strips, and the Codex. No new screen types.
- **Mobile session length.** The simulation must be deeper without making turns take longer. Complexity is in the *model*, not in the player's decision count.
- **Pure functions.** All new engine code is state-in, state-out. No side effects, no UI imports, no player-facing text in engine files.

---

## Expansion 1 — Population Dynamics

### Problem
Population counts are frozen at scenario start. A kingdom with 18,000 commoners in Year 1 still has 18,000 in Year 20. Nothing grows, nothing shrinks. The world doesn't respond to how you rule at the most fundamental level — whether people are *alive*.

### Solution
Add birth rate, death rate, migration, and class mobility as per-turn calculations. Population becomes a dynamic resource that responds to food security, disease, war casualties, economic opportunity, and policy.

### New State: `PopulationDynamicsState`

```typescript
interface PopulationDynamicsState {
  // Per-class growth tracking
  birthRateModifier: number;           // kingdom-wide, 0.8–1.2, affected by food/faith/stability
  deathRateModifier: number;           // kingdom-wide, 0.8–1.5, affected by disease/famine/war
  migrationPressure: number;           // -100 to +100. Positive = inflow, negative = outflow

  // Class mobility queues (resolved once per season)
  pendingMobility: ClassMobilityEvent[];

  // Carrying capacity
  housingCapacity: number;             // derived from regions + construction
  currentTotalPopulation: number;      // cached sum

  // Demographic momentum
  recentBirthSurplus: number;          // rolling 4-turn sum of net births
  recentDeathSurplus: number;          // rolling 4-turn sum of net deaths
}

interface ClassMobilityEvent {
  fromClass: PopulationClass;
  toClass: PopulationClass;
  count: number;
  reason: string;                      // internal code: 'merchant_prosperity', 'noble_purchase', etc.
}
```

### Growth Formula

Each turn, per class:
```
netGrowth = population × baseGrowthRate × birthRateModifier × classSpecificModifier
          - population × baseDeathRate × deathRateModifier × classSpecificModifier
          + migrationDelta
```

**Base rates** (per turn = per season):
- Birth rate: 0.008 (0.8% per season ≈ 3.2% per year)
- Death rate: 0.005 (0.5% per season ≈ 2.0% per year)
- Net natural growth: ~1.2% per year in stable conditions

**Birth rate modifiers:**
- Food reserves > 200: +0.1
- Food reserves < 50: -0.2
- Faith level > 70: +0.05 (religious encouragement of families)
- Stability < 30: -0.15 (uncertainty suppresses births)
- Rationing at Emergency: -0.2

**Death rate modifiers:**
- Food reserves = 0 (famine): +0.3
- Active disease condition: +0.2 to +0.5 (see Expansion 3)
- Active war: +0.1 for commoners, +0.3 for military caste
- Stability < 15: +0.1 (civil violence)

**Class-specific modifiers:**
- Commoners grow fastest (×1.2 birth rate) — they're the base of the pyramid
- Nobility grows slowest (×0.5 birth rate) — small, controlled class
- Military Caste death rate scales with deployment posture (Aggressive: ×1.5)

### Migration

Migration pressure is a composite score (-100 to +100) derived from:
- Food security vs. neighbor food security (estimated): ±20
- Tax burden vs. regional average: ±15
- Stability: ±20
- Active war: -25
- Trade openness (Encouraged attracts merchants): +10 to +15
- Religious tolerance (Suppressed drives out minorities): -10

When migration pressure is positive, commoner and merchant populations gain a small inflow bonus. When negative, they lose population — people are *leaving your kingdom*. This is the first time the player feels the consequence of bad governance as literally losing subjects.

**Card surfacing:**
- Migration pressure > +50: Advisor card — "Word of our prosperity spreads. Settlers arrive at the borders."
- Migration pressure < -30: Petition card — "Merchants petition for reduced taxes, warning that families are leaving for [neighbor]."
- Migration pressure < -60: Crisis card — "A mass exodus threatens the [region]. Entire villages stand empty."

### Class Mobility

Once per season (during Phase 4), class mobility resolves:

- **Commoners → Merchants** (when trade openness is Encouraged AND merchant satisfaction > 60 AND commoner satisfaction > 40): Small flow of commoners entering trade. Rate: 0.5% of commoners per season at peak conditions.
- **Merchants → Nobility** (when merchant satisfaction > 80 AND stability > 60): Wealthy merchants buy titles. Rate: 0.1% of merchants per season. *This angers existing nobility* — satisfaction penalty.
- **Commoners → Military Caste** (when military recruitment is Conscript or WarFooting): Forced conscription. Rate scales with stance. Reduces commoner population, increases military force. *Commoner satisfaction penalty applied.*
- **Clergy → Commoners** (when religious tolerance is Suppressed AND faith < 30): Clergy lose institutional support. Rate: 0.3% per season. Former clergy rejoin the commons.

**Card surfacing:**
- Merchants buying titles → Petition card from nobility: "The old houses are outraged. Merchant families now sit in the High Council. Your Majesty, the bloodlines must be preserved."
- Mass conscription → Crisis card: "The harvest rots in the fields. The men who would have reaped it march under your banner instead."

### Carrying Capacity

Total population is soft-capped by housing capacity (derived from regions + civic construction). Exceeding capacity:
- Increases death rate modifier (+0.05 per 10% over capacity)
- Generates petition cards for housing
- Increases disease vulnerability (see Expansion 3)

This creates a genuine infrastructure puzzle: growth is good, but only if you build to support it.

### Engine Integration

**New sub-phase: Phase 4b — Population Growth** (after satisfaction deltas, before stability recalc)

```typescript
function resolvePopulationGrowth(
  population: PopulationState,
  dynamics: PopulationDynamicsState,
  food: FoodState,
  faithLevel: number,
  stability: number,
  policies: PolicyState,
  military: MilitaryState,
  activeConditions: KingdomCondition[],  // from Expansion 3
): { population: PopulationState; dynamics: PopulationDynamicsState }
```

Population changes feed directly into the *same turn's* stability calculation (Phase 8), food consumption (retroactive adjustment next turn), treasury income (more merchants = more tax), and military force size (conscription pathway).

---

## Expansion 2 — Economic Depth

### Problem
The economy is a set of static multipliers. Trade income = base × openness × merchant satisfaction × regional modifier. There's no sense of economic *conditions* — no boom, no bust, no inflation, no scarcity. The treasury goes up or down but the player never feels a living economy.

### Solution
Add an economic cycle system, resource scarcity pricing, a simple inflation model, and inter-class economic relationships that create genuine feedback loops.

### New State: `EconomicState`

```typescript
interface EconomicState {
  // Economic cycle (boom/bust oscillator)
  economicMomentum: number;            // -100 to +100. Positive = expansion, negative = contraction
  cyclePhase: EconomicPhase;           // derived from momentum thresholds
  turnsInCurrentPhase: number;

  // Scarcity pricing
  resourceDemandPressure: Record<ResourceType, number>;  // 0–100, drives price multipliers
  foodPriceMultiplier: number;         // 0.5–3.0, affects treasury/satisfaction

  // Inflation
  inflationRate: number;               // 0.0–0.5, erodes treasury purchasing power
  cumulativeInflation: number;         // tracks total inflation since game start

  // Market confidence
  merchantConfidence: number;          // 0–100, separate from satisfaction — represents market outlook
  tradeVolume: number;                 // abstract 0–100, represents kingdom commercial activity level
}

enum EconomicPhase {
  Depression = 'Depression',           // momentum < -50
  Recession = 'Recession',            // momentum -50 to -15
  Stagnation = 'Stagnation',          // momentum -15 to +15
  Growth = 'Growth',                   // momentum +15 to +50
  Boom = 'Boom',                       // momentum > +50
}
```

### Economic Cycle

Economic momentum drifts based on:
```
momentumDelta = (tradeIncomeTrend × 0.3)
              + (merchantSatisfactionTrend × 0.2)
              + (stabilityAbove50 × 0.15)
              + (constructionActivity × 0.1)
              + (warPenalty × -0.3)
              + (famineShock × -0.4)
              + (meanReversion × -0.05 × currentMomentum)  // natural regression toward zero
```

The mean reversion term is critical — it prevents permanent booms or permanent recessions. The economy *breathes*. Booms naturally cool. Recessions naturally recover. But player actions accelerate or delay the transitions.

**Phase effects:**

| Phase | Treasury Modifier | Trade Modifier | Merchant Satisfaction | Event Pool |
|-------|------------------|----------------|----------------------|------------|
| Depression | ×0.7 | ×0.5 | -3/turn | Bank failures, merchant flight, bread riots |
| Recession | ×0.85 | ×0.75 | -1/turn | Trade disputes, guild complaints |
| Stagnation | ×1.0 | ×1.0 | 0 | Neutral |
| Growth | ×1.1 | ×1.2 | +1/turn | Market expansion, foreign traders arrive |
| Boom | ×1.25 | ×1.5 | +2/turn | Speculation warnings, inflation pressure |

**Card surfacing:**
- Entering Growth: Advisor card — "The market square hums with new stalls. Our merchants report rising fortunes."
- Entering Recession: Crisis card — "Trade caravans grow scarce. The merchant guild warns of hard months ahead."
- Boom → Depression (crash): Crisis card — "The bottom falls out. Warehouses stand full of goods no one can afford. The merchant quarter reels."

### Scarcity Pricing

When resource stockpiles drop below threshold (< 20), a demand pressure value rises. This affects:
- Construction costs (building in a wood shortage costs more gold)
- Military equipment maintenance (iron scarcity degrades equipment faster)
- Food price multiplier (famine drives prices up, hurting commoner satisfaction extra)

The food price multiplier is the big one. When food is scarce:
```
foodPriceMultiplier = 1.0 + max(0, (100 - foodReserves) / 50)
```
At zero reserves, food costs 3× normal. This hits the treasury (emergency grain purchases) and commoner satisfaction (they can't afford to eat). It also *helps* merchants who trade in grain — creating a moral tension where famine is profitable for the trading class.

**Card surfacing:**
- Iron scarcity + active war: Crisis card — "Our smiths report iron stockpiles are nearly exhausted. Weapons cannot be repaired. Your commanders demand a solution."
- Food price spike: Petition from commoners — "Bread costs three times what it did last spring. The people grow desperate."

### Inflation

Inflation is a slow burn that accumulates from:
- Consecutive turns of high government spending (military upkeep + construction > income)
- Boom phase persistence (> 4 turns in Boom)
- Event-driven: discovering gold, looting enemy treasury

Inflation erodes the *effective value* of the treasury. At 10% cumulative inflation, everything costs 10% more in real terms. This is applied as a cost multiplier on construction, military upkeep, and religious order upkeep.

The player never sees "inflation: 12%." They see: "Construction costs have risen sharply" on an advisor card, or a decree that used to cost 80 gold now shows 90 on its effect strip. The simulation is legible through its *consequences*, not its numbers.

**Deflation pathway:** Extended recession or depression naturally reduces inflation. Punitive taxation also reduces it (but kills growth). The player must choose between growth and price stability.

### Engine Integration

**New sub-phase: Phase 1b — Economic Cycle Update** (after income calculation, before action execution)

The economic phase modifiers apply to income and expense calculations within the same turn. This means entering a recession immediately reduces trade income — the player feels it that season.

---

## Expansion 3 — Environmental & Health System

### Problem
The world has no weather, no disease, no natural disasters beyond flat seasonal food modifiers. The environment is inert. Medieval kingdoms were defined by their relationship with nature — droughts, plagues, floods, harsh winters, bountiful harvests. Without this, the world feels like a spreadsheet, not a land.

### Solution
Add a condition system for environmental and health states. Conditions are named, multi-turn effects that modify multiple systems simultaneously and can trigger or be triggered by other conditions.

### New State: `EnvironmentState`

```typescript
interface EnvironmentState {
  // Active conditions (the core of this system)
  activeConditions: KingdomCondition[];

  // Weather tracking
  weatherSeverity: number;             // -50 to +50. Negative = harsh, positive = mild
  droughtAccumulator: number;          // 0–100, rises in dry conditions
  floodRisk: number;                   // 0–100, rises after heavy weather events

  // Health tracking
  diseaseVulnerability: number;        // 0–100, rises with overcrowding/famine/war
  sanitationLevel: number;             // 0–100, improved by civic construction/knowledge
  plagueMemoryTurns: number;           // turns since last plague, affects population caution
}

interface KingdomCondition {
  id: string;
  type: ConditionType;
  severity: ConditionSeverity;
  turnsActive: number;
  turnsRemaining: number | null;       // null = until resolved by player action or system threshold
  systemEffects: ConditionEffect[];    // what this condition does each turn
  regionId: string | null;             // null = kingdom-wide, string = regional
  canEscalate: boolean;                // whether this condition can worsen if unaddressed
  escalatesTo: string | null;          // condition ID of the escalated form
}

enum ConditionType {
  // Environmental
  Drought = 'Drought',
  Flood = 'Flood',
  HarshWinter = 'HarshWinter',
  Blight = 'Blight',
  BountifulHarvest = 'BountifulHarvest',

  // Health
  Plague = 'Plague',
  Pox = 'Pox',
  Famine = 'Famine',              // upgraded from simple food=0 tracking
  Pestilence = 'Pestilence',      // vermin destroying stored grain

  // Social (see Expansion 4)
  Banditry = 'Banditry',
  Corruption = 'Corruption',
  Unrest = 'Unrest',
  CriminalUnderworld = 'CriminalUnderworld',

  // Economic (see Expansion 2)
  TradeDisruption = 'TradeDisruption',
  MarketPanic = 'MarketPanic',

  // Positive conditions
  GoldenAge = 'GoldenAge',
  HarvestFestival = 'HarvestFestival',
  PilgrimageSeason = 'PilgrimageSeason',
  MilitaryTriumph = 'MilitaryTriumph',
}

enum ConditionSeverity {
  Mild = 'Mild',
  Moderate = 'Moderate',
  Severe = 'Severe',
}

interface ConditionEffect {
  target: string;                      // e.g., 'food.productionModifier', 'treasury.expenseModifier'
  operator: 'add' | 'multiply';
  value: number;
}
```

### Condition Lifecycle

Conditions follow a four-stage lifecycle:

**1. Incubation** — Risk accumulates silently. The drought accumulator rises during dry seasons. Disease vulnerability increases during famine. The player sees no card — but an astute player reading the Codex notices the numbers shifting.

**2. Emergence** — A condition triggers when its accumulator crosses a threshold. This ALWAYS generates a card — either an advisor briefing (mild), a petition (moderate), or a crisis (severe). The player now knows the condition exists.

**3. Persistence** — The condition applies its effects each turn. It may escalate if the player doesn't respond. Drought (Mild, -20% food) can become Drought (Severe, -50% food). Plague (Mild, regional) can become Plague (Severe, kingdom-wide).

**4. Resolution** — The condition ends via player action (decree), system threshold (weather changes), time passage, or escalation into a different condition. Resolution generates a summary card or advisor briefing.

### Weather System

Weather severity oscillates semi-randomly with seasonal bias:
```
weatherDelta = seasonalBias + random(-15, +15) + clamp(trend, -5, +5)
```

| Season | Seasonal Bias | Tendency |
|--------|--------------|----------|
| Spring | +5 | Mild, wet — flood risk |
| Summer | -5 | Hot, dry — drought risk |
| Autumn | 0 | Variable |
| Winter | -15 | Harsh — severe winter risk |

**Drought:** Summer with weatherSeverity < -25 for 2+ consecutive turns. Stacks: mild (-20% food), moderate (-35% food, +10 commoner dissatisfaction), severe (-50% food, +20 commoner dissatisfaction, trade routes disrupted).

**Flood:** Spring with weatherSeverity > +30 after accumulated precipitation. Damages one region (localConditionModifier reduced), destroys stored food (reserves -15%), but replenishes farmland long-term (+5% food next season).

**Harsh Winter:** Winter with weatherSeverity < -35. Military readiness decays faster, food consumption increases 20%, construction halts, commoner death rate increases.

**Bountiful Harvest:** Summer/Autumn with weatherSeverity > +20 and no active drought. Food production +30%, commoner satisfaction +5, merchant confidence +10 (trade in surplus grain).

### Disease System

Disease vulnerability accumulates from:
- Overcrowding (population > housing capacity): +5/turn
- Famine (food reserves = 0): +8/turn
- Active war (troops returning with camp diseases): +3/turn
- Low sanitation (no civic construction, no knowledge advancement): +2/turn
- Trade openness = Encouraged (foreign merchants bring foreign diseases): +1/turn

Reduced by:
- Healing religious order active: -3/turn
- Civic knowledge milestones: -2 per milestone
- Quarantine decree (player action, costs trade income): -5/turn

**Plague trigger:** When diseaseVulnerability > 60, each turn has a (vulnerability - 40)% chance of plague emergence. Plague is the most devastating condition in the game:

| Severity | Death Rate Modifier | Duration | Spread |
|----------|-------------------|----------|--------|
| Mild (Pox) | +0.15 | 3–5 turns | 1 region |
| Moderate (Plague) | +0.30 | 4–8 turns | 2–3 regions |
| Severe (Great Plague) | +0.50 | 6–12 turns | Kingdom-wide |

Plague kills population. That's the point. A Great Plague can kill 10–15% of the population over its duration. This reshapes everything: fewer commoners means less food production, fewer merchants means less trade, fewer soldiers means military weakness. The kingdom that emerges from a plague is fundamentally changed.

**Card surfacing:**
- Plague emergence (Mild): Advisor card — "Reports from [region]: a sickness spreads through the lower quarters. Healers advise caution."
- Plague escalation: Crisis card — "The sickness is no longer contained. Bodies pile in the streets of [region]. Your healers are overwhelmed. What is your command?"
- Plague resolution: Legacy card — "The plague has passed. [X] souls were lost. The kingdom endures, diminished but alive."

### Condition Interactions (Emergence Chains)

This is where the system creates genuine emergence:

- **Drought → Famine → Plague**: Drought reduces food. Prolonged food shortage creates Famine condition. Famine increases disease vulnerability. Disease vulnerability triggers Plague. The player who ignored a drought in Summer may face a plague by Winter.
- **War → Banditry → Trade Disruption**: War creates deserters and bandits. Banditry disrupts trade routes. Trade disruption reduces merchant confidence. The economic cost of war extends far beyond military upkeep.
- **Boom → Overcrowding → Disease**: Economic growth attracts migration. Migration exceeds housing capacity. Overcrowding increases disease vulnerability. Success creates its own dangers.
- **Harsh Winter + Low Reserves → Emergency**: Harsh winter increases consumption while reducing production. If reserves were already low, this chain can trigger famine within a single season.

### Engine Integration

**New sub-phase: Phase 0b — Environmental Tick** (after proposals, before income)

```typescript
function resolveEnvironmentTick(
  environment: EnvironmentState,
  season: Season,
  food: FoodState,
  population: PopulationState,
  dynamics: PopulationDynamicsState,
  regions: RegionState[],
  military: MilitaryState,
  policies: PolicyState,
  knowledge: KnowledgeState,
): { environment: EnvironmentState; conditionCards: ConditionCardTrigger[] }
```

The function returns both updated state AND a list of condition-triggered card events. The card triggers are processed in Phase 9 (Event Generation) alongside normal events, ensuring conditions generate appropriately-timed cards.

---

## Expansion 4 — Social Fabric

### Problem
Low satisfaction is just a number. There's no crime, no corruption, no riots, no black market, no banditry — none of the social consequences that make a struggling kingdom feel *dangerous*. The gap between satisfaction 50 and satisfaction 20 should feel like the difference between a grumbling populace and a powder keg.

### Solution
Add social conditions that emerge from satisfaction thresholds, policy choices, and system interactions. These conditions have mechanical effects that feed back into other systems, creating downward spirals that require active intervention to break.

### Social Condition Definitions

**Banditry** — Emerges when commoner satisfaction < 35 AND stability < 40, OR during/after war (deserters).
- Effects: Trade income -15%, regional food production -10% (raided harvests), merchant satisfaction -5/turn
- Escalation: If unaddressed for 4+ turns, can escalate to "Brigand Kingdoms" — a regional condition where an entire region's output drops by 40% and requires military action to resolve
- Resolution: Military patrol decree, or stability recovery above 50

**Corruption** — Emerges when nobility satisfaction > 80 AND taxation is High/Punitive (nobles exploit their position), OR when treasury balance is very high with low oversight.
- Effects: Treasury income -10% (skimmed), construction costs +15% (graft), stability -2/turn (public resentment)
- Escalation: If unaddressed, corruption becomes entrenched — a permanent kingdom feature that requires a dedicated reform storyline to remove
- Resolution: Internal surveillance (espionage), anti-corruption decree, or lowering noble influence

**Unrest** — Emerges when ANY class satisfaction < 20 AND stability < 35.
- Effects: Stability -5/turn (self-reinforcing!), construction progress halted, random regional damage
- Escalation: Riot → Rebellion → Civil War (an internal conflict using the existing conflict system)
- Resolution: Address the underlying class grievance, festival decree (temporary), or military suppression (Authoritarian ruling style shift)

**Criminal Underworld** — Emerges when merchant satisfaction < 30 AND trade openness is Restricted/Closed, OR when intelligence funding is None for 4+ turns.
- Effects: Espionage counter-intelligence -15, treasury -5% (black market tax evasion), merchant satisfaction +3 (black market provides what legal trade doesn't — a perverse incentive)
- Resolution: Counter-espionage sweep, opening trade, or accepting it as a cost of control

### Class Interaction Matrix

The current engine treats each class independently. This expansion adds cross-class friction:

```typescript
interface ClassInteraction {
  sourceClass: PopulationClass;
  targetClass: PopulationClass;
  trigger: string;                     // condition code
  satisfactionImpact: number;          // delta applied to target
  probability: number;                 // chance per turn when trigger is active
}
```

| Source Rising | Target Falling | Trigger | Effect |
|--------------|----------------|---------|--------|
| Merchants (>75) | Nobility (<50) | Merchant ascendancy | Nobility -2/turn ("upstarts threaten the old order") |
| Clergy (>80) | Merchants (<60) | Theocratic pressure | Merchants -1/turn ("religious restrictions hurt trade") |
| Military Caste (>70) | Commoners (<50) | Military arrogance | Commoners -1/turn ("soldiers swagger through the market") |
| Nobility (>80) | Commoners (<40) | Noble excess | Commoners -2/turn ("the lords feast while we starve") |
| Commoners (>70) | Nobility (<50) | Popular empowerment | Nobility -2/turn ("the commons forget their place") |

These interactions create genuine class politics. You can't keep everyone happy — raising one class inherently threatens another. This is the core tension driver that makes the 5-class system feel like a society rather than 5 independent meters.

**Card surfacing:**
- Noble-Merchant friction: Petition from nobility — "The merchant Aldric now holds more land than House Varenne. We demand the Crown restrict common-born land purchases."
- Commoner-Noble friction: Crisis card — "A mob has gathered outside Lord Harland's manor. They demand he open his granaries. Your guard captain awaits orders."

### Engine Integration

**New sub-phase: Phase 4c — Social Fabric** (after population growth, before stability)

Social conditions are evaluated based on the satisfaction values *after* Phase 4 deltas are applied but *before* stability is recalculated. This means a social condition that emerged this turn will immediately affect the stability score — creating the fast feedback the player needs to feel the consequence.

---

## Expansion 5 — Regional Life

### Problem
Regions are just output buckets. A region with `primaryEconomicOutput: 'Food'` produces food. That's it. There's no local politics, no regional events, no infrastructure decay, no sense that these are *places* where *people live*.

### Solution
Expand RegionState with local conditions, infrastructure, loyalty, and population distribution. Give regions their own mini-simulation that feeds into the kingdom-level systems.

### Expanded `RegionState`

```typescript
interface RegionState {
  // Existing fields (preserved)
  id: string;
  primaryEconomicOutput: ResourceType | 'Food' | 'Trade';
  localConditionModifier: number;
  populationContribution: number;
  developmentLevel: number;
  localFaithProfile: string;
  culturalIdentity: string;
  strategicValue: number;
  isOccupied: boolean;

  // New fields
  localPopulation: number;             // actual population count in this region
  loyalty: number;                     // 0–100, how attached the region is to the crown
  infrastructure: RegionalInfrastructure;
  localConditions: KingdomCondition[]; // regional conditions (drought, plague, banditry)
  localEconomy: RegionalEconomy;
  borderRegion: boolean;               // true = adjacent to a neighbor, affects military/diplomacy
  terrainType: TerrainType;            // affects agriculture, military, construction
}

interface RegionalInfrastructure {
  roads: number;                       // 0–100, affects trade throughput and military movement
  walls: number;                       // 0–100, affects siege defense
  granaries: number;                   // 0–100, affects local food storage capacity
  sanitation: number;                  // 0–100, affects disease vulnerability
  // Each improves through construction projects and decays slowly without maintenance
}

interface RegionalEconomy {
  productionOutput: number;            // actual output this turn (after all modifiers)
  localTradeActivity: number;          // 0–100, affects merchant population
  taxContribution: number;             // this region's share of kingdom tax revenue
}

enum TerrainType {
  Plains = 'Plains',                   // food bonus, vulnerable to cavalry
  Hills = 'Hills',                     // mining bonus, defensive terrain
  Forest = 'Forest',                   // wood bonus, ambush terrain
  Coastal = 'Coastal',                 // trade bonus, naval vulnerability
  Mountain = 'Mountain',               // stone bonus, near-impregnable defense, low food
  River = 'River',                     // food + trade bonus, flood risk
}
```

### Regional Loyalty

Loyalty starts at 60–80 depending on scenario. It drifts based on:
- Kingdom stability above 50: +1/turn
- Kingdom stability below 30: -1/turn
- Region occupied then liberated: +10 (gratitude) but -5 base (trauma)
- Regional conditions unaddressed: -2/turn per condition
- Construction completed in region: +5 one-time
- Tax burden with low regional benefit: -1/turn
- Cultural mismatch with kingdom identity: -1/turn (creates assimilation tension)

**Low loyalty consequences:**
- Loyalty < 40: Region stops paying full taxes (-30% tax contribution)
- Loyalty < 25: Separatist events enter the crisis pool. Regional officials resist decrees.
- Loyalty < 15: Rebellion. The region effectively becomes an internal enemy, requiring military action or diplomatic concession.

**Card surfacing:**
- Loyalty dropping: Advisor card — "Our governor in [region] reports growing discontent. The people feel forgotten by the crown."
- Loyalty critical: Crisis card — "The Council of [region] has sent an ultimatum. They demand local autonomy, reduced taxes, and the removal of the royal garrison. Failure to respond may mean open revolt."

### Infrastructure Decay

All infrastructure decays by 1–2 points per season without maintenance. This creates a constant low-level maintenance cost that the player must balance against new construction. A neglected region's roads crumble, its walls weaken, its granaries rot.

Infrastructure levels feed back into the kingdom-level systems:
- **Roads** → regional trade output modifier, military movement speed for conflicts in this region
- **Walls** → siege defense value if the region is attacked, also reduces banditry
- **Granaries** → local food storage acts as a buffer against famine (the region can absorb 2–3 turns of food deficit before contributing to kingdom-wide shortage)
- **Sanitation** → disease vulnerability modifier for this region

### Engine Integration

**New sub-phase: Phase 1c — Regional Tick** (after income, feeds into existing regional summary)

The regional tick updates local conditions, infrastructure decay, loyalty drift, and local economy. Its outputs feed into the existing `summarizeRegionalOutputs()` function, replacing the current simple pass with a richer calculation that accounts for local conditions and infrastructure.

---

## Expansion 6 — Causal Legibility System

### Problem
The player can see that their treasury dropped by 47 gold this turn, but they can't see *why*. Was it military upkeep? Construction? A corruption condition eating 10% of income? The festival they funded? The simulation runs deep logic that the player never reads, which makes the game feel arbitrary rather than smart.

### Solution
Add a causal chain tracking system that records why every significant state change occurred, and surfaces the most important chains through cards, summaries, and the Codex.

### New State: `CausalLedger`

```typescript
interface CausalLedger {
  // Per-turn chain records
  currentTurnChains: CausalChain[];

  // Rolling history for trend analysis
  recentChains: CausalChain[];         // last 4 turns, for advisor analysis
}

interface CausalChain {
  id: string;
  rootCause: CausalNode;
  finalEffect: CausalNode;
  intermediateSteps: CausalNode[];
  totalMagnitude: number;              // abstract importance score for filtering
  turnRecorded: number;
}

interface CausalNode {
  system: string;                      // 'food', 'treasury', 'population', 'military', etc.
  description: string;                 // internal code, NOT player text: 'conscription_labor_loss'
  numericDelta: number | null;         // the actual value change, if quantifiable
}
```

### How Chains Are Built

During turn resolution, each calculation that produces a significant delta (> threshold) registers a causal record:

```typescript
// Example: in food production calculation
const laborLoss = conscriptionCount * FOOD_COMMONER_LABOR_PRODUCTION_RATE;
if (laborLoss > 5) {
  ledger.record({
    system: 'food',
    cause: { system: 'military', description: 'conscription_reduced_labor' },
    effect: { system: 'food', description: 'production_decreased', numericDelta: -laborLoss },
  });
}
```

The ledger automatically chains records that share system connections:
```
conscription_policy → labor_loss → food_production_down → food_reserves_low → commoner_satisfaction_down → stability_decrease
```

### Surfacing Through Cards

**Turn Summary Enhancement:**
Instead of "Treasury: -47", the summary shows:
"Treasury: -47 (Military upkeep -32, Festival costs -25, Trade income +10)"

Each cause is tappable — tapping "Military upkeep -32" shows a tooltip: "1,200 soldiers at Mobilized posture. Readiness maintenance costs rising."

**Advisor Briefings (Trend Analysis):**
When a causal chain repeats for 3+ turns, an advisor briefing card appears:
"Sire, our food reserves have fallen for three consecutive seasons. The primary cause: conscription has reduced our farming population by 2,400 since the war began. At this rate, reserves will be exhausted by Winter."

This is the single most impactful legibility feature. The player doesn't need to understand the formulas — the advisor *tells them the story* of what's happening in their kingdom.

**Crisis Card Context:**
When a crisis event fires (e.g., famine warning), the crisis card body includes causal context:
"The granaries echo with emptiness. Three seasons of drought, compounded by the loss of farmhands to the eastern campaign, have brought your people to the edge of starvation."

This text is generated by the bridge layer reading the causal ledger and mapping internal codes to narrative fragments. The text is assembled, not hardcoded — so the crisis card naturally reflects the *actual* causes in this specific playthrough.

### Codex Integration

The Codex (existing system) gains a "Kingdom Pressures" section that shows the top 3–5 active causal chains, ordered by magnitude:

```
⚠ FOOD CRISIS (Severity: High)
  Drought (Summer, 2 seasons) → Production -35%
  Conscription (War Footing) → Labor -13%
  Combined: Reserves declining at 28/turn. Estimated exhaustion: 2 turns.

⚠ TREASURY STRAIN (Severity: Moderate)
  War upkeep → Expenses +40/turn
  Recession → Trade income -25%
  Combined: Net flow -47/turn. Insolvency in 6 turns at current rate.

✦ MERCHANT PROSPERITY (Severity: Positive)
  Trade openness (Encouraged) → Income +15/turn
  Boom phase → Confidence high
  Warning: Inflation accumulating. Consider moderating spending.
```

### Engine Integration

The causal ledger is a lightweight recording system that piggybacks on existing calculations. Each system module gains an optional `ledger` parameter. When present, significant deltas are recorded. When absent (unit tests, etc.), the system behaves identically to today.

**No new phase required.** The ledger is populated *during* existing phases and read *after* resolution by the bridge layer for card generation.

---

## Expansion 7 — Feedback Loop Map

This section doesn't add new code — it documents the emergent feedback loops created by Expansions 1–6 working together. These loops are the reason the simulation will feel "smart."

### The Prosperity Spiral (Positive Feedback)
```
High stability → migration inflow → population growth → more tax revenue
→ more construction → infrastructure improvement → more production
→ higher trade → economic boom → merchant confidence → higher stability
```
**Breaking mechanism:** Boom triggers inflation. Population growth exceeds housing. Prosperity attracts neighbor envy (war). The spiral doesn't last forever — it generates its own threats.

### The Collapse Spiral (Negative Feedback)
```
War → conscription → labor loss → food production drops → famine
→ disease vulnerability → plague → population death → less production
→ less tax revenue → can't maintain military → war goes worse
```
**Breaking mechanism:** Peace treaty, emergency rationing, quarantine decree, foreign aid request (diplomatic action). The spiral is escapable but only through decisive, costly action.

### The Class Tension Cycle
```
Favor merchants (trade openness) → merchant prosperity → merchants buy noble titles
→ nobility enraged → noble intrigue → instability → merchants nervous
→ trade income drops → merchant dissatisfaction → economic recession
```
**Resolution requires:** Direct intervention — either restricting social mobility (authoritarian, angers commoners) or pacifying nobility (expensive, requires favors). No passive solution exists.

### The Regional Decay Loop
```
Neglect region → infrastructure decays → production drops → loyalty drops
→ region stops paying taxes → less revenue for maintenance → more neglect
→ banditry emerges → trade disrupted → further loyalty loss → separatism
```
**Breaking mechanism:** Targeted construction, military patrol, royal visit decree. But every resource spent here is a resource not spent on the war, the plague, or the hungry capital.

### The Religious Pressure Cooker
```
Enforce state religion → heterodoxy rises (suppressed beliefs go underground)
→ devout neighbor applies pressure → heterodoxy accelerates
→ schism triggers → clergy split → faith crashes → stability drops
→ commoners lose moral comfort → satisfaction drops → unrest
```
**Alternative path:** Tolerance reduces heterodoxy but angers clergy. The player must choose which pressure to relieve.

---

## Implementation Priority

The expansions are ordered by impact-per-complexity:

### Phase A — Foundation (Highest Impact, Moderate Complexity)
1. **Expansion 3: Environmental & Health (Conditions System)** — This is the infrastructure that Expansions 2, 4, and 5 all depend on. The `KingdomCondition` type and lifecycle is the backbone. Build this first.
2. **Expansion 6: Causal Legibility** — The ledger system should be wired in early so every subsequent expansion automatically generates readable causal chains. Without this, adding depth makes the game *more* opaque, not less.

### Phase B — Core Dynamics (Highest Impact, Higher Complexity)
3. **Expansion 1: Population Dynamics** — Growth, death, and migration transform the game from a static puzzle to a living world. This is the single biggest "the simulation is alive" signal.
4. **Expansion 4: Social Fabric** — Class interactions and social conditions create the political tension that makes every decision feel weighted.

### Phase C — Economic and Spatial (Deepening)
5. **Expansion 2: Economic Depth** — Boom/bust cycles and scarcity pricing add temporal rhythm to the economy.
6. **Expansion 5: Regional Life** — Regional loyalty, infrastructure, and local conditions give the kingdom spatial texture.

### Estimated Scope

| Expansion | New Types | New Functions | New Constants | Data Layer (events/text) |
|-----------|----------|---------------|---------------|-------------------------|
| 1. Population | 3 interfaces, 0 enums | 8–10 | 15–20 | 10–15 event defs, 20+ text entries |
| 2. Economic | 2 interfaces, 1 enum | 6–8 | 10–15 | 8–12 event defs, 15+ text entries |
| 3. Environment | 3 interfaces, 2 enums | 10–12 | 20–25 | 20–30 event defs, 40+ text entries |
| 4. Social Fabric | 1 interface | 5–7 | 10–12 | 15–20 event defs, 25+ text entries |
| 5. Regional | 3 interfaces, 1 enum | 8–10 | 15–18 | 15–20 event defs, 30+ text entries |
| 6. Causal Ledger | 3 interfaces | 4–6 | 3–5 | 0 event defs, bridge layer templates |

---

## What Changes for the Player

None of these expansions add new screens, new interaction types, or new phase structures. The player still plays the same three-beat round: crisis → petitions → decrees → summary. What changes:

1. **Crisis cards have context.** "Your kingdom starves" becomes "Three seasons of drought and a conscripted workforce have brought your people to the edge."
2. **Petitions feel connected.** The merchant complaining about taxes in Month 1 is the same merchant whose trade income you see dropping in the summary.
3. **Decrees have real stakes.** Conscription doesn't just cost gold — it costs farmers, which costs food, which costs lives next winter.
4. **The Codex tells a story.** The Kingdom Pressures view shows the player the 3–5 forces actually shaping their kingdom, with projected consequences.
5. **Time matters.** A drought in Summer has consequences in Autumn. A plague in Year 3 reshapes the kingdom through Year 5. The simulation has *memory*.
6. **Success is fragile.** Prosperity creates its own threats (inflation, overcrowding, neighbor envy). The player never reaches a stable equilibrium — there's always a new pressure building.

The simulation doesn't get more *complicated* for the player. It gets more *legible*. The player understands more because the game tells them more, and what it tells them is a coherent story of cause and effect rather than a list of disconnected deltas.
