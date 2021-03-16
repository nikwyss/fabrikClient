<template>
  <q-page class="doc_content ">
    <SideMenu :items="sideMenuItems" />

    <!-- AM-OVERVIEW -->
    <ArtificialModeration
      :AM="AMs.index_top"
      alignment="center"
      :ctx="this"
    />

    <!-- </div> -->
    <div
      v-if="routed_stage && contenttree"
      class="text-vessel"
    >

      <h2>{{routed_stage.stage.title}}</h2>
      <p class="text-body1">{{routed_stage.stage.info}}</p>

      <div
        class="row justify-between"
        v-for="(nodeL1, keyL1)  in mainTopics"
        :key="`L1${nodeL1.id}`"
      >

        <div class="seperator">
          <q-icon name="mdi-star-four-points-outline" />
          <a :name="`ANCHOR${nodeL1.id}`" />
        </div>

        <TextsheetCard
          :level="1"
          :filterTypes="DISCUSSIONTYPES"
          :node="nodeL1"
          :heading_number="(keyL1+1)"
        />

        <div
          class="row justify-between"
          v-for="(nodeL2, keyL2) in filter_entries(nodeL1.children, TEXTTYPES)"
          :key="`L2${nodeL2.id}`"
        >

          <TextsheetCard
            :level="2"
            :filterTypes="DISCUSSIONTYPES"
            :node="nodeL2"
            :heading_number="`${(keyL1+1)}.${(keyL2+1)}`"
          />

          <div
            class="row justify-between"
            v-for="(nodeL3, keyL3) in filter_entries(nodeL2.children, TEXTTYPES)"
            :key="`L3${nodeL3.id}`"
          >

            <TextsheetCard
              :filterTypes="DISCUSSIONTYPES"
              :node="nodeL3"
              :level="3"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- AM-FINAL -->
    <ArtificialModeration
      :AM="AMs.index_bottom"
      alignment="center"
      :ctx="this"
    />

  </q-page>
</template>

<script>
import ContentTreeMixin from "src/mixins/contenttree";
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import TextsheetCard from "./components/TextsheetCard";
// import ArtificialModeratorTEXTSHEETIndexTop from "./artificialmoderation/IndexTop";
// import ArtificialModeratorTEXTSHEETIndexBottom from "./artificialmoderation/IndexBottom";
import AMs from "./ArtificialModeration.js";
import ArtificialModeration from "src/artificial_moderation/ArtificialModeration.vue";
import SideMenu from "src/layouts/components/SideMenu";

import i18nPluginMixin from "./i18n";

export default {
  name: "TextsheetDefault",
  mixins: [ContentTreeMixin, i18nPluginMixin],
  components: {
    ComponentStageEditor,
    TextsheetCard,
    SideMenu,
    ArtificialModeration,
    // ArtificialModeratorTEXTSHEETIndexTop,
    // ArtificialModeratorTEXTSHEETIndexBottom,
  },

  data() {
    return {
      AMs,
      TEXTTYPES: ["PARAGRAPH", "SECTION", "SUBSECTION"],
      DISCUSSIONTYPES: ["COMMENT", "QUESTION"],
      todays_first_visit: null,
      // sideMenuItems: null,
    };
  },

  computed: {
    mainTopics() {
      return this.filter_entries(
        this.contenttree?.structure.children,
        this.TEXTTYPES
      );
    },

    sideMenuItems() {
      if (!this.mainTopics) {
        return [];
      }

      const mainTopicContents = this.mainTopics.map(
        (node) => this.contenttree.entries[node.id]
      );
      return mainTopicContents.map((content) => {
        return {
          label: content.content.title,
          anchor: `ANCHOR${content.content.id}`,
        };
      });
    },
  },

  mounted() {
    this.todays_first_visit = this.is_stage_alerted(this.routed_stage);
    // console.log(this.todays_first_visit, "stage is still alerted?");
    // give milesone
    // TODO: one interaction more, or five seconds more?
    this.milestone("readTextsheet", 10);
  },
};
</script>
