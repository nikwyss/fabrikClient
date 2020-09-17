import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import StageMixin from "src/mixins/stage"
// import assembly from "src/pages/Assembly/mixins/assembly"
// import Configuration from 'src/utils/configuration'
// import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {

  mixins: [StageMixin],
  data() {
    return {
      is_loaded: false,
      checked_sync_state:false
    }
  },

  computed: {

    contenttreeID: function() {
      return(this.stage.stage.contenttree_id)
    },

    contenttree: function() {

      console.assert(this.contenttreeID)
      console.assert(this.assemblyIdentifier)

      //   console.error("assemblyIdentifier is missing")
      //   return(null)
      // }

      return (this.get_contenttree({
        contenttreeID: this.contenttreeID, 
        assemblyIdentifier: this.assemblyIdentifier
      }))

      // has contenttree already be cached in the vues store??
      // var contenttree = this.get_contenttree(this.contenttreeID)
      // // TODO: reload contenttree data to check last modification date.
      // if(contenttree) {
      //   LayoutEventBus.$emit('hideLoading')
      //   return(contenttree)
      // }
      // // no cache version exists: load the full tree...
      // this.retrieveContentTree()
      // return(null)
    },

    startingContentID: function() {
      if (this.$route.params.contentID!==undefined) {
        return(Number(this.$route.params.contentID))
      }

      return(null)
    },

    startingContent: function() {
      if(this.startingContentID) {
        console.log("starting content found")
        return(this.contenttree.entries[this.startingContentID])
      }
      return(null)
    },

    ...mapGetters({
      get_contenttree: 'contentstore/get_contenttree'
    })
  },

  methods: {

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
