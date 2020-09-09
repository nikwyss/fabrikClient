export default {

  computed: {
    stageID: function() {
      return(this.$route.params.stageID)
    },
    assemblyIdentifier: function () {
      return (this.$route.params.assemblyIdentifier)
    }
  },

  mounted: function() {
    // notify statge entry 
    // TODO: shall we prevent too many notifications?
    this.notifyAPI (
      this.NotificationStageEntering,
      {assembly_identifier: this.assemblyIdentifier, stage_id: this.stageID})

    // update stage (as having visited)

  }
}
