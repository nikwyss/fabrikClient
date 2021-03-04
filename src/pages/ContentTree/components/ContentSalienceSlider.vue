<template>

  <!-- :style="{'background-color': backgroundColor}" -->
  <!-- // ContentSalienceSlider -->
  <div
    class="q-pa-md full-width"
    :class="noneResponse ? 'bg-orange-4' : ''"
  >

    Wie wichtig ist Ihnen dieses Thema? Bitte verschieben Sie den Regler.

    <q-list
      dense
      color="orange"
    >

      <q-separator
        inset
        spaced
      />

      <q-item>
        <q-item-section side></q-item-section>

        <q-item-section>
          <q-slider
            v-model="value"
            :min="min"
            :max="max"
            @change="initSet"
            label
            label-always
            :label-value="getSlideLabel"
            :style="{color: getSlideColor}"
          />
        </q-item-section>

        <q-item-section side></q-item-section>

      </q-item>

      <q-separator
        inset
        spaced
      />

    </q-list>
  </div>

</template>

<script>
import { colors } from "quasar";
import { mapActions } from "vuex";
import constants from "src/utils/constants";

const { rgbToHex } = colors;

export default {
  name: "ContentSalienceSlider",
  props: ["content"],
  data() {
    return {
      progression_salience: null,
      min: 0,
      max: 100,
      scaleLabel: [
        "Unwichtig",
        "Eher unwichtig",
        "Mittelmässsig",
        "Eher wichtig",
        "Sehr wichtig",
      ],
    };
  },

  computed: {
    value: {
      get: function () {
        return this.noneResponse ? 50 : this.progression_salience;
      },
      set: function (value) {
        this.progression_salience = value;
      },
    },

    getSlideLabel() {
      if (this.noneResponse) {
        return "Bitte Wählen";
      }
      const value = Math.round(
        (this.scale100 / 100) * (this.scaleLabel.length - 1)
      );
      return this.scaleLabel[value];
    },

    colorRange() {
      return this.max - this.min;
    },

    scale100() {
      return (100 / this.colorRange) * (this.progression_salience - this.min);
    },

    getSlideColor() {
      if (this.noneResponse) {
        return "grey";
      }

      // const color = rgbToHex({
      //   b: Math.round(this.scale100*2.5),
      //   g: 202,
      //   r: 60,
      // })

      const color = rgbToHex({
        r: Math.round(this.scale100 * 2.24),
        g: Math.round(this.scale100 * 2.02),
        b: 60,
      });
      return color;
    },
    // rgb(224, 202, 60, 0.25)
    noneResponse() {
      return (
        this.progression_salience === null ||
        this.progression_salience === undefined
      );
    },
  },

  methods: {
    initSet() {
      // INIT Salience Monitor
      const data = {
        contentID: this.content.content.id,
        salience: this.progression_salience,
      };
      this.$root.monitorLog(constants.MONITOR_SET_SALIENCE, data);

      // immediatly update saliences in vuex store (=> allows to update the dynamically generated charts)
      this.update_salience({
        contenttreeID: this.content.content.contenttree_id,
        contentID: this.content.content.id,
        salience: this.progression_salience,
      });
    },

    ...mapActions("contentstore", ["update_salience"]),
  },

  mounted: function () {
    this.progression_salience = this.content?.progression?.salience;
  },
};
</script>
