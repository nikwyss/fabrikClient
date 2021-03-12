<template>
  <q-page
    class="doc_content"
    v-if="contenttree"
  >

    <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <!-- RESULT -->
    <div v-if="salienceCompleted">
      <h2>Resultat</h2>
      <div class="row justify-between">
        <ChartRadar
          :personalData="chartRadarPersonalData"
          :populationData="chartRadarPopulationData"
          :labels="chartRadarLabels"
        />
      </div>
    </div>
    </div>

  </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/contenttree";
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import ContentSalienceSlider from "src/pages/ContentTree/components/ContentSalienceSlider";
import ChartRadar from "src/components/charts/ChartRadar";

export default {
  name: "VAATopics",
  mixins: [ContentTreeMixin],
  components: {
    ComponentStageEditor,
    ContentSalienceSlider,
    ChartRadar,
  },
  computed: {
    chartEntries() {
      const children = this.contenttree.structure.children;
      return children.map((child) => this.contenttree.entries[child.id]);
    },
    chartRadarPersonalData() {
      // console.log(this.entries)
      return this.chartEntries.map((entry) => entry.progression?.salience);
    },
    chartRadarLabels() {
      return this.chartEntries.map((entry) => entry.content?.title);
    },
    chartRadarPopulationData() {
      return this.chartEntries.map((entry) => Math.random() * 100);
    },

    // salienceCompleted() {
    //     const allSalienced = this.numberOfUnsaliencedTopLevelEntries == 0
    //     if (allSalienced && this.is_stage_scheduled(this.routed_stage)) {
    //         this.markIdle()
    //     }
    //     return (allSalienced)
    // }
  },
};
</script>
