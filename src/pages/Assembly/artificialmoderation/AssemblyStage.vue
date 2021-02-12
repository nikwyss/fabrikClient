<template>
<div class="justify-center center" v-if="stage">

    <!-- ONLY SHOWN WHEN ATLEAST ONE SCHEDULED STAGE IS ON THE AGENDA  -->

    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage' :ongoing="ongoing">
        
        <!-- No Stage left => Tagessoll erfüllt
        <!-- At least one stage is still open -->
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

        <template v-if="is_stage_scheduled(stage)">
            {{$t('stages.am.attention_needed') }}
        </template>

        <template v-if="!is_stage_scheduled(stage) && $nLength(assembly_scheduled_stages)">
            {{$t('stages.am.already_seen') }}
        </template>

        <template v-if="!is_stage_scheduled(stage) && !$nLength(assembly_scheduled_stages)">
            {{$t('stages.am.all_stages_already_seen') }}
        </template>




        <!-- ACTION CHIPS -->
        <template  v-slot:actions>

        <Button v-if="$nLength(assembly_scheduled_stages) && !is_stage_last(stage) && !is_stage_scheduled(stage)" icon="mdi-arrow-down" 
            clickable @click="gotoNextStageNr(stage)"
          :label="$t('stages.goto_next_stage')"
        ></Button>

        <!-- :size="is_stage_scheduled(stage) ? 'lg' : 'md'"  -->
        <Button icon="mdi-arrow-right" v-if="stage && !is_stage_completed(stage) && is_stage_scheduled(stage)" 
          :label="$t('stages.please_enter_stage')"
          @click="clickPluginLink(stage)"
        ></Button>


        <!-- LAST STAGE COMPLETED -->
        <!-- <q-chip size="sm" icon="mdi-arrow-down" v-if="stage && is_stage_last(stage) && is_stage_skippable(stage)" 
            clickable @click="goto_final_message">
            {{ $t('stages.goto_final_message') }}
        </q-chip> -->
        </template>

    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from 'src/components/ArtificialModerator'
import Button from "src/components/ArtificialModeratorButton";
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
            'is_stage_done', 'is_stage_completed', 'is_stage_new', 'is_stage_last',
            'is_stage_first', 'is_stage_alert', 'assembly_scheduled_stages', 'is_first_day'
            ]
        )
    },
    components: {ArtificialModerator, Button},
    props: ['stage']
}
</script>
