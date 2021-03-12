const AMs = {

  indexTop: {
    loading: (ctx) => !ctx.rootNode,
    items: [
      {
        prosa: 'Gibt es Dinge, die sie zum gelesenen Text noch ergänzen möchten. Haben Sie Fragen dazu?',
        body: (ctx) => `Gibt es Dinge, die sie noch ergänzen möchten? Haben Sie Fragen? Schreiben Sie einen Beitrag!`,
      },
      {
        prosa: 'Ungelesene Beiträge',
        // condition: (ctx) => !ctx.todays_first_visit,
        body: (ctx) => `Da gibt es viele neue Beiträge in diesem Forum. Wollen Sie sich mal umsehen?`,
      }
    ]
  }
}


// < !--ACTION CHIPS -->
//   <template v-slot:actions>
//     <q-chip
//       v-if="rootNode.children.length < 2 && IsContributor"
//       icon="mdi-tooltip-plus-outline"
//       clickable
//         @click="popup_create"
//       >
//         {{ $t('contenttree.add_comment_or_question') }}
export default AMs