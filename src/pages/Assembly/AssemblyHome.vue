<style lang="sass" scoped>
.q-stepper__dot
    width: 50px  !important;
    height: 50px !important;
</style>
<template>
    <q-page class="doc_content">


        <!-- ASSEMBLY DESCRIPTION -->
        <div v-if="assembly">
            <div class="caption">{{ $t('assemblies.home_caption', {assembly_title: assembly.title}) }}</div>
            <h2>{{$t('assemblies.home_title', {current_date: $moment().format('l')})}}</h2>
            <span>{{ $t('assemblies.home_description', {relative_end_date: $moment(assembly.date_end).fromNow()}) }}</span>
        </div>

        <!-- AM-OVERVIEW -->
        <div class="q-mb-xl">
            <ArtificialModeratorAssemblyHome 
            v-if="!isFinished"
            :ongoing="!sorted_stages || sorted_stages === undefined" 
            :maxStages="maxStages"
            align="left" />
        </div>

        <!-- STAGES -->
        <q-stepper
            v-if="sorted_stages && sorted_stages"
            v-model="stageNr"
            vertical
            header-nav
            flat
            animated
            ref="stepper"
            inactive-icon="mdi-disabled"
            >

            <q-step
                v-for="(item, localStageNr) in sorted_stages"
                :key="Number(localStageNr)"
                :prefix="localStageNr+1"
                :color="getColor(item, localStageNr)"
                :name="Number(localStageNr)"
                :caption="getStepCaption(item, localStageNr)"
                :header-nav="isActive(item, localStageNr) && localStageNr != stageNr"
                :title="getStepTitle(item, localStageNr)"
                :icon="item.icon ? item.stage.icon : 'mdi-email-outline'"
                error-icon="mdi-email-alert-outline"
                :done-icon="isActive(item, localStageNr) ? 'mdi-email-outline' : 'mdi-email-check-outline'"
                :active-icon="'mdi-email-open-outline'"
                :done="isDone(item, localStageNr)"
                :active="!isDone(item, localStageNr)"
                :disabled="isDisabled(item)"
            >

                <!-- MANAGERS: STAGE EDITOR -->
                <ComponentStageEditor :key="`AE${localStageNr}`"  v-if="assembly_acls.includes('manage') && stageNr==localStageNr" :assembly="assembly" :model="item"/>

                <!-- STAGE CONTENT-->
                <q-card flat>

                    <q-card-section 
                      v-if="localStageNr==stageNr"
                      class="q-pa-xs" style="min-height:3em;" >
                        <div class="text-subtitle2" v-html="item.stage.info" />
                    </q-card-section>

                    <!-- AM-STAGE -->
                    <q-card-section class="col-12 " align="right">
                    <ArtificialModeratorAssemblyStage
                        v-if="localStageNr==stageNr"
                        :ongoing="!assembly && assembly_stages === undefined"
                        :stageNr="localStageNr"
                        :lastStage="isLastStage(localStageNr)"
                        :skippable="isSkippable(item, localStageNr)"
                        :isNew="isNew(item)"
                        :isCompleted="isCompleted(item)"
                        :isAlert="isAlert(item)"
                        :firstStage="isFirstStage(localStageNr)"
                        @clickGotoNextStage="clickGotoNextStage"
                        :stage="item" />
                    </q-card-section>

                </q-card>
            </q-step>
        </q-stepper>

        <!-- AM-OVERVIEW -->
        <div class="q-mb-xl">
            <ArtificialModeratorAssemblyHome 
            v-if="isFinished"
            :ongoing="!sorted_stages || sorted_stages === undefined" 
            :maxStages="maxStages"
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

