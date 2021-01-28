import { mapGetters } from 'vuex'
import AssemblyMixin from 'src/mixins/assembly'

export default {

  mixins: [AssemblyMixin],

  computed: {

    stageID: function () {
      return (this.$route.params.stageID)
    },

    stage: function () {

      console.log(this.assemblyIdentifier)

      const stage = this.get_assembly_stage({
        assemblyIdentifier: this.assemblyIdentifier,
        stageID: this.stageID
      }
      )

      return (stage)
    },

    ...mapGetters({
      get_assembly_stage: 'assemblystore/get_assembly_stage'
    })
  },

  methods: {

    monitorApi: function () {
      /* By this method we allow the API to monitor user activities */
      console.log("monitor stage api")
      // Monitor about stage visit
      let data = {
        assembly_identifier: this.assemblyIdentifier,
        stage_id: this.stageID
      }
      // console.log('HHHH')
      this.$store.dispatch('monitorApi', {
        event: this.Constants.MONITOR_STAGE_ENTERING,
        data: data,
        key: parseInt(this.stageID)
      })
    }
  }
}
