<template>

  <q-page
    class="doc_content"
    v-if="ready"
  >

    <SideMenu :items="sideMenuItems" />

    <!-- DISABLED WARNING -->
    <q-banner
      dense
      inline-actions
      class="text-white bg-red"
      v-if="routed_stage.stage.disabled"
      style="padding:2em; margin-bottom:1em;"
    >
      This Stage is disabled and, therefore, not visible for users.
    </q-banner>

    <!-- EDIT CONTENT -->
    <ComponentStageEditor
      v-if="IsManager"
      :assembly_id="assembly.id"
      :model="routed_stage"
    />

    <div class="q-pt-xl text-vessel">

      <ArtificialModeration
        :AM="AMs.topics_top"
        alignment="center"
        :ctx="this"
      />

      <h2>Themengewichtung</h2><a name="SALIENCE" />
      <q-list
        bordered
        v-if="routed_stage && contenttree"
      >

        <span
          v-for="(node, key)  in contenttree.structure.children"
          :key="`L1${node.id}`"
        >

          <q-expansion-item
            :group="salienceCompleted ? 'accordeon' : `group${node.id}`"
            icon="mdi-sign-direction"
            :default-opened="!isSalienced(contents[node.id])"
            :caption="isSalienced(contents[node.id]) ? `Ihre Bewertung ${contents[node.id].progression.salience}` : `Unbewertet`"
            header-class="text-primary"
          >
            <template
              template
              v-slot:header
            >
              <q-item-section avatar>
                <q-knob
                  disable
                  v-if="isSalienced(contents[node.id])"
                  show-value
                  v-model="contents[node.id].progression.salience"
                  style="color:black"
                  :thickness="0.4"
                  center-color="vaatopic-light"
                  color="vaatopic"
                  track-color="white"
                  class="text-body q-ma-md"
                >
                  {{contents[node.id].progression.salience}}
                </q-knob>
              </q-item-section>

              <q-item-section>
                {{contents[node.id].content.title}}
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <ContentSalienceSlider :content="contents[node.id]" />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />
        </span>

      </q-list>

      <div class="row justify-between">
        <div class="seperator large">
          <q-icon name="mdi-star-four-points-outline" />
        </div>
      </div>

      <!-- RESULT / STATS -->
      <div v-if="salienceCompleted">

        <h2>Die Themen im Vergleich</h2><a name="CHARTS" />

        <ArtificialModeration
          :AM="AMs.topics_after_saliencing"
          alignment="center"
          amGroup="sdfdsf"
          :role="2"
          :ctx="this"
        />

        <!-- Sie sehen hier nun ihre persönliche Prioritätenliste der Wahlthemen. -->
        <br><br>
        <q-tabs
          v-model="chartType"
          narrow-indicator
          dense
          align="justify"
          class="text-primary"
        >
          <q-tab
            :ripple="false"
            name="chartBar"
            label="Balkendiagram"
          />
          <q-tab
            :ripple="false"
            name="chartRadar"
            label="Smartspider"
          />
        </q-tabs>
        <ChartBar
          v-if="chartType=='chartBar'"
          :personalData="chartBarPersonalData"
          :labels="chartBarLabels"
          color="rgb(224, 202, 60, 0.45)"
        />
        <ChartRadar
          v-if="chartType=='chartRadar'"
          :personalData="chartBarPersonalData"
          :labels="chartBarLabels"
          color="rgb(224, 202, 60, 0.45)"
        />

        <ArtificialModeration
          :AM="AMs.topics_after_charts"
          alignment="right"
          amGroup="sdfdsf"
          :role="2"
          :ctx="this"
        />
      </div>

      <div v-if="salienceCompleted">

        <div class="row justify-between">
          <div class="seperator large">
            <q-icon name="mdi-star-four-points-outline" />
          </div>
        </div>

        <h2>Forum</h2><a name="FORUM" />

        <ArtificialModeration
          :AM="AMs.topics_forum"
          alignment="left"
          amGroup="sdfdsf"
          :role="1"
          :ctx="this"
        />

        <ComponentContentTree />
      </div>

      <div v-if="salienceCompleted">

        <div class="row justify-between">
          <div class="seperator large">
            <q-icon name="mdi-star-four-points-outline" />
          </div>
        </div>

        <h2>Neue Themen vorschlagen</h2><a name="MODERATION" />

        <!-- <ArtificialModeratorTopicsBottom
          :ongoing="!routed_stage || oauth.authorized === null"
          align="right"
        /> -->

        Sind ausser Ihrer Sicht noch nicht alle Themen abgedeckt. Gibt es etwas aus Ihrer Sicht, was nicht in eines der Themen passt? Folgende Ergänzungen wurden von anderen Teilnehmenden bereits vorgeschlagen.
      </div>

    </div>
  </q-page>
</template>


<script>
import AMs from "./ArtificialModeration.js";
import ArtificialModeration from "src/artificial_moderation/ArtificialModeration.vue";

import SideMenu from "src/layouts/components/SideMenu";
import ContentTreeMixin from "src/mixins/contenttree";
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
// import TextsheetCard from "./components/TextsheetCard";
import ContentSalienceSlider from "src/pages/ContentTree/components/ContentSalienceSlider";
import ChartBar from "src/components/charts/ChartBar";
import ChartRadar from "src/components/charts/ChartRadar";
// import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock";
import ComponentContentTree from "src/pages/ContentTree/components/ContentTree";

export default {
  name: "VAATopics",
  mixins: [ContentTreeMixin],
  components: {
    SideMenu,
    ComponentStageEditor,
    // TextsheetCard,
    ContentSalienceSlider,
    // DefaultDiscussionBlock,
    ComponentContentTree,
    ChartBar,
    ChartRadar,
    ArtificialModeration,
  },
  data() {
    return {
      AMs: AMs,
      sideMenuItems: [
        {
          label: "Themengewichtung",
          anchor: "SALIENCE",
        },
        {
          label: "Vergleich",
          anchor: "CHARTS",
        },
        {
          label: "Forum",
          anchor: "FORUM",
        },
        {
          label: "Neue Themen",
          anchor: "MODERATION",
        },
      ],
      chartType: "chartBar",
    };
  },

  computed: {
    sortedChartEntries() {
      const children = this.contenttree.structure.children;
      const entries = Object.values(
        children.map((child) => this.contenttree.entries[child.id])
      );
      return entries.sort(
        (a, b) => b.progression.salience - a.progression.salience
      );
    },
    chartBarPersonalData() {
      return this.sortedChartEntries.map(
        (entry) => entry.progression?.salience
      );
    },
    chartBarLabels() {
      return this.sortedChartEntries.map((entry) => entry.content?.title);
    },

    ready() {
      console.log("stage loaded.... ", !!this.routed_stage?.stage?.id);
      return !!this.routed_stage?.stage?.id;
    },
  },
};
</script>
