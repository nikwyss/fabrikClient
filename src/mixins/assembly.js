import { mapGetters, mapActions } from 'vuex'
import { scroll } from 'quasar'
import { runtimeStore, runtimeMutations } from "src/store/runtime.store"
import constants from 'src/utils/constants'

const { getScrollTarget, setScrollPosition } = scroll

/* Note: Make available all the properties and methods in any descendant object.*/
// const ReactiveProvidePropertiesMixin = ReactiveProvideMixin({
//   name: 'ABLY',
//   include: ['assemblyAcls']
// })

export default {

  provide() {
    return {
      gotoAssemblyHome: this.gotoAssemblyHome,
      gotoNextStageNr: this.gotoNextStageNr,
    }
  },

  computed: {

    ...mapGetters(
      'assemblystore',
      ['assembly', 'assembly_sorted_stages', 'is_stage_accessible', 'is_stage_scheduled',
        'last_accessible_stage', 'is_stage_idle',
        'is_stage_done', 'is_stage_disabled', 'is_stage_completed',
        'is_stage_new', 'is_stage_last',
        'is_stage_first', 'is_stage_alert', 'assembly_scheduled_stages', 'assembly_stages',
        'get_stage_number_by_stage_id', 'get_stage_number_by_stage', 'next_scheduled_stage',
        'find_next_accessible_stage', 'assembly_stages', 'assembly_configuration', 'IsDelegate', 'IsManager'
      ]
    ),


    stage_nr_last_visited: {
      get() {
        if (isNaN(runtimeStore.stageID) || runtimeStore.stageID === null) {
          return null
        }
        return this.get_stage_number_by_stage_id(runtimeStore.stageID)
      },
      set(stageNr) {
        if (stageNr === null || stageNr === undefined) {
          runtimeMutations.setStageID(null)
        } else {
          const stageID = this.assembly_sorted_stages[stageNr].stage.id
          // console.log("set stageID by stageNR", stageNr, stageID)
          runtimeMutations.setStageID(stageID)
        }
      }
    },

    stage_last_visited() {
      if (this.stage_nr_last_visited === null) {
        return null
      }
      return this.assembly_sorted_stages[this.stage_nr_last_visited]
    }
  },

  methods: {

    clickBackToAssemblyListButton: function () {
      runtimeMutations.setAssemblyIdentifier(null)
      this.$router.push({ name: 'assemblies' })
    },

    stageTransition: function (newVal, oldVal) {
      //   // this.scrollToStage()
    },

    laggedScrollToStage: function () {
      console.log("KKKKKKKKKKK")
      setTimeout(() => {
        this.scrollToStage()
      }, 200)
    },

    scrollToStage: function () {
      // SCROLL POSITION
      // console.log('Do the scrolling...')
      // let anchorid = `stage${this.stage_nr_last_visited}`
      var element = document.getElementsByClassName('q-stepper__tab--active');
      if (element && element[0]) {
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

      // console.log(this.stage_nr_last_visited, "stage before assembly")
      var route = this.$root.getAssemblyHomeRoute(this.assembly);
      this.$router.push(route, this.laggedScrollToStage)

    },

    gotoNextStageNr: function (stage) {
      console.assert(stage)
      console.log("gotoNextStageNr")
      const currentStageGroup = stage.stage.group

      const nextStage = this.find_next_accessible_stage(stage)
      if (!nextStage) {
        console.log("NOTE: Assembly seems to be completed!")
        return (null)
      }
      const nextStageGroup = stage.stage.group
      if (nextStageGroup !== currentStageGroup) {
        // different group: so make a new route...
        console.log("ROUTERROUTE")
        this.$router.push(`${nextStage.stage.id}/${nextStage.stage.group}`)
      } else {
        // just update , the "stage_nr_last_visited"
        // console.log(this.stage_nr_last_visited, "old stage")
        this.stage_nr_last_visited = this.get_stage_number_by_stage(nextStage)
        console.log(this.stage_nr_last_visited, "new stage")

      }

    },

    gotoStage: function (stage) {
      console.log("gotoStage");
      var params = {
        assemblyIdentifier: runtimeStore.assemblyIdentifier,
        stageID: stage.stage.id,
        contenttreeID: stage.stage.contenttree_id,
      };
      this.$router.push({
        name: stage.stage.type,
        params: params,
      });
    },


    // TODO: what is that for?
    gotoDefaultStageTeaser: function () {

      console.log("goto default stage teaser")
      if (runtimeStore.stageID !== null && runtimeStore.stageID !== undefined) {
        this.stage_nr_last_visited = this.get_stage_number_by_stage_id(runtimeStore.stageID)
      } else if (this.last_accessible_stage) {
        this.stage_nr_last_visited = this.get_stage_number_by_stage(this.last_accessible_stage)
      } else {
        this.stage_nr_last_visited = null
      }
    },

    ...mapActions({ setCachedStageID: 'assemblystore/setCachedStageID' })
  },

  mounted: function () {

    // console.log('>> APP LOADED: in assembly. Stage: ', this.stage_nr_last_visited)
    this.$store.dispatch('assemblystore/syncAssembly', {
      oauthUserID: this.oauth.userid
    })

    this.$root.monitorLog(constants.MONITOR_ASSEMBLY_ENTERING)
  }
}
