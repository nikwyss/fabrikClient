<style>
/* bg-none */
.q-tree .q-focus-helper {
  background-color: transparent !important;
}
</style>

<template>
  <div class="full-width q-mb-lg">

    <div
      v-if="rootNode.children && rootNode.children.length"
      class="full-width "
      align="right"
    >

      <!-- <q-chip
        :clickable="expanded.length < this.total_nof_contents"
        @click="expand_more"
        :disabled="expanded.length>=this.total_nof_contents"
        align="right"
        icon="mdi-expand-all"
      >
        {{ $t('contenttree.expand_all') }}
      </q-chip> -->

      <q-chip
        :clickable="expanded.length>0"
        @click="expand_none"
        :disabled="expanded.length==0"
        align="right"
        icon="mdi-collapse-all"
      >
        {{ $t('contenttree.collapse_all') }}
      </q-chip>

      <q-chip
        clickable
        @click="expanded_filter = !expanded_filter; filter = expanded_filter ? filter : ''"
        align="right"
        icon="mdi-feature-search"
      >
        {{ $t('contenttree.search_button') }}
      </q-chip>
      <div class="q-gutter-md">
        <q-input
          ref="filter"
          filled
          v-show="expanded_filter"
          v-model="filter"
          :label="$t('contenttree.search_field_label')"
        >
        </q-input>
      </div>
    </div>

    <div v-if="showAM">
      <component
        :is="artificialModerationComponent"
        :AM="AMs.indexTop"
        alignment="left"
        :ctx="this"
      />
    </div>
    <!-- ContentTree Title (optional) -->
    <div
      class="text-h6"
      v-if="label"
    >{{label}}</div>

    <!-- AFTER LOADING -->
    <div
      class="q-pa-none q-ma-none q-gutter-sm"
      v-if="rootNode"
    >
      <span v-if="rootNode.nof_descendants && !hideNofEntriesText">
        {{rootNode.nof_descendants}} Beiträge
      </span>

      <q-tree
        ref="qtree"
        :nodes="rootNode.children"
        label-key="id"
        :expandable="false"
        nodeKey="id"
        icon="mdi-play"
        :expanded.sync="expanded"
        @update:expanded="updateExpanded"
        :filter="filter"
        color="teal-10"
        style="clear:both;"
        :filter-method="treeFilterMethod"
        :no-results-label="$t('contenttree.no_filter_results')"
        :no-nodes-label="hideNoEntryText ? ' ' : $t('contenttree.no_entries')"
      >

        <!-- Content Header -->
        <template
          v-slot:default-header="prop"
          color="red"
        >
          <!-- // TODO: check if we should cache/ref the content on the node.content (in tree structure) -->
          <ContentTreeQTreeHead
            :node="prop.node"
            :content="cachedNode(prop.node.id)"
          />
        </template>

        <!-- Content Body -->
        <template v-slot:default-body="prop">
          <ContentTreeQTreeBody
            :node="prop.node"
            :realRootNodesIDs="realRootNodesIDs"
            :content="cachedNode(prop.node.id)"
          />
        </template>

      </q-tree>

      <!-- EDIT/CREATE FORM -->
      <!-- <ContentEditor
        ref="content_editor"
        :parent_id="rootNodeID"
      /> -->

      <div v-if="IsContributor">
        <component
          :is="ContentEditorComponentLoader"
          ref="content_editor"
          :parent_id="rootNodeID"
        />
      </div>
      <q-separator inset />

      <div
        class="full-width"
        align="right"
      >
        <!-- class="bg-accent" -->
        <q-chip
          v-if="IsContributor"
          icon="mdi-tooltip-plus-outline"
          clickable
          @click="popup_create"
        >
          {{ $t('contenttree.add_comment_or_question') }}
        </q-chip>

        <!-- Disclaimer -->
        <AlgorithmDisclaimer
          :text="disclaimerText"
          v-if="rootNode.nof_descendants > 1"
        />

        <slot name="actions"></slot>

      </div>
    </div>

    <!-- DURING LOADING -->
    <div v-else>
      <q-spinner-rings
        color="primary"
        size="2em"
      />
      <q-tooltip :offset="[0, 8]">Bitte warten. Die Daten werden geladen.</q-tooltip>
    </div>

  </div>
</template>

<script>
import QTreeMixin from "src/mixins/qtree";

// import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";
// import ContentEditor from "./ContentEditor";
import AlgorithmDisclaimer from "src/layouts/components/AlgorithmDisclaimer";
// import UserAvatar from "src/layouts/components/UserAvatar";
import { mapGetters } from "vuex";
// import ContentBackground from "./ContentBackground";
import ContentTreeQTreeHead from "./ContentTreeQTreeHead";
import ContentTreeQTreeBody from "./ContentTreeQTreeBody";
import AMs from "../ArtificialModeration.js";

export default {
  name: "ContentTree",
  props: ["showAM", "hideNoEntryText", "hideNofEntriesText"],
  mixins: [QTreeMixin],
  components: {
    AlgorithmDisclaimer,
    // ContentEditor,
    // ContentToolbar,
    ContentTreeQTreeHead,
    ContentTreeQTreeBody,
    // UserAvatar,
    // ContentBackground,
  },
  provide() {
    return {
      popup_content_form: this.popup_content_form,
    };
  },
  data() {
    return {
      AMs,
      ContentEditorComponentLoader: () => import("./ContentEditor"),
    };
  },
  computed: {
    artificialModerationComponent() {
      return () => import("src/artificial_moderation/ArtificialModeration");
    },

    // real_expanded: function () {
    //   return this.expanded || this.node.children.length == 0;
    // },

    disclaimerText: function () {
      var text = this.$i18n.t("disclaimer.contenttree.basic");

      if (this.rootNode.children.length > 30) {
        text +=
          " " + this.$i18n.t("disclaimer.contenttree.extensionExtraLarge");
      }

      return text;
    },

    ...mapGetters("assemblystore", [
      "IsDelegate",
      "IsExpert",
      "IsContributor",
      "IsObserver",
      "IsManager",
    ]),
  },

  methods: {
    popup_content_form: function (action, model) {
      console.log("popup action " + action);
      this.$refs.content_editor.initialize(action, model);
    },

    popup_create() {
      this.popup_content_form("create", { parent_id: this.rootNodeID });
    },
  },
};
</script>
