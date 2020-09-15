<template>
<Fragment>
  
    <span v-on:click.stop v-if="standalone" style="float:right;">
      <ContentToolbar
        :obj="item"
        :acl="acl"
        :stage="stage"
        @afterdeletion="openIndex()">
      </ContentToolbar>
    </span>

    <q-card class="q-ma-none full-width"  flat v-if="item">
      <q-card-section horizontal class="full-width ">
        <div class=" col-11">
          <div class="q-mt-lg q-mb-xs" :class="header_class">{{heading_number}} {{item.content.title}}</div>
          <div class="text-body1 text-justify" v-if="item.content.text" v-html="$sanitize(item.content.text)"/>
          <!-- <q class="L T">Die Demokratiefabrik legt grossen Wert auf Sicherheit und Datenschutz.</q> -->
        </div>

        <q-card-actions class=" col-1" align="right">
          <q-btn  @click="show_discussion=!show_discussion" dense text-color="purple" round 
              icon="mdi-comment-outline" size="sm" class="">
            <q-badge color="red" v-if="comments.length" floating>{{comments.length}}</q-badge>
          </q-btn>
          <!-- <q-btn @click="show_discussion=!show_discussion" dense text-color="green" round icon="mdi-help-circle-outline" class=""  size="sm">
            <q-badge color="red" v-if="questions.length" floating>{{questions.length}}</q-badge>
          </q-btn> -->
        </q-card-actions>
      
      </q-card-section>

    </q-card><br>

    <ComponentContentTree
      v-if="show_discussion"
      :acl="acl"
      class="bg-grey-3 q-pa-md col-10 q-ml-xl "
      :dense="true"
      label="Offene Diskussion"
      :stage="stage.stage" 
      :contenttree="contenttree" 
      :custom_starting_node="startingContent_node" 
    /> 
  </Fragment>
</template>


<script>
import { Fragment } from 'vue-fragment'
import ContentRating from "src/pages/ContentTree/components/ContentRating"
import ContentEditor from "src/pages/ContentTree/components/ContentEditor"
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar"
import ComponentContentTree from "src/pages/ContentTree/components/ContentTree"

export default {
  name: 'TextsheetCard',
  props: ['stage','contenttree', 'item', 'acl', 'standalone', 'heading_number', 'questions', 'comments'],
  components: { Fragment, ContentRating, ContentEditor, ContentToolbar, ComponentContentTree},
  data: function() {
    return({
        show_discussion: false
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
    },

    startingContent_node: function() {
      var node = {children: this.comments}
      return(node)
    }
  },

  methods: {

    

    openIndex: function(parent_id) {

      console.log("redirect to pros_and_cons_index")

      // REDIRECT TO ARGUMENT PAGE
      var identifier = this.$route.params.assemblyIdentifier
      this.$router.push({name: 'TEXTSHEET', params: {
        assemblyIdentifier: identifier,
        stageID: this.stage.id }})
    },

    openArgument: function() {

      if (this.standalone) {
        return
      }

      // REDIRECT TO ARGUMENT PAGE
      // console.log(this.item)
      var identifier = this.$route.params.assemblyIdentifier
      this.$router.push({name: 'TEXTSHEET_CONTENT', params: {
        assemblyIdentifier: identifier,
        stageID: this.stage.id,
        contentID: item.content.id
      }})
    }
  }
}
</script>
