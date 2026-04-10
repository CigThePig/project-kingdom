// Workstream A — Task A4: Assessment Player-Facing Text
// Assessments present ambiguous intelligence. The player chooses a posture
// (investigate, hedge, or ignore) rather than responding to a clear crisis.

import type { EventTextEntry } from './events';

export const ASSESSMENT_TEXT: Record<string, EventTextEntry> = {
  assess_border_movement: {
    title: 'Unusual Border Activity',
    body: 'Scouts report unusual movement along the border — troop formations shifting, supply carts on unfamiliar roads, and campfires where none have been before. The activity could be routine exercises, seasonal repositioning, or preparation for something far more serious. The intelligence is inconclusive.',
    choices: {
      investigate_border_movement: 'Send Scouts to Investigate',
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
    body: 'A neighboring kingdom has made a series of subtle gestures — a visiting scholar here, an unusually generous trade offer there. The signals could indicate genuine interest in closer relations, or they could be a prelude to manipulation. The intent remains unclear.',
    choices: {
      reciprocate_overture: 'Reciprocate the Overture',
      investigate_intent: 'Investigate Their Intent',
      ignore_signal: 'Ignore the Signals',
    },
  },

  assess_internal_unrest_rumor: {
    title: 'Rumors of Internal Unrest',
    body: 'Whispers reach the court of growing discontent among the populace. Market gossip speaks of secret meetings, inflammatory pamphlets, and rising tension in the lower quarters. The rumors may be exaggerated — idle tongues feed on discontent. Or they may signal something more dangerous taking root.',
    choices: {
      investigate_unrest_rumor: 'Investigate the Rumors',
      preemptive_concession: 'Make Preemptive Concessions',
      monitor_quietly: 'Monitor Quietly',
    },
  },

  assess_foreign_famine: {
    title: 'Reports of Foreign Famine',
    body: 'Travelers and merchants bring reports that a neighboring kingdom suffers from severe food shortages. Refugee columns have been spotted near the border. The situation presents both an opportunity to build goodwill through humanitarian aid and a temptation to press an advantage while a rival weakens.',
    choices: {
      send_humanitarian_aid: 'Send Humanitarian Aid',
      exploit_weakness: 'Exploit Their Weakness',
      observe_from_distance: 'Observe from a Distance',
    },
  },

  assess_religious_movement: {
    title: 'New Religious Movement Reported',
    body: 'Reports emerge of a new religious movement gaining followers in the countryside. Its teachings diverge from established doctrine, drawing both the curious and the discontented. The clergy views it with alarm, but the movement has not yet broken any laws. Whether it represents renewal or heresy remains to be seen.',
    choices: {
      investigate_movement: 'Investigate the Movement',
      suppress_early: 'Suppress It Early',
      allow_to_grow: 'Allow It to Grow',
    },
  },
};
