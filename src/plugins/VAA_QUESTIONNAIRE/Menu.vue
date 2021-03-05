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
      v-if="assembly_sorted_stages"
    >

      <CustomQRouteTab
        v-for="item in Object.values(menu)"
        :key="item.name"
        :name="item.name"
        class="trennbar"
        :disabled="item.disabled"
        :alert="item.alert"
        :icon="item.icon"
        exact
        :to="item.to"
        :label="item.label"
        :menuOffset="menuOffset"
        :highlighted="routed_stage && routed_stage.stage.group == item.name"
        :tooltip="item.tooltip"
        :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      />
    </q-tabs>

  </div>
</template>


<script>
import CustomQRouteTab from "src/layouts/components/CustomQRouteTab";
import VAAMixin from "./mixins/VAA";
import { runtimeStore } from "src/store/runtime.store";

export default {
  name: "AssemblyMenu",
  mixins: [VAAMixin],
  props: ["menuOffset"],
  components: { CustomQRouteTab },

  data() {
    return {
      assemblyIdentifier: runtimeStore.assemblyIdentifier,
      currenttab: "",
    };
  },

  computed: {
    menu() {
      return {
        preparation: {
          name: "preparation",
          disabled: this.groupsAccessible?.includes("preparation"),
          label: "Vorbereitung",
          icon: "mdi-calendar-text",
          tooltip: "Bevor es losgeht sind Vorbereitungen zu treffen.",
          to: {
            name: "VAA_QUESTIONNAIRE_HOME",
            params: { assemblyIdentifier: runtimeStore.assemblyIdentifier },
          },
        },

        topics: {
          name: "topics",
          label: "Themen",
          disabled: this.groupsAccessible?.includes("topics"),
          icon: "mdi-sign-direction",
          tooltip: "Setzen Sie die Themen des Wahlkampfs.",
          to: {
            name: "VAA_QUESTIONNAIRE_TOPICS",
            params: {
              assemblyIdentifier: runtimeStore.assemblyIdentifier,
              stageID: this.stages_by_groups
                ? this.stages_by_groups[0].stage.id
                : 0,
            },
          },
        },

        questions: {
          name: "questions",
          label: "Fragenkatalog",
          disabled: this.groupsAccessible?.includes("questions"),
          // alert: "orange",
          icon: "mdi-calendar-text",
          tooltip:
            "Entscheiden, Sie über welche konkreten Fragen im Wahlkampf diskutiert wird.",
          to: {
            name: "VAA_QUESTIONNAIRE_QUESTIONS",
            params: {
              assemblyIdentifier: runtimeStore.assemblyIdentifier,
              stageID: this.stages_by_groups
                ? this.stages_by_groups[0].stage.id
                : 0,
            },
          },
        },

        overview: {
          name: "overview",
          label: "Zwischenstand",
          disabled: this.groupsAccessible?.includes("overview"),
          icon: "mdi-lead-pencil",
          tooltip:
            "Sie finden eine Übersicht über den aktuellen Stand der BürgerInnen-Versammlung",
          to: {
            name: "VAA_QUESTIONNAIRE_ANALYSES",
            params: {
              assemblyIdentifier: runtimeStore.assemblyIdentifier,
              stageID: this.stages_by_groups
                ? this.stages_by_groups[0].stage.id
                : 0,
            },
          },
        },
      };
    },
  },
};
</script>