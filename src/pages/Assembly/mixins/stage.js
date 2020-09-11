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

      // Notify about stage visit
      let data = {
        assembly_identifier: this.assemblyIdentifier, 
        stage_id: this.stageID,
        returnObject: !stage.progression
      }
      this.$store.dispatch('monitorApi', {
        event: this.NotificationStageEntering,
        data: data})

      return(stage)
    },

    ...mapGetters({ 
      get_assembly_stage: 'assemblystore/get_assembly_stage'
    })
  }
}
