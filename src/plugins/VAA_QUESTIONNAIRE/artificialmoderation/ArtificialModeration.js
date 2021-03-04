const AMs = {

  topics_top: {
    condition: (ctx) => { return (!ctx.salienceCompleted) },
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: `In diesem Abschnitt geht es darum, die wichtigsten politischen Themen der nächsten Legislatur zu identifizieren. Welche politischen Herausforderungen liegen Ihnen besonders am Herzen?
          Bitte sagen Sie uns, für wie wichtig für sie diese Themen sind.`,
      },
      {
        body: `Je mehr Relevanz die BürgerInnen den Themen beimessen, desto mehr Platz erhalten sie im finalen Smartvote-Fragebogen.`
      }
    ]
  },

  topics_after_saliencing: {
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: `Bitte bewerten Sie alle Themen. Dann können wir weiterfahren!`,
        condition: (ctx) => !ctx.salienceCompleted,
      },
      {
        body: `Sie sehen hier nun ihre persönliche Prioritätenliste der Wahlthemen. Sie können Ihre Gewichtung auch mit den anderen BürgerInnen vergleichen.`,
        condition: (ctx) => ctx.salienceCompleted
      }
    ]
  },

  topics_after_charts: {
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: `Sind sie mit Ihrer Priorisierung vorerst mal einverstanden?`,
        condition: (ctx) => ctx.salienceCompleted,
        buttons: [
          {
            action: (ctx) => ctx.gotoIndexAndMoveOn(),
            label: 'Ja, wir können weiterfahren!'
            // icon: null,
            // icon_rigth: null,
          }
        ]
      }
    ]
  },

  topics_forum: {
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        body: `Sie haben hier Gelegenheit mit anderen BürgerInnen über die Wahlthemen zu diskutieren.`,
        // condition: (ctx) => !ctx.salienceCompleted,
      },
    ]
  }
}

export default AMs