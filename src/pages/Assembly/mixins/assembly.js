import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import { LayoutEventBus } from 'src/layouts/components/eventbus.js'
import Configuration from 'src/utils/configuration'

export default {

  data () {
    return {
      attempts_to_retrieve_an_assembly: 0,
    }
  },

  computed: {

    // Helper Dummies

    /** 
     * Is there an active Assembly: 
     * assemblyIdentifier is taken from the localstorage 
     * TODO: probably not used anymore
     */
    current_assemblyIdentifier: function () {
      return (this.get_current_assemblyIdentifier)
    },

    assemblyIdentifier: function () {
      return (this.$route.params.assemblyIdentifier)
    },

    assembly: function () {
      console.log("ASSEMBLY GETTER" + this.assemblyIdentifier)
      LayoutEventBus.$emit('showLoading')

      if (!this.assemblyIdentifier) {
        console.log("no identifier")
        LayoutEventBus.$emit('hideLoading')
        return (null)
      }

      // has contentree already be cached in the vues store??
      var synced = false
      var assembly = this.get_assembly(this.assemblyIdentifier)
      if (assembly) {
        // check sync state of local stage version
        synced = this.checkAssemblyStatus(assembly)
      }

      if (!synced) {

        // (Re-)Load Assembly from API
        // anyway: downt wait; return cache version. (dont wait until remote data are loaded...)
        console.log("The local copy of the assembly is outdated")
        this.retrieveAssembly (this.assemblyIdentifier)

      }else{

        // Just monitor about assembly visit.
        this.monitorApi()
      }

      // update store: current_assembly
      this.set_current_assemblyIdentifier(assembly)

      // no cache version exists: load the full tree...
      LayoutEventBus.$emit('hideLoading')
      return (assembly)
    },

    assembly_stages: function() {
      console.log("get assembly_stages")

      // not yet ready...
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
    
    ...mapGetters({
      get_assembly: 'assemblystore/get_assembly',
      get_current_assemblyIdentifier: 'assemblystore/get_current_assemblyIdentifier',
      get_assembly_stages: 'assemblystore/get_assembly_stages',
      get_assembly_progression: 'assemblystore/get_assembly_progression',
      get_assembly_configuration: 'assemblystore/get_assembly_configuration'
    })
  },

  methods: {

    // LOAD TREE
    retrieveAssembly (assemblyIdentifier) {
      console.log("Retrieve Assembly")

      // Load assembly from the resource server
      console.assert(assemblyIdentifier)

      if(this.attempts_to_retrieve_an_assembly> 5) {
        // it is not possible to retrieve a valid assembly. Sorry.
        return(null)
      }
      this.attempts_to_retrieve_an_assembly += 1
      console.log("Attempts: " + this.attempts_to_retrieve_an_assembly)
      let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${assemblyIdentifier}`

      // store date of last assembly request. (to prevent imediate monitor calls)
      this.$store.dispatch('update_monitor_date', {event: this.MonitorAssemblyEntering})

      ApiService.get(url).then (
        response => {
          // store it to vuex
          console.log("ASSEMBLY RETRIEVED.")
          LayoutEventBus.$emit('hideLoading')

          console.log('Update CACHE STATUS OF ASSEMBLY')
          // if response contains a full version of the stage then replace it in the cache
          if (response.data && 'assembly' in response.data) {
            console.assert('assembly' in response.data)
            console.assert('stages' in response.data)
            this.add_or_update_assembly ({
              assembly: response.data.assembly, 
              stages: response.data.stages, 
              configuration: response.data.configuration, 
              progression: response.data.progression })
          }
        }
      )
    },

    monitorApi: function() {
      /* By this method we allow the API to monitor user activities */
    
      // Just Monitor assembly visit
      let data = {
        assembly_identifier: this.assemblyIdentifier
      }
      this.$store.dispatch('monitorApi', {
        event: this.MonitorAssemblyEntering,
        data: data})
    },

    // CHECK STATE OF LOADED Assembly
    checkAssemblyStatus: function (assembly) {
      console.log("Is out of date? CACHE STATUS")

      // is cache up to date?
      if (!assembly ||
          assembly.access_sub === undefined ||
          // TODO: just during page reload $root.userid is null.
          assembly.access_sub != this.$root.userid) {
        console.log("OUTDATED")
        return(false)
      }

      if (this.check4OutdatedData(assembly.access_date, this.CacheUpdateFrequency)) {
        console.log("OUTDATED")
        return (false)
      }

      console.log("Assembly status OK")
      return (true)
    },

    ...mapActions({
      add_or_update_assembly: 'assemblystore/add_or_update_assembly',
      set_current_assemblyIdentifier: 'assemblystore/set_current_assemblyIdentifier'
    })
  },

  mounted: function () {
    // this.update_publicIndex()
  }
}
