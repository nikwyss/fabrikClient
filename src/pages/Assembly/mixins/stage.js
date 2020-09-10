import {mapGetters} from 'vuex'
import AssemblyMixin from "src/pages/Assembly/mixins/assembly"

export default {
  mixins: [AssemblyMixin],
  
  computed: {
    stageID: function() {
      return(this.$route.params.stageID)
    },
    assemblyIdentifier: function () {
      return (this.$route.params.assemblyIdentifier)
    },

    stage: function() {
      console.assert(this.assembly)

      if(!this.stageID) {
        return(null)
      }

      if(!this.assemblyIdentifier) {
        return(null)
      }

      // has contentree already be cached in the vues store??
      var stage = this.get_assembly_stage({
        assemblyIdentifier: this.assemblyIdentifier,
        stageID: this.stageID})
  
      if(!stage) {
          // Not yet loaded. please wait
          return(null)
      }

      // CHECK IF API SHOULD BE NOTIFIED
      console.log("STAGE")
      
      let please_notify =  (!('progression' in stage) ||
          !stage.progression ||
          this.check4OutdatedData(stage.progression.last_accessed, this.NotificationFrequency))

      if (please_notify) {
        this.notifyAPI (
          this.NotificationStageEntering,
          {assembly_identifier: this.assemblyIdentifier, stage_id: this.stageID}
        )
      }

      return(stage)
    },

    ...mapGetters({ 
      get_assembly_stage: 'assemblystore/get_assembly_stage'
    })
  }
}
