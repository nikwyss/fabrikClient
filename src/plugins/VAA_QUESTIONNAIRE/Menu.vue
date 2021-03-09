<style scoped>
.trennbar {
  /* hyphens */
  -moz-hyphens: auto;
  -o-hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
</style>

<template>

  <div align="center">

    <q-tabs
      v-model="currenttab"
      inline-label
      outside-arrows
      mobile-arrows
      v-if="stages_by_groups"
    >
      <CustomQRouteTab
        v-for="item in Object.values(menu)"
        :key="item.name"
        :name="item.name"
        class="trennbar"
        :icon="item.icon"
        exact
        :disable="!groupsAccessible.includes(item.name)"
        :highlighted="next_scheduled_stage && stages_by_groups[item.name].includes(next_scheduled_stage)"
        :to="item.to()"
        :label="item.label"
        :menuOffset="menuOffset"
        :tooltip="item.tooltip"
        :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      />
      <!-- :disabled="item.disabled" -->
      <!-- :alert="item.alert" -->
      <!-- :highlighted="routed_stage && routed_stage.stage.group == item.name" -->

    </q-tabs>

  </div>
</template>


<script>
import CustomQRouteTab from "src/layouts/components/CustomQRouteTab";
import StageGroupMixin from "../../mixins/stagegroup";
import { runtimeStore } from "src/store/runtime.store";

export default {
  name: "AssemblyMenu",
  mixins: [StageGroupMixin],
  props: ["menuOffset"],
  components: { CustomQRouteTab },

  data() {
    return {
      currenttab: "",
      assemblyIdentifier: runtimeStore.assemblyIdentifier,
      menu: {
        preparation: {
          name: "preparation",
          // disabled: this.groupsAccessible?.includes("preparation"),
          label: "Vorbereitung",
          icon: "mdi-calendar-text",
          tooltip: "Bevor es losgeht sind Vorbereitungen zu treffen.",
          to: () => {
            return {
              name: "VAA_QUESTIONNAIRE",
              params: { assemblyIdentifier: runtimeStore.assemblyIdentifier },
            };
          },
        },

        topics: {
          name: "topics",
          label: "Themen",
          // disabled: this.groupsAccessible?.includes("topics"),
          icon: "mdi-sign-direction",
          tooltip: "Setzen Sie die Themen des Wahlkampfs.",
          to: () => {
            return {
              name: "VAA_QUESTIONNAIRE_TOPICS",
              params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: this.getFirstStageIDByGroup("topics"),
              },
            };
          },
        },

        questions: {
          name: "questions",
          label: "Fragenkatalog",
          // disabled: this.groupsAccessible?.includes("questions"),
          // alert: "orange",
          icon: "mdi-calendar-text",
          tooltip:
            "Entscheiden, Sie über welche konkreten Fragen im Wahlkampf diskutiert werden soll.",
          to: () => {
            return {
              name: "VAA_QUESTIONNAIRE_QUESTIONS",
              params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: this.getFirstStageIDByGroup("topics"),
              },
            };
          },
        },

        overview: {
          name: "overview",
          label: "Zwischenstand",
          // disabled: this.groupsAccessible?.includes("overview"),
          icon: "mdi-lead-pencil",
          tooltip:
            "Sie finden eine Übersicht über den aktuellen Stand der BürgerInnen-Versammlung",
          to: () => {
            return {
              name: "VAA_QUESTIONNAIRE_OVERVIEW",
              params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: this.getFirstStageIDByGroup("topics"),
              },
            };
          },
        },
      },
    };
  },

  computed: {},
};
</script>