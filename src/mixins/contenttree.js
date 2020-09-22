import {mapGetters, mapActions} from 'vuex'
import StageMixin from "src/mixins/stage"
import { ReactiveProvideMixin } from 'vue-reactive-provide'

/* Make available all the properties and methods in any descendant object.*/
const ReactiveProvidePropertiesMixin = ReactiveProvideMixin({
  name: 'CTREE',
  include: ['contenttreeID', 'contenttree', 'startingContentID', 'startingContent'],
})

export default {
  mixins: [StageMixin, ReactiveProvidePropertiesMixin],

  provide() {
    return {
      openIndex: this.openIndex,
      openArgument: this.openArgument
    }
  },
  
  data() {
    return {
      is_loaded: false,
      checked_sync_state:false
    }
  },

  computed: {

    contenttreeID: function() {
      // contenttreeID is defined in the URL
      // Mixin is only usable for pages with assemblyIdentifier in the URL
      const contenttreeID = this.$route.params.contenttreeID
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
      return (contenttree)
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

    openIndex: function() {

      console.log("redirect to pros_and_cons_index")
      console.log(this.routedStage.stage)
      console.log("WHICH IS THE TYPE??")
      console.log(this.routedStage.stage.type)
      // REDIRECT TO ARGUMENT PAGE
      var identifier = this.$route.params.assemblyIdentifier
      this.$router.push({name: this.routedStage.stage.type, params: {
        assemblyIdentifier: identifier,
        stageID: this.routedStageID,
        contenttreeID: this.contenttreeID
      }})
    },

    openArgument: function(contentID) {

      if (this.standalone) {
        return
      }

      // REDIRECT TO ARGUMENT PAGE
      // console.log(this.item)
      var identifier = this.$route.params.assemblyIdentifier
      this.$router.push({
        name: this.routedStage.stage.type, 
        params: {
          assemblyIdentifier: this.assemblyIdentifier,
          stageID: this.routedStageID,
          contentID: contentID
        }
      })
    },

    filter_entries: function(nodes, TYPES) {

      console.assert(this.contenttreeID && this.contenttree!==null)
      var local_contenttree = this.contenttree
      let filtered = nodes.filter(
        item => TYPES.includes(local_contenttree.entries[item.id].content.type)
      )
      return(filtered)
    },
  },

  watch: {
    oauth_authenticated (before, after) {
      console.assert(this.contenttreeID)
      this.$store.dispatch('contentstore/syncContenttree', {
        assemblyIdentifier: this.assemblyIdentifier,
        contenttreeID: this.contenttreeID
      })
    }
  },

  mounted: function() {   
    console.assert(this.assemblyIdentifier)
    console.assert(this.contenttreeID)
    this.$store.dispatch('contentstore/syncContenttree', {
      assemblyIdentifier: this.assemblyIdentifier,
      contenttreeID: this.contenttreeID
    })
  }
}
