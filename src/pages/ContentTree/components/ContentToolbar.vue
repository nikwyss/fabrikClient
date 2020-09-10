<style>
.q-btn__wrapper{
  padding:0px !important;
}
</style>
<template>
    <div class="q-pa-none full-height" style="float:right;" >

      <q-toolbar class="rounded-borders full-height" > 

        <!-- DELETE -->
        <ContentEditor
            v-if="acl.includes('contribute')"
            :containerID="container.id"
            :model="obj.content"
            :parent_id="obj.content.parent_id"
            @zoom-to-content="$emit('zoomToContent')"
            />
        <q-separator vertical inset />

        <!-- DELETE -->
        <q-btn  
          round dense flat
          v-if="obj.content.delete_permission" 
          @click="deletePrompt(obj.content)"
          class="q-mr-sm"
          :title="obj.content.common_property ? 'Delete this Entry' : 'Subject a Delete Proposal'"
          :icon="obj.content.common_property ? 'mdi-delete-outline' : 'mdi-delete-circle-outline'" />
        <q-separator v-if="obj.content.delete_permission" vertical inset />

        <!-- Track changes -->
        <q-btn  @click="switchTrackChanges" :color="track_changes_color"
          class="q-mr-sm primary red" round dense flat  title="Track changes" :icon="track_changes_icon" />
        <q-separator vertical inset />


        <!-- Background Popup -->
        <q-btn flat round dense icon="mdi-menu" class="q-mr-sm" >
          <q-popup-edit v-model="obj" ref="contentpopup">
              <q-icon 
                name="mdi-close" 
                class="cursor-pointer"
                size="sm"
                style="float:right; padding:0.3em;" 
                @click="$refs.contentpopup.cancel()"/>

            <div class="q-pa-md doc-container" width="400px">
                <q-badge color="blue">Authors</q-badge>
                <div class="row items-start">
                  <div class="col-7">Created</div>
                  <div class="col-5">@APS202 at Monday, 2020</div>
                </div>
                <div class="row items-start">
                  <div class="col-7">Revisions</div>
                  <div class="col-5">
                    @APS202 20.02.2020<br>
                    @EPU111 20.02.2020</div>
                </div>
            </div>
            <div class="q-pa-md doc-container" width="400px">
                <q-badge color="blue">Peer Review</q-badge>
                <div class="row items-start">
                  <div class="col-7">Acceptance:</div>
                  <div class="col-5">70%</div>
                </div>
                <div class="row items-start">
                  <div class="col-7">Reviewers:</div>
                  <div class="col-5">3</div>
                </div>
              </div>
            <div class="q-pa-md doc-container" width="400px">
                <q-badge color="blue">Overall Interactions</q-badge>
                <div class="row items-start">
                  <div class="col-7">Viewed:</div>
                  <div class="col-5">1000x times</div>
                </div>
                <div class="row items-start">
                  <div class="col-7">Open Rating:</div>
                  <div class="col-5">60 times</div>
                </div>
                <div class="row items-start">
                  <div class="col-7">Rate average:</div>
                  <div class="col-5">2.3 (1-3)</div>
                </div>
              </div>
          </q-popup-edit>
        </q-btn>
        <q-separator vertical inset />

        <ContentRating
          v-if="acl.includes('contribute')"
          name="`elRating${obj.content.id}`"
          :content="obj"
        />

      </q-toolbar>
      <!-- </div> -->
  </div>
</template>


<script>
import ContentRating from "./ContentRating";
import ContentEditor from "./ContentEditor"
import ApiService from 'src/utils/xhr'
import { mapActions } from 'vuex'

export default {
    name: "ContentToolbarComponent",
    props:["obj", "acl", "container"],
    components: {ContentRating, ContentEditor},
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

    deletePrompt (content) {
      
      var message = ''
      if (content.common_property) {
        message = 'This is common property. You can submit a Proposal to delete this entry. However, provide a short justification, why do you think deletion is appropriate.'
      } else {
        message = 'This is private property. If you want, you can delete it. However, please provide a short justification.'
      }

      this.$q.dialog({
        title: content.common_property ? 'Submit a Delete-Proposal' : 'Deletion of Private Content' ,
        message: message,
        prompt: {
          model: '',
          isValid: val => val.length > 5, // << here is the magic
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
      let containerID = this.$route.params.containerID
      var identifier = this.$route.params.assemblyIdentifier
      console.assert(identifier);
      let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${identifier}/container/${containerID}/content/${content.id}`
      var data = {'justification': justification}
      ApiService.delete(url, data).then(
        response => {
            console.log("RESPONSE RECEIVED")
            var msg = null

            // ON SUCCESS RESPONSE
            if(response.data.OK) {

              // update the whole tree
              this.add_or_update_contenttree({
                containerID: containerID,
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