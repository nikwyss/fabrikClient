import {mapGetters, mapActions} from 'vuex'
import StageMixin from "src/mixins/stage"

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
      // contenttreeID is defined in the URL
      const contenttreeID = this.$route.params.contenttreeID
      // Mixin is only usable for pages with assemblyIdentifier in the URL
      console.assert(contenttreeID)
      return (contenttreeID)
    },

    contenttree: function() {

      console.log("start fetching the contenttree")
      console.assert(this.contenttreeID)
      console.assert(this.assemblyIdentifier)

      // retrieve from localStorage
      const contenttree =  this.get_contenttree({
        contenttreeID: this.contenttreeID
      })

      // Whether loaded or not: Do the localStorage-cache-sync
      if (this.contenttreeID !== null) {
        console.log("cache-sync contenttree")
        this.$store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID: this.contenttreeID
        })
      }
    },

    startingContentID: function() {

      if (this.$route.params.contentID!==undefined) {
        return(Number(this.$route.params.contentID))
      }
      return(null)
    },

    startingContent: function() {
      if(this.startingContentID && this.contenttree !== null) {
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

    /* By this method we allow the API to monitor user activities 
    In this case, we monitor contenttree access.
    */
    monitorApi: function () {
      if (!this.contenttreeID){
        return (null)
      }

      // dont monitor if contenttree has not been loaded.
      console.log('Monitor contenttree activities')
      let data = {
        assembly_identifier: this.assemblyIdentifier,
        contenttreeID: this.contenttreeID
      }

      this.$store.dispatch('monitorApi', {
        event: this.MonitorContenttreeEntering,
        data: data
      })
    },

    filter_question_entries: function(nodes) {

      console.assert(this.contenttreeID && this.contenttree!==null)

      var QUESTION_ENTRIES = ['QUESTION']
      var local_contenttree = this.contenttree
      let filtered = nodes.filter(
        item => QUESTION_ENTRIES.includes(local_contenttree.entries[item.id].content.type)
      )
      return(filtered)
    },

    filter_comment_entries: function(nodes) {

      console.assert(this.contenttreeID && this.contenttree!==null)

      var COMMENT_ENTRIES = ['COMMENT']
      var local_contenttree = this.contenttree
      let filtered = nodes.filter(
        item => COMMENT_ENTRIES.includes(local_contenttree.entries[item.id].content.type)
      )
      return(filtered)
    }
  },

  watch: {
    // if route changes, hide TextLoading
    oauth_authenticated (before, after) {
      if (!this.contenttreeID){
        // Wait until contenttreeID (respectively stage) is loaded.
      }

      const assemblyIdentifier = this.assemblyIdentifier
      this.$store.dispatch('contentstore/syncContenttree', {
        assemblyIdentifier: this.assemblyIdentifier,
        contenttreeID: this.contenttreeID
      })
    }
  },

  mounted: function() {

    // console.assert(this.assemblyIdentifier)

    // if (!this.contenttreeID){
    //   // Wait until contenttreeID (respectively stage) is loaded.
    //   return (null)
    // }

    // // not usefull here, since stage loading can be longer than component mounting.
    // this.$store.dispatch('contentstore/syncContenttree', {
    //   assemblyIdentifier: this.assemblyIdentifier,
    //   contenttreeID: this.contenttreeID
    // })
  }
}
