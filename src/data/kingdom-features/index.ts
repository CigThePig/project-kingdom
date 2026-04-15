import type { KingdomFeature, MechanicalEffectDelta } from '../../engine/types';

export interface KingdomFeatureDefinition {
  featureId: string;
  title: string;
  description: string;
  category: KingdomFeature['category'];
  ongoingEffect: MechanicalEffectDelta;
}

export const KINGDOM_FEATURE_REGISTRY: Record<string, KingdomFeatureDefinition> = {
  // ============================================================
  // Economic — Market Chain (3 tiers)
  // ============================================================
  'decree:decree_market_charter': {
    featureId: 'feature_market_charter',
    title: 'Royal Market Charter',
    description: 'Licensed markets attract steady trade. Merchant confidence grows each season.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1 },
  },
  'decree:decree_trade_guild_expansion': {
    featureId: 'feature_trade_guild_expansion',
    title: 'Expanded Trade Guilds',
    description: 'Guild halls across the kingdom coordinate commerce and boost revenues.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1, treasuryDelta: 2 },
  },
  'decree:decree_merchant_republic_charter': {
    featureId: 'feature_merchant_republic',
    title: 'Merchant Republic Charter',
    description: 'Merchants hold formal political power. Commerce thrives under their governance.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 2, treasuryDelta: 3 },
  },

  // ============================================================
  // Economic — Trade Chain (3 tiers)
  // ============================================================
  'decree:decree_trade_subsidies': {
    featureId: 'feature_trade_subsidies',
    title: 'Trade Subsidies',
    description: 'Crown-funded trade incentives keep merchants active and goods flowing.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1 },
  },
  'decree:decree_trade_monopoly': {
    featureId: 'feature_trade_monopoly',
    title: 'Royal Trade Monopoly',
    description: 'Crown-controlled trade routes generate steady income for the treasury.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1, treasuryDelta: 2 },
  },
  'decree:decree_international_trade_empire': {
    featureId: 'feature_international_trade_empire',
    title: 'International Trade Empire',
    description: 'A vast network of trade agreements fills the kingdom\'s coffers each season.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 2, treasuryDelta: 3 },
  },

  // ============================================================
  // Economic — Standalone
  // ============================================================
  'decree:decree_trade_agreement': {
    featureId: 'feature_trade_agreement',
    title: 'Foreign Trade Agreement',
    description: 'A standing trade pact brings ongoing commercial benefits.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1 },
  },
  'decree:decree_exp_mint_coinage': {
    featureId: 'feature_royal_mint',
    title: 'Royal Mint',
    description: 'Standardized coinage stabilizes commerce across the realm.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1, stabilityDelta: 1 },
  },
  'decree:decree_tax_code_reform': {
    featureId: 'feature_tax_code',
    title: 'Reformed Tax Code',
    description: 'A fair and efficient tax system yields reliable revenue.',
    category: 'economic',
    ongoingEffect: { treasuryDelta: 2, stabilityDelta: 1 },
  },

  // ============================================================
  // Military — Fortification Chain (3 tiers)
  // ============================================================
  'decree:decree_fortify_borders': {
    featureId: 'feature_fortified_borders',
    title: 'Fortified Border Outposts',
    description: 'Border defenses have been reinforced. Military readiness benefits each season.',
    category: 'military',
    ongoingEffect: { militaryReadinessDelta: 1 },
  },
  'decree:decree_integrated_defense_network': {
    featureId: 'feature_defense_network',
    title: 'Integrated Defense Network',
    description: 'Coordinated fortifications provide layered protection across the realm.',
    category: 'military',
    ongoingEffect: { militaryReadinessDelta: 1, militaryMoraleDelta: 1 },
  },
  'decree:decree_fortress_kingdom': {
    featureId: 'feature_fortress_kingdom',
    title: 'Fortress Kingdom',
    description: 'The realm is a bastion. Every border bristles with defenses.',
    category: 'military',
    ongoingEffect: { militaryReadinessDelta: 2, militaryMoraleDelta: 1 },
  },

  // ============================================================
  // Military — Arms Chain (3 tiers)
  // ============================================================
  'decree:decree_arms_commission': {
    featureId: 'feature_arms_commission',
    title: 'Arms Commission',
    description: 'Ongoing weapons production keeps the armory stocked.',
    category: 'military',
    ongoingEffect: { militaryEquipmentDelta: 1 },
  },
  'decree:decree_royal_arsenal': {
    featureId: 'feature_royal_arsenal',
    title: 'Royal Arsenal',
    description: 'A centralized arsenal supplies the military with quality equipment.',
    category: 'military',
    ongoingEffect: { militaryEquipmentDelta: 1, militaryCasteSatDelta: 1 },
  },
  'decree:decree_war_machine_industry': {
    featureId: 'feature_war_machine_industry',
    title: 'War Machine Industry',
    description: 'Industrial-scale arms production fuels the kingdom\'s military might.',
    category: 'military',
    ongoingEffect: { militaryEquipmentDelta: 2, militaryCasteSatDelta: 1 },
  },

  // ============================================================
  // Military — Knowledge-Gated
  // ============================================================
  'decree:decree_advanced_fortifications': {
    featureId: 'feature_advanced_fortifications',
    title: 'Advanced Fortifications',
    description: 'Engineered defenses using modern techniques bolster the realm.',
    category: 'military',
    ongoingEffect: { militaryReadinessDelta: 1, regionDevelopmentDelta: 1 },
  },
  'decree:decree_elite_training_program': {
    featureId: 'feature_elite_training',
    title: 'Elite Training Program',
    description: 'Soldiers train to the highest standards. Morale and readiness climb.',
    category: 'military',
    ongoingEffect: { militaryReadinessDelta: 1, militaryMoraleDelta: 1 },
  },
  'decree:decree_exp_war_engineers': {
    featureId: 'feature_war_engineers',
    title: 'War Engineers Corps',
    description: 'Specialist engineers maintain siege equipment and field fortifications.',
    category: 'military',
    ongoingEffect: { militaryEquipmentDelta: 1 },
  },

  // ============================================================
  // Military — Espionage Chain (3 tiers)
  // ============================================================
  'decree:decree_exp_spy_network': {
    featureId: 'feature_spy_network',
    title: 'Spy Network',
    description: 'Agents across the realm gather intelligence for the crown.',
    category: 'military',
    ongoingEffect: { espionageNetworkDelta: 1 },
  },
  'decree:decree_exp_intelligence_bureau': {
    featureId: 'feature_intelligence_bureau',
    title: 'Intelligence Bureau',
    description: 'A formal bureau coordinates espionage activities with precision.',
    category: 'military',
    ongoingEffect: { espionageNetworkDelta: 1, stabilityDelta: 1 },
  },
  'decree:decree_exp_shadow_council': {
    featureId: 'feature_shadow_council',
    title: 'Shadow Council',
    description: 'A secret council directs covert operations throughout the region.',
    category: 'military',
    ongoingEffect: { espionageNetworkDelta: 2, stabilityDelta: 1 },
  },

  // ============================================================
  // Infrastructure — Roads Chain (3 tiers)
  // ============================================================
  'decree:decree_road_improvement': {
    featureId: 'feature_improved_roads',
    title: 'Improved Roads',
    description: 'Better roads ease trade and travel across the kingdom.',
    category: 'infrastructure',
    ongoingEffect: { regionDevelopmentDelta: 1 },
  },
  'decree:decree_provincial_highway_system': {
    featureId: 'feature_highway_system',
    title: 'Provincial Highway System',
    description: 'A highway network connects provinces, boosting commerce and mobility.',
    category: 'infrastructure',
    ongoingEffect: { regionDevelopmentDelta: 1, merchantSatDelta: 1 },
  },
  'decree:decree_kingdom_transit_network': {
    featureId: 'feature_transit_network',
    title: 'Kingdom Transit Network',
    description: 'A comprehensive transit system links every corner of the realm.',
    category: 'infrastructure',
    ongoingEffect: { regionDevelopmentDelta: 2, merchantSatDelta: 1 },
  },

  // ============================================================
  // Infrastructure — Agriculture Knowledge-Gated
  // ============================================================
  'decree:decree_crop_rotation': {
    featureId: 'feature_crop_rotation',
    title: 'Crop Rotation System',
    description: 'Scientific farming practices yield more food each season.',
    category: 'infrastructure',
    ongoingEffect: { foodDelta: 2 },
  },
  'decree:decree_irrigation_works': {
    featureId: 'feature_irrigation_works',
    title: 'Irrigation Works',
    description: 'Canal networks bring water to fields, boosting harvests reliably.',
    category: 'infrastructure',
    ongoingEffect: { foodDelta: 2, regionDevelopmentDelta: 1 },
  },

  // ============================================================
  // Infrastructure — Engineering & Maritime Knowledge-Gated
  // ============================================================
  'decree:decree_engineering_corps': {
    featureId: 'feature_engineering_corps',
    title: 'Royal Engineering Corps',
    description: 'Professional engineers maintain and improve the kingdom\'s infrastructure.',
    category: 'infrastructure',
    ongoingEffect: { regionDevelopmentDelta: 1, militaryReadinessDelta: 1 },
  },
  'decree:decree_harbor_expansion': {
    featureId: 'feature_expanded_harbor',
    title: 'Expanded Harbor',
    description: 'Larger docks accommodate more trade vessels each season.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1, treasuryDelta: 1 },
  },
  'decree:decree_trade_fleet_commission': {
    featureId: 'feature_trade_fleet',
    title: 'Royal Trade Fleet',
    description: 'Crown-commissioned vessels carry goods to distant markets.',
    category: 'economic',
    ongoingEffect: { merchantSatDelta: 1, treasuryDelta: 2 },
  },

  // ============================================================
  // Infrastructure — Expansion Standalone
  // ============================================================
  'decree:decree_exp_infrastructure_audit': {
    featureId: 'feature_infrastructure_audit',
    title: 'Infrastructure Standards',
    description: 'Regular audits maintain building quality throughout the realm.',
    category: 'infrastructure',
    ongoingEffect: { regionConditionDelta: 1 },
  },
  'decree:decree_exp_public_works': {
    featureId: 'feature_public_works',
    title: 'Public Works Program',
    description: 'Ongoing investment in roads, bridges, and public buildings.',
    category: 'infrastructure',
    ongoingEffect: { regionDevelopmentDelta: 1, commonerSatDelta: 1 },
  },

  // ============================================================
  // Infrastructure — Agriculture Reform Chain (3 tiers)
  // ============================================================
  'decree:decree_exp_land_reform': {
    featureId: 'feature_land_reform',
    title: 'Land Reform',
    description: 'Redistributed farmland produces more food for the common people.',
    category: 'economic',
    ongoingEffect: { foodDelta: 1, commonerSatDelta: 1 },
  },
  'decree:decree_exp_irrigation_authority': {
    featureId: 'feature_irrigation_authority',
    title: 'Irrigation Authority',
    description: 'A central authority manages water resources for maximum crop yield.',
    category: 'infrastructure',
    ongoingEffect: { foodDelta: 1, regionDevelopmentDelta: 1 },
  },
  'decree:decree_exp_agricultural_modernization': {
    featureId: 'feature_agricultural_modernization',
    title: 'Agricultural Modernization',
    description: 'Modern techniques transform the kingdom into an agricultural powerhouse.',
    category: 'infrastructure',
    ongoingEffect: { foodDelta: 2, regionDevelopmentDelta: 1 },
  },

  // ============================================================
  // Civic — Administration Chain (3 tiers)
  // ============================================================
  'decree:decree_administrative_reform': {
    featureId: 'feature_administrative_reform',
    title: 'Administrative Reform',
    description: 'Streamlined governance improves stability across the realm.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 1 },
  },
  'decree:decree_royal_bureaucracy': {
    featureId: 'feature_royal_bureaucracy',
    title: 'Royal Bureaucracy',
    description: 'A professional civil service administers the kingdom efficiently.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 1, commonerSatDelta: 1 },
  },
  'decree:decree_centralized_governance': {
    featureId: 'feature_centralized_governance',
    title: 'Centralized Governance',
    description: 'All authority flows from the crown. Order and efficiency prevail.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 2, commonerSatDelta: 1 },
  },

  // ============================================================
  // Civic — Justice Chain (3 tiers)
  // ============================================================
  'decree:decree_exp_circuit_courts': {
    featureId: 'feature_circuit_courts',
    title: 'Circuit Courts',
    description: 'Traveling judges bring royal justice to every province.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 1 },
  },
  'decree:decree_exp_common_law': {
    featureId: 'feature_common_law',
    title: 'Common Law System',
    description: 'Consistent legal precedents bring predictability and fairness.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 1, commonerSatDelta: 1 },
  },
  'decree:decree_exp_supreme_tribunal': {
    featureId: 'feature_supreme_tribunal',
    title: 'Supreme Tribunal',
    description: 'The highest court settles disputes with finality and authority.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 2, commonerSatDelta: 1 },
  },

  // ============================================================
  // Civic — Standalone
  // ============================================================
  'decree:decree_provincial_governance': {
    featureId: 'feature_provincial_governance',
    title: 'Provincial Governance',
    description: 'Appointed governors maintain order and develop their provinces.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 1, regionDevelopmentDelta: 1 },
  },
  'decree:decree_medical_reforms': {
    featureId: 'feature_medical_reforms',
    title: 'Medical Reforms',
    description: 'Public health measures keep the population healthy and productive.',
    category: 'infrastructure',
    ongoingEffect: { commonerSatDelta: 1, stabilityDelta: 1 },
  },
  'decree:decree_exp_anti_corruption_campaign': {
    featureId: 'feature_anti_corruption',
    title: 'Anti-Corruption Campaign',
    description: 'Ongoing vigilance against corruption keeps governance honest.',
    category: 'infrastructure',
    ongoingEffect: { stabilityDelta: 1 },
  },

  // ============================================================
  // Social — Granary Chain (3 tiers)
  // ============================================================
  'decree:decree_public_granary': {
    featureId: 'feature_public_granary',
    title: 'Public Granary',
    description: 'Crown granaries store surplus food against lean times.',
    category: 'economic',
    ongoingEffect: { foodDelta: 1 },
  },
  'decree:decree_regional_food_distribution': {
    featureId: 'feature_food_distribution',
    title: 'Regional Food Distribution',
    description: 'A logistics network moves food to where it is needed most.',
    category: 'economic',
    ongoingEffect: { foodDelta: 2, commonerSatDelta: 1 },
  },
  'decree:decree_kingdom_breadbasket': {
    featureId: 'feature_kingdom_breadbasket',
    title: 'Kingdom Breadbasket',
    description: 'The realm is a breadbasket. No one goes hungry under the crown\'s watch.',
    category: 'economic',
    ongoingEffect: { foodDelta: 3, commonerSatDelta: 1 },
  },

  // ============================================================
  // Social — Food Standalone
  // ============================================================
  'decree:decree_military_ration_reform': {
    featureId: 'feature_ration_reform',
    title: 'Military Ration Reform',
    description: 'Efficient rationing frees food for the civilian population.',
    category: 'economic',
    ongoingEffect: { foodDelta: 1 },
  },
  'decree:decree_seasonal_reserve_mandate': {
    featureId: 'feature_seasonal_reserves',
    title: 'Seasonal Reserve Mandate',
    description: 'Mandated reserves smooth out seasonal food fluctuations.',
    category: 'economic',
    ongoingEffect: { foodDelta: 2 },
  },
  'decree:decree_agricultural_trade_compact': {
    featureId: 'feature_agricultural_trade',
    title: 'Agricultural Trade Compact',
    description: 'Cross-border food trade agreements ensure reliable supply.',
    category: 'economic',
    ongoingEffect: { foodDelta: 2, merchantSatDelta: 1 },
  },
  'decree:decree_harvest_tithe_exemption': {
    featureId: 'feature_tithe_exemption',
    title: 'Harvest Tithe Exemption',
    description: 'Reduced tithes let farmers keep more of their harvest.',
    category: 'economic',
    ongoingEffect: { foodDelta: 1, commonerSatDelta: 1 },
  },

  // ============================================================
  // Social — Labor Chain (3 tiers)
  // ============================================================
  'decree:decree_labor_rights': {
    featureId: 'feature_labor_rights',
    title: 'Labor Rights',
    description: 'Workers\' protections build loyalty among the common people.',
    category: 'economic',
    ongoingEffect: { commonerSatDelta: 1 },
  },
  'decree:decree_workers_guild_charter': {
    featureId: 'feature_workers_guild',
    title: 'Workers\' Guild Charter',
    description: 'Organized labor ensures fair wages and working conditions.',
    category: 'economic',
    ongoingEffect: { commonerSatDelta: 1, stabilityDelta: 1 },
  },
  'decree:decree_social_contract': {
    featureId: 'feature_social_contract',
    title: 'Social Contract',
    description: 'A formal compact between crown and people defines mutual obligations.',
    category: 'economic',
    ongoingEffect: { commonerSatDelta: 2, stabilityDelta: 1 },
  },

  // ============================================================
  // Social — Standalone
  // ============================================================
  'decree:decree_land_redistribution': {
    featureId: 'feature_land_redistribution',
    title: 'Land Redistribution',
    description: 'Redistributed estates give commoners a stake in the kingdom.',
    category: 'economic',
    ongoingEffect: { commonerSatDelta: 1 },
  },

  // ============================================================
  // Cultural — Education Chain (3 tiers)
  // ============================================================
  'decree:decree_exp_village_schools': {
    featureId: 'feature_village_schools',
    title: 'Village Schools',
    description: 'Basic education spreads literacy and knowledge among commoners.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1 },
  },
  'decree:decree_exp_provincial_academies': {
    featureId: 'feature_provincial_academies',
    title: 'Provincial Academies',
    description: 'Regional centers of learning nurture scholars and administrators.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1, commonerSatDelta: 1 },
  },
  'decree:decree_exp_university_system': {
    featureId: 'feature_university_system',
    title: 'University System',
    description: 'A network of universities advances knowledge and cultural prestige.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 2, commonerSatDelta: 1 },
  },

  // ============================================================
  // Cultural — Knowledge-Gated
  // ============================================================
  'decree:decree_university_charter': {
    featureId: 'feature_university_charter',
    title: 'University Charter',
    description: 'A chartered university attracts scholars from across the realm.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1, clergySatDelta: 1 },
  },
  'decree:decree_diplomatic_academy': {
    featureId: 'feature_diplomatic_academy',
    title: 'Diplomatic Academy',
    description: 'Trained diplomats represent the kingdom\'s interests with skill.',
    category: 'cultural',
    ongoingEffect: { stabilityDelta: 1, culturalCohesionDelta: 1 },
  },

  // ============================================================
  // Cultural — Expansion Standalone
  // ============================================================
  'decree:decree_exp_cultural_exchange_program': {
    featureId: 'feature_cultural_exchange',
    title: 'Cultural Exchange Program',
    description: 'Cross-border cultural exchanges build understanding and prestige.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1 },
  },

  // ============================================================
  // Diplomatic — Envoy Chain (3 tiers)
  // ============================================================
  'decree:decree_diplomatic_envoy': {
    featureId: 'feature_diplomatic_envoy',
    title: 'Diplomatic Envoys',
    description: 'Royal envoys maintain communication with neighboring kingdoms.',
    category: 'diplomatic',
    ongoingEffect: { stabilityDelta: 1 },
  },
  'decree:decree_permanent_embassy': {
    featureId: 'feature_permanent_embassy',
    title: 'Permanent Embassy',
    description: 'Standing embassies strengthen diplomatic ties and trade relations.',
    category: 'diplomatic',
    ongoingEffect: { stabilityDelta: 1, merchantSatDelta: 1 },
  },
  'decree:decree_diplomatic_supremacy': {
    featureId: 'feature_diplomatic_supremacy',
    title: 'Diplomatic Supremacy',
    description: 'The kingdom\'s diplomatic corps is the envy of the region.',
    category: 'diplomatic',
    ongoingEffect: { stabilityDelta: 2, merchantSatDelta: 1 },
  },

  // ============================================================
  // Diplomatic — Marriage Chain (3 tiers)
  // ============================================================
  'decree:decree_royal_marriage': {
    featureId: 'feature_royal_marriage',
    title: 'Royal Marriage Alliance',
    description: 'A dynastic marriage binds two houses together in common cause.',
    category: 'diplomatic',
    ongoingEffect: { nobilitySatDelta: 1 },
  },
  'decree:decree_dynasty_alliance': {
    featureId: 'feature_dynasty_alliance',
    title: 'Dynasty Alliance',
    description: 'A network of marriages creates a powerful noble coalition.',
    category: 'diplomatic',
    ongoingEffect: { nobilitySatDelta: 1, stabilityDelta: 1 },
  },
  'decree:decree_imperial_confederation': {
    featureId: 'feature_imperial_confederation',
    title: 'Imperial Confederation',
    description: 'A grand confederation of allied kingdoms under shared governance.',
    category: 'diplomatic',
    ongoingEffect: { nobilitySatDelta: 1, stabilityDelta: 2 },
  },

  // ============================================================
  // Diplomatic — Expansion Standalone
  // ============================================================
  'decree:decree_exp_peace_envoy': {
    featureId: 'feature_peace_envoy',
    title: 'Peace Envoy Mission',
    description: 'Dedicated envoys work to maintain peaceful relations with neighbors.',
    category: 'diplomatic',
    ongoingEffect: { stabilityDelta: 1 },
  },

  // ============================================================
  // Religious — Faith Chain (3 tiers)
  // ============================================================
  'decree:decree_invest_religious_order': {
    featureId: 'feature_religious_order',
    title: 'Invested Religious Order',
    description: 'Crown-backed religious orders tend to the spiritual needs of the realm.',
    category: 'cultural',
    ongoingEffect: { faithDelta: 1 },
  },
  'decree:decree_expand_religious_authority': {
    featureId: 'feature_religious_authority',
    title: 'Expanded Religious Authority',
    description: 'The clergy wield greater influence, guiding the faithful.',
    category: 'cultural',
    ongoingEffect: { faithDelta: 1, clergySatDelta: 1 },
  },
  'decree:decree_theocratic_council': {
    featureId: 'feature_theocratic_council',
    title: 'Theocratic Council',
    description: 'A council of religious leaders shapes policy alongside the crown.',
    category: 'cultural',
    ongoingEffect: { faithDelta: 2, clergySatDelta: 1 },
  },

  // ============================================================
  // Religious — Heresy Chain (3 tiers)
  // ============================================================
  'decree:decree_suppress_heresy': {
    featureId: 'feature_heresy_suppression',
    title: 'Heresy Suppression',
    description: 'Active suppression of heterodox beliefs maintains religious unity.',
    category: 'cultural',
    ongoingEffect: { heterodoxyDelta: -1 },
  },
  'decree:decree_inquisitorial_authority': {
    featureId: 'feature_inquisitorial_authority',
    title: 'Inquisitorial Authority',
    description: 'Formal inquisitors root out dissent and enforce orthodoxy.',
    category: 'cultural',
    ongoingEffect: { heterodoxyDelta: -2, clergySatDelta: 1 },
  },
  'decree:decree_religious_unification': {
    featureId: 'feature_religious_unification',
    title: 'Religious Unification',
    description: 'One faith unites the kingdom under a single spiritual banner.',
    category: 'cultural',
    ongoingEffect: { heterodoxyDelta: -3, clergySatDelta: 1 },
  },

  // ============================================================
  // Religious — Expansion Standalone
  // ============================================================
  'decree:decree_exp_interfaith_council': {
    featureId: 'feature_interfaith_council',
    title: 'Interfaith Council',
    description: 'Representatives of various faiths promote harmony and tolerance.',
    category: 'cultural',
    ongoingEffect: { faithDelta: 1, commonerSatDelta: 1 },
  },

  // ============================================================
  // Event-Sourced Features — Cultural
  // ============================================================
  'evt_exp_env_medicinal_springs:build_healing_baths': {
    featureId: 'feature_healing_baths',
    title: 'Public Healing Baths',
    description: 'Natural hot springs developed into public baths. Commoner wellbeing and cultural prestige grow.',
    category: 'cultural',
    ongoingEffect: { commonerSatDelta: 1, culturalCohesionDelta: 1 },
  },
  'evt_exp_cul_monument_foundation:commission_grand_monument': {
    featureId: 'feature_grand_monument',
    title: 'Grand Monument',
    description: 'A monument to the kingdom\'s founding stands as a symbol of pride.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1 },
  },
  'evt_exp_cul_architectural_ambition:build_great_cathedral': {
    featureId: 'feature_great_cathedral',
    title: 'Great Cathedral',
    description: 'A towering cathedral inspires the faithful and draws pilgrims.',
    category: 'cultural',
    ongoingEffect: { faithDelta: 1, culturalCohesionDelta: 1 },
  },
  'evt_exp_cul_architectural_ambition:construct_public_amphitheater': {
    featureId: 'feature_public_amphitheater',
    title: 'Public Amphitheater',
    description: 'A grand venue for performances and public gatherings.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1, commonerSatDelta: 1 },
  },
  'evt_exp_cul_architectural_ambition:invest_in_housing': {
    featureId: 'feature_housing_district',
    title: 'Housing District',
    description: 'New housing eases overcrowding and improves living conditions.',
    category: 'infrastructure',
    ongoingEffect: { commonerSatDelta: 1, regionDevelopmentDelta: 1 },
  },
  'evt_exp_cul_preservation_council:establish_preservation_council': {
    featureId: 'feature_preservation_council',
    title: 'Cultural Preservation Council',
    description: 'A council safeguards ancestral traditions for future generations.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1 },
  },
  'evt_exp_cul_oral_history_keeper:appoint_royal_chronicler': {
    featureId: 'feature_royal_chronicler',
    title: 'Royal Chronicler Office',
    description: 'An official chronicler records the kingdom\'s history and deeds.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1 },
  },
  'evt_exp_cul_oral_history_keeper:transcribe_oral_traditions': {
    featureId: 'feature_written_traditions',
    title: 'Written Traditions Archive',
    description: 'Oral histories preserved in writing for posterity.',
    category: 'cultural',
    ongoingEffect: { culturalCohesionDelta: 1 },
  },
  'evt_clergy_healing_reputation:establish_permanent_hospice': {
    featureId: 'feature_permanent_hospice',
    title: 'Permanent Hospice',
    description: 'Clergy-run hospices provide healing to the sick and injured.',
    category: 'cultural',
    ongoingEffect: { commonerSatDelta: 1, clergySatDelta: 1 },
  },

  // ============================================================
  // Event-Sourced Features — Infrastructure
  // ============================================================
  'evt_exp_env_spring_thaw_floods:build_emergency_levees': {
    featureId: 'feature_river_levees',
    title: 'River Levees',
    description: 'Engineered levees protect lowland settlements from flooding.',
    category: 'infrastructure',
    ongoingEffect: { regionConditionDelta: 1 },
  },
  'evt_exp_env_coastal_erosion:build_sea_walls': {
    featureId: 'feature_sea_walls',
    title: 'Coastal Sea Walls',
    description: 'Stone walls hold back the sea, protecting coastal communities.',
    category: 'infrastructure',
    ongoingEffect: { regionConditionDelta: 1 },
  },
  'evt_exp_env_deforestation_crisis:establish_royal_forest_reserves': {
    featureId: 'feature_forest_reserves',
    title: 'Royal Forest Reserves',
    description: 'Protected forests replenish timber and prevent erosion.',
    category: 'infrastructure',
    ongoingEffect: { regionConditionDelta: 1 },
  },
  'evt_treasury_windfall:invest_in_infrastructure': {
    featureId: 'feature_infrastructure_investment',
    title: 'Infrastructure Investment',
    description: 'A windfall wisely invested in lasting improvements.',
    category: 'infrastructure',
    ongoingEffect: { regionDevelopmentDelta: 1 },
  },
  'evt_agricultural_innovation:implement_across_kingdom': {
    featureId: 'feature_agricultural_innovation',
    title: 'Kingdom-Wide Agricultural Innovation',
    description: 'New farming techniques adopted across the realm boost yields.',
    category: 'infrastructure',
    ongoingEffect: { foodDelta: 1 },
  },

  // ============================================================
  // Event-Sourced Features — Economic
  // ============================================================
  'evt_exp_fod_preservation:build_smoke_houses': {
    featureId: 'feature_smoke_houses',
    title: 'Smoke Houses',
    description: 'Food preservation extends the shelf life of harvested goods.',
    category: 'economic',
    ongoingEffect: { foodDelta: 1 },
  },
  'evt_exp_fod_feast_famine:establish_food_reserves': {
    featureId: 'feature_food_reserves',
    title: 'Royal Food Reserves',
    description: 'Strategic food reserves buffer against famine.',
    category: 'economic',
    ongoingEffect: { foodDelta: 1 },
  },
  'evt_resource_boom:establish_workers_rights': {
    featureId: 'feature_workers_rights',
    title: 'Workers\' Rights Charter',
    description: 'Formal labor protections give workers security and dignity.',
    category: 'economic',
    ongoingEffect: { commonerSatDelta: 1 },
  },
  'evt_abundant_harvest_surplus:invest_in_granary_expansion': {
    featureId: 'feature_expanded_granaries',
    title: 'Expanded Granaries',
    description: 'Larger storage facilities preserve surplus harvests.',
    category: 'economic',
    ongoingEffect: { foodDelta: 1 },
  },
};
