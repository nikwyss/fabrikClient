// import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {

  computed: {

    // Get Assembly Identifier from URL
    assemblyIdentifier: function () {

      const assemblyIdentifier = this.$route.params.assemblyIdentifier
      // Mixin is only usable for pages with assemblyIdentifier in the URL
      console.assert(assemblyIdentifier)
      return (assemblyIdentifier)
    },

    assembly: function () {
      console.log("ASSEMBLY GETTER" + this.assemblyIdentifier)

      LayoutEventBus.$emit('showLoading')

      const assembly = this.get_assembly(this.assemblyIdentifier)

      // Monitor assembly visit
      if (assembly){

        let data = {
          assembly_identifier: this.assemblyIdentifier
        }
        this.$store.dispatch('monitorApi', {
          event: this.MonitorAssemblyEntering,
          data: data
        })
      }

      // no cache version exists: load the full tree...
      LayoutEventBus.$emit('hideLoading')
      return (assembly)
    },

    assembly_stages: function() {
      console.log("get assembly_stages")

      // not yet ready?
      if (!this.assembly){ return (null)}
      return (this.get_assembly_stages(this.assemblyIdentifier))
    },

    assembly_configuration: function() {
      if (!this.assemblyIdentifier) {
        return (null)
      }
      console.assert(this.assembly)
      console.assert(this.assemblyIdentifier)
      return (this.get_assembly_configuration(this.assemblyIdentifier))
    },

    assembly_progression: function() {
      if (!this.assemblyIdentifier) {
        return (null)
      }

      console.assert(this.assembly)
      console.assert(this.assemblyIdentifier)
      return (this.get_assembly_progression(this.assemblyIdentifier))
    },

    assembly_acls: function() {
      return (this.store_assembly_acls(this.assembly.identifier))
    },

    ...mapGetters({
      store_assembly_acls: 'oauthstore/assembly_acls',
      get_assembly: 'assemblystore/get_assembly',
      get_assembly_stages: 'assemblystore/get_assembly_stages',
      get_assembly_progression: 'assemblystore/get_assembly_progression',
      get_assembly_configuration: 'assemblystore/get_assembly_configuration'
    })
  },

  mounted: function() {
    const assemblyIdentifier = this.assemblyIdentifier
    this.$store.dispatch('assemblystore/syncAssembly', {assemblyIdentifier})
  }
}
