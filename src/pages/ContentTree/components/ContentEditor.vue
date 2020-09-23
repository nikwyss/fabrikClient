<template>
<span>
  <q-popup-edit buttons v-model="localmodel" ref="popup_editor"
    auto-save
    v-on:save="saveContent">
    <div class="q-pa-md bg-grey-2">
      <div class="q-gutter-y-md column" style="max-width: 600px">
        <!-- HTML -->
        <b>Title:</b>
        <q-input type="text" v-model="localmodel['title']"
          shadow-text="Enter a short title."
          counter maxlength="60"
          dense autofocus />
        <br />

        <b>Text:</b>
        <q-input 
          v-model="localmodel['text']"
          shadow-text="Outline your idea"
          hint="Please, try to makeshort statements only."
          autogrow
          counter maxlength="300"
          dense />
        
        <br />

        <q-select
          v-if="typeOptions"
          class="q-ma-none"
          style="max-width:270px"
          dense
          dropdown-icon="mdi-menu-down"
          v-model="localmodel['type']"
          :options="typeOptions"
          hint="What kind of content is this?"
          label="Type of Content"
        />
      </div>
    </div>
  </q-popup-edit>
  </span>
</template>

<script>
import ApiService from 'src/utils/xhr'
import { mapActions } from 'vuex'
import Configuration from 'src/utils/configuration'

export default {
  name: 'ContentEditor',
  inject: ['QTREE'],
  // props: {
  //   contenttreeID: { type: Number },
  //   parent_id: {
  //     type: Number,
  //     required: false
  //   },
  //   icon: {
  //     type: String,
  //     default: 'mdi-comment-plus'
  //   },
  //   btnlabel: {
  //     type: String,
  //     default: ''
  //   },
  //   content_type: {
  //     type: String
  //   },
  //   type_options: {
  //     type: Array
  //   },
  //   model: {
  //     type: Object,
  //     default: function () {
  //       // EMPTY CONTENT MODEL as default value
  //       return ({
  //         id: null,
  //         title: '',
  //         text: '',
  //         parent_id: this.parent_id
  //       })
  //     }
  //   }
  // },

  data: function () {
    return {
      localmodel: {
        id: null,
        title: '',
        text: '',
        parent_id: null
      },
      icon: '',
      btnlabel: '',
      contentType: '',
      typeOptions: {}
    }
  },

  methods: {

    setup: function (model, parent_id) {

      if (model) {
        this.localmodel = model
      }

      if (parent_id) {
        this.localmodel.parent_id = parent_id
      }
    },

    saveContent: function(model) {
      console.log("Save content")
      console.assert( QTREE.contenttreeID)
      var identifier = this.$route.params.assemblyIdentifier
      console.assert(identifier)
      let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${identifier}/contenttree/${QTREE.contenttreeID}`
      var create_action = true
      if (model.id) {
          // this is an update
          url += `/content/{model.id}`
          create_action = false
      } else {
          create_action = true
          url += '/addcontent/'
      }
      console.log("Save content2")
 
      ApiService.put(url, {content: model}).then (
        response => {

          console.log(response.data)
          console.log("Model saved")

          // ERROR RESPONSE
          if(response.data.OK) {
            console.log("data received")

            // update the whole tree
            if ('contenttree' in response.data) {
            this.add_or_update_contenttree({
              contenttreeID:  QTREE.contenttreeID,
              contenttree: response.data.contenttree});
            }
            
            // Zoom to newly created entry
            if ('content' in response.data) {
              var editor = this;
              setTimeout(function() {
                console.log("raise Zoomer CONTENT")
                editor.$emit("zoom-to-content", response.data.content)
              }, 75)
            }
          }
          
          this.$q.notify({
            type: response.data.OK ? 'info' : 'error',
            message: `${response.data.MESSAGE}`
          })
        }
      )
    },

    ...mapActions({
      add_or_update_contenttree: 'contentstore/add_or_update_contenttree'
    })
  },

  created: function () {
    if (this.contentType) {
      this.localmodel['type'] = this.contentType
    }
  }
}
</script>
