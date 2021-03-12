<template>
  <div v-if="CONTENTTREE.contenttree">
    <a :name="`CONTENTTREE${CONTENTTREE.contenttree.id}`" />
    <div align="right">
      <q-btn
        v-if="!!entry.content"
        flat
        align="right"
        @click="toggleDiscussion"
        text-color="grey-7"
        :class="[show_discussion ? 'bg-grey-1' : '']"
        :icon="show_discussion ? 'mdi-comment' : 'mdi-comment-outline'"
        size="md"
      >
        <q-badge
          v-if="childrenNodes.length && nof_descendants_unread"
          color="red"
          floating
        >{{nof_descendants_unread}}</q-badge>
        <q-tooltip
          v-if="!show_discussion"
          anchor="top left"
          self="bottom left"
        >{{$t('contenttree.comment_section_tooltip')}}</q-tooltip>
        <q-tooltip
          v-if="show_discussion"
          anchor="top left"
          self="bottom left"
        >{{$t('contenttree.close_comment_section_tooltip')}}</q-tooltip>
        &nbsp;{{ discussionBlockLabel ? discussionBlockLabel : 'Fragen und Kommentare'}} {{nof_descendants ? `(${nof_descendants})` : ''}}
      </q-btn>
    </div>

    <transition name="fade">
      <ComponentContentTree
        class="q-pa-xs full-width bg-grey-1"
        v-if="show_discussion"
        :node="node"
        :dense="true"
        :filterTypes="['COMMENT', 'QUESTION', 'ANSWER']"
        :hideNoEntryText="true"
        :showAM="showAM"
        :hideNofEntriesText="true"
      >
        <template v-slot:actions>
          <!-- Close when possible -->
          <q-chip
            clickable
            @click="toggleDiscussion"
            align="right"
            icon="mdi-close"
          >
            {{ $t('contenttree.close_comment_section') }}
          </q-chip>
        </template>
      </ComponentContentTree>
    </transition>

  </div>
</template>

<script>
import ComponentContentTree from "src/pages/ContentTree/components/ContentTree";
import constants from "src/utils/constants";

export default {
  name: "DefaultDiscussionBlock",
  components: { ComponentContentTree },
  props: ["showAM", "node", "filterTypes", "discussionBlockLabel"],
  data() {
    return {
      show_discussion: false,
    };
  },

  inject: [
    "openIndex",
    "CONTENTTREE",
    "filter_entries",
    "isRead",
    "recalculate_nof_descendants_unread",
    "recalculate_nof_descendants",
  ],

  computed: {
    entry() {
      return this.CONTENTTREE.contenttree.entries[this.node.id];
    },

    childrenNodes() {
      if (this.filterTypes) {
        return this.filter_entries(this.node.children, this.filterTypes);
      }
      return this.node.children;
    },

    /**
     * Recalculate metrics considering the fitlers...
     * NOTE: this assumes, that once filtered children do not have unexcepted descendant types..
     */
    nof_descendants_unread: function () {
      return this.recalculate_nof_descendants_unread(this.childrenNodes);
    },

    nof_descendants: function () {
      return this.recalculate_nof_descendants(this.childrenNodes);
    },
  },
  methods: {
    toggleDiscussion() {
      // scroll To element above the discussion
      if (this.show_discussion) {
        this.$root.scrollToAnchor(
          `CONTENTTREE${this.CONTENTTREE.contenttree.id}`,
          0
        );
      }

      // Toggle Discussion
      this.show_discussion = !this.show_discussion;

      // Monitor action
      const extra = { content_id: this.entry.content.id };
      if (this.show_discussion) {
        this.$root.monitorLog(constants.MONITOR_DISCUSSION_SHOW, extra);
      } else {
        this.$root.monitorLog(constants.MONITOR_DISCUSSION_HIDE, extra);
      }
    },
  },
};
</script>
