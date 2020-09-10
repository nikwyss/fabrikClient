<style lang="sass" scoped>
.q-stepper__dot
    width: 50px  !important;
    height: 50px !important;
</style>
<template>
    <q-page class="doc_content">


        <!-- ASSEMBLY DESCRIPTION -->
        <div v-if="assembly">
            <div class="text-subtitle2">{{$t('content.assemblies.item.subtitle')}}</div>
            <h2>{{assembly.title}}</h2>
            <span>{{assembly.info}}</span>
        </div>

        <!-- AM-OVERVIEW -->
        <div class="q-mb-xl">
            <ArtificialModeratorAssemblyHome 
            :ongoing="!assembly || assembly_stages === undefined" 
            :maxSteps="maxSteps"
            align="left" />
        </div>

        <!-- STAGES -->
        <q-stepper
            v-if="assembly && assembly_stages"
            v-model="step"
            vertical
            flat
            animated
            header-nav
            ref="stepper"
            inactive-icon="mdi-disabled"
            >

            <q-step
                v-for="(item, stageNr) in sorted_stages"
                :key="Number(stageNr)"
                :prefix="stageNr+1"
                :name="Number(stageNr)"
                :caption="getStepCaption(item, stageNr)"
                :header-nav="highestAllowedStep >= stageNr"
                :title="getStepTitle(item, stageNr)"
                :icon="item.icon ? item.stage.icon : 'mdi-email-outline'"
                error-icon="mdi-email-alert-outline"
                :done-icon="ishighestAllowedStep(stageNr) ? 'mdi-email-outline' : 'mdi-email-check-outline'"
                :active-icon="'mdi-email-open-outline'"
                :active-color="ishighestAllowedStep(stageNr) ? 'blue' : 'accent2'"
                :done-color="ishighestAllowedStep(stageNr) ? 'blue' : 'accent2-light'"
                :done="isDone(item, stageNr)"
                :disabled="isDisabled(item)"
            >
                <!-- MANAGERS: STAGE EDITOR -->
                <ComponentStageEditor :key="`AE${stageNr}`"  v-if="assembly.acl.includes('manage') && step==stageNr" :assembly="assembly" :model="item"/>

                <!-- STAGE CONTENT-->
                <q-card flat>

                    <q-card-section class="q-pa-xs" style="min-height:3em;" >
                        <div class="text-subtitle2" v-html="item.stage.info" />
                    </q-card-section>

                    <!-- AM-STAGE -->
                    <q-card-section class="col-12 " align="right">
                    <ArtificialModeratorAssemblyStage
                        :ongoing="!assembly && assembly_stages === undefined"
                        :stageNr="stageNr"
                        :lastStage="isLastStage(stageNr)"
                        :skippable="isSkippable(item, stageNr)"
                        :isNew="isNew(item)"
                        :isAlert="isAlert(item)"
                        :firstStage="isFirstStage(stageNr)"
                        @clickGotoNextStage="clickGotoNextStage"
                        :stage="item" />
                    </q-card-section>

                </q-card>
            </q-step>
        </q-stepper>

    </div>

    <!-- MANAGER: NEW STAGE -->
    <ComponentStageEditor v-if="assembly && assembly.acl.includes('manage')" :assembly="assembly" />
</q-page>
</template>


<script>
import AssemblyMixin from "./mixins/assembly"
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import { mapGetters, mapActions } from 'vuex'
import ArtificialModeratorAssemblyHome from 'src/artificialmoderation/AssemblyHome'
import ArtificialModeratorAssemblyStage from 'src/artificialmoderation/AssemblyStage'

export default {
    name: 'PageAssemblyHome',
    components: {ComponentStageEditor, ArtificialModeratorAssemblyHome, ArtificialModeratorAssemblyStage},
    mixins: [AssemblyMixin],
    computed: {
        
        maxSteps: function() {

            if(!this.assembly_stages){
                return (undefined)
            }

            return(Object.keys(this.assembly_stages).length)
        },

        sorted_stages: function() {
            if(!this.assembly_stages){
                return (undefined)
            }

            // Object.values(assembly_stages).sort((a, b) => a.stage.order_position.localeCompare(b.stage.order_position))
            // console.log(this.assembly_stages)
            let sorted = Object.values(this.assembly_stages).sort((a, b) => a.stage.order_position < b.stage.order_position ? -1 : a.stage.order_position > b.stage.order_position ? 1 : 0)
            return(sorted)
        },

        highestAllowedStep: function () {
            if(!this.assembly_stages){
                return (undefined)
            }

            for (let stageNr in this.sorted_stages) {
                let stage = this.sorted_stages[stageNr]
                if (this.isNew(stage) || this.isAlert(stage)){
                    return (stageNr)
                }
            }
            return (this.maxSteps + 1)
        },

        step: {
            get: function() {
                let stageID = this.get_current_stageID(this.assembly.identifier)
                let stageNr = null
                if (stageID) {
                    let stage = this.assembly_stages[stageID]
                    stageNr = this.sorted_stages.indexOf(stage)
                }
                if (stageNr === null || stageNr === undefined) {
                    stageNr = 0
                }
                return (stageNr)
            },

            set: function(stageNr) {
                console.log("SET NEW STAGE")
                this.set_current_stageID({assembly: this.assembly, stageID: this.sorted_stages[stageNr].stage.id})
            },
        },

        ...mapGetters({get_current_stageID: 'assemblystore/get_current_stageID'})
    },

    methods: {

        clickBackToAssemblyListButton: function () {
            this.set_current_assemblyIdentifier(null)
            this.$router.push ({ name: 'assemblies' })
        },

        clickGotoNextStage: function(stageNr) {
            this.step = stageNr + 1
        },

        getStepCaption: function (item, key) {

            var caption = ''

            // PREFIX
            if (!this.isDone(item, key)){
                caption = this.$i18n.t('content.assemblies.item.stage_not_yet_accessible')
            }

            return(caption)
        },

                getStepTitle: function (item, key) {
            var title = item.stage.title

            if(item.stage.disabled) {
                title +=  ' [DISABLED]'
            }

            if("deleted" in item.stage && item.stage.deleted) {
                title +=  ' [DELETED]'
            }

            // PREFIX
            // title = `${key+1}/${this.maxSteps} ${title}`

            return(title)
        },

        isDone: function (item, key) {
            // return(this.step in [this.STATUS_COMPLETED])
            return(this.highestAllowedStep >= key)
        },
        ishighestAllowedStep: function (key) {
            return(this.highestAllowedStep == key)
        },
        isSkipped: function (item) {
            return(item.progression && item.progression.status in [this.STATUS_SKIPPED])
        },
        isAlert: function (item) {
            return(item.progression && item.progression.status in [this.STATUS_ALERT])
        },
        isIdle: function (item) {
            return(item.status in [this.STATUS_IDLE])
        },
        isNew: function (item) {
            return(item.progression === null || item.progression === undefined)
        },
        isDisabled: function (item) {
            // only admins see deleted attribute.
            return(("disabled" in item.stage && item.stage.disabled) || ("deleted" in item.stage && item.stage.deleted))
        },

        isSkippable: function(item, key) {

            // new content is never skippable
            if (this.isNew(item)) {
                return (false)
            }

            // alerted content is never skippable
            if (this.isAlert(item)) {
                return (false)
            }

            // all the rest is skippable. right?
            return(true)
        },

        isFirstStage: function (key) {
            return(key == 0)
        },

        isLastStage: function (key) {
            return(key == this.sorted_stages.length)
        },

        ...mapActions({set_current_stageID: 'assemblystore/set_current_stageID'})
    }
}
</script>
