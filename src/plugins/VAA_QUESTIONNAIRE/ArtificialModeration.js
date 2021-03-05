const AMs = {

  preparation_completed: {
    prosa: ' Wird angzeigt, wenn es in der Vorbereitungsphase nichts mehr zu tun gibt.',
    condition: (ctx) => !ctx.stageGroupScheduled,
    loading: (ctx) => ctx.stages === null || ctx.stages === undefined,
    items: [
      {
        prosa: ' ... aber andernorts schon.',
        condition: (ctx) => ctx.groupsScheduled?.length > 0,
        body: (ctx) => `Sie haben bereits alle Schritte in der Vorbereitungsphase erledigt. Wir können mit der BürgerInnen-Versammlung weiterfahren.`,
        buttons: [
          {
            action: (ctx) => ctx.gotoStage(ctx.next_scheduled_stage),
            label: (ctx) => 'Ja, wir können weiterfahren!'
          }
        ]
      },
      {
        prosa: ' ... und auch andernorts nichts mehr zu tun gibt.',
        condition: (ctx) => !ctx.groupsScheduled?.length,
        body: (ctx) => `Sie haben alle Schritte in der Vorbereitungsphase bereits erledigt.`,
      },
      {
        body: (ctx) => `PS: Natürlich können Sie auch nocheinmal einen Blick in das Infoblatt werfen, wenn Sie das möchten.`,
        condition: (ctx) => ctx.stageTypes.includes("TEXTSHEET"),
      },
    ]
  },

  topics_top: {
    prosa: ' Wird angzeigt, wenn nicht alle Themen bewertet wurden.',
    condition: (ctx) => { return (!ctx.salienceCompleted) },
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: (ctx) => `In diesem Abschnitt geht es darum, die wichtigsten politischen Themen der nächsten Legislatur zu identifizieren. Welche politischen Herausforderungen liegen Ihnen besonders am Herzen?
          Bitte sagen Sie uns, für wie wichtig für sie diese Themen sind.`,
      },
      {
        body: (ctx) => `Je mehr Relevanz die BürgerInnen den Themen beimessen, desto mehr Platz erhalten sie im finalen Smartvote-Fragebogen.`
      }
    ]
  },

  topics_after_saliencing: {
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: (ctx) => `Bitte bewerten Sie alle Themen. Dann können wir weiterfahren!`,
        condition: (ctx) => !ctx.salienceCompleted,
      },
      {
        body: (ctx) => `Sie sehen hier nun ihre persönliche Prioritätenliste der Wahlthemen. Sie können Ihre Gewichtung auch mit den anderen BürgerInnen vergleichen.`,
        condition: (ctx) => ctx.salienceCompleted
      }
    ]
  },

  topics_after_charts: {
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: (ctx) => `Sind sie mit Ihrer Priorisierung vorerst mal einverstanden?`,
        condition: (ctx) => ctx.salienceCompleted,
        buttons: [
          {
            action: (ctx) => ctx.gotoIndexAndMoveOn(),
            label: (ctx) => 'Ja, wir können weiterfahren!'
          }
        ]
      }
    ]
  },

  topics_forum: {
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: (ctx) => `Sie haben hier Gelegenheit mit anderen BürgerInnen über die Wahlthemen zu diskutieren.`,
      },
    ]
  }
}

export default AMs