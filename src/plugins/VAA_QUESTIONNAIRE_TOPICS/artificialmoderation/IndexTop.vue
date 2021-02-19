<template>
<div class="justify-center center" v-if="STAGE.routed_stage">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="!STAGE.routed_stage">

        <template>
            
            In diesem Abschnitt geht es darum, die wichtigsten politischen Themen der nächsten Legislatur zu identifizieren. Welche politischen Herausforderungen liegen Ihnen besonders am Herzen?
            Bitte sagen Sie uns, für wie wichtig für sie diese Themen sind.

            <br>
            <br>
            Je mehr Relevanz die BürgerInnen den Themen beimessen, desto mehr Platz erhalten sie im finalen Smartvote-Fragebogen.
            
        </template>
        <!-- <template  v-slot:actions>
        <q-chip v-if="is_stage_last(STAGE.routed_stage)" icon="mdi-arrow-left" clickable 
                @click="gotoIndexAndMoveOn">
            {{ $t('index.button_end_of_page_on_last_stage') }}
        </q-chip>
        <q-chip v-else icon="mdi-arrow-left" clickable 
                @click="gotoIndexAndMoveOn">
            {{ $t('index.button_end_of_page_on_early_stage') }}
        </q-chip>
        </template> -->
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
    inject: ['gotoIndexAndMoveOn', 'STAGE'], // see provide attribute in the antecedents
    components: {ArtificialModerator},
}
</script>
