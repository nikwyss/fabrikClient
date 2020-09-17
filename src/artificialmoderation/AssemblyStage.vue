<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage'
            :ongoing="oauth_authenticated!==undefined && assembly===null">
        
        <!-- // TODO: differentiate by alert status -->
        <template v-if="isNew && firstStage && !lastStage && !isCompleted">
            {{$t('assemblies.stage_enter_first') }}
        </template>
        <template v-if="isNew && !firstStage  && !lastStage  && !isCompleted">
            {{$t('assemblies.stage_enter_continue') }}
        </template>
        <template v-if="isCompleted">
            {{$t('assemblies.stage_already_completed') }}
        </template>
        <template v-if="isNew && !firstStage  && lastStage && !isCompleted">
            {{$t('assemblies.stage_enter_end') }}
        </template>
        <template v-if="isNew && firstStage  && lastStage && !isCompleted">
            {{$t('assemblies.unique_stage_enter') }}
        </template>

        <template v-if="!isNew && isAlert && !isCompleted">
            {{$t('assemblies.stage_attention_needed') }}
        </template>

        <template v-if="!isNew && !isAlert && !isCompleted">
            {{$t('assemblies.stage_already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="stage && !lastStage && skippable" :size="requiresAttention ? 'md' : 'md'" icon="mdi-arrow-down" 
            clickable @click="clickGotoNextStage">
            {{ $t('assemblies.goto_next_stage') }}
        </q-chip>
        <q-chip :size="requiresAttention ? 'md' : 'md'" icon="mdi-arrow-right" v-if="stage && !isCompleted" clickable @click="clickPluginLink">
            {{ $t('assemblies.please_enter_stage') }}
        </q-chip>
        <q-chip size="sm" icon="mdi-arrow-down" v-if="stage && lastStage && skippable" 
            clickable @click="goto_final_message">
            {{ $t('assemblies.goto_final_message') }}
        </q-chip>
        </template>

    </ArtificialModerator>


    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import AssemblyMixin from 'src/mixins/assembly'

export default{
    name: "ArtificialModeratorAssemblyHome",
    components: {ArtificialModerator},
    mixins: [AssemblyMixin],
    props: ['lastStage', 'firstStage', 'stage', 'skippable', 
    'isAlert', 'isNew', 'stageNr', 'isCompleted'],

    computed: {
        requiresAttention: function(){
            return (this.isNew || this.isAlert)
        }
    },

    methods: {

        clickGotoNextStage: function () {
            console.log("clickGotoNextStage")
            this.$emit('clickGotoNextStage', this.stageNr)
        },

        clickPluginLink: function () {
            console.log("clickPluginLink")
            var assemblyIdentifier = this.$route.params.assemblyIdentifier
            var params = {assemblyIdentifier: assemblyIdentifier}
            console.log(this.stage)
            params["stageID"] = this.stage.stage.id
            console.log("....")
            this.$router.push({name:  this.stage.stage.type, params: params})
        }
    }
}
</script>
