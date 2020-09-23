// import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { scroll } from 'quasar'

const { getScrollTarget, setScrollPosition } = scroll

/* Make available all the properties and methods in any descendant object.*/
const ReactiveProvidePropertiesMixin = ReactiveProvideMixin({
  name: 'ABLY',
  include: [
      'assembly', 'isAgendaFinished', 'numberOfStages', 'numberOfScheduledStages',
      'assembly_acls', 'routedStage'
  ]
})

export default {
  mixins: [ReactiveProvidePropertiesMixin],

  provide() {
    return {
        assemblyIdentifier: this.assemblyIdentifier,
        routedStageID: this.routedStageID,
        gotoAssemblyHome: this.gotoAssemblyHome,
        clickGotoIndexAndMoveOn: this.clickGotoIndexAndMoveOn,
        clickGotoNextStageNr: this.clickGotoNextStageNr,
        isLastStage: this.isLastStage,
        isFirstStage: this.isFirstStage,
        isNew: this.isNew,
        isAlert: this.isAlert,
        isSkippable: this.isSkippable,
        isCompleted: this.isCompleted
    }
  },

  computed: {

    // Get Assembly Identifier from URL
    assemblyIdentifier: function () {

      const assemblyIdentifier = this.$route.params.assemblyIdentifier
      // Mixin is only usable for pages with assemblyIdentifier in the URL
      console.assert(assemblyIdentifier)
      return (assemblyIdentifier)
    },

    assembly: function () {
      console.log("ASSEMBLY GETTER" + this.assemblyIdentifier)

      LayoutEventBus.$emit('showLoading')

      const assembly = this.get_assembly(this.assemblyIdentifier)

      // Monitor assembly visit
      if (assembly){
        this.monitorApi()
      }

      // no cache version exists: load the full tree...
      LayoutEventBus.$emit('hideLoading')
      return (assembly)
    },

    assembly_stages: function() {
      console.log("get assembly_stages")
      console.assert(this.assemblyIdentifier)

      // not yet ready?
      if (!this.assembly){
        console.log("assembly not yet loaded...1923")
        return (null)
      }

      return (this.get_assembly_stages(this.assemblyIdentifier))
    },

    assembly_configuration: function() {
      console.assert(this.assemblyIdentifier)
      // not yet ready?
      if (!this.assembly){ 
        console.log("assembly not yet loaded...1922")
        return (null)
      }
      return (this.get_assembly_configuration(this.assemblyIdentifier))
    },

    assembly_progression: function() {
      console.assert(this.assemblyIdentifier)
      // not yet ready?
      if (!this.assembly){ 
        console.log("assembly not yet loaded...1921")
        return (null)
      }
      return (this.get_assembly_progression(this.assemblyIdentifier))
    },

    assembly_acls: function() {
      return (this.store_assembly_acls(this.assemblyIdentifier))
    },

    isAgendaFinished: function () {
      return (this.highestAllowedStageNr == this.numberOfStages+1)
    },

    highestAllowedStageNr: function () {
      if(!this.sorted_stages){
          return (undefined)
      }

      var lastAllowedStageNr = this.numberOfStages
      for (let stageNr in this.sorted_stages) {
        let stage = this.sorted_stages[stageNr]
        // TODO: buggy: use maybe... isScheduledStages
        if (!this.isDisabled(stage) && !this.isCompleted(stage)){
          if (!this.isSkippable(stage, stageNr) ){
              // this stage must be handled right now.
              return (stageNr)
          }else {
              lastAllowedStageNr = stageNr
          }
        }
      }

      // User is finished with all steps..
      return (lastAllowedStageNr + 1)
    },

    numberOfStages: function() {

      if(!this.assembly_stages){
          return (undefined)
      }

      return(Object.keys(this.assembly_stages).length)
    },

    numberOfScheduledStages: function() {
        if(!this.assembly_stages){
            return (undefined)
        }
        const scheduled_stages = Object.filter(this.assembly_stages, x => this.isScheduledStage(x))
        return(Object.values(scheduled_stages).length)
    },

    sorted_stages: function() {
        if(!this.assembly_stages){
            return (undefined)
        }
        let sorted = Object.values(this.assembly_stages).sort((a, b) => a.stage.order_position < b.stage.order_position ? -1 : a.stage.order_position > b.stage.order_position ? 1 : 0)
        return(sorted)
    },


    //  -----------------------------------------------
    // Get Stage from StageID transmitted in the URL
    // (used in all sub-pages)
    routedStageID: function() {
      let stageID = this.$route.params.stageID
      stageID = stageID ? parseInt(stageID) : null
      return(stageID)
    },

    // GEt Stage from StageID transmitted in the URL
    routedStage: function() {

      if (this.assembly_stages === null){
        return (null)
      }

      // Get Assembly Identifier from URL
      if (this.routedStageID) {
        console.assert(this.routedStageID in this.assembly_stages)
        return (this.assembly_stages[this.routedStageID])
      }
    },

    
    //  -----------------------------------------------
    // Get Stage from StageID transmitted in the URL
    // (used on Index Page)
    cachedStageNr: {
      get: function() {
          if (this.assembly_stages===null) {
              return (null)
          }

          let stageID = this.getCachedStageID(this.assemblyIdentifier)
          let stageNr = null
          if (stageID) {
              let stage = this.assembly_stages[stageID]
              stageNr = this.sorted_stages.indexOf(stage)
          }
          if (stageNr === null || stageNr === undefined) {
              stageNr = 0
          }

          return (stageNr)
      },

      set: function(stageNr) {

          console.log("SET NEW STAGE" + stageNr)

          if (stageNr === null) {
            this.setCachedStageID({assembly: this.assembly, stageID: null })
            return (null)
          }

          console.assert(this.validateStageNr(stageNr))

          this.setCachedStageID({
            assembly: this.assembly,
            stageID: this.getIDbyNr(stageNr)
          })
      }
    },

    ...mapGetters({
      getCachedStageID: 'assemblystore/getCachedStageID',
      store_assembly_acls: 'oauthstore/assembly_acls',
      get_assembly: 'assemblystore/get_assembly',
      get_assembly_stages: 'assemblystore/get_assembly_stages',
      get_assembly_progression: 'assemblystore/get_assembly_progression',
      get_assembly_configuration: 'assemblystore/get_assembly_configuration'
    })
  },

  methods: {

    clickBackToAssemblyListButton: function () {
      this.set_current_assemblyIdentifier(null)
      this.$router.push ({ name: 'assemblies' })
    },

    monitorApi: function() {
      /* By this method we allow the API to monitor user activities */
    
      // Monitor about stage visit
      let data = {
        assembly_identifier: this.assemblyIdentifier
      }
      this.$store.dispatch('monitorApi', {
        event: this.MonitorAssemblyEntering,
        data: data
      })
    },


        // // SCROLL POSITION
    // setTimeout(() => {
    //   this.scrollToStage()
    // }, 340)

    stageTransition: function(newVal, oldVal) {
      this.scrollToStage()
    },

    laggedScrollToStage: function() {
      setTimeout(() => {
        this.scrollToStage()
      }, 200)
    },

    scrollToStage: function() {
      // SCROLL POSITION
      console.log("Do the scrolling...")
      // let anchorid = `stage${this.cachedStageNr}`
      var element = document.getElementsByClassName('q-stepper__tab--active');
      if (element) {
        const el = element[0]
        const target = getScrollTarget(el)
        const offset = el.offsetTop
        console.log(el.offsetTop)
        const duration = 300
        setScrollPosition(target, offset, duration)
        
      }else{
        console.log("scroll element not found..")
      }
    },

    gotoAssemblyHome: function() {

      var route = null

      // REDIRECT TO Assembly Home
      // if (this.$routedStageID) {
      //   route = {name: 'assembly_home_stepper', 
      //     params: {
      //         assemblyIdentifier: this.assemblyIdentifier,
      //         stageID: this.$routedStageID
      //     }
      //   }
      // } else {
      route = {
        name: 'assembly_home',
        params: {assemblyIdentifier: this.assemblyIdentifier}
      }
      // }
      console.log(route)
      this.$router.push(route, this.laggedScrollToStage)

    },

    findNextValidateStageNr: function (currentStageNr) {

      console.log("validator: " + currentStageNr)
      var stageNr = currentStageNr + 1

      // is the current stage accessible (i.e. not completed)
      if (this.validateStageNr(stageNr)) {

        // Valid stage
        return (stageNr)
      }

      // Not valid
      if (stageNr == this.numberOfStages) {
        // Last stage is completed. This is the end of todays agenda.
        console.log("last stage is finished. End of Agenda.")
        return (null)

      }

      console.log("This stage is not accessible: Check the next one...")
      return (this.findNextValidateStageNr(stageNr))
    },

    validateStageNr: function (stageNr) {

      console.log("validator: " + stageNr)

      // is there a unskipable stage before the current stage?
      // Or: is the current stage beyond highgest allowed stageNr?
      if (stageNr > this.highestAllowedStageNr) {
        return (false)
      }

      // is the current stage accessible (i.e. not completed)
      const stage = this.sorted_stages[stageNr]
      console.assert(stage)
      if (this.isCompleted(stage) || this.isDisabled(stage)) {
        return (false)
      }

      return (true)
    },

    clickGotoIndexAndMoveOn: function() {
      // const stageNr = this.sorted_stages.indexOf(this.cachedStageNr)
      console.log("update stage")
      this.gotoNextStageNr()
      console.log("stage has been updated: goto home")
      this.gotoAssemblyHome()
      // this.scrollToStage()

    },

    clickGotoNextStageNr: function() {
      this.gotoNextStageNr()
    },

    gotoNextStageNr: function() {
      console.log("clcik goto next stage nr. CURRENT: ")
      const nextStageNr = this.findNextValidateStageNr(this.cachedStageNr)
      console.log(" next stage found: " + nextStageNr)
      this.cachedStageNr = nextStageNr
      console.log("ok, new stage is set to " + nextStageNr )
    },

    getIDbyNr: function (stageNr) { 
      return (this.sorted_stages[stageNr].stage.id)
    },

    // ------ STAGE STATUS -------------------
    isDone: function (stage, stageNr) {
        // return(this.stageNr in [this.STATUS_COMPLETED])
        return(this.highestAllowedStageNr >= stageNr && !this.isCompleted(stage))
    },

    isActive: function (stage, stageNr) {
      return( this.highestAllowedStageNr >= stageNr && !this.isCompleted(stage))
    },

    /* Is there still an activity required on this stage? */
    isScheduledStage: function (stage, stageNr) {
        return(!this.isDisabled(stage) && !this.isCompleted(stage) &&
            (this.isNew(stage) || this.isAlert(stage))
        )
    },

    isSkippable: function(stage, stageNr) {

        // new content is never skippable
        if (this.isNew(stage)) {
            return (false)
        }

        // alerted content is never skippable
        if (this.isAlert(stage)) {
            return (false)
        }

        // all the rest is skippable. right?
        return(true)
    },

    isSkipped: function (stage) {
        return(stage.progression && stage.progression.status in [this.STATUS_SKIPPED])
    },
    isAlert: function (stage) {
        return(stage.progression && stage.progression.status in [this.STATUS_ALERT])
    },
    isIdle: function (stage) {
        return(stage.status in [this.STATUS_IDLE])
    },
    isNew: function (stage) {
        return(stage.progression === null || stage.progression === undefined)
    },
    isDisabled: function (stage) {
        // only admins see deleted attribute.
        return(("disabled" in stage.stage && stage.stage.disabled) || ("deleted" in stage.stage && stage.stage.deleted))
    },
    isCompleted: function (stage) {
      console.assert(stage)

      // return (this.routedStage && this.routedStage.progression && this.routedStage.progression.completed)

      if (!('progression' in stage)) {
        return (false)
      }

      if (!stage.progression) {
        return (false)
      }
      if (!stage.progression.completed) {
        return (false)
      }
      return(stage.progression.completed===true)
    },

    isFirstStage: function (stage, stageNr) {
        return(stageNr == 0)
    },

    isLastStage: function (stage, stageNr) {
        return(stageNr == this.sorted_stages.length)
    },

    ...mapActions({setCachedStageID: 'assemblystore/setCachedStageID'})    

  },

  watch: {
    // if route changes, hide TextLoading
    oauth_authenticated (before, after) {
      const assemblyIdentifier = this.assemblyIdentifier
      console.log(">> oauth watcher")
      this.$store.dispatch('assemblystore/syncAssembly', {assemblyIdentifier})
    }
  },

  mounted: function() {
    const assemblyIdentifier = this.assemblyIdentifier
    console.log(">> mounter")
    this.$store.dispatch('assemblystore/syncAssembly', {assemblyIdentifier})
  }
}
