<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="2" amGroup='textsheetPage' :ongoing="ongoing">

        <template>
            Haben Sie zum obigen Abschnitt bereits Fragen oder Kommentare? Die anderen Teilnehmern
            wird das auf jeden Fall auch interessieren.
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip icon="mdi-arrow-left" clickable @click="alert('TODO')">
            {{ $t('comments.add_comment_or_question') }}
        </q-chip>
        </template>
    </ArtificialModerator>
      <!-- </div> -->
    </div>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'

export default{
    name: "ArtificialModeratorContentTreeIndexEnd",
    // inject: ['ABLY', 'assemblyIdentifier', 'gotoAssemblyHome', 'clickGotoIndexAndMoveOn',
    //     'isSkippable', 'isNew', 'isLastStage', 'isCompleted', 'isAlert', 'isFirstStage'
    // ], // see provide attribute in the antecedents
    components: {ArtificialModerator},
    props: ['ongoing'],
}
</script>
