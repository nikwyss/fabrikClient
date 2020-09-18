<style lang="sass" scoped>
.q-stepper__dot
    width: 50px  !important;
    height: 50px !important;
</style>
<template>
    <q-page class="doc_content" >

        <!-- ASSEMBLY DESCRIPTION -->
        <div v-if="assembly">
            <div class="caption">{{ $t('assemblies.home_caption', {assembly_title: assembly.title}) }}</div>
            <h2>{{$t('stages.home_title', {current_date: $moment().format('l')})}}</h2>
            <span>{{ $t('assemblies.home_description', {relative_end_date: $moment(assembly.date_end).fromNow()}) }}</span>
        </div>

        <!-- AM-OVERVIEW -->
        <div class="q-mb-xl">
            <ArtificialModeratorAssemblyHome 
            v-if="!isAgendaFinished"
            :ongoing="!sorted_stages || oauth_authenticated === null" 
            align="left" />
        </div>

        <!-- STAGES -->
        <q-stepper
            v-if="sorted_stages &&  oauth_authenticated !== null"
            v-model="currentStageNr"
            vertical
            header-nav
            flat
            animated
            ref="stepper"
            inactive-icon="mdi-disabled"
            >

            <q-step
                v-for="(localStage, localStageNr) in sorted_stages"
                :key="Number(localStageNr)"
                :prefix="localStageNr+1"
                :color="getColor(localStage, localStageNr)"
                :name="Number(localStageNr)"
                :caption="getStepCaption(localStage, localStageNr)"
                :header-nav="isActive(localStage, localStageNr) && localStageNr != currentStageNr"
                :title="getStepTitle(localStage, localStageNr)"
                :icon="localStage.icon ? localStage.stage.icon : 'mdi-email-outline'"
                error-icon="mdi-email-alert-outline"
                :done-icon="isActive(localStage, localStageNr) ? 'mdi-email-outline' : 'mdi-email-check-outline'"
                :active-icon="'mdi-email-open-outline'"
                :done="isDone(localStage, localStageNr)"
                :active="!isDone(localStage, localStageNr)"
                :disabled="isDisabled(localStage)"
            >

                <!-- MANAGERS: STAGE EDITOR -->
                <ComponentStageEditor :key="`AE${localStageNr}`"  v-if="assembly_acls.includes('manage') && currentStageNr==localStageNr" :assembly="assembly" :model="localStage"/>

                <!-- STAGE CONTENT-->
                <q-card flat>

                    <q-card-section
                      v-if="localStageNr==currentStageNr"
                      class="q-pa-xs" style="min-height:3em;" >
                        <div class="text-subtitle2" v-html="localStage.stage.info" />
                    </q-card-section>

                    <!-- AM-STAGE -->
                    <q-card-section class="col-12 " align="right">
                    <ArtificialModeratorAssemblyStage
                        v-if="localStageNr==currentStageNr"
                        :ongoing="!assembly || !localStage"
                        :stageNr="localStageNr"
                        :stage="localStage" />
                    </q-card-section>

                </q-card>
            </q-step>
        </q-stepper>

        <!-- AM-OVERVIEW -->
        <div class="q-mb-xl">
            <ArtificialModeratorAssemblyHome 
            v-if="isAgendaFinished"
            :ongoing="!sorted_stages || sorted_stages === undefined" 
            :numberOfStages="numberOfStages"
            align="left" />
        </div>

    </div>

    <!-- MANAGER: NEW STAGE -->
    <ComponentStageEditor v-if="assembly && assembly_acls.includes('manage')" :assembly="assembly" />
</q-page>
</template>


<script>
import AssemblyMixin from "src/mixins/assembly"
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import { mapGetters, mapActions } from 'vuex'
import ArtificialModeratorAssemblyHome from 'src/artificialmoderation/AssemblyHome'
import ArtificialModeratorAssemblyStage from 'src/artificialmoderation/AssemblyStage'
// import Vue from 'vue'
// var vue = require('vue');

