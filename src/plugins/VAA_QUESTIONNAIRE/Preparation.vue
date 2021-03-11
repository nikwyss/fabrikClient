<style lang="sass" scoped>
.q-stepper__dot
  width: 50px !important
  height: 50px !important
</style>
<template>
  <q-page class="doc_content">

    <ArtificialModeration
      :AM="AMs.preparation_completed"
      alignment="right"
      :ctx="that"
    />

    <!-- ASSEMBLY DESCRIPTION -->
    <h2>Vorbereitung</h2>

    <!-- STAGES -->
    <q-stepper
      v-if="stages"
      v-model="currentSelectedStageNr"
      vertical
      header-nav
      @transition="stageTransition"
      flat
      ref="stepper"
    >
      <q-step
        v-for="(localStage, localStageNr) in stages"
        :key="localStageNr"
        :prefix="localStageNr+1"
        :done="true"
        :name="Number(localStageNr)"
        :caption="getStepCaption(localStage)"
        :title="localStage.stage.title"
        :color="getColor(localStage)"
        :done-icon="getIcon(localStage)"
      >
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
            horizontal
            v-if="localStage==currentSelectedStage"
            class="q-pa-xs"
            style="min-height:3em;"
          >
            <q-btn
              color="white"
              text-color="black"
              class="q-mt-md"
              @click="gotoStage(localStage)"
              v-if="is_stage_idle(localStage)"
              label="Öffnen"
            />

            <q-card-section>
              <div
                class="text-subtitle2"
                v-if="!is_stage_completed(localStage)"
                v-dompurify-html="localStage.stage.info"
              />

            </q-card-section>
          </q-card-section>

          <!-- AM-STAGE -->
          <q-card-section
            class="col-12 "
            align="right"
          >

            <!-- <div v-if="currentSelectedStage"> -->
            <div v-if="stageGroupScheduled ">
              <keep-alive>
                <ArtificialModeration
                  :AM="currentSelectedStageAM"
                  alignment="right"
                  :ctx="that"
                />

              </keep-alive>
            </div>

          </q-card-section>

        </q-card>
      </q-step>
    </q-stepper>

  </q-page>

</template>


<script>
import AssemblyMixin from "src/mixins/assembly";
import StageGroupMixin from "../../mixins/stagegroup";
import { mapGetters } from "vuex";
import AMs from "src/pages/Assembly/artificialmoderation/ArtificialModeration.js";
import ArtificialModeration from "src/artificial_moderation/ArtificialModeration.vue";
// import ArtificialModeratorAssemblyStage from "src/pages/Assembly/artificialmoderation/AssemblyStage";

import { runtimeStore } from "src/store/runtime.store";

export default {
  name: "PageAssemblyHome",
  mixins: [AssemblyMixin, StageGroupMixin],

  data() {
    return {
      AMs: AMs,
      that: this,
      currentSelectedStageNr: null,
    };
  },

  components: {
    ArtificialModeration,
    // ArtificialModeratorAssemblyStage,
  },

  computed: {
    stages() {
      if (!this.stages_by_groups) {
        return null;
      }

      return this.stages_by_groups["preparation"];
    },

    stageTypes() {
      return this.stages.map((stage) => stage.stage.type);
    },

    stageIDs() {
      return this.stages.map((stage) => stage.stage.id);
    },

    currentSelectedStage() {
      if (this.currentSelectedStageNr === null) {
        return null;
      }
      return this.stages[this.currentSelectedStageNr];
    },

    currentSelectedStageType: function () {
      return this.currentSelectedStage?.stage?.type;
    },

    currentSelectedStageAM: function () {
      if (!this.currentSelectedStage) {
        return {};
      }
      const type = this.currentSelectedStage.stage.type;
      if (AMs[`stage_teaser_${type}`]) {
        return AMs[`STAGE_TEASER_${type}`];
      }

      // Take default teaser AM-instruction set
      if (AMs[`stage_teaser_DEFAULT`]) {
        return AMs[`stage_teaser_DEFAULT`];
      }

      // Empty
      return {};
    },

    // componentStageTeaser() {
    //   console.assert(this.currentSelectedStageType);
    //   return () =>
    //     import(
    //       `src/plugins/${this.assemblyType}/artificialmoderation/${this.currentSelectedStageType}/StageTeaser`
    //     )
    //       .then((teaser) => teaser)
    //       .catch(() => ArtificialModeratorAssemblyStage);
    // },

    stageGroupScheduled() {
      return this.groupsScheduled.includes("preparation");
    },

    ...mapGetters("assemblystore", [
      "assemblyType",
      "IsDelegate",
      "IsExpert",
      "IsContributor",
      "IsObserver",
      "IsManager",
    ]),
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

    getIcon(stage) {
      console.assert(stage);
      if (this.is_stage_disabled(stage)) {
        return "mdi-cancel";
      }
      if (this.last_accessible_stage == stage) {
        return "mdi-bell";
      }
      if (
        this.last_accessible_stage?.stage.order_position <
        stage.stage.order_position
      ) {
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

      if (
        this.last_accessible_stage?.stage.order_position <
        stage.stage.order_position
      ) {
        return "orange-5";
      }

      return color;
    },
  },

  // created() {
  // LayoutEventBus.$once("AssemblyLoaded", (data) => {
  //   this.gotoDefaultStageTeaser();
  // });
  // this.gotoDefaultStageTeaser();
  // },

  mounted() {
    // console.log(this.$i18n.t("stages.goto_next_stage"));
    if (this.stages && this.stages?.length == 1) {
      this.currentSelectedStageNr = 0;
    } else if (this.stageIDs.includes(runtimeStore.stageID)) {
      this.currentSelectedStageNr = this.stageIDs.indexOf(runtimeStore.stageID);
    } else if (
      this.last_accessible_stage &&
      this.stageIDs.includes(this.last_accessible_stage.stage.id)
    ) {
      this.currentSelectedStageNr = this.stageIDs.indexOf(
        this.last_accessible_stage.stage.id
      );
    }
  },
};
</script>
