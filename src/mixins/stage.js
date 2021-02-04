import { mapGetters } from 'vuex'
import AssemblyMixin from 'src/mixins/assembly'
import { ReactiveProvideMixin } from 'vue-reactive-provide'


export default {

  mixins: [
    AssemblyMixin,
    ReactiveProvideMixin({
      name: 'STAGE',
      include: ['routed_stage_id', 'routed_stage'],
    })
  ],
  provide() {
    return {
      gotoIndexAndMoveOn: this.gotoIndexAndMoveOn
    }
  },


  computed: {

    /** Get Stage from StageID transmitted in the URL  */
    routed_stage_id: function () {
      return (this.$route.params.stageID)
    },

    routed_stage: function () {
      console.assert(this.routed_stage_id)

      if (!this.assembly_stages) {
        console.log('assemmbly is not yet loaded')
        return null
      }

      console.log("STAGE IS LOADED", this.routed_stage_id)
      return (this.assembly_stages[this.routed_stage_id])
    },

    ...mapGetters({
      assembly_stages: 'assemblystore/assembly_stages'
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
      /* By this method we allow the API to monitor user activities */
      console.log("monitor stage api")
      // Monitor about stage visit
      let data = {
        assembly_identifier: this.assemblyIdentifier,
        stage_id: parseInt(this.routed_stage_id)
      }
      this.$store.dispatch('monitorApi', {
        event: this.Constants.MONITOR_STAGE_ENTERING, data
        // ,
        // key: parseInt(this.routed_stage_id)
      })
    }
  }
}
