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
        this.monitorApi()
      }

      // no cache version exists: load the full tree...
      LayoutEventBus.$emit('hideLoading')
      return (assembly)
    },

    assembly_stages: function() {
      console.log("get assembly_stages")
      console.assert(this.assemblyIdentifier)

      // not yet ready?
      if (!this.assembly){ 
        console.log("assembly not yet loaded...1923")
        return (null)
      }

      return (this.get_assembly_stages(this.assemblyIdentifier))
    },

    assembly_configuration: function() {
      console.assert(this.assemblyIdentifier)
      // not yet ready?
      if (!this.assembly){ 
        console.log("assembly not yet loaded...1922")
        return (null)
      }
      return (this.get_assembly_configuration(this.assemblyIdentifier))
    },

    assembly_progression: function() {
      console.assert(this.assemblyIdentifier)
      // not yet ready?
      if (!this.assembly){ 
        console.log("assembly not yet loaded...1921")
        return (null)
      }
      return (this.get_assembly_progression(this.assemblyIdentifier))
    },

    assembly_acls: function() {
      return (this.store_assembly_acls(this.assemblyIdentifier))
    },

    ...mapGetters({
      store_assembly_acls: 'oauthstore/assembly_acls',
      get_assembly: 'assemblystore/get_assembly',
      get_assembly_stages: 'assemblystore/get_assembly_stages',
      get_assembly_progression: 'assemblystore/get_assembly_progression',
      get_assembly_configuration: 'assemblystore/get_assembly_configuration'
    })
  },

  methods: {

    gotoAssemblyHome: function(stage_id) {

      // REDIRECT TO ARGUMENT PAGE
      if (stage_id) {
        this.$router.replace({name: 'assembly_home_stepper', 
            params: {
                assemblyIdentifier: this.assembly.identifier,
                stageID: stage_id
                }
        })

      } else {
        
        this.$router.replace({
          name: 'assembly_home', 
          params: {assemblyIdentifier: this.assembly.identifier}
        })
      }
    },
    
    monitorApi: function() {
      /* By this method we allow the API to monitor user activities */
    
      // Monitor about stage visit
      let data = {
        assembly_identifier: this.assemblyIdentifier
      }
      this.$store.dispatch('monitorApi', {
        event: this.MonitorAssemblyEntering,
        data: data
      })
    }
  },

  watch: {
    // if route changes, hide TextLoading
    oauth_authenticated (before, after) {
      const assemblyIdentifier = this.assemblyIdentifier
      console.log(">> oauth watcher")
      this.$store.dispatch('assemblystore/syncAssembly', {assemblyIdentifier})
    }
  },
  
  mounted: function() {
    const assemblyIdentifier = this.assemblyIdentifier
    console.log(">> mounter")
    this.$store.dispatch('assemblystore/syncAssembly', {assemblyIdentifier})
  }
}
