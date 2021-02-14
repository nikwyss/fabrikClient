import { mapGetters, mapActions, mapState } from 'vuex'
import { LayoutEventBus } from 'src/utils/eventbus.js'
// import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { scroll } from 'quasar'
// TODO: do without: vue-reactive-provide, instead write a plugin...
import { runtimeStore, runtimeMutations } from "src/store/runtime.store";
import constants from 'src/utils/constants';

const { getScrollTarget, setScrollPosition } = scroll

/* Make available all the properties and methods in any descendant object.*/
// const ReactiveProvidePropertiesMixin = ReactiveProvideMixin({
//   name: 'ABLY',
//   include: ['assemblyAcls']
// })

export default {
  // mixins: [ReactiveProvidePropertiesMixin],

  provide() {
    return {
      gotoAssemblyHome: this.gotoAssemblyHome,
      gotoNextStageNr: this.gotoNextStageNr,
    }
  },


  data() {
    return {
      stage_nr_last_visited: null
    }
  },

  computed: {

    ...mapGetters(
      'assemblystore',
      ['assembly', 'assembly_sorted_stages', 'is_stage_accessible', 'is_stage_scheduled',
        'last_accessible_stage', 'is_stage_idle',
        'is_stage_done', 'is_stage_disabled', 'is_stage_completed', 'last_accessible_stage',
        'is_stage_new', 'is_stage_last',
        'is_stage_first', 'is_stage_alert', 'assembly_scheduled_stages', 'assembly_stages',
        'get_stage_number_by_stage_id', 'get_stage_number_by_stage', 'next_scheduled_stage',
        'find_next_accessible_stage', 'assembly_stages', 'assembly', 'assembly_configuration', 'IsDelegate', 'IsManager'
      ]
    ),

    stage_last_visited() {
      return this.assembly_sorted_stages[this.stage_nr_last_visited]
    }
  },

  methods: {

    clickBackToAssemblyListButton: function () {
      runtimeMutations.setAssemblyIdentifier(null)
      this.$router.push({ name: 'assemblies' })
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
        params: { assemblyIdentifier: runtimeStore.assemblyIdentifier }
      }
      // }
      // console.log(route)
      this.$router.push(route, this.laggedScrollToStage)

    },

    gotoNextStageNr: function (stage) {
      console.assert(stage)
      console.log("gotoNextStageNr")

      const nextStage = this.find_next_accessible_stage(stage)
      if (!nextStage) {
        return (null)
      }

      this.stage_nr_last_visited = this.get_stage_number_by_stage(nextStage)
    },

    gotoDefaultStageTeaser: function () {
      if (runtimeStore.stageID) {
        this.stage_nr_last_visited = this.get_stage_number_by_stage_id(runtimeStore.stageID)
      } else if (this.last_accessible_stage) {
        this.stage_nr_last_visited = this.get_stage_number_by_stage(this.last_accessible_stage)
      } else {
        this.stage_nr_last_visited = null
      }
    },

    ...mapActions({ setCachedStageID: 'assemblystore/setCachedStageID' })
  },


  created() {

    // Catch all authentication status changes
    LayoutEventBus.$once('AssemblyLoaded', data => {
      console.log("LayoutEventBus on AssemblyLoaded")
      this.gotoDefaultStageTeaser()
    })

    this.gotoDefaultStageTeaser()
  },


  mounted: function () {

    console.log('>> APP LOADED: in assembly: do the assembly sync!!!')
    // TODO: remove any personal data when loggin out
    this.$store.dispatch('assemblystore/syncAssembly', {
      oauthUserID: this.oauth.userid
    })

    this.$root.monitorLog(constants.MONITOR_ASSEMBLY_ENTERING)
  },

  /**
  * Ensure that all contenttrees is up to date
  **/
  // watch: {
  //   // if route changes, hide TextLoading
  //   $route(to, from) {
  //     console.log("router watch in assembly.mixin")
  //     console.log(from, to, 'ddddd')
  //   }
  // },
  // activated: function () {
  //   console.log("---ACTIVATED-------")
  // },

  // activated: function () {
  //   console.log("---UPDATED-------")
  // }
}
