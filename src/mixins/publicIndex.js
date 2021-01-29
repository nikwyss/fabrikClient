import { mapGetters, mapActions } from 'vuex'
// import assembly from './assembly'
// import { LayoutEventBus } from "src/utils/eventbus";

export default {

  provide() {
    return {
      published_assemblies: this.published_assemblies,
      clickAssemblyLink: this.clickAssemblyLink,
      assemblyName: this.assemblyName,
      // assemblyIdentifier: this.assemblyIdentifier,
      IsThereNothingGoingOn: this.IsThereNothingGoingOn,
      IsThereAnAssemblyInPublicState: this.IsThereAnAssemblyInPublicState,
      IsThereAnAssemblyOngoing: this.IsThereAnAssemblyOngoing,
      UsersDelegateAssemblies: this.UsersDelegateAssemblies,
      IsUserDelegateOfOngoingAssembly: this.IsUserDelegateOfOngoingAssembly // Vue.observable(this.IsUserDelegateOfOngoingAssembly)
    }
  },

  computed: {

    UsersDelegateAssemblies() {

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
      return (Object.values(accessibleAssemblies))
    },


    IsUserDelegateOfOngoingAssembly() {

      const assemblies = this.UsersDelegateAssemblies
      return (assemblies && Object.values(assemblies).length > 0)
    },

    assemblyIdentifier() {

      const assemblies = this.UsersDelegateAssemblies
      return (this.$route?.params?.assemblyIdentifier)
    },

    currentPublicAssembly() {

      // const assemblies = this.UsersDelegateAssemblies
      const assemblyIdentifier = this.currentAssemblyIdentifier
      if (assemblyIdentifier) {
        return this.getAssembly(assemblyIdentifier)
      }
    },

    assemblyName() {

      const assembly = this.currentPublicAssembly
      if (assembly) {
        return (assembly.title)
      }
    },

    ...mapGetters({
      published_assemblies: 'publicindexstore/published_assemblies',
      ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
      getAssembly: 'publicindexstore/getAssembly',
      IsThereAnAssemblyInPublicState: 'publicindexstore/IsThereAnAssemblyInPublicState',
      IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
      IsThereNothingGoingOn: 'publicindexstore/IsThereNothingGoingOn'
    })
  },

  methods: {
    clickAssemblyLink: function (assembly) {
      console.assert(assembly)
      var route = { name: 'assembly_home', params: { assemblyIdentifier: assembly.identifier } }
      this.$router.push(route)
    }
  },

  mounted: function () {

    console.log("...retrieve public index (if not yet done)")
    this.$store.dispatch('publicindexstore/syncPublicIndex')
  }
}
