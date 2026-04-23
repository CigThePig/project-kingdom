// Phase 6.5 — Faction Request Player-Facing Text
// Maps faction_req_* IDs to title, body, and choice labels.

import type { EventTextEntry } from './events';

export const FACTION_REQUEST_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // Nobility
  // ============================================================
  faction_req_nobility_tax_exemption: {
    title: 'Noble Houses Demand Tax Relief',
    body: 'A delegation of noble houses has arrived at court, demanding exemption from the crown\'s latest taxation measures. They warn that continued levies on their estates will drive the lesser nobility into open defiance. The treasury would suffer, but refusal risks deepening the rift with the aristocracy.',
    choices: {
      grant_tax_exemption: 'Grant Tax Exemptions',
      deny_tax_exemption: 'Deny Their Demands',
    },
  },
  faction_req_nobility_court_privileges: {
    title: 'Nobles Seek Expanded Privileges',
    body: 'A coalition of noble families petitions the crown for expanded privileges at court — seats on the advisory council, priority in land disputes, and ceremonial precedence. The request is reasonable by tradition, but granting it may further entrench aristocratic power.',
    choices: {
      expand_court_privileges: 'Expand Court Privileges',
      deny_court_privileges: 'Deny the Petition',
    },
  },
  faction_req_nobility_academy: {
    title: 'Proposal for a Noble Academy',
    body: 'Flush with influence and good standing, the noble houses propose establishing a royal academy for the training of young aristocrats in governance, warfare, and diplomacy. The project would elevate the kingdom\'s prestige but require significant treasury investment.',
    choices: {
      fund_noble_academy: 'Fund the Academy',
      decline_academy_proposal: 'Decline the Proposal',
    },
  },

  // ============================================================
  // Clergy
  // ============================================================
  faction_req_clergy_heresy_crackdown: {
    title: 'Clergy Demands Heresy Crackdown',
    body: 'The senior clergy has formally petitioned the crown for authority to conduct a crackdown on heretical teachings spreading through the provinces. They insist that tolerance has gone too far and that the faith is under existential threat. Granting their request will please the orthodox establishment but alarm free-thinking commoners.',
    choices: {
      authorize_crackdown: 'Authorize the Crackdown',
      refuse_crackdown: 'Refuse the Request',
    },
  },
  faction_req_clergy_temple_funding: {
    title: 'Request for Temple Restoration',
    body: 'The clergy requests crown funding for the restoration of aging temples and the raising of new shrines in underserved regions. The investment would strengthen the faith\'s presence and improve clerical morale, though the treasury would bear the cost.',
    choices: {
      approve_temple_funding: 'Approve Temple Funding',
      deny_temple_funding: 'Deny the Request',
    },
  },
  faction_req_clergy_religious_festival: {
    title: 'Clergy Proposes Grand Festival',
    body: 'Buoyed by their strong standing with the crown, the clergy proposes a grand religious festival to celebrate the faith and unite the populace. The celebration would strengthen piety and communal bonds, but requires royal sponsorship.',
    choices: {
      sponsor_religious_festival: 'Sponsor the Festival',
      decline_festival_request: 'Decline the Proposal',
    },
  },

  // ============================================================
  // Merchants
  // ============================================================
  faction_req_merchant_trade_protections: {
    title: 'Merchants Demand Trade Protections',
    body: 'The merchant guild has sent an urgent petition demanding crown protection from foreign competition and predatory tariffs. They claim that without immediate intervention, several major trading houses will fail, taking employment and tax revenue with them.',
    choices: {
      grant_trade_protections: 'Grant Trade Protections',
      deny_trade_protections: 'Deny Their Demands',
    },
  },
  faction_req_merchant_market_expansion: {
    title: 'Request for Market Expansion',
    body: 'The merchant guild requests royal permission and support to expand the kingdom\'s central marketplace. The project would increase trade volume and tax revenue, though commoners near the market complain of displacement from their homes, and nobles protest the encroachment of commercial activity onto estates bordering the district.',
    choices: {
      approve_market_expansion: 'Approve the Expansion',
      deny_market_expansion: 'Deny the Request',
    },
  },
  faction_req_merchant_foreign_mission: {
    title: 'Merchants Propose Foreign Trade Mission',
    body: 'Confident in the kingdom\'s commercial strength, the leading merchants propose a crown-sponsored trade mission to distant lands. The venture promises new markets and cultural exchange, though it requires investment with uncertain returns.',
    choices: {
      fund_foreign_mission: 'Fund the Mission',
      decline_foreign_mission: 'Decline the Proposal',
    },
  },

  // ============================================================
  // Commoners
  // ============================================================
  faction_req_commoner_food_relief: {
    title: 'Common Folk Plead for Food Relief',
    body: 'Representatives of the common folk have gathered at the palace gates, pleading for emergency food distribution. Hunger is spreading through the lower quarters, and without intervention, unrest will follow. The granaries hold enough to help — but at a cost to reserves.',
    choices: {
      distribute_food_relief: 'Distribute Food Relief',
      deny_food_relief: 'Deny the Request',
    },
  },
  faction_req_commoner_labor_reforms: {
    title: 'Petition for Labor Reforms',
    body: 'A delegation of workers and tradesmen petitions the crown for reforms to labor conditions — fair wages, limited working hours, and protections against arbitrary dismissal. The nobility and merchant class warn that such reforms will increase costs and reduce productivity.',
    choices: {
      enact_labor_reforms: 'Enact Labor Reforms',
      reject_labor_reforms: 'Reject the Petition',
    },
  },
  faction_req_commoner_public_works: {
    title: 'Proposal for Public Works',
    body: 'With the common folk in good spirits, community leaders propose a program of public works — roads, bridges, and communal facilities — to improve life in the provinces. The project would strengthen infrastructure and morale, funded by the royal treasury.',
    choices: {
      approve_public_works: 'Approve Public Works',
      decline_public_works: 'Decline the Proposal',
    },
  },

  // ============================================================
  // Military Caste
  // ============================================================
  faction_req_military_equipment_pay: {
    title: 'Soldiers Demand Better Pay',
    body: 'A formal petition from the officer corps demands immediate improvement in military pay and equipment. Morale in the barracks has plummeted, and veterans warn that without action, desertions will increase and readiness will suffer. The army\'s loyalty hangs in the balance.',
    choices: {
      increase_military_pay: 'Increase Military Pay',
      deny_pay_increase: 'Deny the Demands',
    },
  },
  faction_req_military_training_grounds: {
    title: 'Request for Training Grounds',
    body: 'Military commanders request funding for proper training grounds and practice facilities. Current training conditions are inadequate, and the officer corps argues that improved facilities will significantly boost readiness and discipline.',
    choices: {
      build_training_grounds: 'Build Training Grounds',
      deny_training_grounds: 'Deny the Request',
    },
  },
  faction_req_military_border_fortification: {
    title: 'Military Proposes Border Fortification',
    body: 'With the military in high spirits and strong readiness, the generals propose an ambitious program of border fortification — watchtowers, palisades, and garrison posts along vulnerable stretches. The project would enhance security but strain the treasury.',
    choices: {
      approve_border_fortification: 'Approve Fortification',
      decline_border_fortification: 'Decline the Proposal',
    },
  },
};
