import { mapGetters } from 'vuex'
import StageMixin from 'src/mixins/stage'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { runtimeStore } from "src/store/runtime.store"
import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {
  // mixins: [StageMixin],

  mixins: [
    StageMixin,
    ReactiveProvideMixin({
      name: 'CONTENTTREE',
      include: ['contenttreeID', 'contenttree', 'isRead', 'ratingCompleted', 'salienceCompleted'],
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
      // is_loaded: false,
      // checked_sync_state: false
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

    contents() {
      return this.contenttree.entries
    },

    ratingCompleted() {

      // console.log("rating completed?? rerun...")
      const allRated = this.numberOfUnratedTopLevelEntries == 0
      if (allRated && this.is_stage_scheduled(this.routed_stage)) {
        this.markIdle()
      }

      return (allRated)
    },

    salienceCompleted() {

      // console.log("salience completed?? rerun...")
      const allSalienced = this.numberOfUnsaliencedTopLevelEntries == 0
      if (allSalienced && this.is_stage_scheduled(this.routed_stage)) {
        this.markIdle()
      }

      return (allSalienced)
    },


    numberOfUnratedTopLevelEntries() {
      if (this.contenttree == null) {
        return null
      }

      const unrated_children = Object.filter(this.contenttree.structure.children, x => this.contenttree.entries[x.id]?.progression?.rated !== true)
      return (Object.values(unrated_children).length)
    },


    numberOfUnsaliencedTopLevelEntries() {
      if (this.contenttree == null) {
        return null
      }

      const unsalienced_children = Object.filter(this.contenttree.structure.children, x => this.contenttree.entries[x.id]?.progression?.salienced !== true)
      return (Object.values(unsalienced_children).length)
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
          // contenttreeID: this.contenttreeID
        }
      })
    },

    openArgument: function (contentID) {

      if (this.standalone) {
        return
      }

      // REDIRECT TO ARGUMENT PAGE
      this.$router.push({
        name: this.routed_stage.stage.type,
        params: {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          stageID: runtimeStore.stageID,
          contentID: contentID
        }
      })
    },

    filter_entries: function (nodes, TYPES) {
      console.assert(this.contenttreeID && this.contenttree !== null)
      var local_contenttree = this.contenttree
      let filtered = nodes.filter(
        item => TYPES.includes(local_contenttree.entries[item.id].content.type)
      )
      return (filtered)
    },

    isRead: function (content) {
      console.assert('progression' in content)
      return (content.progression)
    },

    isSalienced: function (content) {
      console.assert('progression' in content)
      return (content.progression?.salience)
    },

    isRated: function (content) {
      console.assert('progression' in content)
      return (content.progression?.rating)
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

  mounted() {

    // when stage has been loaded already
    if (this.routed_stage?.stage.contenttree_id && this.oauth.userid) {
      this.$store.dispatch('contentstore/syncContenttree', {
        assemblyIdentifier: runtimeStore.assemblyIdentifier,
        contenttreeID: this.routed_stage.stage.contenttree_id,
        oauthUserID: this.oauth.userid
      })
    } else {
      // Stage is not yet loaded: so wait until it is...
      LayoutEventBus.$once("EventStageLoaded", (stage) => {
        this.$store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          contenttreeID: stage.stage.contenttree_id,
          oauthUserID: this.oauth.userid
        })
      });
    }
  }
}
