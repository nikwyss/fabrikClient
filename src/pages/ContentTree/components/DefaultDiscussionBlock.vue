<template>
  <div v-if="CONTENTTREE.contenttree">
      <div align="right">
        <q-btn v-if="!!item.content.text" 
          flat
          align="right"
          @click="toggleDiscussion"
          text-color="grey-7"
          :class="[show_discussion ? 'bg-grey-1' : '']"
          :icon="show_discussion ? 'mdi-comment' : 'mdi-comment-outline'"
          size="md"
        >
          <q-badge v-if="comments.length && nof_descendants_unread" color="red" floating>{{nof_descendants_unread}}</q-badge> 
          <q-tooltip v-if="!show_discussion" anchor="top left" self="bottom left">{{$t('contenttree.comment_section_tooltip')}}</q-tooltip>
          <q-tooltip v-if="show_discussion" anchor="top left" self="bottom left">{{$t('contenttree.close_comment_section_tooltip')}}</q-tooltip>
          &nbsp;{{ discussionBlockLabel ? discussionBlockLabel : 'Fragen und Kommentare'}} {{nof_descendants ? `(${nof_descendants})` : ''}}
        </q-btn>
      </div>

      
      <transition name="fade">
        <ComponentContentTree
          class="q-pa-md col-12 bg-grey-1"
          v-if="show_discussion"
          :startingNode="startingNode"
          :dense="true"
          :customStartingNodes="comments"
          :customStartingParentID="item.content.id"
          :customLimitNodeTypes="['COMMENT', 'QUESTION', 'ANSWER']"
          :hideNoEntryText="true"
          :hideNofEntriesText="true"
          :artificialmoderationComponents="artificialmoderationComponents"
        >
          <template v-slot:actions>
            <!-- Close when possible -->
            <q-chip clickable @click="show_discussion = false" align="right" icon="mdi-close">
                {{ $t('contenttree.close_comment_section') }}
            </q-chip>
          </template>
        </ComponentContentTree>
      </transition>

    </div>
</template>

<script>

import ComponentContentTree from "src/pages/ContentTree/components/ContentTree"
import constants from 'src/utils/constants';


export default {
  name: 'DefaultDiscussionBlock',
  components: { ComponentContentTree },
  props: ['artificialmoderationComponents', 'item' , 'comments', 'startingNode', 'discussionBlockLabel'],
  data: function() {
    return({
        show_discussion: false
    })
  },

  inject: ['openIndex', 'CONTENTTREE'],

  computed: {

    nof_descendants_unread: function () {
      // summ up descendants_unread of the root elements
      const that = this
      const counting = function (node) {
        if (Number.isInteger(node)) {return (node)}
        return (that.CONTENTTREE.isRead(that.CONTENTTREE.contenttree.entries[node.id])
                + node.nof_descendants_unread)
      }
      var nof_descendants_unread = this.comments.reduce(function(prev, cur) {
        return (counting(prev) + counting(cur))
      }, 0)
      return (nof_descendants_unread)
    },

    nof_descendants: function () {
      if (!this.comments?.length){
        return 0
      }
      const nof_descendants = this.comments.reduce(function (accumulator, child) {
        return accumulator + child.nof_descendants;
      }, 0);
      return (nof_descendants + this.comments.length)
    }    
  },
  methods: {
    toggleDiscussion() {
      this.show_discussion = !this.show_discussion
      const extra = {content_id: this.item.content.id}
      if (this.show_discussion) {
        this.$root.monitorLog(constants.MONITOR_DISCUSSION_SHOW, extra)
      }else{
        this.$root.monitorLog(constants.MONITOR_DISCUSSION_HIDE, extra)
      }
    }
  }
}
</script>
