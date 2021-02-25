import { mapGetters } from 'vuex'
import ContentTreeMixin from 'src/mixins/contenttree'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { runtimeStore } from "src/store/runtime.store"
import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {
  // mixins: [StageMixin],

  mixins: [
    ContentTreeMixin,
    ReactiveProvideMixin({
      name: 'CONTENT',
      include: ['contentID', 'content'],
    })
  ],

  provide() {
    return {
      openIndex: this.openIndex,
      openArgument: this.openArgument
    }
  },

  data() {
    return {
      is_loaded: false,
      checked_sync_state: false
    }
  },

  computed: {

    contenttreeID: function () {
      // Mixin is only usable for pages with assemblyIdentifier in the URL

      // console.log("RETRIEVE contenttreeID..", this.routed_stage)
      if (!this.routed_stage || !this.routed_stage?.stage?.contenttree_id) {
        console.log(" routed_stage not loaded")
        return (null)
      }

      return (this.routed_stage?.stage?.contenttree_id)
    },


    contenttree: function () {
      if (!this.contenttreeID) {
        return null
      }

      console.assert(runtimeStore.assemblyIdentifier)


      // retrieve from localStorage
      const contenttree = this.get_contenttree({
        contenttreeID: this.contenttreeID
      })


      return (contenttree)
    },

    contentID: function () {
      // console.log("RETRIEVE contenttreeID..", this.routed_stage)
      return this.$route.params.contentID
    },

    content: function () {
      if (!this.contentID || !this.contenttree) {
        return null
      }
      return this.contenttree.entries[this.contentID]
    },


    node: function () {
      if (!this.contentID) {
        return null
      }
      const node = this.contenttree.structure.children.find(x => x.id == this.contentID)
      // TODO: error handling in case of a wrong url
      return node
    },



    childRatingCompleted() {
      // console.trace()
      const allRated = this.numberOfUnratedChildEntries == 0
      // if (allRated && this.is_stage_scheduled(this.routed_stage)) {
      //   this.markIdle()
      // }

      return (allRated)
    },

    numberOfUnratedChildEntries() {
      const unrated_children = Object.filter(this.node.children, x => this.contenttree.entries[x.id]?.progression?.rated !== true)
      return (Object.values(unrated_children).length)
    },

    ...mapGetters({
      get_contenttree: 'contentstore/get_contenttree'
    })
  },

  methods: {

    openIndex: function () {

      // REDIRECT TO ARGUMENT PAGE
      this.$router.push({
        name: this.routed_stage.stage.type, params: {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          stageID: runtimeStore.stageID
        }
      })
    },

    openArgument: function (contentID) {

      // REDIRECT TO ARGUMENT PAGE
      this.$router.push({
        name: this.routed_stage.stage.type, params: {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          stageID: runtimeStore.stageID,
          contentID: contentID
        }
      })
    },

    // filter_entries: function (nodes, TYPES) {
    //   console.assert(this.contenttreeID && this.contenttree !== null)
    //   var local_contenttree = this.node.children
    //   let filtered = nodes.filter(
    //     item => TYPES.includes(local_contenttree.entries[item.id].content.type)
    //   )
    //   return (filtered)
    // },

    isRead: function (content) {
      console.assert('progression' in content)
      return (!content.progression)
    },


    // unratedTopics: function (nodes, TYPES) {
    //   console.assert(this.contenttreeID && this.contenttree !== null)
    //   var local_contenttree = this.contenttree
    //   let filtered = nodes.filter(
    //     item => TYPES.includes(local_contenttree.entries[item.id].content.type)
    //   )
    //   return (filtered)
    // },

    // hasUnratedChildren: function (content) {
    //   console.assert(content)
    //   return (!content.progression)
    // }


  },

  // mounted() {

  //   // when stage has been loaded already
  //   // if (this.routed_stage?.stage.contenttree_id && this.oauth.userid) {
  //   //   console.log("SYNC CONTENTTREE IN CONTENT.js (1)")
  //   //   this.$store.dispatch('contentstore/syncContenttree', {
  //   //     assemblyIdentifier: runtimeStore.assemblyIdentifier,
  //   //     contenttreeID: this.routed_stage.stage.contenttree_id,
  //   //     oauthUserID: this.oauth.userid
  //   //   })
  //   // } else {
  //   //   console.log("SYNC CONTENTTREE IN CONTENT.js (2)")
  //   //   // Stage is not yet loaded: so wait until it is...
  //   //   LayoutEventBus.$once("EventStageLoaded", (stage) => {
  //   //     // console.log(stage)
  //   //     this.$store.dispatch('contentstore/syncContenttree', {
  //   //       assemblyIdentifier: runtimeStore.assemblyIdentifier,
  //   //       contenttreeID: stage.stage.contenttree_id,
  //   //       oauthUserID: this.oauth.userid
  //   //     })
  //   //   })
  //   // }
  // }
}
