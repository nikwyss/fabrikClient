import { mapGetters, mapActions, mapState } from 'vuex'
import { LayoutEventBus } from 'src/utils/eventbus.js'
// import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { scroll } from 'quasar'
// TODO: do without: vue-reactive-provide, instead write a plugin...

const { getScrollTarget, setScrollPosition } = scroll

/* Make available all the properties and methods in any descendant object.*/
// const ReactiveProvidePropertiesMixin = ReactiveProvideMixin({
//   name: 'ABLY',
//   include: ['assembly_acls']
// })

export default {
  // mixins: [ReactiveProvidePropertiesMixin],

  provide() {
    return {
      gotoAssemblyHome: this.gotoAssemblyHome,
      gotoIndexAndMoveOn: this.gotoIndexAndMoveOn,
      gotoNextStageNr: this.gotoNextStageNr,
    }
  },


  data: function () {
    return {
      stage_nr_last_visited: null
    }
  },

  computed: {

    // assembly_acls: function () {
    //   console.log("EMPTY identifier in acs?", this.assemblyIdentifier)
    //   console.assert(this.assemblyIdentifier)
    // },

    assembly_acls: function () {
      return this.oauth.acls(this.assemblyIdentifier);
    },

    ...mapGetters(
      'assemblystore',
      ['assemblyIdentifier', 'assembly', 'assembly_sorted_stages', 'is_stage_accessible', 'is_stage_scheduled', 'routed_stage', 'last_accessible_stage',
        'is_stage_done', 'is_stage_disabled', 'is_stage_completed', 'last_accessible_stage', 'is_stage_new', 'is_stage_last',
        'is_stage_first', 'is_stage_alert', 'assembly_scheduled_stages', 'assembly_stages', 'get_stage_number_by_stage',
        'find_next_accessible_stage', 'assembly_stages', 'assembly', 'assembly_configuration'
      ]
    )
  },

  methods: {

    clickBackToAssemblyListButton: function () {
      this.set_current_assemblyIdentifier(null)
      this.$router.push({ name: 'assemblies' })
    },

    monitorApi: function () {
      /* By this method we allow the API to monitor user activities */

      // Monitor about stage visit
      let data = {
        assembly_identifier: this.assemblyIdentifier
      }

      console.log("monitor assembly data")
      this.$store.dispatch('monitorApi', {
        event: this.Constants.MONITOR_ASSEMBLY_ENTERING,
        data: data,
        key: this.assemblyIdentifier
      })
    },

    stageTransition: function (newVal, oldVal) {
      this.scrollToStage()
    },

    laggedScrollToStage: function () {
      setTimeout(() => {
        this.scrollToStage()
      }, 200)
    },

    scrollToStage: function () {
      // SCROLL POSITION
      console.log('Do the scrolling...')
      // let anchorid = `stage${this.stage_nr_last_visited}`
      var element = document.getElementsByClassName('q-stepper__tab--active');
      if (element) {
        const el = element[0]
        const target = getScrollTarget(el)
        const offset = el.offsetTop
        // console.log(el.offsetTop)
        const duration = 300
        setScrollPosition(target, offset, duration)

      } else {
        console.log('scroll element not found..')
      }
    },

    gotoAssemblyHome: function () {

      var route = null

      route = {
        name: 'assembly_home',
        params: { assemblyIdentifier: this.assemblyIdentifier }
      }
      // }
      console.log(route)
      this.$router.push(route, this.laggedScrollToStage)

    },


    gotoIndexAndMoveOn: function () {
      // const stageNr = this.assembly_sorted_stages.indexOf(this.stage_nr_last_visited)
      console.log('update stage')
      this.gotoNextStageNr(this.routed_stage)
      console.log('stage has been updated: goto home')
      this.gotoAssemblyHome()
      // this.scrollToStage()

    },

    gotoNextStageNr: function (stage) {
      const nextStage = this.find_next_accessible_stage(stage)
      if (!nextStage) {
        return (null)
      }

      this.stage_nr_last_visited = this.get_stage_number_by_stage(nextStage)
    },

    ...mapActions({ setCachedStageID: 'assemblystore/setCachedStageID' })
  },


  created() {

    // Catch all authentication status changes
    // SYNC respectively CLEAN DATA (after logout)
    // TODO
    LayoutEventBus.$on('AfterAuthenticationStatusChanged', data => {
      console.log('>> AfterAuthenticationStatusChanged listener in assembly')
      // TODO: remove any personal data when loggin out
      this.$store.dispatch('assemblystore/syncAssembly', {
        oauthUserID: this.oauth.userid
      })
    })
  },

  mounted: function () {
    console.log('>> mounted')
    this.$store.dispatch('assemblystore/syncAssembly', {
      oauthUserID: this.oauth.userid
    })

    console.assert(this.last_accessible_stage)
    this.stage_nr_last_visited = this.get_stage_number_by_stage(this.last_accessible_stage)
  }
}
