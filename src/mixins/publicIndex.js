// import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'

export default {
  computed: {
    ...mapGetters({
      published_assemblies: 'publicindexstore/published_assemblies',
      ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
      IsThereAnAssemblyInPublicState: 'publicindexstore/IsThereAnAssemblyInPublicState',
      IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
      IsUserDelegateOfOngoingAssembly: 'publicindexstore/IsUserDelegateOfOngoingAssembly',
      IsThereNothingGoingOn: 'publicindexstore/IsThereNothingGoingOn'
    })
  },

  mounted: function() {
    this.$store.dispatch('publicindexstore/syncPublicIndex')
  }
}
