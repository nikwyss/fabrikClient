import { mapGetters, mapActions } from 'vuex'
// import assembly from './assembly'
// import { LayoutEventBus } from "src/utils/eventbus";

export default {

  provide() {
    return {
      // published_assemblies: this.published_assemblies,
      clickAssemblyLink: this.clickAssemblyLink,
      // assemblyName: this.assemblyName,
      // assemblyIdentifier: this.assemblyIdentifier,
      // IsThereNothingGoingOn: this.IsThereNothingGoingOn,
      // IsThereAnAssemblyInPublicState: this.IsThereAnAssemblyInPublicState,
      // IsThereAnAssemblyOngoing: this.IsThereAnAssemblyOngoing,
      // UsersDelegateAssemblies: this.UsersDelegateAssemblies,
      // IsUserDelegateOfOngoingAssembly: this.IsUserDelegateOfOngoingAssembly // Vue.observable(this.IsUserDelegateOfOngoingAssembly)
    }
  },

  computed: {


    // ...mapGetters({
    //   published_assemblies: 'publicindexstore/published_assemblies',
    //   ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
    //   // getAssembly: 'publicindexstore/getAssembly',
    //   // IsThereAnAssemblyInPublicState: 'publicindexstore/IsThereAnAssemblyInPublicState',
    //   // IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
    //   // IsThereNothingGoingOn: 'publicindexstore/IsThereNothingGoingOn'
    // })

    ...mapGetters(
      'publicindexstore',
      ['published_assemblies', 'ongoing_assemblies']
    ),

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