export default {
    name: 'PageAssemblyHome',
    mixins: [AssemblyMixin],

    /* Make available all the properties and methods in any descendant object.*/
    reactiveProvide: {
        name: 'injects',
        include: [
            'assembly', 'isAgendaFinished', 'numberOfStages', 'numberOfScheduledStages', 
            'assembly_acls', 'currentStageNr'],
    },

    provide() {
        return {
            assemblyIdentifier: this.assemblyIdentifier,
            gotoAssemblyHome: this.gotoAssemblyHome,
            clickGotoNextStage: this.clickGotoNextStage,
            clickPluginLink: this.clickPluginLink,
            isLastStage: this.isLastStage,
            isFirstStage: this.isFirstStage,
            isNew: this.isNew,
            isAlert: this.isAlert,
            isSkippable: this.isSkippable,
            isCompleted: this.isCompleted
        }
    },


    components: {
        ComponentStageEditor, // load dynamically when required...
        ArtificialModeratorAssemblyHome,
        ArtificialModeratorAssemblyStage},

    computed: {

        numberOfStages: function() {

            if(!this.assembly_stages){
                return (undefined)
            }

            return(Object.keys(this.assembly_stages).length)
        },

        numberOfScheduledStages: function() {
            if(!this.assembly_stages){
                return (undefined)
            }
            const scheduled_stages = Object.filter(this.assembly_stages, x => this.isScheduledStage(x))
            return(Object.values(scheduled_stages).length)
        },

        sorted_stages: function() {
            if(!this.assembly_stages){
                return (undefined)
            }
            let sorted = Object.values(this.assembly_stages).sort((a, b) => a.stage.order_position < b.stage.order_position ? -1 : a.stage.order_position > b.stage.order_position ? 1 : 0)
            return(sorted)
        },

        highestAllowedStageNr: function () {
            if(!this.sorted_stages){
                return (undefined)
            }

            var lastAllowedStageNr = this.numberOfStages
            for (let stageNr in this.sorted_stages) {
              let stage = this.sorted_stages[stageNr]
              // TODO: buggy: use maybe... isScheduledStages
              if (!this.isDisabled(stage) && !this.isCompleted(stage)){
                if (!this.isSkippable(stage, stageNr) ){
                    // this stage must be handled right now.
                    return (stageNr)
                }else {
                    lastAllowedStageNr = stageNr
                }
              }
            }

            // User is finished with all steps..
            return (lastAllowedStageNr + 1)
        },

        currentStageNr: {
            get: function() {
                if (this.assembly_stages===null) {
                    return (null)
                }

                let stageID = this.get_current_stageID(this.assemblyIdentifier)
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

              console.log("SET NEW STAGE" + stageNr)

              if (stageNr === null) {
                this.set_current_stageID({assembly: this.assembly, stageID: null })
                return (null)
              }

              // Is this a valid stage?
              const stage = this.sorted_stages[stageNr]
              if (this.validateStep(stage, stageNr)){
                console.log("Validation passed.." + stageNr)
                this.set_current_stageID({assembly: this.assembly, stageID: stage.stage.id})
              }else{
                console.log("Validation not passed.." + stageNr)

              }
            }
        },

        isAgendaFinished: function () {
          return (this.highestAllowedStageNr == this.numberOfStages+1)
        },

        ...mapGetters({get_current_stageID: 'assemblystore/get_current_stageID'})
    },

    methods: {
  

        validateStep: function (stage, stageNr) {

          console.log("validator: " + stageNr)

          // is there a unskipable stage before the current stage?
          // Or: is the current stage beyond highgest allowed stageNr?
          if (stageNr > this.highestAllowedStageNr) {
            this.stageNr = (this.highestAllowedStageNr)
            return (null)
          }

          // is the current stage accessible (i.e. not completed)
          if (this.isCompleted(stage) ||
              this.isDisabled(stage)) {

            if (stageNr == this.numberOfStages) {
              this.stageNr = null
              return (null)
            }else{
              this.clickGotoNextStage(stage, stageNr)
              return (null)
            }
          }

          return (true)
        },


        getColor(stage, stageNr) {

          var color = 'accent'

        if (this.isDisabled(stage)) {
              return 'grey-4'
        }

        if (this.isCompleted(stage)) {
              return 'grey-4'
        }

          if (this.ishighestAllowedStageNr(stage, stageNr)) {
            color =  'brown-9' 
          }


          if (this.highestAllowedStageNr < stageNr) {
              return 'brown-5'
          }

          return(color)
        },
        getStepCaption: function (stage, stageNr) {

          var caption = ''

          // PREFIX
          if (this.isCompleted(stage)) {
              caption =  `${this.$i18n.t('stages.status_completed')}`
          } else if (!this.isDone(stage, stageNr)){
              caption = this.$i18n.t('stages.status_not_yet_accessible')
          } else if (stage.stage.disabled) {
              caption =  `${this.$i18n.t('stages.status_disabled')}`
          } else if ("deleted" in stage.stage && stage.stage.deleted) {
              caption =  ` ${this.$i18n.t('stages.status_deleted')}`
          }

          if (caption) {
            return(`(${caption})` )
          }
        },

        getStepTitle: function (stage, stageNr) {
          var title = stage.stage.title
          return(title)
        },

        isDone: function (stage, stageNr) {
            // return(this.stageNr in [this.STATUS_COMPLETED])
            return(this.highestAllowedStageNr >= stageNr && !this.isCompleted(stage))
        },

        isActive: function (stage, stageNr) {
          return( this.highestAllowedStageNr >= stageNr && !this.isCompleted(stage))
        },

        /* Is there still an activity required on this stage? */
        isScheduledStage: function (stage, stageNr) {
            return(!this.isDisabled(stage) && !this.isCompleted(stage) &&
                (this.isNew(stage) || this.isAlert(stage))
            )
        },

        isSkippable: function(stage, stageNr) {

            // new content is never skippable
            if (this.isNew(stage)) {
                return (false)
            }

            // alerted content is never skippable
            if (this.isAlert(stage)) {
                return (false)
            }

            // all the rest is skippable. right?
            return(true)
        },


        clickPluginLink: function (stage) {
            console.log("clickPluginLink")
            var params = {
                assemblyIdentifier: this.assemblyIdentifier,
                stageID: stage.stage.id,
                contenttreeID: stage.stage.contenttree_id,
            }
            this.$router.push({
                name:  stage.stage.type, 
                params: params
            })
        },
        
        
        isSkipped: function (stage) {
            return(stage.progression && stage.progression.status in [this.STATUS_SKIPPED])
        },
        isAlert: function (stage) {
            return(stage.progression && stage.progression.status in [this.STATUS_ALERT])
        },
        isIdle: function (stage) {
            return(stage.status in [this.STATUS_IDLE])
        },
        isNew: function (stage) {
            return(stage.progression === null || stage.progression === undefined)
        },
        isDisabled: function (stage) {
            // only admins see deleted attribute.
            return(("disabled" in stage.stage && stage.stage.disabled) || ("deleted" in stage.stage && stage.stage.deleted))
        },

        isCompleted: function (stage) {
          console.assert(stage)

          if (!('progression' in stage)) {
            return (false)
          }

          if (!stage.progression) {
            return (false)
          }
          if (!stage.progression.completed) {
            return (false)
          }

          return(stage.progression.completed===true)
        },
        

        ishighestAllowedStageNr: function (stage, stageNr) {
            return(this.highestAllowedStageNr == stageNr)
        },

        isFirstStage: function (stage, stageNr) {
            return(stageNr == 0)
        },

        isLastStage: function (stage, stageNr) {
            return(stageNr == this.sorted_stages.length)
        },


        clickGotoNextStage: function(stage, stageNr) {
            this.currentStageNr = stageNr + 1
        },

        clickBackToAssemblyListButton: function () {
            this.set_current_assemblyIdentifier(null)
            this.$router.push ({ name: 'assemblies' })
        },

        ...mapActions({set_current_stageID: 'assemblystore/set_current_stageID'})
    }
}
</script>
