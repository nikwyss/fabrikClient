<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage' :ongoing="ongoing">
        
        <!-- // TODO: differentiate by alert status -->
        <template v-if="is_stage_new(stage) && is_stage_first(stage) && !is_stage_last(stage) && !is_stage_completed(stage)">
            {{$t('stages.am.enter_first') }}
        </template>
        <template v-if="is_stage_new(stage) && !is_stage_first(stage)  && !is_stage_last(stage)  && !is_stage_completed(stage)">
            {{$t('stages.am.enter_continue') }}
        </template>
        <template v-if="is_stage_completed(stage)">
            {{$t('stages.am.already_completed') }}
        </template>
        <template v-if="is_stage_new(stage) && !is_stage_first(stage)  && is_stage_last(stage) && !is_stage_completed(stage)">
            {{$t('stages.am.enter_end') }}
        </template>
        <template v-if="is_stage_new(stage) && is_stage_first(stage)  && is_stage_last(stage) && !is_stage_completed(stage)">
            {{$t('stages.am.enter_unique_stage') }}
        </template>

        <template v-if="!is_stage_new(stage) && is_stage_alert(stage) && !is_stage_completed(stage)">
            {{$t('stages.am.attention_needed') }}
        </template>

        <template v-if="!is_stage_new(stage) && !is_stage_alert(stage) && !is_stage_completed(stage)">
            {{$t('stages.am.already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="stage && !is_stage_last(stage) && is_stage_skippable(stage)" :size="is_stage_skippable(stage) ? 'md' : 'md'" icon="mdi-arrow-down" 
            clickable @click="gotoNextStageNr(stage)">
            {{ $t('stages.goto_next_stage') }}
        </q-chip>
        <q-chip :size="is_stage_skippable(stage) ? 'md' : 'md'" icon="mdi-arrow-right" v-if="stage && !is_stage_completed(stage)" 
                clickable @click="clickPluginLink(stage)">
            {{ $t('stages.please_enter_stage') }}
        </q-chip>
        <q-chip size="sm" icon="mdi-arrow-down" v-if="stage && is_stage_last(stage) && is_stage_skippable(stage)" 
            clickable @click="goto_final_message">
            {{ $t('stages.goto_final_message') }}
        </q-chip>
        </template>

    </ArtificialModerator>


    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import { mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorAssemblyStage",
    inject: ['clickPluginLink', 'gotoNextStageNr'], 
    computed: {
        ongoing: function() {
            return !this.assembly_sorted_stages || !this.oauth.authorized
        },
        ...mapGetters(
        'assemblystore', [
            'assembly_sorted_stages', 'is_stage_accessible', 'is_stage_scheduled',
            'is_stage_done', 'is_stage_completed', 'is_stage_new', 'is_stage_last', 'is_stage_skippable',
            'is_stage_first', 'is_stage_alert'
            ]
        )
    },
    components: {ArtificialModerator},
    props: ['stage']
}
</script>
