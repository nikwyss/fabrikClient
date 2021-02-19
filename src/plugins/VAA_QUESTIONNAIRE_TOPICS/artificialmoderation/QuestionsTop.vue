<template>
<div class="justify-center center" v-if="STAGE.routed_stage">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="!STAGE.routed_stage">


        <template>           
            Wählen Sie zuerst ein Thema aus! 
        </template>

        <template>           
            Welche Fragen sollen die künftig gewählten PolitikerInnen angehen! 
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
