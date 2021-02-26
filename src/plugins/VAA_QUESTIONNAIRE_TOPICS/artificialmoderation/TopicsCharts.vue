<template>
  <div
    class="justify-center center"
    v-if="STAGE.routed_stage"
  >

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator
      alignment="left"
      role="1"
      amGroup='textsheetPage'
      :ongoing="!STAGE.routed_stage"
    >

      <template v-if="!CONTENTTREE.salienceCompleted">
        Bitte bewerten Sie alle Themen. Dann können wir weiterfahren!
      </template>

      <template v-else-if="CONTENTTREE.salienceCompleted">
        Sind sie mit Ihrer Priorisierung vorerst mal einverstanden?
      </template>

      <template v-slot:actions>
        <q-chip
          v-if="CONTENTTREE.salienceCompleted"
          icon-right="mdi-arrow-up"
          clickable
          @click="$router.anchor('SALIENCE')"
        >
          Ich möchte noch Änderungen vornehmen.
        </q-chip>
        <q-chip
          v-if="CONTENTTREE.salienceCompleted"
          clickable
          icon-right="mdi-arrow-down"
          label="Ja, wir können weiterfahren!"
          @click="$router.anchor('FORUM')"
        />
      </template>
    </ArtificialModerator>
  </div>
</template>

<script>
import ArtificialModerator from "src/components/ArtificialModerator";
import { mapGetters } from "vuex";

export default {
  name: "ArtificialModeratorTopicsCharts",
  computed: {
    ...mapGetters("assemblystore", ["is_stage_last"]),
  },
  inject: ["gotoIndexAndMoveOn", "STAGE", "CONTENTTREE"], // see provide attribute in the antecedents
  components: { ArtificialModerator },
};
</script>
