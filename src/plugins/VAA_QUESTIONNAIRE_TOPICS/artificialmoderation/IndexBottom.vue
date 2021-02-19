<template>
<div class="justify-center center" v-if="STAGE.routed_stage">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="!STAGE.routed_stage">

        <template v-if="!CONTENTTREE.ratingCompleted">
            Bitte bewerten Sie alle Themen. Dann können wir weiterfahren!
        </template>

        <template v-else-if="CONTENTTREE.ratingCompleted">
            Sie sehen hier nun ihre persönliche Liste der Wahltehmen. Sind sie damit mal vorerst einverstanden? 
        </template>

        <template  v-slot:actions>
        <q-chip v-if="CONTENTTREE.ratingCompleted" icon="mdi-arrow-left" clickable 
                @click="gotoIndexAndMoveOn">
            Ja, wir können weiterfahren!
        </q-chip>
        </template>
    </ArtificialModerator>
    </div>
</template>

<script>
import ArtificialModerator from 'src/components/ArtificialModerator'
import { mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorIndexBottom",
    computed: {
        ...mapGetters(
        'assemblystore',
        ['is_stage_last']
        )
    },
    inject: ['gotoIndexAndMoveOn', 'STAGE', 'CONTENTTREE'], // see provide attribute in the antecedents
    components: {ArtificialModerator},
}
</script>
