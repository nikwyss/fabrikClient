<style lang="sass" scoped>
.q-stepper__dot
    width: 50px !important
    height: 50px !important
</style>
<template>
  <q-page class="doc_content" v-if="assembly">

    <!-- ASSEMBLY DESCRIPTION -->
    <div >


      <!-- <div class="caption">{{ $t('assemblies.home_caption', {assembly_title: assembly.title}) }}</div> -->
      <h2>Um was wir sie heute bitten</h2>
      <!-- <h2>{{ assembly.caption }}</h2> -->
      <p>{{ assembly.info }}</p>
            <!-- <div class="caption">{{ $t('assemblies.home_caption', {assembly_title: assembly.title}) }}</div> -->

      <!-- <h2>{{$t('stages.home_title', {current_date: $options.filters.formatDate(Date.now())})}}</h2> -->

      <!-- <span>{{ $t('assemblies.home_description', {relative_end_date: $options.filters.formatTimeLeft(assembly.date_end)}) }}</span> -->
    </div>

    <!-- AM-OVERVIEW -->
    <div class="q-mb-xl">

      <ArtificialModeratorAssemblyHome align="left" />
    </div>

    <!-- STAGES -->
      <!-- inactive-icon="mdi-disabled" -->
    <q-stepper
      v-if="assembly_sorted_stages &&  oauth.authorized !== null"
      v-model="stage_nr_last_visited"
      vertical
      header-nav
      @transition="stageTransition"
      flat
      ref="stepper"
    >
      <q-step
        v-for="(localStage, localStageNr) in assembly_sorted_stages"
        :key="Number(localStageNr)"
        :prefix="localStageNr+1"
        :done="true"
        :name="Number(localStageNr)"
        :caption="getStepCaption(localStage)"
        :title="getStepTitle(localStage)"
        :color="getColor(localStage)"
        :done-icon="getIcon(localStage)"
      > 
        <!-- :header-nav="is_stage_accessible(localStage) && stage_last_visited != localStage" -->
        <!-- :active-icon="getIcon(localStage, localStageNr)"
        :error-icon="getIcon(localStage, localStageNr)" -->

        <!-- MANAGERS: STAGE EDITOR -->
        <ComponentStageEditor
          :key=" `AE${localStageNr}` "
          v-if="IsManager && stage_nr_last_visited==localStageNr"
          :model="localStage"
        />

        <!-- DISABLED WARNING -->
        <q-banner
          dense
          inline-actions
          class="text-white bg-red"
          v-if="localStage.stage.disabled"
          style="padding:2em; margin-bottom:1em;"
        >
          This Stage is disabled and, therefore, not visible for users.
        </q-banner>

        <!-- STAGE CONTENT-->
        <q-card flat>
          <q-card-section
            v-if="localStageNr==stage_nr_last_visited"
            class="q-pa-xs"
            style="min-height:3em;"
          >
            <div
              class="text-subtitle2"
              v-dompurify-html="localStage.stage.info"
            />
          </q-card-section>

          <!-- AM-STAGE -->
          <q-card-section
            class="col-12 "
            align="right"
          >
            <ArtificialModeratorAssemblyStage
              v-if="localStageNr==stage_nr_last_visited"
              :stage="localStage"
            />
          </q-card-section>

        </q-card>
      </q-step>
    </q-stepper>

    <!-- AM-OVERVIEW -->
    <div class="q-mb-xl">
      <ArtificialModeratorAssemblyHome
        v-if="!assembly_scheduled_stages"
        :ongoing="!assembly_sorted_stages || assembly_sorted_stages === undefined"
        :numberOfStages="numberOfStages"
        align="left"
      />
    </div>

    </div>

    <!-- MANAGER: NEW STAGE -->
    <ComponentStageEditor v-if="assembly && IsManager" />
  </q-page>
</template>


<script>
import AssemblyMixin from "src/mixins/assembly";
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import ArtificialModeratorAssemblyHome from "src/artificialmoderation/AssemblyHome";
import ArtificialModeratorAssemblyStage from "src/artificialmoderation/AssemblyStage";
import { mapGetters} from "vuex";
import { runtimeStore } from "src/store/runtime.store";

export default {
  name: "PageAssemblyHome",
  mixins: [AssemblyMixin],
  components: {
    ComponentStageEditor, // load dynamically when required...
    ArtificialModeratorAssemblyHome,
    ArtificialModeratorAssemblyStage,
  },

  provide() {
    return {
      clickPluginLink: this.clickPluginLink,
    };
  },

  methods: {
    getStepCaption: function (stage, stageNr) {
      var caption = "";
      // PREFIX
      if (this.is_stage_completed(stage)) {
        caption = this.$i18n.t("stages.status_completed");
      } else if (!this.is_stage_done(stage)) {
        caption = this.$i18n.t("stages.status_not_yet_accessible");
      } else if (stage.stage.disabled) {
        caption = this.$i18n.t("stages.status_disabled");
      } else if ("deleted" in stage.stage && stage.stage.deleted) {
        caption = this.$i18n.t("stages.status_deleted");
      }

      if (caption) {
        return `(${caption})`;
      }
    },

    getStepTitle: function (stage) {
      return stage.stage.title;
    },

    clickPluginLink: function (stage) {
      console.log("clickPluginLink");
      var params = {
        assemblyIdentifier: runtimeStore.assemblyIdentifier,
        stageID: stage.stage.id,
        contenttreeID: stage.stage.contenttree_id,
      };
      this.$router.push({
        name: stage.stage.type,
        params: params,
      });
    },
        
    getIcon(stage) {
      console.assert(stage)
      if (this.is_stage_disabled(stage)) {
        return "mdi-cancel";
      }

      if (this.last_accessible_stage == stage) {
        return "mdi-bell";
      }

      if (this.last_accessible_stage?.stage.order_position < stage.stage.order_position) {
        return "mdi-clock-time-eleven-outline";
      }

      return "mdi-check-bold";
    },

    getColor(stage) {
      var color = "green-6";

      if (this.is_stage_disabled(stage)) {
        return "grey-4";
      }

      if (this.is_stage_completed(stage)) {
        return "green-3";
      }

      if (this.last_accessible_stage == stage) {
        return "blue-9";
      }

      if (this.last_accessible_stage?.stage.order_position < stage.stage.order_position) {
        return "orange-5";
      }

      return color;
    }
  },

  computed: {
    ...mapGetters(
      'assemblystore', ['IsDelegate',  'IsExpert', 'IsContributor', 'IsObserver', 'IsManager']
    )
  },

  mounted: function () {
    // this.scrollToStage()
  },
};
</script>
