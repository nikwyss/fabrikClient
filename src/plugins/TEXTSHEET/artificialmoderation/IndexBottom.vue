<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="!routed_stage">

        <template v-if="is_stage_last(routed_stage)">
            {{$t('index.am.button_end_of_page_on_last_stage') }}
        </template>
        <template v-else>
            {{$t('index.am.button_end_of_page_on_early_stage') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="is_stage_last(routed_stage)" icon="mdi-arrow-left" clickable 
                @click="gotoIndexAndMoveOn">
            {{ $t('index.button_end_of_page_on_last_stage') }}
        </q-chip>
        <q-chip v-else icon="mdi-arrow-left" clickable 
                @click="gotoIndexAndMoveOn">
            {{ $t('index.button_end_of_page_on_early_stage') }}
        </q-chip>
        </template>
    </ArtificialModerator>
      <!-- </div> -->
    </div>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'
import { mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorIndexBottom",
    computed: {
        ...mapGetters(
        'assemblystore',
        ['routed_stage', 'is_stage_last']
        )
    },
    inject: ['gotoIndexAndMoveOn'], // see provide attribute in the antecedents
    components: {ArtificialModerator},
}
</script>
