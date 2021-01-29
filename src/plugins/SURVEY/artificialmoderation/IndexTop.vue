<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='surveyPage' :ongoing="!routed_stage">

        <!-- ALREADY COMPLETED? -->
        <template v-if="is_stage_completed(routed_stage)">
        {{ $t('survey.already_completed_error') }}
        </template>
        <template v-if="!is_stage_completed(routed_stage)">
            {{ $t("survey.redirect_to_survey")}}
        </template>

        <template  v-slot:actions>
        <q-chip v-if="is_stage_completed(routed_stage)" icon="mdi-arrow-left" clickable 
                @click="gotoIndexAndMoveOn">
            {{ $t('assemblies.go_back_to_assembly_home') }}
        </q-chip>
        </template>
    </ArtificialModerator>

</div>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'
import { mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorTEXTSHEETMain",
    ...mapGetters(
      'assemblystore',
      ['routed_stage', 'is_stage_completed']
    ),    
    inject: ['gotoIndexAndMoveOn'],
    components: {ArtificialModerator}
}
</script>