export default {
    name: 'PageAssemblyHome',
    components: {ComponentStageEditor, ArtificialModeratorAssemblyHome, ArtificialModeratorAssemblyStage},
    mixins: [AssemblyMixin],
    computed: {
        
        maxStages: function() {

            if(!this.assembly_stages){
                return (undefined)
            }

            return(Object.keys(this.assembly_stages).length)
        },

        isFinished(stageNr) {
          return (this.highestAllowedStageNr == this.maxStages+1)
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

            for (let stageNr in this.sorted_stages) {
              let stage = this.sorted_stages[stageNr]
              if (!this.isDisabled(stage) && !this.isCompleted(stage) && !this.isDisabled(stage)){
                if (this.isNew(stage) || this.isAlert(stage) ){
                    return (stageNr)
                }
              }
            }

            // User is finished with all steps..
            return (this.maxStages + 1)
        },

        stageNr: {
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

              console.log("SET NEW STAGE" + stageNr)

              if (stageNr === null) {
                this.set_current_stageID({assembly: this.assembly, stageID: null })
                return (null)
              } 

              // Is this a valid stage?
              if (this.validateStep(stageNr)){
                console.log("Validation passed.." + stageNr)
                const stage = this.sorted_stages[stageNr]
                this.set_current_stageID({assembly: this.assembly, stageID: stage.stage.id})
              }else{
                console.log("Validation not passed.." + stageNr)

              }
            }
        },

        ...mapGetters({get_current_stageID: 'assemblystore/get_current_stageID'})
    },

    methods: {

        validateStep: function (stageNr) {

          console.log("validateor: " + stageNr)

          // is there a unskipable stage before the current stage?
          // Or: is the current stage beyond highgest allowed stageNr?
          if (stageNr > this.highestAllowedStageNr) {
            this.stageNr = (this.highestAllowedStageNr)
            return (null)
          }


          const stage = this.sorted_stages[stageNr]

          // is the current stage accessible (i.e. not completed)
          if (this.isCompleted(stage) ||
              this.isDisabled(stage)) {

            if (stageNr == this.maxStages) {
              this.stageNr = null
              return (null)
            }else{
              this.clickGotoNextStage(stageNr)
              return (null)
            }
          }

          return (true)
        },

        clickBackToAssemblyListButton: function () {
            this.set_current_assemblyIdentifier(null)
            this.$router.push ({ name: 'assemblies' })
        },

        clickGotoNextStage: function(stageNr) {
            this.stageNr = stageNr + 1
        },

        getStepCaption: function (item, key) {

          var caption = ''

          // PREFIX
          if (this.isCompleted(item)) {
              caption =  `${this.$i18n.t('assemblies.stage_status_completed')}`
          } else if (!this.isDone(item, key)){
              caption = this.$i18n.t('assemblies.stage_status_not_yet_accessible')
          } else if (item.stage.disabled) {
              caption =  `${this.$i18n.t('assemblies.stage_status_disabled')}`
          } else if ("deleted" in item.stage && item.stage.deleted) {
              caption =  ` ${this.$i18n.t('assemblies.stage_status_deleted')}`
          }

          if (caption) {
            return(`(${caption})` )
          }
        },

        getStepTitle: function (item, key) {
          var title = item.stage.title
          return(title)
        },

        isDone: function (item, key) {
            // return(this.stageNr in [this.STATUS_COMPLETED])
            return(this.highestAllowedStageNr >= key && !this.isCompleted(item))
        },
        ishighestAllowedStageNr: function (key) {
            return(this.highestAllowedStageNr == key)
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

        isActive: function (item, stageNr) {
          return( this.highestAllowedStageNr >= stageNr && !this.isCompleted(item))
        },

        isCompleted: function (item) {
          console.assert(item)

          if (!('progression' in item)) {
            return (false)
          }

          if (!item.progression) {
            return (false)
          }
          if (!item.progression.completed) {
            return (false)
          }

          return(item.progression.completed===true)
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

        getColor(item, stageNr) {

          if (this.isDisabled(item) || this.isCompleted(item)) {
              return 'grey-5'
          }

          var color = 'accent2'

          // if (this.ishighestAllowedStageNr(stageNr)) {
          //   color =  'blue' 
          // }

          if (this.highestAllowedStageNr < stageNr) {
              return 'brown-5'
          }

          return(color)
        },

        ...mapActions({set_current_stageID: 'assemblystore/set_current_stageID'})
    }
}
</script>
