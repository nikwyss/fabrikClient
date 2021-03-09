<template>
  <span>

    <q-btn-toggle
      stack
      flat
      padding="0px"
      class="q-pa-none q-ma-none"
      color="brown"
      v-model="progression_rating"
      @input.capture="debouncedInitSet"
      :options="[
          {value: 0, slot: 'one', toggleColor:'red', textColor:'grey-5'},
          {value: 50, slot: 'two', toggleColor:'orange', textColor:'grey-5'},
          {value: 100, slot: 'three', toggleColor:'green', textColor:'grey-5'}
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
  </span>
</template>

<script>
import { mapActions } from "vuex";
import { debounce } from "quasar";
import constants from "src/utils/constants";

export default {
  name: "ContentRatingThumbs",
  props: ["content"],
  data() {
    return {
      // TODO: do we need zero as starting value?
      progression_rating: 50,
    };
  },

  computed: {
    noneResponse() {
      return (
        this.progression_rating === null ||
        this.progression_rating === undefined
      );
    },
  },

  methods: {
    initSet() {
      const data = {
        contentID: this.content.content.id,
        rating: this.progression_rating,
      };
      this.$root.monitorLog(constants.MONITOR_SET_RATING, data);

      // immediatly update saliences in vuex store (=> allows to update the dynamically generated charts)
      // console.log("update local storage => rating")
      this.update_rating({
        contenttreeID: this.content.content.contenttree_id,
        contentID: this.content.content.id,
        rating: this.progression_rating,
      });
    },

    ...mapActions("contentstore", ["update_rating"]),
  },

  created() {
    this.debouncedInitSet = debounce(this.initSet, 1200);
  },

  mounted: function () {
    if (this.content && this.content.progression) {
      this.progression_rating = this.content.progression.rating;
    }
  },
};
</script>
