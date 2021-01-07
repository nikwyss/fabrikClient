// import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {
  include: ['IsUserDelegateOfOngoingAssembly'],
  provide() {
    // can be incected on all child components.
    return {
      clickAssemblyLink: this.clickAssemblyLink
    }
  },

  computed: {
    
    IsUserDelegateOfOngoingAssembly() {

      // data not yet loaded
      if (this.ongoing_assemblies === null) {
        return (null)
      }

      // Check if there is at least one ongoing assembly.
      if (this.ongoing_assemblies.length === 0) {
        return (false)
      }

      // Check permissions:
      const compare_func = this.oauth.acls
      let accessibleAssemblies = Object.filter(this.ongoing_assemblies, x => compare_func(x.identifier))
      return (Object.values(accessibleAssemblies).length > 0)
    },

    ...mapGetters({
      published_assemblies: 'publicindexstore/published_assemblies',
      ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
      IsThereAnAssemblyInPublicState: 'publicindexstore/IsThereAnAssemblyInPublicState',
      IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
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
