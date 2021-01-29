<template>
  <q-page class="doc_content">

    <div v-if="routed_stage">

      <!-- EDIT CONTENT -->
      <!-- <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="routed_stage" /> -->

      <!-- MISCONFIGURATION -->
      <div v-if="routed_stage && !is_stage_completed(routed_stage) && !check_data">
        <h2>{{routed_stage.stage.title}}</h2>

        <q-banner class="bg-grey-3 q-mb-lg">
          <template v-slot:avatar>
            <q-icon
              name="mdi-alert-circle-outline"
              color="primary"
            />
          </template>
          {{ $t('survey.misconfiguration_error') }}
          <template v-slot:action>
            <q-btn
              flat
              :label="$t('assemblies.go_back_to_assembly_home')"
              @click="gotoAssemblyHome()"
            />
          </template>
        </q-banner>
      </div>

      <!-- AM-OVERVIEW -->
      <div class="q-mb-xl">
        <ArtificialModeratorSURVEYIndexTop
          v-if="check_data"
          :ongoing="!routed_stage || oauth.authorized === null"
          align="left"
        />
      </div>

      <!-- Redirect Spinner  -->
      <div
        v-if="routed_stage && check_data && !is_stage_completed(routed_stage)"
        align="center"
      >
        <q-spinner-gears
          color="grey"
          class="q-mb-lg"
          size="5em"
        />
      </div>
    </div>

  </q-page>
</template>


<script>
import StageMixin from "src/mixins/stage";
import i18nPluginMixin from "./i18n";
// import Configuration from 'src/utils/configuration'
import ArtificialModeratorSURVEYIndexTop from "./artificialmoderation/IndexTop";
// import {mapGetters} from 'vuex'

export default {
  name: "Survey",
  components: { ArtificialModeratorSURVEYIndexTop },
  mixins: [StageMixin, i18nPluginMixin],

  data() {
    return {
      // Events
      MonitorSurveyCompleting: "MonitorSurveyCompleting",
    };
  },

  computed: {
    check_data: function () {
      console.log("check survey data..");

      if (this.routed_stage === undefined) {
        // not yet loaded...
        return null;
      }

      if (
        !this.routed_stage.stage.custom_data ||
        !this.routed_stage.stage.custom_data.provider ||
        !this.routed_stage.stage.custom_data.SID
      ) {
        console.log("no survey data provided at this stage..");
        console.log(this.routed_stage.stage.custom_data);
        return false;
      }
      return true;
    },

    is_a_survey_response() {
      if (this.$route.query.completed) {
        return true;
      }
    },
  },

  methods: {
    redirect: function () {
      // all data available
      const SID = this.routed_stage.stage.custom_data.SID;
      // this.$router.currentRoute.path
      let url = process.env.ENV_SURVEY_URL;
      var re = /:SID:/g;
      var newurl = url.replace(re, SID);
      re = /:USERID:/g;
      newurl = newurl.replace(re, this.oauth.userid);
      re = /:STAGEID:/g;
      newurl = newurl.replace(re, this.routed_stage_id);
      re = /:ASSEMBLYIDENTIFIER:/g;
      newurl = newurl.replace(re, this.assemblyIdentifier);
      // console.log(USERID)
      // console.log(newurl)
      window.location.href = newurl;

      return true;
    },

    monitorApi: function (event, force) {
      console.log("Force MonitorApi: " + event + " - " + force);
      console.assert(event);
      // if (!event) {
      //     event = this.Constants.MONITOR_STAGE_ENTERING
      // }

      /* By this method we allow the API to monitor userz activities */
      const STAGEID = this.routed_stage_id;
      const USERID = this.oauth.userid;
      console.log(this.oauth.userid + "oauth_userid");

      if (!STAGEID || this.$route.query.U != USERID) {
        console.log("wrong response data...");
        return false;
      }

      // Notify API
      const data = {
        assembly_identifier: this.assemblyIdentifier,
        stage_id: STAGEID,
        sub: USERID,
      };
      console.log("slkdjfjsdf09sdfs");
      this.$store.dispatch("monitorApi", {
        event: event,
        data: data,
        key: STAGEID,
        timeout: 0,
        force: force,
      });
    },
  },

  /**
   * Must be run before monitor are mounted...
   */
  created: function () {
    console.log("created survey index page");
    // Completed Response?
    if (!this.is_stage_completed(this.routed_stage)) {
      if (this.is_a_survey_response) {
        console.log("Completed response!");
        const event = this.MonitorSurveyCompleting;
        const force = true;
        this.monitorApi(event, force);
        return true;

        // Initiating Survey => redirect to Provider
      } else {
        console.log("Redirect to Provider..?");
        this.redirect();
        return true;
      }
    }
  },
};
</script>
