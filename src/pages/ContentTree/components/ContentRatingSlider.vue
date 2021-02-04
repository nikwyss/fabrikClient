<template>

 <!-- :style="{'background-color': backgroundColor}" -->
  <div class="q-pa-md full-width" :class="noneResponse ? 'bg-orange-1' : 'bg-blue-1'">

    <!-- <q-badge color="secondary">
    </q-badge> -->
      Wie wichtig ist Ihnen dieses Thema? Bitte verschieben Sie den Regler.

    <q-list dense color="orange">


      <q-separator inset spaced />

      <q-item>
        <q-item-section side>
          <!-- <q-icon name="volume_down" /> -->
        </q-item-section>
        <q-item-section>
          <!-- `rgb(${(100 - percent) *2.56}, ${percent *2.56},0)`} -->
    <q-slider
      v-model="value"
      :min="min"
      :max="max"
      @change="startSetRatingTimer"
      label
      label-always
      :label-value="getSlideLabel"
      :style="{color: getSlideColor}"
    />
      <!-- :label-value="model + 'px'" -->
      <!-- @input.capture="getSlideLabel(progression_rating)" -->

        </q-item-section>
        <q-item-section side>
          <!-- <q-icon name="mdi-volume_up" /> -->
        </q-item-section>
      </q-item>

      <q-separator inset spaced />

    </q-list>

  </div>

  
        <!-- <q-tooltip>{{$t('contenttree.rating.1')}}</q-tooltip> -->
</template>

<script>
import RatingMixin from "../mixins/rating"
import { colors } from 'quasar'
const { rgbToHex } = colors

export default {
  name: "ContentRatingSlider",
  mixins: [RatingMixin],
  data: function() {
    return({
        min: -50,
        max: +50,
        scaleLabel: [
          'Unwichtig',
          'Eher unwichtig',
          'Mittelmässsig',
          'Eher wichtig',
          'Sehr wichtig'
        ],
    })
  },

  computed: {

    value: {
      get: function() {
          return this.noneResponse ? 0 : this.progression_rating
      },        
      set: function (value) { 
          this.progression_rating = value
      }
    },

    getSlideLabel() {
      if (this.noneResponse){
        return "Bitte Wählen"
      }
      const value = Math.round(this.scale100 / 100 *  (this.scaleLabel.length-1))
      return this.scaleLabel[value]
    },
    
    colorRange() {
      return (this.max-this.min)
    },

    scale100() {
        return 100 / this.colorRange * (this.progression_rating-this.min)
    },

    getSlideColor() {
      if (this.noneResponse){
        return "grey"
      }

      const color = rgbToHex({
        b: Math.round(this.scale100*2.55),
        g: 50,
        r: 50,
      })
      return color
    },

    noneResponse() {
      return this.progression_rating === null || this.progression_rating === undefined
    }
  },
  methods: {
    startSetRatingTimer() {
      console.log('start timer,')
    }
  }
}
</script>
