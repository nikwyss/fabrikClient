// import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {

  provide() {
    // can be incected on all child components.
    return {
      clickAssemblyLink: this.clickAssemblyLink
    }
  },

  computed: {
    ...mapGetters({
      published_assemblies: 'publicindexstore/published_assemblies',
      ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
      IsThereAnAssemblyInPublicState: 'publicindexstore/IsThereAnAssemblyInPublicState',
      IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
      IsUserDelegateOfOngoingAssembly: 'publicindexstore/IsUserDelegateOfOngoingAssembly',
      IsThereNothingGoingOn: 'publicindexstore/IsThereNothingGoingOn',
      retrieveCredentials: 'oauthstore/retrieveCredentials',      
    })
  },

  methods: {
    clickAssemblyLink: function (assembly) {
        console.assert(assembly)
        var route = {name: 'assembly_home', params: {assemblyIdentifier: assembly.identifier}}
        this.$router.push(route)
    }
  },

  mounted: function() {
    this.$store.dispatch('publicindexstore/syncPublicIndex')
    
  }
}
