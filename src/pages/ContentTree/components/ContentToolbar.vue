<style>
.q-btn__wrapper{
  /* padding:0px !important; */
}
</style>
<template>
  <div class="q-pa-none" style="">

    <q-toolbar shrink class="rounded-borders q-pr-none">

      <!-- REPLY BUTTON -->
      <q-btn 
        flat
        @click="popup_create"
        round
        color="primary"
        icon="mdi-reply-outline">
        <q-tooltip>{{obj.content.common_property ? $t('contenttree.toolbar.reply_proposal') : $t('contenttree.toolbar.reply')}}</q-tooltip>
      </q-btn>

      <!-- EDIT BUTTON -->
      <q-btn
        padding="0px"
        flat
        @click="popup_edit"
        round
        v-if="obj.content.edit_permission"
        color="primary"
        icon="mdi-playlist-edit">
        <q-tooltip>{{obj.content.common_property ? $t('contenttree.toolbar.edit_proposal') : $t('contenttree.toolbar.edit')}}</q-tooltip>
      </q-btn>

      <!-- DELETE -->
      <q-btn  
        padding="0px"
        round dense flat
        size="sm"
        v-if="obj.content.delete_permission"
        @click="deletePrompt(obj.content)"
        :icon="obj.content.common_property ? 'mdi-delete-outline' : 'mdi-delete-circle-outline'" 
      >
        <q-tooltip>{{obj.content.common_property ? $t('contenttree.toolbar.delete_proposal') : $t('contenttree.toolbar.delete')}}</q-tooltip>
      </q-btn>      
      <!-- <q-separator v-if="obj.content.delete_permission" vertical inset /> -->

      <!-- Track changes -->
      <!-- <q-btn  @click="switchTrackChanges" :color="track_changes_color"
        size="sm"
        class="q-mr-sm primary red" round dense flat  title="Track changes" :icon="track_changes_icon">
        <q-tooltip>{{$t('contenttree.toolbar.track_changes')}}</q-tooltip>
      </q-btn> -->

      <!-- <q-separator vertical inset /> -->

      <ContentBackground
        v-if="ABLY.assembly_acls.includes('observe')"
        name="`elBackground${obj.content.id}`"
        :obj="obj"
      />

      <!-- <ContentRating
        v-if="ABLY.assembly_acls.includes('contribute')"
        name="`elRating${obj.content.id}`"
        :content="obj"
      /> -->

    </q-toolbar>
  </div>
</template>


<script>
// import ContentRating from "./ContentRating";
import ContentBackground from "./ContentBackground";
// import ContentEditor from "./ContentEditor"
import ApiService from 'src/utils/xhr'
import { mapActions } from 'vuex'

export default {
    name: "ContentToolbarComponent",
    props:["obj"],
    components: {ContentBackground},
    inject: ['ABLY','QTREE', 'contenttreeID', 'popup_content_form'],  // is injecting ctree needed: only for contenttree_id, right?
    data () {
        return {
            confirm_deletion: false,
            confirm_deletion_content: null,
            confirm_deletion_justification: '',
            confirm_deletion_justification_error: false,
            confirm_deletion_justification_error_message: '',
            track_changes: this.obj.progression ? this.obj.progression.track_changes : false
        }
    },

    computed: {
      track_changes_icon: function() {
        return(this.track_changes ? "mdi-bookmark-remove" : "mdi-bookmark-plus-outline")
      },
      track_changes_color: function() {
        return(this.track_changes ? "brown-9" : "grey-6")
      }
    },

   methods: {

    popup_edit() {
      this.popup_content_form('edit', this.obj.content)
    },

    popup_create() {
      this.popup_content_form('reply', {parent_id: this.obj.content.id})
    },

    deletePrompt (content) {
      
      var message = ''
      if (content.common_property) {
        message = 'This is common property. You can submit a Proposal to delete this entry. However, provide a short justification, why do you think deletion is appropriate.'
      } else {
        message = 'This is private property. If you want, you can delete it. However, please provide a short justification.'
      }

      this.$q.dialog({
        title: content.common_property ? this.$i18n.t('contenttree.toolbar.submit_delete_proposal') : this.$i18n.t('contenttree.toolbar.delete'),
        message: message,
        prompt: {
          model: '',
          isValid: val => val.length > 3, // << here is the magic
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.deleteEntry(content, data)
      })
    },

    // LOAD TREE
    // TODO: move deleteentry to contenttre.js
    deleteEntry(content, justification) {
      console.log("deleteEntry")
      var identifier = this.$route.params.assemblyIdentifier
      console.assert(identifier);
      let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${identifier}/contenttree/${QTREE.contenttreeID}/content/${content.id}`
      var data = {'justification': justification}
      ApiService.delete(url, data).then(
        response => {
            console.log("RESPONSE RECEIVED")
            var msg = null

            // ON SUCCESS RESPONSE
            if(response.data.OK) {

              // update the whole tree
              this.add_or_update_contenttree({
                contenttreeID: QTREE.contenttreeID,
                contenttree: response.data.contenttree})

              // Zoom to parent entry (if catched)
              console.log("raise after-deletion (if catched in parent component)")
              this.$emit("afterdeletion")
          }

          this.$q.notify({
            type: response.data.OK ? 'info' : 'error',
            message: `${response.data.MESSAGE}`
          })
        }
        )
    },

    validateConfirmDeletion() {

      var has_error = false
      this.confirm_deletion_justification_error_message = ''
      this.confirm_deletion_justification_error = false

      if (!this.confirm_deletion_justification || this.confirm_deletion_justification.length < 5) {
        this.confirm_deletion_justification_error = true
        this.confirm_deletion_justification_error_message = 'Please indicate why you want to delete this entry. What is wrong with it?'
        has_error = true
      }

      return (!has_error)
    },

    switchTrackChanges: function() {
      this.track_changes = !this.track_changes
      // TODO: IMPLEMENT
      //this.$emit('setTrackChanges', this.node, this.track_changes)

      var msg = ''
      if(this.track_changes) {
        msg = "You become notified about activities on this place"
      }else{
        msg = "Notifcation is disabled"
      }        

      // if(response.data.OK) {
      // this.$q.notify({
      //   type: response.data.OK ? 'info' : 'error',
      //   message: `${response.data.MESSAGE}`
      // })

      this.$q.notify({
          type: 'info',
          message: `${msg}`
      })
    },
    
    ...mapActions({
      add_or_update_contenttree: 'contentstore/add_or_update_contenttree'
    })

  }
}
</script>