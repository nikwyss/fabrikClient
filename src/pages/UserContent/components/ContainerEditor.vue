<template>
  <span class="cursor-pointer" style="margin-top:1em;">
    <q-banner dense inline-actions class="text-white bg-green">
      <div v-if="model['id']"><q-icon name="mdi-circle-edit-outline" color="white" style="font-size: 1.3rem;" />Your are allowed to modify this Container. Click on "Modify".</div>
      <div v-if="!model['id']"><q-icon name="mdi-shape-circle-plus" color="white" style="font-size: 1.3rem;" />Your are allowed to add an additional Container. Click on "Add".</div>

      <template v-slot:action>
        <q-btn flat color="white" :label="model['id'] ? 'Modify' : 'Add'" />
      </template>
    </q-banner>

    <q-popup-edit v-model="localmodel"
              @save="save"
              ref="popupeditor"
              :persistent="persistent"
              :label-set="localmodel['id'] ? 'Speichern' : 'Hinzufügen'"
              :validate="validate">

       <!-- <q-btn flat label="cancel" dense icon="mdi-close-box-outline" style="float:right" @click.stop="$refs['popupeditor'].cancel()" /> -->
        <div style="float:right">
        <q-btn flat label="cancel" dense size="lg" icon="mdi-close" @click.stop="$refs['popupeditor'].cancel()" />
        <q-btn flat label="save" dense size="lg" icon="mdi-check"  @click.stop="$refs['popupeditor'].set()" />
        </div>


       <h3 v-html="localmodel['id'] ? 'Container bearbeiten' : 'Fügen Sie einen neuen Container hinzu'" />

        <div class="bg-grey-2 q-mt-lg" >
        <div class="q-gutter-y-md column q-pa-md" style="width: 100%">

          <q-input type="text"
            v-model="localmodel['title']" dense
            autofocus
            label="Label (Public &amp; Required)"
            :error="errorTitle"
            :error-message="errorMessageTitle"/>

          <div v-if="errorInfo" class="red-5 q-field--error text-negative"><div class="q-field__messages col"><div>{{errorMessageInfo}}</div></div></div>
          <q-editor 
            v-model="localmodel['info']" min-height="5rem" 
            label="Description (Public &amp; Required)"
            placeholder="Please add a short description what this container is about!"
            autofocus @keyup.enter.stop />

          <q-select
            v-if="!localmodel['id'] && assembly_configuration"
            dense
            style="max-width:270px"
            dropdown-icon="mdi-menu-down"
            v-model="localmodel['type']"
            :options="Object.keys(assembly_configuration.container_types)"
            label="Please Choose a Container Type (Required)"
            :error="errorContainerType"
            :error-message="errorMessageContainerType"
          />

        <q-input type="text"
            v-model="localmodel['icon']" dense
            autofocus
            hint="If you like, you may indicate a beautiful Icon. Choose a icon identifier of the https://materialdesignicons.com library. (requires full page reload)"
            label="Icon Identifier (Optional)"
            :error="errorIcon"
            :error-message="errorMessageIcon"/>

          <br />

          <q-select
            class="q-ma-none"
            style="max-width:270px"
            dense
            dropdown-icon="mdi-menu-down"
            v-model="localmodel['order_position']"
            :options="order_position_options"
            hint="At which Position should this container be placed?"
            label="Order Position (Default: Last Item)"
          />


        <b>Starting Date  {{localmodel['date_start'] | formatDate}}</b>
        <div v-if="!localmodel['date_start']">{{'The citizenmodul is now enabeled'}}</div>
        <div>
          <q-btn class="q-ma-none" v-if="!show_date_start_selector" flat :label="'Set a starting date'" dense size="md" icon="mdi-calendar-range" @click.stop="show_date_start_selector=true" />
          <q-btn v-if="show_date_start_selector" flat :label="'Remove the starting date.'" dense size="md" icon="mdi-close" @click.stop="show_date_start_selector=false; localmodel['date_start'] = null" />
        </div>
        <div v-if="show_date_start_selector" class="q-gutter-md row items-start">
          <q-date v-model="localmodel['date_start']" mask="YYYY-MM-DDTHH:mm" color="green" />
          <q-time v-model="localmodel['date_start']" mask="YYYY-MM-DDTHH:mm" color="green" />
        </div>

        <b>Assembly Ends: {{localmodel['date_end'] | formatDate}}</b>
        <div v-if="!localmodel['date_end']">{{'The duration of the citizenmodul is unlimited'}}</div>
        <div>
          <q-btn class="q-ma-none" v-if="!show_date_end_selector" flat :label="'Set a ending date'" dense size="md" icon="mdi-calendar-range" @click.stop="show_date_end_selector=true" />
          <q-btn v-if="show_date_end_selector" flat :label="'Remove the ending date.'" dense size="md" icon="mdi-close" @click.stop="show_date_end_selector=false; localmodel['date_end'] = null" />
        </div>
        <div v-if="show_date_end_selector" class="q-gutter-md row items-start">
          <q-date v-model="localmodel['date_end']" mask="YYYY-MM-DDTHH:mm" color="purple" />
          <q-time v-model="localmodel['date_end']" mask="YYYY-MM-DDTHH:mm" color="purple" />
        </div>


        <q-toggle
          class="q-ma-none q-mt-md"
          v-model="localmodel['disabled']"
          :false-value="false"
          :true-value="true"
          checked-icon="mdi-airplane-off"
          color="red"
          label="Should this container be disabled?"
          unchecked-icon="mdi-airplane"
        />

          <div v-if="localmodel['id']">
          <b>Additional Information:</b><br>
          Last Modification: {{localmodel['date_last_tree_modification'] | formatDate}}<br>
          Created: {{localmodel['date_last_tree_modification'] | formatDate}}
          </div>
        </div>

        <div style="float:left">
        <q-btn flat label="delete" dense size="lg" icon="mdi-delete" @click.stop="confirm_delete" />
        <!-- <q-btn label="Confirm" color="primary" @click="confirm" /> -->
        </div>
        
        <div style="float:right">
        <q-btn flat label="cancel" dense size="lg" icon="mdi-close" @click.stop="$refs['popupeditor'].cancel()" />
        <q-btn flat label="save" dense size="lg" icon="mdi-check"  @click.stop="$refs['popupeditor'].set()" />
        </div>
      </div>

    </q-popup-edit>
  </span>
