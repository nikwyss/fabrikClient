<template>
    <q-page class="doc_content">

        <div v-if="routedStage">

            <!-- EDIT CONTENT -->
            <!-- <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="routedStage" /> -->

            <!-- MISCONFIGURATION -->
            <div v-if="routedStage && !isCompleted(routedStage) && !check_data">
                <h2>{{routedStage.stage.title}}</h2>

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

            <!-- AM-OVERVIEW -->
            <div class="q-mb-xl">
                <ArtificialModeratorSURVEYIndexTop
                v-if="check_data"
                :ongoing="!ABLY.routedStage || oauth.authorized === null" 
                align="left" />
            </div>


            <!-- Redirect Spinner  -->
            <div v-if="ABLY.routedStage && check_data && !isCompleted(routedStage)"  align="center">
                <q-spinner-gears
                    color="grey"
                    class="q-mb-lg"
                    size="5em"/>
            </div>
        </div>

    </q-page>
</template>


<script>
import StageMixin from "src/mixins/stage"
import i18nPluginMixin from "./i18n"
// import Configuration from 'src/utils/configuration'
import ArtificialModeratorSURVEYIndexTop from './artificialmoderation/IndexTop'
// import {mapGetters} from 'vuex'

export default {
    name: 'Survey',
    components: {ArtificialModeratorSURVEYIndexTop},

    mixins: [StageMixin, i18nPluginMixin],

    data() {
        return {
            // Events
            MonitorSurveyCompleting: 'MonitorSurveyCompleting',
        }
    },

    computed: {

        check_data: function () {
            console.log("check survey data..")

            if (this.routedStage === undefined) {
                // not yet loaded...
                return (null)
            }

            if (!this.routedStage.stage.custom_data ||
                !this.routedStage.stage.custom_data.provider ||
                !this.routedStage.stage.custom_data.SID) {
                    console.log("no survey data provided at this stage..")
                    console.log(this.routedStage.stage.custom_data)
                    return (false)
            }
            return (true)
        },

        is_a_survey_response() {
            if (this.$route.query.completed){
                return (true)
            }
        }
    },

    methods: {

        redirect: function () {

            // all data available
            const SID = this.routedStage.stage.custom_data.SID
            // this.$router.currentRoute.path
            let url = process.env.ENV_SURVEY_URL
            var re = /:SID:/g
            var newurl = url.replace(re, SID)
            re = /:USERID:/g
            newurl = newurl.replace(re, this.oauth.userid)
            re = /:STAGEID:/g
            newurl = newurl.replace(re, this.routedStageID)
            re = /:ASSEMBLYIDENTIFIER:/g
            newurl = newurl.replace(re, this.assemblyIdentifier)
            // console.log(USERID)
            // console.log(newurl)
            window.location.href=newurl

            return (true)
        },

        monitorApi: function(event, force) {
            console.log("Force MonitorApi: " + event + " - " + force)
            console.assert(event)
            // if (!event) {
            //     event = this.Constants.MONITOR_STAGE_ENTERING
            // }

            /* By this method we allow the API to monitor userz activities */
            const STAGEID = this.routedStageID
            const USERID = this.oauth.userid
            console.log(this.oauth.userid + 'oauth_userid')

            if (!STAGEID || this.$route.query.U != USERID) {
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
                event: event,
                data: data,
                key: STAGEID,
                timeout: 0,
                force: force})

        }
    },

    mounted: function () {
        console.log("mounted3")
        // Completed Response?
        if (!this.isCompleted(this.routedStage)) {

            if (this.is_a_survey_response){                  
                console.log("Completed response!")
                const event = this.MonitorSurveyCompleting
                const force = true
                this.monitorApi(event, force)
                return (true)
        
            // Initiating Survey => redirect to Provider 
            } else {

                console.log("Redirect to Provider..?")
                this.redirect()
                return (true)
            }
        }
    }
}
</script>
