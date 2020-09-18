<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage' :ongoing="ongoing">
        
        <!-- // TODO: differentiate by alert status -->
        <template v-if="isNew(stage, stageNr) && isFirstStage(stage, stageNr) && !isLastStage(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_first') }}
        </template>
        <template v-if="isNew(stage, stageNr) && !isFirstStage(stage, stageNr)  && !isLastStage(stage, stageNr)  && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_continue') }}
        </template>
        <template v-if="isCompleted(stage, stageNr)">
            {{$t('stages.am.already_completed') }}
        </template>
        <template v-if="isNew(stage, stageNr) && !isFirstStage(stage, stageNr)  && isLastStage(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_end') }}
        </template>
        <template v-if="isNew(stage, stageNr) && isFirstStage(stage, stageNr)  && isLastStage(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.enter_unique_stage') }}
        </template>

        <template v-if="!isNew(stage, stageNr) && isAlert(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.attention_needed') }}
        </template>

        <template v-if="!isNew(stage, stageNr) && !isAlert(stage, stageNr) && !isCompleted(stage, stageNr)">
            {{$t('stages.am.already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="stage && !isLastStage(stage, stageNr) && isSkippable(stage, stageNr)" :size="requiresAttention ? 'md' : 'md'" icon="mdi-arrow-down" 
            clickable @click="clickGotoNextStage(stage, stageNr)">
            {{ $t('stages.goto_next_stage') }}
        </q-chip>
        <q-chip :size="requiresAttention ? 'md' : 'md'" icon="mdi-arrow-right" v-if="stage && !isCompleted(stage, stageNr)" clickable @click="clickPluginLink(stage)">
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
    inject: ['injects', 'assemblyIdentifier', 'clickPluginLink', 'clickGotoNextStage',
        'isLastStage', 'isSkippable', 'isNew', 'isLastStage', 'isCompleted', 'isAlert', 'isFirstStage'
    ], // see provide attribute in the antecedents
    components: {ArtificialModerator},
    props: ['stage', 'stageNr', 'ongoing'],
    computed: {
        requiresAttention: function(){
            return (this.isNew(this.stage, this.stageNr) || this.isAlert(this.stage, this.stageNr))
        }
    }
}
</script>
