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
import RatingMixin from "../mixins/rating"

export default {
  name: "ContentRatingThumbs",
  mixins: [RatingMixin],
  data: function () {
    return {
      // TODO: do we need zero as starting value?
      progression_rating: 0,

    };
  }
}
</script>
