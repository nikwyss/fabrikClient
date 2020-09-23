<template>
    <q-btn-toggle  full-height
        dense
        :value="progression_rating"
        color="brown"
        @input.capture="setRating"
        flat
        :options="[
            {value: 1, slot: 'one', toggleColor:'red', textColor:'grey-7'},
            {value: 2, slot: 'two', toggleColor:'orange', textColor:'grey-7'},
            {value: 3, slot: 'three', toggleColor:'green', textColor:'grey-7'}
        ]">
        <template v-slot:one>
            <div class="row items-center no-wrap full-height"  >
            <q-icon rounded stretch flat
                :name="`mdi-emoticon-sad${(progression_rating==1 ? '' : '-outline')}`"
                class="q-pd-md" size="md"/>
            </div>
        </template>
        <template v-slot:two>
            <div class="row items-center no-wrap" style="font-weight:bold;" >
            <q-icon rounded stretch flat
                :name="`mdi-emoticon-neutral${(progression_rating==2 ? '' : '-outline')}`"
                class="q-pd-md" size="md"/>
            </div>
        </template>
        <template v-slot:three>
            <div class="row items-center no-wrap">
            <q-icon rounded stretch flat 
            :name="`mdi-emoticon-excited${(progression_rating==3 ? '' : '-outline')}`"
            class="q-pa-none"  size="md"/>
            </div>
        </template>
    </q-btn-toggle>
</template>

<script>

import {mapActions} from 'vuex'
import ApiService from "src/utils/xhr";
import Configuration from 'src/utils/configuration'

export default{
    name: "ContentRating",
    props: ["content"],
    data: function() {
        return {
            progression_rating: 0
        }
   },
    methods: {

    setRating: function(rating) {
    console.log("set rating...")
    // Load contenttree from scratch
    console.assert(rating !== null && rating !== undefined)
    console.assert(this.content.content.id)
    var identifier = this.$route.params.assemblyIdentifier
    console.assert(identifier);
    this.progression_rating = rating

    let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${identifier}/content/${this.content.content.id}/rating/${rating}`
    console.log(url)
    console.log("xhr request")
    ApiService.get(url).then(

        response => {
          // store changed contents to vuex
          if(response.data.OK) {
              console.log("rating received")

              // this.syncContentTree({
              //     assembly: response.data.contenttree,
              //     contenttree: response.data.contenttree})
              
              console.log(response.data)
              if (response.data.modified_contents) {
                this.update_contents({modifiedContents: response.data.modified_contents})
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
      update_contents: 'contentstore/update_contents'
    }),
  },

  mounted: function() {
    this.progression_rating = this.content && this.content.progression ? this.content.progression.rating : 0
  }
}

</script>
