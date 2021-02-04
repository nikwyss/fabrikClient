import { mapGetters } from 'vuex'
import StageMixin from 'src/mixins/stage'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { ReactiveProvideMixin } from 'vue-reactive-provide'


export default {
  // mixins: [StageMixin],

  mixins: [
    StageMixin,
    ReactiveProvideMixin({
      name: 'CONTENTTREE',
      include: ['contenttreeID', 'contenttree', 'isRead'],
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

      console.log("RETRIEVE contenttreeID..", this.routed_stage)
      if (!this.routed_stage) {
        console.log(" routed_stage not loaded")
        return (null)
      }

      return (this.routed_stage?.stage?.contenttree_id)
    },

    contenttree: function () {
      if (!this.contenttreeID) {
        return null
      }

      console.log('start fetching the contenttree', this.contenttreeID)
      console.assert(this.assemblyIdentifier)

      // retrieve from localStorage
      const contenttree = this.get_contenttree({
        contenttreeID: this.contenttreeID
      })

      return (contenttree)
    },

    ...mapGetters({
      get_contenttree: 'contentstore/get_contenttree'
    })
  },

  methods: {

    openIndex: function () {

      // REDIRECT TO ARGUMENT PAGE
      var identifier = this.$route.params.assemblyIdentifier
      this.$router.push({
        name: this.routed_stage.stage.type, params: {
          assemblyIdentifier: identifier,
          stageID: this.routed_stage_id,
          contenttreeID: this.contenttreeID
        }
      })
    },

    openArgument: function (contentID) {

      if (this.standalone) {
        return
      }

      // REDIRECT TO ARGUMENT PAGE
      // console.log(this.item)
      var identifier = this.$route.params.assemblyIdentifier
      this.$router.push({
        name: this.routed_stage.stage.type,
        params: {
          assemblyIdentifier: this.assemblyIdentifier,
          stageID: this.routed_stage_id,
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
      return (!content.progression)
    }
  },

  created() {

    LayoutEventBus.$on(['AssemblyLoaded', 'AfterLogout'], data => {
      // TOKEN Changed: reload/reset of contenttree data needed?
      console.log("shall we sync contentree?")
      if (this.contenttreeID) {
        console.log("SYNC contentTree (contenttree mixin) --------------------")
        // TODO: remove any personal data when loggin out
        this.$store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID: this.contenttreeID,
          oauthUserID: this.oauth.userid
        })
      }

      console.log("---START MONITORS-------")
      this.monitorApi()

    })
  }
}
