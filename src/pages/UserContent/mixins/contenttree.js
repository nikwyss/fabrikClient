import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import AssemblyMixin from "src/pages/Assembly/mixins/assembly"
// import assembly from "src/pages/Assembly/mixins/assembly"

export default {

  mixins: [AssemblyMixin],
  data() {
    return {
      is_loaded: false,
      checked_sync_state:false
    }
  },

  computed: {
    containerID: function() {
      return(this.$route.params.containerID)
    },

    container: function() {
      console.assert(this.assembly)

      if(!this.containerID) {
        return(null)
      }

      if(!this.assemblyIdentifier) {
        return(null)
      }

      // has contentree already be cached in the vues store??
      var container = this.get_assembly_container({
        assemblyIdentifier: this.assemblyIdentifier, 
        containerID: this.containerID})
        if(!container) {
          // Not yet loaded. please wait
          return(null)
      }

      console.assert(container)

      return(container)
    },

    contenttree: function() {

      if(!this.containerID) {
        return(null)
      }

      if(!this.assemblyIdentifier) {
        return(null)
      }

      // has contentree already be cached in the vues store??
      var contenttree = this.get_contenttree(this.containerID)

      // // TODO: reload container data to check last modification date.
      if(contenttree) {
        return(contenttree)
      }

      // no cache version exists: load the full tree...
      this.retrieveContentTree()
      return(null)
    },

    startingContentID: function() {
      if (this.$route.params.contentID!==undefined) {
        return(Number(this.$route.params.contentID))
      }

      return(null)
    },

    starting_content: function() {
      if(this.startingContentID) {
        console.log("starting content found")
        return(this.contenttree.entries[this.startingContentID])
      }
      return(null)
    },

    ...mapGetters({ 
      get_assembly_container: 'assemblystore/get_assembly_container',
      get_contenttree: 'contentstore/get_contenttree'
    })
  },

  methods: {

    retrieveContentTree() {
      console.log("Retrieve contenttree")
      // Load container data (to check sync status)
      console.assert(this.assemblyIdentifier)
      let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${this.assemblyIdentifier}/container/${this.containerID}/contenttree`
      ApiService.get(url).then(
        response => {
          // update
          console.log('save full contenttree to cache.')
          console.assert ('OK' in response.data)
          console.assert ('contenttree' in response.data)
          this.add_or_update_contenttree({containerID: this.containerID, contenttree: response.data.contenttree})
        }
      )

      // this.checked_sync_state = true
    },

    filter_question_entries: function(nodes) {
      var QUESTION_ENTRIES = ['QUESTION']
      var local_contenttree = this.contenttree
      let filtered = nodes.filter(
        item => QUESTION_ENTRIES.includes(local_contenttree.entries[item.id].content.type)
      )
      return(filtered)
    },

    filter_comment_entries: function(nodes) {
      var COMMENT_ENTRIES = ['COMMENT']
      var local_contenttree = this.contenttree
      let filtered = nodes.filter(
        item => COMMENT_ENTRIES.includes(local_contenttree.entries[item.id].content.type)
      )
      return(filtered)
    },

    ...mapActions({
      add_or_update_contenttree: 'contentstore/add_or_update_contenttree'
    }),
  }
}
