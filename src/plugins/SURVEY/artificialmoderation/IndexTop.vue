<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='surveyPage' :ongoing="ongoing">


        <!-- ALREADY COMPLETED? -->
        <template v-if="isCompleted(ABLY.routedStage)">
        {{ $t('survey.already_completed_error') }}
        </template>
        <template v-if="!isCompleted(ABLY.routedStage)">
            {{ $t("survey.redirect_to_survey")}}
        </template>

        <template  v-slot:actions>
        <q-chip v-if="isCompleted(ABLY.routedStage)" icon="mdi-arrow-left" clickable 
                @click="clickGotoIndexAndMoveOn">
            {{ $t('assemblies.go_back_to_assembly_home') }}
        </q-chip>
        </template>
    </ArtificialModerator>

</div>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'

export default{
    name: "ArtificialModeratorTEXTSHEETMain",
    inject: ['ABLY', 'clickGotoIndexAndMoveOn','isCompleted'
    ], // see provide attribute in the antecedents
    components: {ArtificialModerator},
    props: ['ongoing'],
}
</script>
