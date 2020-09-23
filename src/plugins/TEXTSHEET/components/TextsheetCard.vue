<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  height: 0px;
}
</style>
<template>
  <div class="full-width">

    <span v-on:click.stop v-if="standalone" style="float:right;">
      <ContentToolbar
        :obj="item"
        @afterdeletion="openIndex()">
      </ContentToolbar>
    </span>

    <q-card class="q-ma-none full-width"  flat v-if="item">
      <q-card-section class="full-width" >
        <div class="col-12" >
          <div class="q-mt-lg q-mb-xs" :class="header_class">{{heading_number}} {{item.content.title}}</div>
          <div class="text-body1 text-justify" v-if="item.content.text" v-html="$sanitize(item.content.text)"/>
        </div>
      </q-card-section>
    </q-card>

    <div align="right">
      <q-btn v-if="!!item.content.text" 
        flat
        align="right"
        @click="show_discussion = !show_discussion"
        text-color="grey-7"
        :class="[show_discussion ? 'bg-grey-3' : '']"
        :icon="show_discussion ? 'mdi-comment' : 'mdi-comment-outline'"
        size="md"
      >
        <q-badge color="red" v-if="comments.length" floating>{{comments.length}}</q-badge> 
        <q-tooltip anchor="top left" self="bottom left">{{$t('contenttree.comment_section_tooltip')}}</q-tooltip>
                &nbsp;{{'Fragen und Kommentare'}}
      </q-btn>
    </div>

    <transition name="fade">
      <ComponentContentTree
        class="q-pa-md col-12 bg-grey-3"
        v-if="show_discussion"
        :dense="true"
        :customStartingNodes="this.comments"
        :customStartingParentID="item.content.id"
        :hideNoEntryText="true"
        :hideNofEntriesText="true"
        :hideAddNewEntryButton="true"
        :artificialmoderationComponents="artificialmoderationComponents"
      />
    </transition>
  </div>
</template>

<script>
import ContentRating from "src/pages/ContentTree/components/ContentRating"
import ContentEditor from "src/pages/ContentTree/components/ContentEditor"
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar"
import ComponentContentTree from "src/pages/ContentTree/components/ContentTree"

export default {
  name: 'TextsheetCard',
  props: ['item', 'standalone', 'heading_number', 'comments'],
  inject: ['openIndex'],
  components: { ContentRating, ContentEditor, ContentToolbar, ComponentContentTree},
  data: function() {
    return({
        show_discussion: false,
        // hover_discussion: false, // TODO: this?
        artificialmoderationComponents: {
          ContentTreeIndex: () => import('../artificialmoderation/ArtificialModeratorContentTreeIndex')
        }
    })
  },
  computed: {
    header_class: function() {
      switch (this.item.content.type) {
        case 'SECTION':
          return('text-h4')
        case 'SUBSECTION':
          return('text-subtitle1')
        case 'PARAGRAPH':
          return('text-subtitle2')
      }
    }
  }
}
</script>
