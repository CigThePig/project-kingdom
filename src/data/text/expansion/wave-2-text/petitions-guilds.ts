// Phase 7 — Wave-2 Petition Text: Guild & Trade.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_PETITIONS_GUILD_TEXT: Record<string, EventTextEntry> = {
  faction_req_w2_merchant_tariff_reform: {
    title: 'The Merchants Plead for Tariff Reform',
    body: 'The merchant consuls of three cities present a joint petition to {chancellor_or_fallback}, asking for a reduction of the internal tariffs. They promise increased revenue through volume; their competitors warn that the Crown will simply lose every copper it concedes.',
    choices: {
      reform_the_tariffs: 'Reform the Tariffs',
      defer_the_petition: 'Defer the Petition',
    },
  },
  faction_req_w2_miners_charter: {
    title: 'The Miners Beg a Charter',
    body: 'The free miners of the uplands in {region}, tired of the local lord\'s tolls, petition for a royal charter that would put their works directly under the Crown. The local lord has already sent his own objection.',
    choices: {
      grant_the_miners_charter: 'Grant the Charter',
      refuse_the_charter: 'Refuse the Charter',
    },
  },
  faction_req_w2_fishermens_protection: {
    title: 'The Fishermen Beg for Coastal Patrols',
    body: '{marshal_or_fallback} brings a petition from the coastal fishermen of {region}: pirates from the inland sea have twice taken their catches this month. They ask the Crown for sailing patrols; the treasurer points out that patrols cost silver every week.',
    choices: {
      fund_coastal_patrols: 'Fund Coastal Patrols',
      decline_patrol_request: 'Decline the Request',
    },
  },
  faction_req_w2_carpenters_price_cap: {
    title: 'The Carpenters Demand a Timber Cap',
    body: 'The carpenters\' guild demands the Crown cap the price of timber. They say the forest merchants gouge them every season; the merchants say the carpenters want a subsidy disguised as law.',
    choices: {
      cap_the_timber_prices: 'Cap the Timber Prices',
      leave_prices_to_market: 'Leave Prices to the Market',
    },
  },
  faction_req_w2_millers_tax_relief: {
    title: 'The Millers Beg Tax Relief',
    body: "The millers' league petitions {chancellor_or_fallback} for relief from the mill tax, arguing that with the weight of the levy they cannot afford to keep the stones turning. Villagers are already carrying grain to competing mills across the border.",
    choices: {
      grant_millers_relief: 'Grant the Relief',
      maintain_the_mill_tax: 'Maintain the Mill Tax',
    },
  },
  faction_req_w2_goldsmiths_seal: {
    title: 'The Goldsmiths Ask for a Royal Seal',
    body: "The goldsmiths' guild has presented {chancellor_or_fallback} a request for a royal seal — effectively a monopoly on assay — in exchange for an annual tribute. Lesser smiths in outlying cities will be ruined; the Crown's purse will fatten.",
    choices: {
      grant_the_goldsmith_seal: 'Grant the Seal',
      refuse_monopoly: 'Refuse the Monopoly',
    },
  },
};
