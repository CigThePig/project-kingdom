import type { EventTextEntry } from '../events';

// Phase B identity sweep — bodies weave smart-card placeholders so the engine's
// procgen rulers, dynasties, and capitals reach the player. Pattern: at most
// one {ruler_full} per body (first mention), then {ruler}/{neighbor_short} for
// follow-ups, then pronouns. {neighbor} stays in titles where realm-name
// brevity reads better than ruler-name verbosity.

export const EXPANSION_DIPLOMACY_TEXT: Record<string, EventTextEntry> = {
  evt_exp_dip_foreign_emissary_arrives: {
    title: 'Foreign Emissary at the Gates',
    body: 'An emissary of {ruler_full} has arrived at the capital from {capital} this {season}, bearing letters of introduction and requesting an audience. The nature of their mission is unclear — though with the mood in {capital} reported as {rival_mood}, the gesture carries weight — and it suggests a desire for dialogue. The {class_plural} await the crown\'s reply.',
    choices: {
      welcome_with_feast: 'Welcome with a Feast',
      formal_audience_only: 'Grant a Formal Audience',
    },
  },
  evt_exp_dip_border_greeting: {
    title: 'Friendly Gesture at the Border',
    body: "The governor of {neighbor_short}'s border province has sent a delegation bearing gifts and warm words on behalf of {ruler}. The gesture appears genuine and suggests {dynasty} seeks closer ties with the crown.",
    choices: {
      reciprocate_warmly: 'Reciprocate Warmly',
      acknowledge_politely: 'Acknowledge Politely',
    },
  },
  evt_exp_dip_trade_proposal: {
    title: 'Trade Agreement Proposed',
    body: '{ruler_full} has proposed a formal trade agreement that would reduce tariffs on both sides of the border. With {neighbor_short} in {rival_economic_phase_lc}, the merchants of {capital} stand to benefit handsomely, though the terms could also enrich our own trading houses.',
    choices: {
      accept_trade_terms: 'Accept Their Terms',
      counter_propose: 'Counter-Propose Better Terms',
      decline_politely: 'Decline Politely',
    },
  },
  evt_exp_dip_diplomatic_incident: {
    title: 'Diplomatic Incident with {neighbor}',
    body: "A clash between our border guards and {neighbor_short}'s patrol has escalated into a serious diplomatic incident this {season}. Relations between the courts presently stand at {diplomatic_posture}; {ruler}'s ambassador demands satisfaction, and failure to respond could poison them for years to come. The {class_plural} are watching every move of the court.",
    choices: {
      issue_formal_apology: 'Issue a Formal Apology',
      demand_reciprocal_apology: 'Demand They Apologize First',
      downplay_the_incident: 'Downplay the Incident',
    },
  },
  evt_exp_dip_refugee_plea: {
    title: 'Refugees Seek Asylum',
    body: "A stream of refugees from {neighbor} has appeared at the kingdom's borders this {season}, pleading for sanctuary. They bring little but their labor and their desperation, and the troubles that drove them from {ruler}'s realm — where {spymaster_or_fallback} reports the populace as {rival_mood} — are only half-told. The court debates whether charity or caution should prevail. The {class_plural} await the crown's reply.",
    choices: {
      welcome_refugees: 'Welcome the Refugees',
      limited_asylum: 'Grant Limited Asylum',
      close_the_borders: 'Close the Borders',
    },
  },
  evt_exp_dip_alliance_overture: {
    title: 'Alliance Proposed by {neighbor}',
    body: 'The court at {capital} has sent a formal proposal for a mutual defense alliance under the seal of {ruler_full}, with relations between the realms presently at {diplomatic_posture}. Such a pact would strengthen both realms against external threats, though it would also bind the crown to {dynasty}\'s entanglements.',
    choices: {
      accept_alliance: 'Accept the Alliance',
      propose_limited_pact: 'Propose a Limited Pact',
      maintain_independence: 'Maintain Independence',
    },
  },
  evt_exp_dip_hostage_exchange: {
    title: 'Hostage Exchange Demanded',
    body: '{ruler_full} holds several of our subjects and demands an exchange of prisoners. The captives include a minor noble whose family petitions the crown daily; the negotiations with {capital} will be delicate and costly.',
    choices: {
      negotiate_exchange: 'Negotiate the Exchange',
      refuse_and_retaliate: 'Refuse and Retaliate',
      stall_for_time: 'Stall for Time',
    },
  },
  evt_exp_dip_cultural_envoy: {
    title: 'Cultural Envoy Arrives',
    body: "A troupe of scholars and artists has arrived from {capital}, sent by {ruler_full} to share knowledge and artistic traditions. Their visit could enrich the kingdom's cultural life, though some view foreign influence with suspicion.",
    choices: {
      host_cultural_exchange: 'Host a Cultural Exchange',
      polite_reception: 'Offer a Polite Reception',
    },
  },
  evt_exp_dip_treaty_violation: {
    title: '{neighbor} Violates the Treaty',
    body: '{ruler_full} has flagrantly violated the terms of our standing agreement, pushing relations toward {diplomatic_posture}. {neighbor_short}\'s forces have been spotted in restricted territory, and {dynasty}\'s merchants operate outside sanctioned channels. This cannot stand unanswered.',
    choices: {
      demand_reparations: 'Demand Reparations',
      military_posturing: 'Military Posturing',
      seek_mediation: 'Seek Third-Party Mediation',
      overlook_the_violation: 'Overlook the Violation',
    },
  },
  evt_exp_dip_marriage_proposal: {
    title: 'Royal Marriage Proposed',
    body: '{ruler_full} proposes a marriage between a member of {dynasty} and our own ruling family. Such a union would cement diplomatic ties and bring a substantial dowry, though it would intertwine the bloodlines of {capital} and the crown permanently.',
    choices: {
      accept_the_match: 'Accept the Match',
      negotiate_terms: 'Negotiate Better Terms',
      politely_decline: 'Politely Decline',
    },
  },
  evt_exp_dip_spy_scandal: {
    title: 'Espionage Scandal Erupts',
    body: '{spymaster_or_fallback} reports — from {intel_tier} standing on {neighbor} — that a network of foreign spies has been uncovered operating within the kingdom. {ruler_full} denies involvement, but the evidence is damning. The court must decide how to respond without pushing relations, already at {diplomatic_posture}, any further.',
    choices: {
      deny_involvement: 'Deny Our Own Involvement',
      expel_foreign_diplomats: 'Expel Foreign Diplomats',
      offer_intelligence_sharing: 'Offer Intelligence Sharing',
    },
  },
  evt_exp_dip_border_dispute_escalation: {
    title: 'Border Dispute Escalates',
    body: 'The long-simmering dispute over the borderlands with {neighbor} has erupted into open confrontation, with relations now at {diplomatic_posture}. {ruler_full} has moved troops to the contested region this {season}, and a single miscalculation could trigger armed conflict. The {class_plural} are watching every move of the court.',
    choices: {
      show_of_force: 'Show of Force',
      propose_border_commission: 'Propose a Border Commission',
      cede_disputed_territory: 'Cede the Disputed Territory',
    },
  },
  evt_exp_dip_peace_conference: {
    title: 'Regional Peace Conference',
    body: '{ruler_full} and other neighboring crowns have expressed interest in a formal peace conference, to be hosted at {capital} or elsewhere. Hosting such a gathering would be expensive but could establish the kingdom as a diplomatic leader in the region. The {class_plural} await the crown\'s reply.',
    choices: {
      host_the_conference: 'Host the Conference',
      attend_as_participant: 'Attend as Participant',
      decline_invitation: 'Decline the Invitation',
    },
  },
  evt_exp_dip_trade_embargo_threat: {
    title: '{neighbor} Threatens Trade Embargo',
    body: '{ruler_full} has threatened to impose a complete trade embargo unless the kingdom meets a series of demands — a gambit that would bite hardest with our treasury in {treasury_tier} condition and {neighbor_short} itself in {rival_economic_phase_lc}. Our merchants are alarmed, as {neighbor_short} controls key trade routes that our economy depends upon.',
    choices: {
      negotiate_compromise: 'Negotiate a Compromise',
      counter_embargo: 'Impose a Counter-Embargo',
      seek_alternative_markets: 'Seek Alternative Markets',
      accept_the_embargo: 'Accept the Embargo',
    },
  },
  evt_exp_dip_diplomatic_gift: {
    title: 'Generous Diplomatic Gift',
    body: '{ruler_full} has sent a lavish gift from {capital} — fine textiles, rare spices, and a beautifully illuminated manuscript bearing the seal of {dynasty}. The gesture speaks of genuine goodwill, though diplomacy rarely comes without expectation.',
    choices: {
      accept_graciously: 'Accept Graciously',
      reciprocate_generously: 'Reciprocate Generously',
    },
  },
  evt_exp_dip_war_reparations_demand: {
    title: 'War Reparations Demanded',
    body: '{ruler_full} has issued a formal demand for war reparations, citing damages from past border conflicts. The sum is staggering, and refusal would almost certainly lead to military confrontation — yet paying from a treasury in {treasury_tier} condition would cripple the kingdom.',
    choices: {
      pay_reparations: 'Pay the Reparations',
      refuse_and_mobilize: 'Refuse and Mobilize',
      request_arbitration: 'Request Arbitration',
      stall_negotiations: 'Stall the Negotiations',
    },
  },
  evt_exp_dip_visiting_dignitary: {
    title: 'Visiting Dignitary',
    body: 'A dignitary of modest rank but considerable influence has arrived from {capital} this {season}, sent in {ruler}\'s name. The visit — welcome in light of {intel_tier} current intelligence on {neighbor} — offers an opportunity to strengthen informal ties and gather what {spymaster_or_fallback} cannot otherwise reach. The {class_plural} await the crown\'s reply.',
    choices: {
      grand_welcome: 'Arrange a Grand Welcome',
      standard_reception: 'Standard Reception',
    },
  },
  evt_exp_dip_foreign_merchant_dispute: {
    title: 'Foreign Merchant Dispute',
    body: "A dispute has erupted between local merchants and traders from {neighbor} over trading rights in the capital's market district. Both sides appeal to the crown for a ruling, and the decision will set a precedent for future commerce with {dynasty}.",
    choices: {
      side_with_local_merchants: 'Side with Local Merchants',
      side_with_foreign_traders: 'Side with Foreign Traders',
      impose_neutral_ruling: 'Impose a Neutral Ruling',
    },
  },
  evt_exp_dip_border_patrol_contact: {
    title: 'Border Patrol Encounter',
    body: 'Our border patrols report increased activity along the frontier this {season}. Soldiers under {ruler}\'s banner have been sighted near the boundary markers, their intentions unclear — and with intelligence on {neighbor} presently at {intel_tier}, {spymaster_or_fallback} cannot yet tell posture from provocation. The situation calls for either vigilance or outreach.',
    choices: {
      reinforce_patrols: 'Reinforce the Patrols',
      open_dialogue: 'Open Diplomatic Dialogue',
      monitor_situation: 'Monitor the Situation',
    },
  },
  evt_exp_dip_tribute_request: {
    title: 'Tribute Demanded by {neighbor}',
    body: '{ruler_full} has sent envoys demanding annual tribute as a condition for continued peace between {capital} and our throne, presently at {diplomatic_posture}. The demand is humiliating, but with our treasury in {treasury_tier} condition and military morale {morale_tier}, our position leaves us vulnerable should diplomacy fail.',
    choices: {
      pay_the_tribute: 'Pay the Tribute',
      refuse_defiantly: 'Refuse Defiantly',
      negotiate_lesser_amount: 'Negotiate a Lesser Amount',
    },
  },
  evt_exp_dip_diplomatic_marriage_offer: {
    title: 'Marriage Alliance Offered',
    body: 'A noble house allied to {dynasty} proposes a marriage alliance that would bind our families and strengthen the bond between our realms. The match is advantageous, though it would create lasting obligations toward {ruler}.',
    choices: {
      arrange_the_marriage: 'Arrange the Marriage',
      delay_decision: 'Delay the Decision',
    },
  },
  evt_exp_dip_joint_military_exercise: {
    title: 'Joint Military Exercise Proposed',
    body: '{ruler_full} proposes joint military exercises along the shared border — a show of unity that would strengthen both armies and deter potential aggressors. Participation would demonstrate commitment to the alliance with {dynasty}. The {class_plural} await the crown\'s reply.',
    choices: {
      participate_fully: 'Participate Fully',
      send_observers_only: 'Send Observers Only',
    },
  },

  // --- Smart Card Engine Surface — Phase E ---
  // Rival Crisis Window: informational notification. Body reads purely from
  // rival kingdomSimulation state — no effects, no decision. The empty-arg
  // forms `{rival_crisis:}` / `{rival_mood:}` fall through to ctx.neighborId
  // (populated from the event's __IN_CRISIS__ resolved affectedNeighborId).
  evt_rival_crisis_window: {
    title: 'Whispers from {capital}',
    body:
      '{spymaster_or_fallback} lays a dossier before the throne. {ruler_full} of {neighbor} is {rival_crisis}; ' +
      'the mood in {capital} has turned {rival_mood}.{inter_rival_note}',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },
};
