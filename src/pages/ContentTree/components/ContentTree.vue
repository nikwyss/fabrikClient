<style>
/* bg-none */
.q-tree .q-focus-helper {
  background-color: transparent !important;
}
</style>

<template>
  <div class="full-width q-mb-lg">

    <div
      v-if="startingContentNode.children && startingContentNode.children.length"
      class="full-width "
      align="right"
    >

      <q-chip
        :clickable="expanded.length < this.total_nof_contents"
        @click="expand_more"
        :disabled="expanded.length>=this.total_nof_contents"
        align="right"
        icon="mdi-expand-all"
      >
        {{ $t('contenttree.expand_all') }}
      </q-chip>

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

    <br />
    <q-separator inset />

    <!-- AM-ContentTree Index -->
    <div class="q-mb-xl full-width">
      <component
        v-if="artificialmoderationComponents && 'ContentTreeIndex' in artificialmoderationComponents"
        :is="artificialmoderationComponents.ContentTreeIndex"
        :startingContentNode="startingContentNode"
        :ongoing="!startingContentNode || oauth.authorized === null"
        align="left"
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
      v-if="startingContentNode"
    >

      <span v-if="startingContentNode.nof_descendants && !hideNofEntriesText">
        {{startingContentNode.nof_descendants}} Beiträge
      </span>

      <q-tree
        ref="qtree"
        :nodes="startingContentNode.children"
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

          <div
            @click.stop
            @keypress.stop
            :style="'cursor:default; border-top:5px solid white;' + (is_expandable(prop.node) ? 'background-color: #F7F7F7;' : '')"
            class='full-width q-pt-md q-pb-md q-pr-sm q-pl-sm text-overline  vertical-top'
          >
            <div
              :class="[prop.node.nof_descendants ? 'cursor-pointer' : '']"
              @click="toggle_node(prop.node.id)"
            >
              <!-- <q-icon name="mdi-comment-outline" size="xs" /> -->
              <UserAvatar
                v-if="cachedNode(prop.node.id).creator"
                :profile="cachedNode(prop.node.id).creator"
              >
                <template v-slot:extrainfos>
                  {{cachedNode(prop.node.id).content.date_created | formatDate}}
                </template>
              </UserAvatar>

              <q-badge
                color="grey"
                class="cursor-pointer q-ma-sm vertical-top"
                transparent
                @click.stop="$refs.backgroundDialog.toolbar = true"
                v-if="is_currently_expanded(prop.node) !== false"
              >
                <q-tooltip>Schauen Sie sich zusätzliche <br>Informationen zu diesem Beitrag an.</q-tooltip>
                Info
              </q-badge>

              <span class="cursor-pointer float-right ">
                <span
                  flat
                  v-if="is_expandable(prop.node)"
                >
                  {{ is_currently_expanded(prop.node) ? 'EINKLAPPEN' : 'AUSKLAPPEN' }}
                  <q-tooltip>Schauen Sie sich zusätzliche <br>Informationen zu diesem Beitrag an.</q-tooltip>
                </span>

              </span>

              <ContentBackground
                v-if="IsObserver"
                ref="backgroundDialog"
                name="`elBackground${obj.content.id}`"
                :obj="cachedNode(prop.node.id)"
              />

            </div>
            <q-badge
              color="blue"
              v-if="!real_expanded"
              align="top"
            >click to see {{prop.node.nof_descendants}} more</q-badge>
          </div>
        </template>

        <!-- Content Body -->
        <template v-slot:default-body="prop">
          <q-card
            flat
            class="full-width bg-none"
          >
            <q-card-section :style="!is_expandable(prop.node) && rootNodeIDs.includes(prop.node.id) ? 'margin-left:1.4em' : ''">
              <div class="text-h5">{{ cachedNode(prop.node.id).content.title }}</div>
              <div class="text-caption text-grey-9">
                {{ cachedNode(prop.node.id).content.text }}
              </div>

              <!-- <span class="text-bold "> {{ cachedNode(prop.node.id).content.title }} ({{ cachedNode(prop.node.id).content.type }})</span><br> -->
              <!-- {{ cachedNode(prop.node.id).content.text }} -->
              <!-- style="margin-bottom:0.5em"  -->
            </q-card-section>

            <!-- <q-separator /> -->

            <!-- <q-card-actions v-if="IsContributor"> -->
            <!-- <q-card-actions align="right"> -->
            <!-- <ContentRatingThumbs
                name="`elRating${obj.content.id}`"
                :content="cachedNode(prop.node.id)"
              /> -->
            <ContentToolbar
              :obj="cachedNode(prop.node.id)"
              v-if="IsContributor"
            />

            <!-- </q-card-actions> -->
          </q-card>

          <!-- <div
            size="text-body1"
            class="q-mb-lg"
            :style="!prop.node.nof_descendants && rootNodeIDs.includes(prop.node.id) ? 'margin-left:1.5em' : ''"
          > -->

          <!-- <span class="text-bold "> {{ cachedNode(prop.node.id).content.title }} ({{ cachedNode(prop.node.id).content.type }})</span><br>
            {{ cachedNode(prop.node.id).content.text }} -->
          <!-- style="margin-bottom:0.5em"  -->
          <!-- 
            <div
              class="q-pa-null q-ma-null"
              v-if="IsContributor && is_currently_expanded(prop.node) !== false"
              align="right"
            >
              <ContentRatingThumbs
                name="`elRating${obj.content.id}`"
                :content="cachedNode(prop.node.id)"
              />
              <ContentToolbar :obj="cachedNode(prop.node.id)" />

            </div> -->

          <!-- </div> -->
        </template>
      </q-tree>

      <!-- EDIT/CREATE FORM -->
      <ContentEditor
        ref="content_editor"
        v-if="IsContributor"
        :parent_id="startingContentID"
      />

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
          v-if="startingContentNode.nof_descendants > 1"
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
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";
import ContentEditor from "./ContentEditor";
import AlgorithmDisclaimer from "src/layouts/components/AlgorithmDisclaimer";
import UserAvatar from "src/layouts/components/UserAvatar";
import { mapGetters } from "vuex";
import ContentBackground from "./ContentBackground";

export default {
  name: "ContentTree",
  props: [
    "artificialmoderationComponents",
    "hideNoEntryText",
    "hideNofEntriesText",
  ],
  mixins: [QTreeMixin],
  components: {
    AlgorithmDisclaimer,
    ContentEditor,
    ContentToolbar,
    // ContentRatingThumbs,
    UserAvatar,
    ContentBackground,
  },
  provide() {
    return {
      popup_content_form: this.popup_content_form,
    };
  },

  computed: {
    real_expanded: function () {
      return this.expanded || this.node.children.length == 0;
    },

    disclaimerText: function () {
      var text = this.$i18n.t("disclaimer.contenttree.basic");

      if (this.startingContentNode.children.length > 30) {
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
      this.popup_content_form("create", { parent_id: this.startingContentID });
    },
  },
};
</script>
