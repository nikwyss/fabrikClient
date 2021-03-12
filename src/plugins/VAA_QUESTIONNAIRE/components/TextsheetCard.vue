<template>
  <!-- , bgcolor ? `bg-${bgcolor}` : '' -->
  <span :class="['full-width']">

    <span
      v-on:click.stop
      v-if="standalone"
      style="float:right;"
    >
      <ContentToolbar
        :obj="item"
        @afterdeletion="openIndex()"
      >
      </ContentToolbar>
    </span>

    <q-card
      class="q-ma-none full-width"
      flat
      v-if="item"
    >
      <q-card-section class="full-width q-px-none">
        <div :class="['full-width', color ? `text-${color}` : '']">
          <div :class="header_class">
            <q-icon
              :name="heading_icon"
              size="56px"
              v-if="heading_icon"
            />
            {{heading_number}} {{item.content.title}}
          </div>
          <div
            class="text-body1 text-justify"
            v-if="item.content.text"
            v-dompurify-html="item.content.text"
          />
        </div>
      </q-card-section>
    </q-card>

    <DefaultDiscussionBlock
      :item="item"
      :discussionBlockLabel="discussionBlockLabel"
      :comments="comments"
    />
    <!-- :artificialmoderationComponents="artificialmoderationComponents"  -->

  </span>
</template>


<script>
// import { Fragment } from 'vue-fragment'
import ContentRatingThumbs from "src/pages/ContentTree/components/ContentRatingThumbs";
import ContentEditor from "src/pages/ContentTree/components/ContentEditor";
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";
// import ComponentContentTree from "src/pages/ContentTree/components/ContentTree"
import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock";

export default {
  name: "TextsheetCard",
  props: [
    "item",
    "standalone",
    "heading_number",
    "comments",
    "discussionBlockLabel",
    "color",
    "bgcolor",
    "heading_icon",
  ],
  // questions added for debigging : is it still usefukk?
  components: {
    ContentRatingThumbs,
    ContentEditor,
    ContentToolbar,
    DefaultDiscussionBlock,
  },
  data() {
    return {
      show_discussion: false,
      // hover_discussion: false, // TODO: this?
      // artificialmoderationComponents: {
      //   ContentTreeIndex: () => import('src/pages/ContentTree/artificialmoderation/ArtificialModeratorDefaultContentTreeIndex.vue')
      // }
    };
  },
  computed: {
    header_class: function () {
      switch (this.item.content.type) {
        case "SECTION":
          return "text-h5";
        case "SUBSECTION":
          return "text-h6";
        case "PARAGRAPH":
          return "text-h7";
        case "VAA_TOPIC":
          return "text-h3";
        default:
          return "text-h5";
      }
    },

    rootNode: function () {
      // TODO: add nof_descendants to this node object
      // TODO extract this in method...
      var node = {
        children: this.comments,
        id: this.item.content.id,
      };
      return node;
    },
  },
};
</script>
