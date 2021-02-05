<template>
<div class="justify-center center" v-if="STAGE.routed_stage">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='surveyPage' :ongoing="!STAGE.routed_stage">

        <!-- ALREADY COMPLETED? -->
        <template v-if="is_stage_completed(STAGE.routed_stage)">
        {{ $t('survey.already_completed_error') }}
        </template>
        <template v-if="!is_stage_completed(STAGE.routed_stage)">
            {{ $t("survey.redirect_to_survey")}}
        </template>

        <template  v-slot:actions>
        <q-chip v-if="is_stage_completed(STAGE.routed_stage)" icon="mdi-arrow-left" clickable 
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
    inject: ['gotoIndexAndMoveOn', 'STAGE'],
    components: {ArtificialModerator},
    computed: {
        ...mapGetters(
        'assemblystore',
        ['is_stage_completed']
        )
    }
}
</script>
