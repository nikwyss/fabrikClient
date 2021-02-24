<template>

 <!-- :style="{'background-color': backgroundColor}" -->
  <div class="q-pa-md full-width" :class="noneResponse ? 'bg-orange-4' : 'bg-grey-1'">
<!-- {{oauth.userid}} {{ progression_salience}} -->
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
      @change="initSetSalience"
      label
      label-always
      :label-value="getSlideLabel"
      :style="{color: getSlideColor}"
    />
      <!-- :label-value="model + 'px'" -->
      <!-- @input.capture="getSlideLabel(progression_salience)" -->

        </q-item-section>
        <q-item-section side>
          <!-- <q-icon name="mdi-volume_up" /> -->
        </q-item-section>
      </q-item>

      <q-separator inset spaced />

    </q-list>

  </div>

  
        <!-- <q-tooltip>{{$t('contenttree.salience.1')}}</q-tooltip> -->
</template>

<script>
import RatingMixin from "../mixins/rating"
import { colors } from 'quasar'
import constants from 'src/utils/constants'

const { rgbToHex } = colors

export default {
  name: "ContentSalienceSlider",
  mixins: [RatingMixin],
  data: function() {
    return({
        apiTimer: null,
        min: 0,
        max: 100,
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
          return this.noneResponse ? 0 : this.progression_salience
      },        
      set: function (value) { 
          this.progression_salience = value
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
        return 100 / this.colorRange * (this.progression_salience-this.min)
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
      return this.progression_salience === null || this.progression_salience === undefined
    }
  },

  methods: {

    
    initSetSalience() {

      // interrupt previoius saveSalience actions
      // clearInterval(this.apiTimer)      
      // Save salience with a 3 second lag. (To prevent high frequent api requests..)
      // const apiCall = () => this.setSalience(this.progression_salience, true)
      // this.apiTimer = setTimeout(apiCall, 3000)

      // INIT Salience Monitor
      const data = {
        contentID: this.content.content.id,
        salience: this.progression_salience
      }
      this.$root.monitorLog(constants.MONITOR_SET_SALIENCE, data)


      // immediatly update saliences in vuex store (=> allows to update the dynamically generated charts)
      console.log("update local storage => salience")
      this.update_salience({
        contenttreeID: this.content.content.contenttree_id, 
        contentID: this.content.content.id, 
        salience: this.progression_salience })
    }
  }
}
</script>
