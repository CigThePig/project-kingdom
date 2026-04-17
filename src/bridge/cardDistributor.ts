// Bridge Layer — Card Distributor
// Distributes a season's generated card pool across 3 months.
// Pure allocation logic: receives pre-generated card data, assigns each month
// an interaction type and the relevant card data.
//
// Phase 4: adapts each legacy card shape into the unified `Card` envelope at
// this boundary, so downstream month-allocation consumers see `Card` objects.

import { InteractionType } from '../engine/types';
import type { CrisisPhaseData } from './crisisCardGenerator';
import type { PetitionCardData, NotificationCardData } from './petitionCardGenerator';
import type { AssessmentPhaseData } from './assessmentCardGenerator';
import type { NegotiationCard, MonthCardAllocation, MonthAllocation } from '../ui/types';
import type { CardOfFamily } from '../engine/cards/types';
import {
  crisisToCard,
  petitionToCard,
  notificationToCard,
  negotiationToCard,
  assessmentToCard,
  overtureToCard,
} from '../engine/cards/adapters';

const EMPTY_ALLOCATION: MonthAllocation = {
  interactionType: null,
  crisisData: null,
  additionalCrises: [],
  petitionCards: [],
  notificationCards: [],
  negotiationCard: null,
  assessmentData: null,
};

/**
 * Distributes a season's generated card pool across 3 months.
 *
 * Tendencies (soft, not hard):
 *   Month 1: crisis, aftermath, assessments
 *   Month 2: petitions, negotiations, active governance
 *   Month 3: remaining events + decrees (handled by phase structure)
 *
 * Rules (hard):
 *   - Crisis-severity events override tendencies (placed in earliest available month)
 *   - Max 1 crisis/negotiation/assessment per month
 *   - Max 3 petitions per month
 *   - Decrees are Month 3 only (handled by phase structure, not distribution)
 *   - A month can be empty (null interaction = quiet month)
 */
