<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<template>
  <q-page class="doc_content side_menu">

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

    <!-- TOPIC SELECTION -->
    <div class="q-pt-xl text-vessel">
      <!-- <h3>Themenwahl</h3> -->

      <h2>Smartvote Fragebogen</h2>

      <VAATopicSelector
        @input="selectTopic"
        :topicID="topicID"
      />

    </div>

    <!-- QUESTIONS -->
    <transition name="fade">
      <div
        class="q-pt-xl text-vessel"
        v-if="topic && detailView"
      >
        <!-- transition-show="jump-down"
        transition-hide="jump-up"         -->

        <div class="row justify-between">
          <div class="seperator">
            <q-icon name="mdi-star-four-points-outline" />
          </div>
        </div>

        <!-- <h2>Smartvote Fragen zum Thema {{topic.content.title}}</h2> -->

        <!-- <ArtificialModeratorQUESTIONSTop align="left" /> -->

        <!-- QUESTIONS -->
        <div
          class="row justify-between"
          v-for="(nodeL1, keyL1)  in node.children"
          :key="`L1${nodeL1.id}`"
        >

          <TextsheetCard
            :level="1"
            :discussionBlockLabel="`Forum zum Thema '${contenttree.entries[nodeL1.id].content.title}'`"
            :comments="filter_entries(nodeL1.children, ['COMMENT', 'QUESTION'])"
            :heading_number="(keyL1+1)"
            :item="contenttree.entries[nodeL1.id]"
          />

          <!-- RATING -->
          <!-- <ContentSalienceSlider :content="contenttree.entries[nodeL1.id]" /> -->
        </div>

        <div class="row justify-between">
          <div class="seperator">
            <q-icon name="mdi-star-four-points-outline" />
          </div>
        </div>

        <!-- <ArtificialModeratorQUESTIONSBottom align="left" /> -->
        <!-- RESULT -->
        <!-- <div v-if="ratingCompleted"> -->
        <!-- <h2>Resultat</h2> -->
        <!-- <div class="row justify-between q-pt-xl"><ChartBar :personalData="chartBarPersonalData" :labels="chartBarLabels" />
        </div> -->

      </div>
    </transition>
  </q-page>
</template>


<script>
import ContentMixin from "src/mixins/content";
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import VAATopicSelector from "./components/TopicSelector";
import ContentSalienceSlider from "src/pages/ContentTree/components/ContentSalienceSlider";
import ArtificialModeratorQUESTIONSTop from "./artificialmoderation/QuestionsTop";
import ArtificialModeratorQUESTIONSBottom from "./artificialmoderation/QuestionsBottom";
import TextsheetCard from "./components/TextsheetCard";
import { runtimeStore } from "src/store/runtime.store";
import SideMenu from "src/layouts/components/SideMenu";

export default {
  name: "VAAQuestions",
  mixins: [ContentMixin],
  data: () => {
    return {
      detailView: true,
      sideMenuItems: [
        {
          label: "Themenwahl",
          anchor: "TOPICSELECTION",
        },
        {
          label: "Bewertung",
          anchor: "RATING",
        },
        {
          label: "Forum",
          anchor: "FORUM",
        },
        {
          label: "Moderation",
          anchor: "MODERATION",
        },
      ],
    };
  },
  components: {
    ComponentStageEditor,
    VAATopicSelector,
    ContentSalienceSlider,
    TextsheetCard,
    SideMenu,
    ArtificialModeratorQUESTIONSTop,
    ArtificialModeratorQUESTIONSBottom,
  },

  computed: {
    // sortedChartEntries() {
    //     const children = this.contenttree.structure.children
    //     const entries = children.map(child => this.contenttree.entries[child.id])
    //     return Object.values(entries).sort((a, b) => a.progression.rating > b.progression.rating ? -1 : a.progression.rating > b.progression.rating ? 1 : 0)
    // },
    // chartBarPersonalData() {
    //     return this.sortedChartEntries.map(entry => entry.progression?.rating+50)
    // },
    // chartBarLabels() {
    //     return this.sortedChartEntries.map(entry => entry.content?.title)
    // }
  },

  methods: {
    selectTopic(topicID) {
      // First, set to null, for content container to hide and fade-in again..
      this.detailView = false;
      this.topicID = topicID;

      const route = {
        name: topicID
          ? "VAA_QUESTIONNAIRE_QUESTIONS_ENTRY"
          : "VAA_QUESTIONNAIRE_QUESTIONS",
        params: {
          contentID: topicID,
          stageID: runtimeStore.stageID,
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
        },
      };
      this.$router.pushI(route);

      setTimeout(() => {
        this.detailView = true;
      }, 200);
    },
  },
};
</script>
