<template>
  <!-- class="q-pa-none q-ma-none" -->
  <!-- <div
    style="display:inline-block"
    class="vertical-bottom "
  > -->

  <q-card-section
    vertical
    align="center"
    margin="0px"
    class="q-pa-sm q-ma-none  cursor-pointer"
  >

    <q-btn-toggle
      padding="0px"
      label="Bewertung"
      v-model="progression_rating"
      unelevated
      size="1.4em"
      @input.capture="debouncedInitSet"
      :options="buttons"
    >

      <template
        v-for="button in buttons"
        v-slot:[button.slot]
      >
        <q-icon :name="button.ratingicon">
          <q-tooltip>{{$t(`contenttree.rating.${button.tooltipNr}`)}}</q-tooltip>
        </q-icon>

      </template>

      <!-- <template v-slot:one> -->
      <!-- <div class="row items-center no-wrap full-height"  > -->
      <!-- :name="`mdi-emoticon-sad${(progression_rating==1 ? '' : '')}`" -->
      <!-- <q-icon name="mdi-emoticon-sad-outline">
          <q-tooltip>{{$t('contenttree.rating.1')}} {{ button }}ddd
          </q-tooltip>
        </q-icon>
      </template> -->

      <!-- <template v-slot:two> -->
      <!-- <div class="row items-center no-wrap" style="font-weight:bold;" > -->
      <!-- <q-icon name="mdi-emoticon-neutral-outline">
          <q-tooltip>{{$t('contenttree.rating.2')}}</q-tooltip>
        </q-icon>
      </template>
      <template v-slot:three> -->
      <!-- <div class="row items-center no-wrap"> -->
      <!-- <q-icon name="mdi-emoticon-excited-outline">
          <q-tooltip>{{$t('contenttree.rating.3')}}</q-tooltip>
        </q-icon>
      </template> -->

    </q-btn-toggle>
    <q-card-section class="q-pa-none q-ma-none bg-none">
      Bewertung
    </q-card-section>
  </q-card-section>

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
      buttons: [
        {
          value: 0,
          slot: "one",
          toggleColor: "red",
          textColor: "grey-7",
          ratingicon: "mdi-emoticon-sad-outline",
          tooltipNr: 1,
        },
        {
          value: 50,
          slot: "two",
          toggleColor: "orange",
          textColor: "grey-7",
          ratingicon: "mdi-emoticon-neutral-outline",
          tooltipNr: 2,
        },
        {
          value: 100,
          slot: "three",
          toggleColor: "green",
          textColor: "grey-7",
          ratingicon: "mdi-emoticon-excited-outline",
          tooltipNr: 3,
        },
      ],
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
      console.log("new rating received...", this.progression_rating);
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
