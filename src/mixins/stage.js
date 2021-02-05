import { mapGetters } from 'vuex'
import AssemblyMixin from 'src/mixins/assembly'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
// import { LayoutEventBus } from 'src/utils/eventbus'
import { runtimeStore } from "src/store/runtime.store"

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

    /** Get Stage from StageID transmitted in the URL  */
    // routed_stage_id: function () {
    //   console.log(runtimeStore.stageID, "RUNTIME")
    //   return (this.$route.params.stageID)
    // },

    routed_stage: function () {
      console.assert(runtimeStore.stageID)

      if (!this.get_assembly_stage(runtimeStore.stageID)) {
        console.log('assembly is not yet loaded')
        return null
      }

      // const stage = this.assembly_stages[runtimeStore.stageID]
      // LayoutEventBus.$emit("NewStageEntered", {
      //   assemblyIdentifier: this.assemblyIdentifier,
      //   stage: this.assembly_stages[runtimeStore.stageID]
      // })
      return (this.assembly_stages[runtimeStore.stageID])
    },

    ...mapGetters({
      get_assembly_stage: 'assemblystore/get_assembly_stage'
    })
  },

  methods: {
    gotoIndexAndMoveOn: function () {
      // const stageNr = this.assembly_sorted_stages.indexOf(this.stage_nr_last_visited)
      console.log('update stage')
      this.gotoNextStageNr(this.routed_stage)
      console.log('stage has been updated: goto home')
      this.gotoAssemblyHome()
      // this.scrollToStage()

    },

    monitorApi: function () {
      if (runtimeStore.stageID) {
        this.monitorApiStage()

      } else {
        this.monitorApiAssembly()
      }
    },

    monitorApiStage: function () {
      /* By this method we allow the API to monitor user activities */

      console.log("monitor stage api")
      console.assert(runtimeStore.stageID)

      // Monitor about stage visit
      let data = {
        assembly_identifier: this.assemblyIdentifier,
        stage_id: runtimeStore.stageID
      }
      this.$store.dispatch('monitorApi', {
        event: this.Constants.MONITOR_STAGE_ENTERING, data
        // ,
        // key: parseInt(runtimeStore.stageID)
      })
    }
  }


  // mounted: function () {


  // }
}
