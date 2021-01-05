<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage' :ongoing="ongoing">
        
        <!-- // TODO: differentiate by alert status -->
        <template v-if="isNew(stage) && isFirstStage(stage, stageNr) && !isLastStage(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_first') }}
        </template>
        <template v-if="isNew(stage) && !isFirstStage(stage, stageNr)  && !isLastStage(stage, stageNr)  && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_continue') }}
        </template>
        <template v-if="isCompleted(stage, stageNr)">
            {{$t('stages.am.already_completed') }}
        </template>
        <template v-if="isNew(stage) && !isFirstStage(stage, stageNr)  && isLastStage(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_end') }}
        </template>
        <template v-if="isNew(stage) && isFirstStage(stage, stageNr)  && isLastStage(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_unique_stage') }}
        </template>

        <template v-if="!isNew(stage) && isAlert(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.attention_needed') }}
        </template>

        <template v-if="!isNew(stage) && !isAlert(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="stage && !isLastStage(stage, stageNr) && isSkippable(stage, stageNr)" :size="isSkippable(stage, stageNr) ? 'md' : 'md'" icon="mdi-arrow-down" 
            clickable @click="clickGotoNextStageNr">
            {{ $t('stages.goto_next_stage') }}
        </q-chip>
        <q-chip :size="isSkippable(stage, stageNr) ? 'md' : 'md'" icon="mdi-arrow-right" v-if="stage && !isCompleted(stage, stageNr)" 
                clickable @click="clickPluginLink(stage)">
            {{ $t('stages.please_enter_stage') }}
        </q-chip>
        <q-chip size="sm" icon="mdi-arrow-down" v-if="stage && isLastStage(stage, stageNr) && isSkippable(stage, stageNr)" 
            clickable @click="goto_final_message">
            {{ $t('stages.goto_final_message') }}
        </q-chip>
        </template>

    </ArtificialModerator>


    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'

export default{
    name: "ArtificialModeratorAssemblyStage",
    inject: ['ABLY', 'assemblyIdentifier', 'clickPluginLink',
        'clickGotoNextStageNr',
        'isSkippable', 'isNew', 'isLastStage', 'isCompleted', 'isAlert', 'isFirstStage'
    ], // see provide attribute in the antecedents
    components: {ArtificialModerator},
    props: ['stage', 'stageNr', 'ongoing']
}
</script>
