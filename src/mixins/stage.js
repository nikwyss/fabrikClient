import { mapGetters, mapActions } from 'vuex'
import AssemblyMixin from 'src/mixins/assembly'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { LayoutEventBus } from 'src/utils/eventbus'
import { runtimeStore } from "src/store/runtime.store"
import constants from 'src/utils/constants'

export default {

  mixins: [
    AssemblyMixin,
    ReactiveProvideMixin({
      name: 'STAGE',
      include: ['routed_stage'],
    })
  ],
  provide() {
    return {
      gotoIndexAndMoveOn: this.gotoIndexAndMoveOn
    }
  },

  computed: {

    routed_stage: function () {
      console.log("get routed_stage", runtimeStore.stageID)

      if (!this.assembly_stages) {
        console.log('assembly is not yet loaded')
        return (null)
      }

      if (!this.assembly_stages[runtimeStore.stageID]) {
        console.error('invalid stage in this assembly')
        this.gotoAssemblyHome()
        return null
      }

      const stage = this.assembly_stages[runtimeStore.stageID]

      // console.error('stage found', stage)
      LayoutEventBus.$emit("EventStageLoaded", stage)
      return (stage)
    },

    ready() {
      // console.log("stage loaded.... ", !!this.routed_stage?.stage?.id);
      return !!this.routed_stage?.stage?.id;
    },

    // ...mapGetters({
    //   stageMilestonesCompleted: "assemblystore/stageMilestonesCompleted"
    // })

    ...mapGetters("assemblystore", [
      "stageMilestonesCompleted",
      "is_stage_alerted"
    ]),

  },

  methods: {

    milestone: function (milestoneLabel, weight) {
      console.assert(this.routed_stage)
      console.log("WEIGHT", weight)
      this.addMilestone({ label: milestoneLabel, weight })
      console.log("Is stageMilestonesCompleted?")
      if (this.stageMilestonesCompleted) {
        // ignore this statement...
        if (this.is_stage_alerted(this.routed_stage)) {
          this.markUnAlert();
        }
        return;
      }

    },

    gotoIndexAndMoveOn: function () {
      this.gotoNextStageNr(this.routed_stage)
      this.gotoAssemblyHome()
    },

    markUnAlert() {
      // Notify stage as completed
      console.log("IDLE: unalert stage")
      console.assert(this.routed_stage)
      this.$root.monitorLog(constants.MONITOR_STAGE_UNALERT)
      this.storeStageProgressionAlertFlag({ stageID: this.routed_stage_id, alerted: false })
    },

    ...mapActions("assemblystore", [
      "storeStageProgressionAlertFlag",
      "addMilestone"
    ]),
  }
}
