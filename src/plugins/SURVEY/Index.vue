<template>
    <q-page class="doc_content">


        <div v-if="stage">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="stage.disabled" style="padding:2em; margin-bottom:1em;">
            This Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="stage" />


            <!-- MISCONFIGURATION -->
            <div v-if="stage && !is_survey_completed && !check_data">
                <h2>{{stage.stage.title}}</h2>

                <q-banner class="bg-grey-3 q-mb-lg">
                    <template v-slot:avatar>
                        <q-icon name="mdi-alert-circle-outline" color="primary" />
                    </template>
                    {{ $t('survey.misconfiguration_error') }}
                    <template v-slot:action>
                        <q-btn flat 
                            :label="$t('assemblies.go_back_to_assembly_home')" 
                            @click="gotoAssemblyHome()" />
                    </template>
                </q-banner>
            </div>
   

            <!-- ALREADY COMPLETED? -->
            <div v-if="stage && is_survey_completed">
                <h2>{{stage.stage.title}}</h2>

                <q-banner class="bg-grey-3 q-mb-lg">
                    <template v-slot:avatar>
                        <q-icon name="mdi-check" color="primary" />
                    </template>
                    {{ $t('survey.already_completed_error') }}
                    <template v-slot:action>
                        <q-btn flat 
                            :label="$t('assemblies.go_back_to_assembly_home')" 
                            @click="gotoAssemblyHome()" />
                    </template>
                </q-banner>
            </div>

            <!-- REDIRECT TO SURVEY  -->
            <div v-if="stage && check_data && !is_survey_completed"  align="center">
                <!-- <p>{{stage.stage.info}}</p> -->

                <q-spinner-gears
                    color="grey"
                    class="q-mb-lg"
                    size="5em"/>
                <div class="text-italic">
                    {{ $t("survey.redirect_to_survey")}}
                </div>
            </div>

        </div>

    </q-page>
</template>


<script>
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import StageMixin from "src/mixins/stage"
import i18nPluginMixin from "./i18n"
import Configuration from 'src/utils/configuration'

export default {
    name: 'Survey',
    components: {
        ComponentStageEditor
    },

    mixins: [StageMixin, i18nPluginMixin],

    data() {
        return {
            MonitorSurveyCompleting: 'MonitorSurveyCompleting'
        }
    },

    computed: {

        check_data: function () {
            if (this.stage === undefined) {
                // not yet loaded...
                return (null)
            }

            if (!this.stage.stage.custom_data ||
                !this.stage.stage.custom_data.provider ||
                !this.stage.stage.custom_data.SID) {
                    return (false)
            }
            if (this.is_a_survey_response && !this.is_survey_completed){
                this.monitorApi2()
                return (true)
            }


            if (!this.is_a_survey_response && !this.is_survey_completed){
                this.redirect()
            }


            return (true)
        },

        is_a_survey_response() {
            if (this.$route.query.completed){
                return (true)
            }
        },

        is_survey_completed() {
            return (this.stage && this.stage.progression && this.stage.progression.completed)
        },

        redirect: function () {

            // all data available
            const SID = this.stage.stage.custom_data.SID
            const USERID = this.stage.stage.access_sub
            const STAGEID = this.stage.stage.id
            // const RETURNURL = window.location.href
            let url = Configuration.value('ENV_SURVEY_URL')
            var re = /:SID:/g
            var newurl = url.replace(re, SID)
            re = /:USERID:/g
            newurl = newurl.replace(re, USERID)
            re = /:STAGEID:/g
            newurl = newurl.replace(re, STAGEID)
            // re = /:RETURN:/g
            // newurl = newurl.replace(re, RETURNURL)
            window.location.href=newurl

            return (true)
        }
    },

    methods: {

        monitorApi2: function() {
            /* By this method we allow the API to monitor user activities */
            const STAGEID = this.stage.stage.id
            const USERID = this.stage.stage.access_sub
            if (this.$route.query.S != STAGEID ||
                this.$route.query.U != USERID) {
                    console.log("wrong response data...")
                    return (false)
            }

            // Notify API
            const data = {
                assembly_identifier: this.assemblyIdentifier,
                stage_id:STAGEID,
                sub: USERID
            }
            
            this.$store.dispatch('monitorApi', {
                event: this.MonitorSurveyCompleting,
                data: data})

        },

        gotoAssemblyHome: function() {
            // REDIRECT TO ARGUMENT PAGE
            this.$router.replace({name: 'assembly_home',
                params: {assemblyIdentifier: this.assembly.identifier}
            })
        }
    }
}
</script>
