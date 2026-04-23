import type { EventTextEntry } from '../events';

export const EXPANSION_CULTURE_TEXT: Record<string, EventTextEntry> = {
  // --- 1. Foreign Artistic Troupe (Informational, opening) ---
  evt_exp_cul_foreign_troupe: {
    title: 'Foreign Artistic Troupe at the Gates',
    body: 'A troupe of performers from distant lands has arrived at the capital, requesting permission to stage their exotic productions. Their arts are unlike anything the court has witnessed, though some advisors warn that foreign spectacles may unsettle the common folk.',
    choices: {
      welcome_performers: 'Welcome the Performers',
      politely_decline: 'Decline Their Entry',
    },
  },

  // --- 2. Monument Foundation (Notable, developing) ---
  evt_exp_cul_monument_foundation: {
    title: 'Proposal for a Great Monument',
    body: 'The master masons have presented plans for a monument in {region} to commemorate the kingdom\'s founding lineage. The design ranges from a towering granite obelisk to a modest stone memorial, each carrying different implications for the treasury and our cultural standing.',
    choices: {
      commission_grand_monument: 'Commission a Grand Monument',
      build_modest_memorial: 'Build a Modest Memorial',
      defer_construction: 'Defer the Construction',
    },
  },

  // --- 3. Dialect Tensions (Serious, established) ---
  evt_exp_cul_dialect_tensions: {
    title: 'Dialect Tensions Among the Provinces',
    body: 'The outlying province of {region} has begun resisting the use of the capital\'s tongue in official matters. Regional dialects carry deep ancestral significance, yet the lack of a common language hampers governance and trade across borders.',
    choices: {
      enforce_common_tongue: 'Enforce the Common Tongue',
      protect_regional_dialects: 'Protect Regional Dialects',
      promote_bilingual_policy: 'Institute a Bilingual Policy',
    },
  },

  // --- 4. Harvest Festival Tradition (Informational, any) ---
  evt_exp_cul_harvest_festival: {
    title: 'The Autumn Harvest Festival',
    body: 'As the harvest season draws to a close, the people look to the crown for blessing upon their annual festival. A well-funded celebration would lift spirits and honor tradition, though the folk are content enough to celebrate on their own.',
    choices: {
      fund_grand_celebration: 'Fund a Grand Celebration',
      let_folk_celebrate: 'Let the Folk Celebrate Freely',
    },
  },

  // --- 5. Cultural Preservation Crisis (Critical, established) ---
  evt_exp_cul_preservation_crisis: {
    title: 'Cultural Preservation in Peril',
    body: 'A growing tide of foreign customs threatens to erode ancestral traditions across {region} beyond recovery. The elders plead for intervention, while merchants argue that cultural exchange brings prosperity. The crown must decide what our identity shall become.',
    choices: {
      establish_preservation_council: 'Establish a Preservation Council',
      embrace_cultural_change: 'Embrace Cultural Change',
      suppress_foreign_influence: 'Suppress Foreign Influence',
    },
  },

  // --- 6. Arts Patronage Request (Notable, developing) ---
  evt_exp_cul_arts_patronage: {
    title: 'The Nobility Seeks Royal Patronage',
    body: 'Several noble houses have petitioned the crown to endow a royal arts guild, arguing that great kingdoms are remembered for their cultural achievements. The alternative of sponsoring traveling artists would spread culture more broadly, though with less prestige for the court.',
    choices: {
      fund_royal_arts_guild: 'Fund a Royal Arts Guild',
      sponsor_traveling_artists: 'Sponsor Traveling Artists',
      decline_patronage: 'Decline the Request',
    },
  },

  // --- 7. Folk Tradition Revival (Informational, any) ---
  evt_exp_cul_folk_revival: {
    title: 'Revival of Old Folk Traditions',
    body: 'The common folk have begun reviving half-forgotten customs from their grandparents\' era: ancient dances, seasonal rites, and craft techniques long thought lost. A royal endorsement would strengthen these traditions, though some nobles view such rustic displays as beneath the crown\'s dignity.',
    choices: {
      endorse_revival: 'Endorse the Revival',
      observe_from_afar: 'Observe From Afar',
    },
  },

  // --- 8. Literary Movement (Notable, established) ---
  evt_exp_cul_literary_movement: {
    title: 'A Literary Movement Takes Root',
    body: 'Scholars and monks across our lands have begun producing a flourishing body of written works, from theological treatises to historical chronicles. The clergy petition for scriptoriums to preserve this knowledge, while others suggest a royal chronicle would better serve the crown\'s legacy.',
    choices: {
      fund_scriptoriums: 'Fund New Scriptoriums',
      commission_royal_chronicle: 'Commission a Royal Chronicle',
      allow_natural_growth: 'Allow It to Grow Naturally',
    },
  },

  // --- 9. Cultural Exchange Opportunity (Notable, developing) ---
  evt_exp_cul_exchange_opportunity: {
    title: 'Cultural Exchange with the Southern Empire',
    body: 'The Southern Empire has proposed a formal cultural exchange, offering to share their renowned architectural and scholarly traditions. Sending a delegation would strengthen diplomatic ties, while inviting their scholars would enrich our own institutions at the risk of foreign ideas taking root.',
    choices: {
      send_cultural_delegation: 'Send a Cultural Delegation',
      invite_foreign_scholars: 'Invite Their Scholars Here',
      politely_postpone: 'Postpone the Exchange',
    },
  },

  // --- 10. Oral History Keeper (Serious, established) ---
  evt_exp_cul_oral_history_keeper: {
    title: 'The Last Keeper of Oral Histories',
    body: 'The kingdom\'s eldest oral historian grows frail, and with them fades generations of unwritten lore. Without action, centuries of ancestral knowledge will perish within a season. The question is whether to formalize this role at court or undertake a broader effort to commit the spoken word to parchment.',
    choices: {
      appoint_royal_chronicler: 'Appoint a Royal Chronicler',
      transcribe_oral_traditions: 'Transcribe the Oral Traditions',
      let_traditions_fade: 'Let the Old Ways Fade',
    },
  },

  // --- 11. Winter Storytelling Festival (Informational, any) ---
  evt_exp_cul_winter_stories: {
    title: 'The Midwinter Storytelling Gathering',
    body: 'As the long nights of winter settle over the capital, the people gather around hearth fires to share tales of heroes and ancestors. Hosting a royal gathering in the great hall would honor this tradition, drawing bards and chroniclers from every corner of our lands.',
    choices: {
      host_royal_gathering: 'Host a Royal Gathering',
      acknowledge_tradition: 'Acknowledge the Tradition',
    },
  },

  // --- 12. Assimilation Pressure (Critical, established) ---
  evt_exp_cul_assimilation_pressure: {
    title: 'The Southern Empire Demands Cultural Conformity',
    body: 'Emissaries from {neighbor_short} have made it plain that continued antagonism will persist unless the kingdom adopts their customs and courtly protocols — with {region} bearing the brunt of the pressure. Resistance will be costly but preserves sovereignty, while accommodation risks our very identity.',
    choices: {
      resist_cultural_pressure: 'Resist at All Costs',
      negotiate_cultural_treaty: 'Negotiate a Cultural Treaty',
      accept_partial_integration: 'Accept Partial Integration',
    },
  },

  // --- 13. Architectural Ambition (Serious, developing) ---
  evt_exp_cul_architectural_ambition: {
    title: 'Grand Architectural Ambitions',
    body: 'With the treasury well-stocked, the master builders present three proposals for {region}: a great cathedral to glorify the faith, a public amphitheater to elevate the arts, or improved housing for the common folk. Each would reshape the capital\'s skyline and the kingdom\'s character.',
    choices: {
      build_great_cathedral: 'Build a Great Cathedral',
      construct_public_amphitheater: 'Construct a Public Amphitheater',
      invest_in_housing: 'Invest in Common Housing',
    },
  },

  // --- 14. Spring Cultural Awakening (Notable, any) ---
  evt_exp_cul_spring_awakening: {
    title: 'A Spring Cultural Awakening',
    body: 'The warming season has stirred a creative fervor across the kingdom. Artisans, poets, and musicians emerge from their winter seclusion with ambitious new works. The court must decide whether to channel this energy toward the arts or redirect it to more practical endeavors.',
    choices: {
      sponsor_spring_arts: 'Sponsor the Spring Arts',
      direct_energy_to_labor: 'Direct Energy to Labor',
      let_creativity_bloom: 'Let Creativity Bloom Freely',
    },
  },

  // --- 15. Heretical Art Scandal (Serious, established) ---
  evt_exp_cul_heretical_art: {
    title: 'The Heretical Art Scandal',
    body: 'A series of provocative artworks depicting unorthodox religious themes has scandalized the clergy and divided public opinion. The faithful demand their destruction, while others argue that suppressing art sets a dangerous precedent for the freedom of thought that sustains cultural vitality.',
    choices: {
      destroy_offensive_works: 'Destroy the Offensive Works',
      defend_artistic_freedom: 'Defend Artistic Freedom',
      convene_clergy_tribunal: 'Convene a Clergy Tribunal',
    },
  },

  // --- 16. Cultural Identity Crisis (Critical, established) ---
  evt_exp_cul_identity_crisis: {
    title: 'The Kingdom\'s Identity in Question',
    body: 'Years of external pressure and internal discord have fractured our sense of shared identity. {region} leans toward foreign customs, while the heartland clings to ancestral ways. Without decisive action, the kingdom may splinter not by sword, but by the slow erosion of common purpose.',
    choices: {
      reassert_national_identity: 'Reassert National Identity',
      forge_new_cultural_synthesis: 'Forge a New Cultural Synthesis',
      allow_regional_autonomy: 'Allow Regional Autonomy',
    },
  },

  // --- 17. Merchant Cultural Investment (Notable, any) ---
  evt_exp_cul_merchant_investment: {
    title: 'Merchants Offer Cultural Investment',
    body: 'The merchant guilds, flush with profits from recent trade, propose to fund cultural endeavors in exchange for naming rights and influence over civic institutions. Their coin would enrich the kingdom\'s cultural life, though the nobility bristle at commerce dictating matters of art and tradition.',
    choices: {
      accept_merchant_patronage: 'Accept Merchant Patronage',
      redirect_to_public_works: 'Redirect Funds to Public Works',
      decline_with_gratitude: 'Decline With Gratitude',
    },
  },

  // --- 18. Military Tradition Ceremony (Serious, opening) ---
  evt_exp_cul_military_ceremony: {
    title: 'The Rite of Blades and Banners',
    body: 'The military caste requests the crown\'s blessing for the ancient Rite of Blades and Banners, a ceremonial display of martial tradition and valor. A grand parade would invigorate the troops and awe the populace, while a solemn remembrance would honor the fallen with quiet dignity.',
    choices: {
      grand_military_parade: 'Hold a Grand Military Parade',
      solemn_remembrance: 'Hold a Solemn Remembrance',
      skip_ceremony: 'Skip the Ceremony',
    },
  },

  // --- 19. Council Formation ---
  evt_exp_cul_council_formation: {
    title: 'Forming the Royal Council',
    body: 'The throne room empties after the morning audience, and the matter of governance demands attention. Your predecessor\'s councilors wait with varying degrees of confidence \u2014 some expect to retain their seats, others sense the winds of change. How you compose the royal council will signal to every faction at court whether the old order endures or a new vision takes shape.',
    choices: {
      traditional_council: 'Appoint from the Old Families',
      meritocratic_council: 'Choose Advisors by Merit',
      retain_predecessors_council: 'Retain the Existing Council',
    },
  },
};
