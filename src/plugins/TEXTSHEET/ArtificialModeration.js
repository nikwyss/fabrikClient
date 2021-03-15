const AMs = {

  index_top: {
    prosa: ' Leitet eine Text-Stage ein.',
    loading: (ctx) => !ctx.routed_stage?.stage.id,
    items: [
      {
        prosa: ' Erster Besuch am ersten Tag!.',
        condition: (ctx) => ctx.todays_first_visit,
        body: (ctx) => `Wir beginnen mit folgendem Text. Darf ich Sie bitten diesen durchzulesen? Sie können sich bei Fragen und Kommentaren gerne an die Diskussionsforen wenden.`,
      },
      {
        prosa: ' Zweiter Besuch',
        condition: (ctx) => !ctx.todays_first_visit,
        body: (ctx) => `Sie können sich das ruhig nochmal anschauen und bei Bedarf kommentieren.`,
        buttons: [
          {
            action: (ctx) => ctx.gotoIndexAndMoveOn(),
            label: (ctx) => 'Lass uns gleich weiterfahren!'
          }
        ]
      }
    ]
  },

  index_bottom: {
    prosa: ' Schliesst die Text-Stage ab.',
    // loading: (ctx) => !ctx.routed_stage?.stage.id || ctx.is_stage_alerted(ctx.routed_stage),
    items: [
      {
        prosa: ' Erster Besuch am ersten Tag!.',
        condition: (ctx) => ctx.todays_first_visit,
        body: (ctx) => `Sie sind schon fertig mit dem Text? Dann folgen Sie mir bitte.`,
        buttons: [
          {
            action: (ctx) => ctx.gotoIndexAndMoveOn(),
            label: (ctx) => 'Ja, bitte!'
          }
        ]
      },
      {
        prosa: ' Zweiter Besuch',
        condition: (ctx) => !ctx.todays_first_visit,
        body: (ctx) => `Wollen wir weiterfahren? Dann folgen Sie mir bitte.`,
        buttons: [
          {
            action: (ctx) => ctx.gotoIndexAndMoveOn(),
            label: (ctx) => 'Ja, bitte!'
          }
        ]
      }
    ]
  }
}

export default AMs