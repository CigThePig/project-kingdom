// Workstream A — Task A4: Assessment Player-Facing Text
// Assessments present ambiguous intelligence. The player chooses a posture
// (investigate, hedge, or ignore) rather than responding to a clear crisis.

import type { EventTextEntry } from './events';

export const ASSESSMENT_TEXT: Record<string, EventTextEntry> = {
  assess_border_movement: {
    title: 'Unusual Border Activity',
    body: '{intel_grade}: troop formations are shifting along the border, supply carts are on unfamiliar roads, and campfires are burning where none have been before. The activity could be routine exercises, seasonal repositioning, or preparation for something far more serious — and at this grade of intelligence, the picture will not resolve on its own.',
    choices: {
      investigate_border_movement: 'Run Down the Source',
      reinforce_preemptively: 'Reinforce Border Positions',
      dismiss_border_reports: 'Dismiss the Reports',
    },
  },

  assess_spy_report_unverified: {
    title: 'Unverified Intelligence Report',
    body: 'An agent embedded in foreign territory has delivered a troubling report: claims of a conspiracy that could affect the kingdom. However, the source has been unreliable before, and the details are suspiciously convenient. Acting on false intelligence could be more dangerous than inaction.',
    choices: {
      verify_intelligence: 'Verify Through Other Sources',
      act_on_report: 'Act on the Report',
      file_away_report: 'File Away for Now',
    },
  },

  assess_diplomatic_signal: {
    title: 'Subtle Diplomatic Overture',
    body: '{intel_grade}: {neighbor} has made a series of subtle gestures — a visiting scholar here, an unusually generous trade offer there. {ruler_full} sends nothing in writing. The signals could indicate genuine interest in closer relations, or they could be a prelude to manipulation, and the source material is not strong enough to tell which.',
    choices: {
      reciprocate_overture: 'Reciprocate the Overture',
      investigate_intent: 'Corroborate Through Other Courts',
      ignore_signal: 'Ignore the Signals',
    },
  },

  assess_internal_unrest_rumor: {
    title: 'Rumors of Internal Unrest',
    body: '{intel_grade}: whispers reach the court of growing discontent among the populace. Market gossip speaks of secret meetings, inflammatory pamphlets, and rising tension in the lower quarters. The rumors may be exaggerated — idle tongues feed on discontent — or they may signal something more dangerous taking root, and the watch cannot tell which from gossip alone.',
    choices: {
      investigate_unrest_rumor: 'Verify Through Watch Informants',
      preemptive_concession: 'Make Preemptive Concessions',
      monitor_quietly: 'Monitor Quietly',
    },
  },

  assess_foreign_famine: {
    title: 'Reports of Foreign Famine',
    body: "Travelers and merchants bring reports that {neighbor} suffers from severe food shortages. Refugee columns have been spotted streaming away from {capital}, and {ruler}'s grip is reported to be uncertain. The situation presents both an opportunity to earn goodwill through humanitarian aid and a temptation to press an advantage while {neighbor} weakens.",
    choices: {
      send_humanitarian_aid: 'Send Humanitarian Aid',
      exploit_weakness: 'Exploit Their Weakness',
      observe_from_distance: 'Observe from a Distance',
    },
  },

  assess_religious_movement: {
    title: 'New Religious Movement Reported',
    body: '{intel_grade}: a new religious movement is gaining followers in the countryside. Its teachings diverge from established doctrine, drawing both the curious and the discontented. The clergy views it with alarm, but the movement has not yet broken any laws — and at this grade of intelligence, neither renewal nor heresy can be ruled out.',
    choices: {
      investigate_movement: 'Send Observers to the Conventicles',
      suppress_early: 'Suppress It Early',
      allow_to_grow: 'Allow It to Grow',
    },
  },

  assess_merchant_caravan_disappearance: {
    title: 'Merchant Caravan Gone Missing',
    body: 'A well-provisioned merchant caravan has vanished on a route considered safe. Local patrols found no wreckage, no bodies, no tracks leading away from the road. The merchants\' guild demands answers, but the disappearance could have any number of explanations — bandits, desertion, a competing guild\'s sabotage, or simply bad weather in the mountain passes.',
    choices: {
      fund_investigation: 'Fund a Formal Investigation',
      increase_road_patrols: 'Increase Road Patrols',
      accept_losses: 'Accept the Losses',
    },
  },

  assess_scholarly_heresy_manuscript: {
    title: 'Controversial Manuscript Discovered',
    body: 'Scholars at the royal library have uncovered a manuscript containing ideas that challenge established religious doctrine. The text draws on ancient sources and presents its arguments with unsettling eloquence. If studied openly, it could advance learning but risk theological controversy. If suppressed, order is maintained at the cost of knowledge.',
    choices: {
      examine_manuscript: 'Examine the Manuscript',
      seize_and_suppress: 'Seize and Suppress It',
      ignore_the_text: 'Ignore the Text',
    },
  },

  assess_crop_blight_reports: {
    title: 'Reports of Crop Blight',
    body: 'Farmers in several provinces report a strange discoloration spreading across their grain fields. The extent of the damage is unclear — some fields seem unaffected, and the blight may burn itself out before harvest. But if the reports are accurate and the blight spreads, the consequences for the food supply could be severe.',
    choices: {
      dispatch_agronomists: 'Dispatch Agronomists',
      preemptive_rationing: 'Begin Preemptive Rationing',
      wait_for_confirmation: 'Wait for Confirmation',
    },
  },

  assess_noble_faction_meeting: {
    title: 'Secret Noble Gathering Reported',
    body: 'Informants report that several prominent noble houses have been meeting in private, away from court. The gatherings may be innocent — discussions of trade arrangements or family alliances — or they may signal coordinated opposition to the crown. The nobility\'s intentions remain opaque.',
    choices: {
      infiltrate_meeting: 'Infiltrate the Meetings',
      confront_directly: 'Confront Them Directly',
      let_them_meet: 'Let Them Meet',
    },
  },

  assess_coastal_vessel_sighting: {
    title: 'Unknown Vessels Sighted Off Coast',
    body: '{intel_grade}: coastal watchmen have spotted unfamiliar vessels on the horizon. The ships fly no recognizable banners and have made no attempt to enter port. They could be explorers charting new trade routes, a diplomatic advance party, or scouts for a less welcome purpose — and at this grade, intent cannot be deduced from the silhouette alone.',
    choices: {
      send_naval_scouts: 'Send Naval Scouts',
      fortify_harbor: 'Fortify the Harbor',
      observe_and_log: 'Observe and Log',
    },
  },

  assess_strange_illness_outbreak: {
    title: 'Reports of Strange Illness',
    body: '{intel_grade}: healers in the lower quarters describe a cluster of cases involving an unfamiliar illness — high fever, weakness, and confusion. The cases may be isolated and seasonal, or they may be the first signs of something more dangerous spreading through the crowded districts, and the cause cannot be named from what little has reached court so far.',
    choices: {
      quarantine_affected_area: 'Quarantine the Affected Area',
      investigate_cause: 'Investigate the Cause',
      dismiss_as_seasonal: 'Dismiss as Seasonal',
    },
  },
};
