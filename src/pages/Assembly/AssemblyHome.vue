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
            v-model="cachedStageNr"
            vertical
            header-nav
            @transition="stageTransition"
            flat
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
                :header-nav="isActive(localStage, localStageNr) && localStageNr != cachedStageNr"
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
                <ComponentStageEditor :key=" `AE${localStageNr}` "  
                    v-if="assembly_acls.includes('manage') && cachedStageNr==localStageNr" 
                    :model="localStage"/>

                <!-- DISABLED WARNING -->
                <q-banner dense inline-actions class="text-white bg-red" v-if="localStage.stage.disabled" style="padding:2em; margin-bottom:1em;">
                This Stage is disabled and, therefore, not visible for users.
                </q-banner>

                <!-- STAGE CONTENT-->
                <q-card flat>
                    <q-card-section
                      v-if="localStageNr==cachedStageNr"
                      class="q-pa-xs" style="min-height:3em;" >
                        <div class="text-subtitle2" v-html="localStage.stage.info" />
                    </q-card-section>

                    <!-- AM-STAGE -->
                    <q-card-section class="col-12 " align="right">
                    <ArtificialModeratorAssemblyStage
                        v-if="localStageNr==cachedStageNr"
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
import ArtificialModeratorAssemblyHome from 'src/artificialmoderation/AssemblyHome'
import ArtificialModeratorAssemblyStage from 'src/artificialmoderation/AssemblyStage'

export default {
    name: 'PageAssemblyHome',
    mixins: [AssemblyMixin],
    components: {
        ComponentStageEditor, // load dynamically when required...
        ArtificialModeratorAssemblyHome,
        ArtificialModeratorAssemblyStage
    },

    provide() {
        return {
            clickPluginLink: this.clickPluginLink,
        }
    },

    methods: {
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
        

        getColor(stage, stageNr) {

            var color = 'accent'

            if (this.isDisabled(stage)) {
                return 'grey-4'
            }

            if (this.isCompleted(stage)) {
                return 'grey-4'
            }

            if (this.highestAllowedStageNr == stageNr) {
                color =  'brown-9' 
            }

            if (this.highestAllowedStageNr < stageNr) {
                return 'brown-5'
            }

            return(color)
        },
    },

    mounted: function () {
        // this.scrollToStage()
    }
}
</script>
