<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage'
            :ongoing="$root.authenticated!==undefined && ongoing_assembly===null">
        
        <!-- // TODO: differentiate by alert status -->
        <template v-if="isNew && firstStage && !lastStage">
            {{$t('content.assemblies.item.stage_enter_first') }}
        </template>
        <template v-if="isNew && !firstStage  && !lastStage">
            {{$t('content.assemblies.item.stage_enter_continue') }}
        </template>
        <template v-if="isNew && !firstStage  && lastStage">
            {{$t('content.assemblies.item.stage_enter_end') }}
        </template>
        <template v-if="isNew && firstStage  && lastStage">
            {{$t('content.assemblies.item.unique_stage_enter') }}
        </template>

        <template v-if="!isNew && isAlert">
            {{$t('content.assemblies.item.stage_attention_needed') }}
        </template>

        <template v-if="!isNew && !isAlert">
            {{$t('content.assemblies.item.stage_already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip :size="requiresAttention ? 'lg' : 'md'" icon="mdi-arrow-right" v-if="stage" clickable @click="clickPluginLink">
            {{ $t('content.assemblies.item.please_enter_stage') }}
        </q-chip>
        <div v-if="stage && !lastStage && skippable">
            <q-chip :size="requiresAttention ? 'md' : 'lg'" icon="mdi-arrow-down" 
                clickable @click="clickGotoNextStage">
                {{ $t('content.assemblies.item.goto_next_stage') }}
            </q-chip>
        </div>
        <q-chip size="sm" icon="mdi-arrow-down" v-if="stage && lastStage && skippable" 
            clickable @click="goto_final_message">
            {{ $t('content.assemblies.item.goto_final_message') }}
        </q-chip>
        </template>

    </ArtificialModerator>


    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
// import AssemblyMixin from 'src/pages/Assembly/mixins/assembly'

export default{
    name: "ArtificialModeratorAssemblyHome",
    components: {ArtificialModerator},
    // mixins: [AssemblyMixin],
    props: ['ongoing_assembly', 'lastStage', 'firstStage', 'stage', 'skippable', 
    'isAlert', 'isNew', 'stageNr'],

    computed: {
        requiresAttention: function(){
            return (this.isNew || this.isAlert)
        }
    },

    methods: {

        clickGotoNextStage: function () {
            console.log("clickGotoNextStage")
            this.$emit('clickGotoNextStage', this.stageNr)
            // this.set_current_stageID({assembly: this.assembly, stageID: step+})
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
        // ...mapActions({set_current_stageID: 'assemblystore/set_current_stageID'})
    }
}
</script>
