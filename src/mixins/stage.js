import { mapGetters } from 'vuex'
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

      if (!this.assembly_stages) {
        console.log('assembly is not yet loaded')
        return (null)
      }

      if (!this.assembly_stages[runtimeStore.stageID]) {
        console.error('invalid stage in this assembly')
        return null
      }

      const stage = this.assembly_stages[runtimeStore.stageID]
      LayoutEventBus.$emit("EventStageLoaded", stage)
      return (stage)
    }

    // ...mapGetters({
    //   get_assembly_stage: 'assemblystore/get_assembly_stage'
    // })
  },

  methods: {

    gotoIndexAndMoveOn: function () {

      // const stageNr = this.assembly_sorted_stages.indexOf(this.stage_nr_last_visited)
      this.markIdle()

      // Goto index and move on!
      // console.log('update stage')
      // console.log('stage has been updated: goto index')
      this.gotoNextStageNr(this.routed_stage)
      this.gotoAssemblyHome()
      // this.scrollToStage()

    },

    markCompleted() {

      // Notify stage as completed
      console.log("COMPLETED: Completed stage!");
      this.$root.monitorFire(constants.MONITOR_STAGE_COMPLETED);
    },

    markIdle() {

      // Notify stage as completed
      console.log("IDLE: Mark as Idle (unalert stage )")
      this.$root.monitorFire(constants.MONITOR_STAGE_IDLE)
    }
  }
}
