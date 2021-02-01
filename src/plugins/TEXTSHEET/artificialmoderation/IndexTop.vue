<template>
<div class="justify-center center" v-if="STAGE.routed_stage">
    
    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="!STAGE.routed_stage">

        <template v-if="is_stage_new(STAGE.routed_stage) &&  !is_stage_completed(STAGE.routed_stage)">
            {{ is_stage_first(STAGE.routed_stage) ? $t('index.am.new_visit_first_stage') : $t('index.am.new_visit') }}
        </template>
        <template v-if="!is_stage_new(STAGE.routed_stage) &&  is_stage_completed(STAGE.routed_stage)">
            {{$t('index.am.completed') }}
        </template>
        <template v-if="!is_stage_new(STAGE.routed_stage) &&  !is_stage_completed(STAGE.routed_stage)">
            {{$t('index.am.already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="!is_stage_new(STAGE.routed_stage)" icon="mdi-arrow-left" clickable 
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
    inject: ['gotoAssemblyHome', 'gotoIndexAndMoveOn', 'STAGE'], 
    computed: {
    ...mapGetters(
        'assemblystore',
        ['assemblyIdentifier', 'is_stage_new','is_stage_completed', 'is_stage_first']
    )},
    components: {ArtificialModerator}
}
</script>
