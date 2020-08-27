import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import { LayoutEventBus } from 'src/layouts/components/eventbus.js'

export default {

  data () {
    return {
      attempts_to_retrieve_a_public_index: 0
    }
  },
  computed: {

    ...mapGetters({
      get_current_assembly_identifier: 'assemblystore/get_current_assembly_identifier',
      get_public_index: 'assemblystore/get_public_index',
      get_public_index_ongoing_assemblies: 'assemblystore/get_public_index_ongoing_assemblies',
      get_public_index_published_assemblies: 'assemblystore/get_public_index_published_assemblies'
    })
  },

  methods: {

    update_public_index: function () {

      console.log("public_index GETTER")
 
      // has contentree already be cached in the vues store??
      var synced = false
      var public_index = this.get_public_index
      
      if (public_index) {
        // check sync state of local container version
        console.log("check public index status")
        synced = this.checkPublicIndexStatus(public_index)
      }

      if (!synced) {
        // re-load assembly
        // anyway: dont wait; return cache version. (dont wait until remote data are loaded...)
        console.log("The local copy of the public_index is outdated or empty")
        LayoutEventBus.$emit('showLoading')

        this.retrievePublicIndexOfAssemblies()
      }

      // no cache version exists: load the full tree...
      console.log('end public-index getter')

      return (public_index)
    },
    
    retrievePublicIndexOfAssemblies: function () {
      if (this.attempts_to_retrieve_a_public_index > 5) {
        // it is not possible to retrieve a valid assembly. Sorry.
        return (null)
      }

      this.attempts_to_retrieve_a_public_index += 1
      console.log("Attempts: " + this.attempts_to_retrieve_a_public_index)

      ApiService.get(`${process.env.VUE_APP_APISERVER_URL}/assemblies`).then (
        response => {

          console.log("finished retrieving assemblies...")
          LayoutEventBus.$emit('hideLoading')

          if (!response.data) {
              console.log ("TODO: error: Could not retrieve assemblies...")
              return;
          }

          console.assert(response.data && 'assemblies' in response.data)
          console.assert('assemblies' in response.data)
          console.log(response.data)

          this.add_or_update_public_index ({ public_index: response.data})
        }
      )
    },

    // CHECK STATE OF LOADED Assembly
    checkPublicIndexStatus: function (public_index) {
      console.log("Is out of date? CACHE STATUS")
      // Load container data (to check sync status)
      // check if user_id has changed!
      // reload assembly all half 20 minutes..
      var twentyMinutesEarlier = new Date()
      twentyMinutesEarlier.setMinutes(twentyMinutesEarlier.getMinutes() - 20)
      let invalid_status = (!public_index ||
          public_index.access_sub === undefined ||
          public_index.access_date === undefined ||
          // allow userid ==0 && user_id == null
          public_index.access_sub != (this.$root.userid == 0 ? null : this.$root.userid) ||
          public_index.access_date < twentyMinutesEarlier)

      return (!invalid_status)

    },

    ...mapActions({
      add_or_update_public_index: 'assemblystore/add_or_update_public_index'
    })
  },

  mounted: function () {
    console.log("start update of assemblies public index.")
    this.update_public_index()
  }
}