</template>

<script>
import ApiService from "src/utils/xhr";
import ContentTreeMixin from "../mixins/contenttree"
import {mapActions} from 'vuex'

export default {
  name: "ContainerEditor",
  mixins: [ContentTreeMixin],
  props: {
    persistent: {
      type: Boolean,
      default: function () { return (true) }
    },
    model: {
      type: Object,
      default: function(){
        // EMPTY CONTAINER MODEL as default value
        return({
          id: null,
          title:'',
          order_position: this.order_position,
          disabled: false,
          type: '',
          info: '',
          NEW: true
        })
      }
    }
  },

  data: function() {
    return {
      show_date_start_selector: !!this.model['date_start'],
      show_date_end_selector: !!this.model['date_end'],
      localmodel: this.model,
      errorContainerType: false,
      errorMessageContainerType: '',
      errorInfo: false,
      errorMessageInfo: '',
      errorTitle: false,
      errorMessageTitle: '',
      errorIcon: '',
      errorMessageIcon: '',
    };
  },
  computed: {
    container_count: function(){
      return(this.assembly_containers ? Object.keys(this.assembly_containers).length+1: 0)
    },

    order_position_options: function(){
      let options = [...Array(this.container_count).keys()]
      options = options.map(x => {var rObj = {}; rObj['label'] = (x); rObj['value'] = (x); return rObj;})
      return(options)
    },
  },

  methods: {

    validate() {
      var has_error = false
      this.errorInfo = false
      this.errorMessageInfo = ''
      this.errorIcon = false
      this.errorMessageIcon = ''
      this.errorContainerType = false
      this.errorMessageContainerType = ''

      if (!this.localmodel['type']) {
        this.errorContainerType = true
        this.errorMessageContainerType = 'The field must not be empty!'
        has_error = true
      }

      if (!this.localmodel['info']){
        this.errorInfo = true
        this.errorMessageInfo = 'The field must not be empty!'
        has_error = true
      }

      if (!this.localmodel['title']){
        this.errorTitle = true
        this.errorMessageTitle = 'Please add a title!'
        has_error = true
      }
      return (!has_error)
    },

    save: function(localmodel){
        console.log("Save Container")
        var identifier = this.assembly.identifier
        console.assert(identifier);

        // update fields
        console.log(this.localmodel)
        if(!this.localmodel['order_position']){
          this.localmodel['order_position'] = this.container_count + 1
        }

        let url = process.env.VUE_APP_APISERVER_URL+'/assembly/' + identifier + '/container'
        if(localmodel['id']){
          // MODIFY
          url += '/' + localmodel['id']
        }

        ApiService.put(url, {container: localmodel}).then(
            response => {
              this.syncstorecontainer(response.data)

              // since order of containers could have change: 
              // we also have to update the assembly.
              this.add_or_update_assembly(response.data.assembly)
            }
        )
    },

    confirm_delete: function () {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: 'Would you like to delete this container? Only Administrators can restore the data.',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.delete()
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    delete: function (localmodel) {
        console.log("DELETE Container")
        var identifier = this.assembly.identifier
        console.assert(identifier)

        // update fields
        let url = process.env.VUE_APP_APISERVER_URL+'/assembly/' + identifier + '/container'
        url += '/' + this.localmodel['id']

        ApiService.delete(url).then(
            response => {
              // we have to update the assembly. (it contains a list of containers)
              this.add_or_update_assembly(response.data.assembly)
              this.$refs['popupeditor'].cancel()
            }
        )
    },

    ...mapActions({
        add_or_update_assembly: 'assemblystore/add_or_update_assembly'
    })
  }
}
</script>
