<template>
<div class="justify-center center" v-if="STAGE.routed_stage">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="left" role="1" amGroup='textsheetPage' :ongoing="!STAGE.routed_stage">

        <template v-if="!CONTENTTREE.salienceCompleted">
            Bitte bewerten Sie alle Themen. Dann können wir weiterfahren!
        </template>

        <template v-else-if="CONTENTTREE.salienceCompleted">
            Sie sehen hier nun ihre persönliche Prioritätenliste der Wahlthemen. Sind sie mit Ihrer Priorisierung vorerst mal einverstanden? 
        </template>

        <template  v-slot:actions>
        <q-chip v-if="CONTENTTREE.salienceCompleted" icon="mdi-arrow-right" clickable 
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