export function distributeCardsToMonths(
  crisisData: CrisisPhaseData | null,
  petitionCards: PetitionCardData[],
  negotiationCard: NegotiationCard | null,
  assessmentData: AssessmentPhaseData | null,
  additionalCrises: CrisisPhaseData[] = [],
  notificationCards: NotificationCardData[] = [],
  overtureCards: PetitionCardData[] = [],
): MonthCardAllocation {
  // Lift every legacy shape into a unified `Card` envelope at this boundary.
  // Phase 3 overtures piggyback the petition pool for distribution; putting
  // them at the front ensures overtures always fit somewhere and are
  // resolved in the earliest available petition slot.
  const crisisCard = crisisData ? crisisToCard(crisisData) : null;
  const additionalCrisisCards = additionalCrises.map((c) => crisisToCard(c));
  const overtureCardEnvelopes: CardOfFamily<'overture'>[] = overtureCards.map((o) => overtureToCard(o));
  const petitionCardEnvelopes: CardOfFamily<'petition'>[] = petitionCards.map((p) => petitionToCard(p));
  const combinedPetitions: (CardOfFamily<'petition'> | CardOfFamily<'overture'>)[] = [
    ...overtureCardEnvelopes,
    ...petitionCardEnvelopes,
  ];
  const notificationEnvelopes = notificationCards.map((n) => notificationToCard(n));
  const negotiationCardEnvelope = negotiationCard ? negotiationToCard(negotiationCard) : null;
  const assessmentCardEnvelope = assessmentData ? assessmentToCard(assessmentData) : null;

  const month1: MonthAllocation = { ...EMPTY_ALLOCATION, petitionCards: [], notificationCards: [], additionalCrises: [] };
  const month2: MonthAllocation = { ...EMPTY_ALLOCATION, petitionCards: [], notificationCards: [], additionalCrises: [] };
  const month3: MonthAllocation = { ...EMPTY_ALLOCATION, petitionCards: [], notificationCards: [], additionalCrises: [] };

  // Track what's been placed
  let crisisPlaced = false;
  let negotiationPlaced = false;
  let assessmentPlaced = false;

  // ---- Month 1: Crisis if available, else assessment, else petition ----
  if (crisisCard) {
    month1.interactionType = InteractionType.CrisisResponse;
    month1.crisisData = crisisCard;
    crisisPlaced = true;
  } else if (assessmentCardEnvelope) {
    month1.interactionType = InteractionType.Assessment;
    month1.assessmentData = assessmentCardEnvelope;
    assessmentPlaced = true;
  } else if (combinedPetitions.length > 0) {
    month1.interactionType = InteractionType.Petition;
    // Petitions will be assigned below
  }
  // else: quiet month (null interaction)

  // ---- Month 2: Negotiation if available, else petition, else assessment ----
  if (negotiationCardEnvelope) {
    month2.interactionType = InteractionType.Negotiation;
    month2.negotiationCard = negotiationCardEnvelope;
    negotiationPlaced = true;
  } else if (!assessmentPlaced && assessmentCardEnvelope) {
    month2.interactionType = InteractionType.Assessment;
    month2.assessmentData = assessmentCardEnvelope;
    assessmentPlaced = true;
  } else if (combinedPetitions.length > 0) {
    month2.interactionType = InteractionType.Petition;
    // Petitions will be assigned below
  }
  // else: quiet month

  // ---- Month 3: Whatever remains ----
  if (!crisisPlaced && crisisCard) {
    // Crisis wasn't placed (shouldn't happen, but safety)
    month3.interactionType = InteractionType.CrisisResponse;
    month3.crisisData = crisisCard;
  } else if (!assessmentPlaced && assessmentCardEnvelope) {
    month3.interactionType = InteractionType.Assessment;
    month3.assessmentData = assessmentCardEnvelope;
  } else if (!negotiationPlaced && negotiationCardEnvelope) {
    month3.interactionType = InteractionType.Negotiation;
    month3.negotiationCard = negotiationCardEnvelope;
  } else if (combinedPetitions.length > 0 && month3.interactionType === null) {
    month3.interactionType = InteractionType.Petition;
  }
  // else: quiet month

  // ---- Place additional crisis events in available months ----
  for (const extraCrisis of additionalCrisisCards) {
    const months = [month1, month2, month3];
    const freeMonth = months.find((m) => m.interactionType === null);
    if (freeMonth) {
      freeMonth.interactionType = InteractionType.CrisisResponse;
      freeMonth.crisisData = extraCrisis;
    } else {
      // No free month — attach as a stacked additional crisis.
      // Prefer a month that doesn't already have a primary crisis.
      const nonCrisisMonth = months.find(
        (m) => m.interactionType !== InteractionType.CrisisResponse,
      );
      const target = nonCrisisMonth ?? month3;
      target.additionalCrises.push(extraCrisis);
    }
  }

  // ---- Distribute petitions across months that have petition interaction ----
  if (combinedPetitions.length > 0) {
    const petitionMonths: MonthAllocation[] = [];
    if (month1.interactionType === InteractionType.Petition) petitionMonths.push(month1);
    if (month2.interactionType === InteractionType.Petition) petitionMonths.push(month2);
    if (month3.interactionType === InteractionType.Petition) petitionMonths.push(month3);

    if (petitionMonths.length === 0) {
      // No month was assigned petitions but petitions exist.
      // Find the first quiet month and assign petitions there.
      if (month1.interactionType === null) {
        month1.interactionType = InteractionType.Petition;
        petitionMonths.push(month1);
      } else if (month2.interactionType === null) {
        month2.interactionType = InteractionType.Petition;
        petitionMonths.push(month2);
      } else if (month3.interactionType === null) {
        month3.interactionType = InteractionType.Petition;
        petitionMonths.push(month3);
      }
      // If all months are occupied by higher-priority interactions,
      // attach petitions as stacked secondary interactions.
      // CourtBusiness renders them after the primary interaction completes.
      if (petitionMonths.length === 0) {
        petitionMonths.push(month3);
      }
    }

    // Distribute petitions evenly across petition months (max 3 per month)
    const maxPerMonth = 3;
    let petitionIdx = 0;
    for (const monthAlloc of petitionMonths) {
      const count = Math.min(
        maxPerMonth,
        Math.ceil((combinedPetitions.length - petitionIdx) / (petitionMonths.length - petitionMonths.indexOf(monthAlloc))),
      );
      monthAlloc.petitionCards = combinedPetitions.slice(petitionIdx, petitionIdx + count);
      petitionIdx += count;
      if (petitionIdx >= combinedPetitions.length) break;
    }

    // Overflow: if still leftover petitions, add to last petition month
    if (petitionIdx < combinedPetitions.length && petitionMonths.length > 0) {
      const lastMonth = petitionMonths[petitionMonths.length - 1];
      lastMonth.petitionCards = [
        ...lastMonth.petitionCards,
        ...combinedPetitions.slice(petitionIdx),
      ];
    }
  }

  // ---- Distribute notification cards across months ----
  if (notificationEnvelopes.length > 0) {
    const months = [month1, month2, month3];
    // Prefer quieter months (no primary interaction), then spread evenly
    const quietMonths = months.filter((m) => m.interactionType === null);
    const targets = quietMonths.length > 0 ? quietMonths : months;

    let notifIdx = 0;
    for (const target of targets) {
      const count = Math.ceil(
        (notificationEnvelopes.length - notifIdx) / (targets.length - targets.indexOf(target)),
      );
      target.notificationCards = notificationEnvelopes.slice(notifIdx, notifIdx + count);
      notifIdx += count;
      if (notifIdx >= notificationEnvelopes.length) break;
    }

    // Overflow: attach remaining to last target
    if (notifIdx < notificationEnvelopes.length) {
      const last = targets[targets.length - 1];
      last.notificationCards = [
        ...last.notificationCards,
        ...notificationEnvelopes.slice(notifIdx),
      ];
    }
  }

  return { month1, month2, month3 };
}
