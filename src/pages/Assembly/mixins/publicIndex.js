import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import { LayoutEventBus } from 'src/layouts/components/eventbus.js'
import Configuration from 'src/utils/configuration'

export default {

  data () {
    return {
      attempts_to_retrieve_a_publicIndex: 0
    }
  },

  computed: {

    ...mapGetters({
      get_current_assemblyIdentifier: 'assemblystore/get_current_assemblyIdentifier',
      get_publicIndex: 'assemblystore/get_publicIndex',
      get_publicIndex_ongoing_assemblies: 'assemblystore/get_publicIndex_ongoing_assemblies',
      get_publicIndex_published_assemblies: 'assemblystore/get_publicIndex_published_assemblies'
    })
  },

  methods: {

    update_publicIndex: function () {

      console.log("publicIndex GETTER")
 
      // has contentree already be cached in the vues store??
      var synced = false
      var publicIndex = this.get_publicIndex
      
      if (publicIndex) {
        // check sync state of local container version
        console.log("check public index status")
        synced = this.checkPublicIndexStatus(publicIndex)
      }

      if (!synced) {
        // re-load assembly
        // anyway: dont wait; return cache version. (dont wait until remote data are loaded...)
        console.log("The local copy of the publicIndex is outdated or empty")
        LayoutEventBus.$emit('showLoading')

        this.retrievePublicIndexOfAssemblies()
      }

      // no cache version exists: load the full tree...
      console.log('end public-index getter')

      return (publicIndex)
    },
    
    retrievePublicIndexOfAssemblies: function () {
      if (this.attempts_to_retrieve_a_publicIndex > 5) {
        // it is not possible to retrieve a valid assembly. Sorry.
        return (null)
      }

      this.attempts_to_retrieve_a_publicIndex += 1
      console.log("Attempts: " + this.attempts_to_retrieve_a_publicIndex)
      let url = `${Configuration.value('ENV_APISERVER_URL')}/assemblies`

      ApiService.get(url).then (
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

          this.add_or_update_publicIndex ({ publicIndex: response.data})
        }
      )
    },

    // CHECK STATE OF LOADED Assembly
    checkPublicIndexStatus: function (publicIndex) {
      console.log("Is out of date? CACHE STATUS")
      // Load container data (to check sync status)
      // check if user_id has changed!
      // reload assembly all half 20 minutes..
      var twentyMinutesEarlier = new Date()
      twentyMinutesEarlier.setMinutes(twentyMinutesEarlier.getMinutes() - 20)
      let invalid_status = (!publicIndex ||
          publicIndex.access_sub === undefined ||
          publicIndex.access_date === undefined ||
          // allow userid ==0 && user_id == null
          publicIndex.access_sub != (this.$root.userid == 0 ? null : this.$root.userid) ||
          publicIndex.access_date < twentyMinutesEarlier)

      return (!invalid_status)

    },

    ...mapActions({
      add_or_update_publicIndex: 'assemblystore/add_or_update_publicIndex'
    })
  },

  mounted: function () {
    console.log("start update of assemblies public index.")
    this.update_publicIndex()
  }
}
