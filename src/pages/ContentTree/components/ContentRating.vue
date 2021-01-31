<template>
  <q-btn-toggle
    stack
    flat
    padding="0px"
    class="q-pa-none q-ma-none"
    color="brown"
    :value="progression_rating"
    @input.capture="setRating"
    :options="[
          {value: 1, slot: 'one', toggleColor:'red', textColor:'grey-5'},
          {value: 2, slot: 'two', toggleColor:'orange', textColor:'grey-5'},
          {value: 3, slot: 'three', toggleColor:'green', textColor:'grey-5'}
        ]"
  >
    <template v-slot:one>
      <!-- <div class="row items-center no-wrap full-height"  > -->
      <q-icon
        rounded
        flat
        :name="`mdi-emoticon-sad${(progression_rating==1 ? '' : '')}`"
        class="q-pa-none q-ma-none"
        style="width:0.7em"
        size="lg"
      >
        <q-tooltip>{{$t('contenttree.rating.1')}}</q-tooltip>
      </q-icon>
    </template>
    <template v-slot:two>
      <!-- <div class="row items-center no-wrap" style="font-weight:bold;" > -->
      <q-icon
        rounded
        flat
        :name="`mdi-emoticon-neutral${(progression_rating==2 ? '' : '')}`"
        style="width:0.7em"
        size="lg"
      >
        <q-tooltip>{{$t('contenttree.rating.2')}}</q-tooltip>
      </q-icon>
    </template>
    <template v-slot:three>
      <!-- <div class="row items-center no-wrap"> -->
      <q-icon
        rounded
        flat
        :name="`mdi-emoticon-excited${(progression_rating==3 ? '' : '')}`"
        style="width:0.7em"
        size="lg"
      >
        <q-tooltip>{{$t('contenttree.rating.3')}}</q-tooltip>
      </q-icon>
    </template>
  </q-btn-toggle>
</template>

<script>
import { mapActions } from "vuex";
import ApiService from "src/utils/xhr";
// import Configuration from 'src/utils/configuration'

export default {
  name: "ContentRating",
  props: ["content"],
  data: function () {
    return {
      progression_rating: 0,
    };
  },
  methods: {
    setRating: function (rating) {
 
      console.log("set rating...");
      console.assert(rating !== null && rating !== undefined);
      console.assert(this.content.content.id);
      var identifier = this.$route.params.assemblyIdentifier;
      console.assert(identifier);
      this.progression_rating = rating;

      let url = `${process.env.ENV_APISERVER_URL}/assembly/${identifier}/content/${this.content.content.id}/rating/${rating}`;
      console.log(url);
      console.log("xhr request");
      const message = this.$i18n.t('contenttree.rating_response')          
      ApiService.get(url).then((response) => {
        // store changed contents to vuex
        if (response.data.OK) {
          console.log("rating received");
          console.log(response.data);
          if (response.data.modified_contents) {
            this.update_contents({
              modifiedContents: response.data.modified_contents,
            });
          }
        }

        console.log("rating response? ", response.data.OK)
        this.$q.notify({
          type: response.data.OK ? "nFabrikInfo" : "nFabrikError",
          message: message,
        });
      });
    },

    ...mapActions({
      update_contents: "contentstore/update_contents",
    }),
  },

  mounted: function () {
    this.progression_rating =
      this.content && this.content.progression
        ? this.content.progression.rating
        : 0;
  },
};
</script>
