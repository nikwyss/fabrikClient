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
      <q-card-section class="full-width q-px-none" >
        <div class="col-12" >
          <div :class="header_class">{{heading_number}} {{item.content.title}}</div>
          <div class="text-body1 text-justify" v-if="item.content.text" v-dompurify-html="item.content.text"/>
        </div>
      </q-card-section>
    </q-card>


    <DefaultDiscussionBlock 
      :item="item" 
      :discussionBlockLabel="discussionBlockLabel"
      :artificialmoderationComponents="artificialmoderationComponents" 
      :comments="comments" />
  </div>
</template>

<script>
// import ContentRatingThumbs from "src/pages/ContentTree/components/ContentRatingThumbs"
// import ContentEditor from "src/pages/ContentTree/components/ContentEditor"
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar"
import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock"

export default {
  name: 'TextsheetCard',
  props: ['item', 'standalone', 'heading_number', 'comments', 'discussionBlockLabel'],
  inject: ['openIndex', 'CONTENTTREE'],
  components: { DefaultDiscussionBlock, ContentToolbar},
  data () {
    return({
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
          return('text-h4 q-mt-lg q-mb-xs')
        case 'SUBSECTION':
          return('text-subtitle1 q-mt-sm q-mb-xs')
        case 'PARAGRAPH':
          return('text-subtitle2 q-mt-none q-mb-xs')
      }
    }    
  }
}
</script>
