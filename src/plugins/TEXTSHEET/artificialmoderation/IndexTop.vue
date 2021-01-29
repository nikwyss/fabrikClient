<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="!routed_stage">

        <template v-if="is_stage_new(routed_stage) &&  !is_stage_completed(routed_stage)">
            {{ is_stage_first(routed_stage) ? $t('index.am.new_visit_first_stage') : $t('index.am.new_visit') }}
        </template>
        <template v-if="!is_stage_new(routed_stage) &&  is_stage_completed(routed_stage)">
            {{$t('index.am.completed') }}
        </template>
        <template v-if="!is_stage_new(routed_stage) &&  !is_stage_completed(routed_stage)">
            {{$t('index.am.already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="!is_stage_new(routed_stage)" icon="mdi-arrow-left" clickable 
                @click="gotoIndexAndMoveOn">
            {{ $t('index.leave_a_preliminary_completed_stage') }}
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
    
    
    name: 'ArtificialModeratorTEXTSHEETMain',
    computed: {
    ...mapGetters(
        'assemblystore',
        ['assemblyIdentifier', 'routed_stage', 'is_stage_new','is_stage_completed']
    )},
    inject: ['gotoAssemblyHome', 'gotoIndexAndMoveOn'], 
    components: {ArtificialModerator}
}
</script>
